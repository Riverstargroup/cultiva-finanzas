#!/bin/bash
# =============================================================================
# deploy.sh
# Script de despliegue para Cultiva Finanzas (Semilla) en AWS
# Uso: bash scripts/deploy.sh [--env production|staging]
# Requiere: AWS CLI configurado, jq instalado
# =============================================================================

set -euo pipefail

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_success() { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
log_step()    { echo -e "\n${CYAN}====> $1${NC}"; }

# ------------------------------------------------------------------
# Configuracion
# ------------------------------------------------------------------
ENVIRONMENT="${1:-production}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STACK_NAME="cultiva-finanzas-${ENVIRONMENT}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="$PROJECT_DIR/dist"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/tmp/cultiva-deploy-${TIMESTAMP}.log"

echo "=============================================="
echo "  Cultiva Finanzas - Despliegue en AWS        "
echo "  Entorno: $ENVIRONMENT | Region: $AWS_REGION "
echo "=============================================="

# ------------------------------------------------------------------
# 1. Verificar prerequisitos
# ------------------------------------------------------------------
log_step "Verificando prerequisitos..."

for cmd in aws node npm; do
    if ! command -v "$cmd" &>/dev/null; then
        log_error "Comando '$cmd' no encontrado. Ejecuta: bash scripts/install-dependencies.sh"
    fi
done

# Verificar que AWS CLI tiene credenciales
if ! aws sts get-caller-identity &>/dev/null; then
    log_error "AWS CLI no configurado. Ejecuta: aws configure"
fi

AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
log_success "AWS autenticado como: $AWS_USER (cuenta: $AWS_ACCOUNT)"

# ------------------------------------------------------------------
# 2. Obtener outputs del stack CloudFormation
# ------------------------------------------------------------------
log_step "Obteniendo configuracion del stack CloudFormation..."

get_stack_output() {
    local key="$1"
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='${key}'].OutputValue" \
        --output text 2>/dev/null || echo ""
}

S3_BUCKET=$(get_stack_output "WebsiteBucketName")
CLOUDFRONT_ID=$(get_stack_output "CloudFrontDistributionId")
CLOUDFRONT_URL=$(get_stack_output "CloudFrontURL")

if [ -z "$S3_BUCKET" ]; then
    log_warn "Stack '$STACK_NAME' no encontrado o sin outputs."
    log_info "Intentando obtener variables de entorno alternativas..."
    S3_BUCKET="${CULTIVA_S3_BUCKET:-}"
    CLOUDFRONT_ID="${CULTIVA_CF_ID:-}"
fi

if [ -z "$S3_BUCKET" ]; then
    log_error "No se pudo obtener el bucket S3. Despliega primero con CloudFormation:
    aws cloudformation deploy \\
        --template-file infrastructure/cloudformation.yaml \\
        --stack-name ${STACK_NAME} \\
        --capabilities CAPABILITY_IAM"
fi

log_success "Bucket S3: $S3_BUCKET"
[ -n "$CLOUDFRONT_ID" ] && log_success "CloudFront ID: $CLOUDFRONT_ID"

# ------------------------------------------------------------------
# 3. Ejecutar tests
# ------------------------------------------------------------------
log_step "Ejecutando tests..."

cd "$PROJECT_DIR"

if npm run test -- --run 2>&1 | tee -a "$LOG_FILE"; then
    log_success "Todos los tests pasaron."
else
    log_error "Los tests fallaron. Despliegue abortado. Ver: $LOG_FILE"
fi

# ------------------------------------------------------------------
# 4. Build de produccion
# ------------------------------------------------------------------
log_step "Compilando aplicacion para produccion..."

if [ "$ENVIRONMENT" = "production" ]; then
    npm run build 2>&1 | tee -a "$LOG_FILE"
else
    npm run build:dev 2>&1 | tee -a "$LOG_FILE"
fi

if [ ! -d "$BUILD_DIR" ]; then
    log_error "Directorio dist/ no encontrado. El build fallo."
fi

BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
log_success "Build completado. Tamano: $BUILD_SIZE"

# ------------------------------------------------------------------
# 5. Sincronizar archivos a S3
# ------------------------------------------------------------------
log_step "Subiendo archivos a S3..."

# Subir archivos HTML con cache corto (10 minutos)
log_info "Subiendo archivos HTML (cache: 10 min)..."
aws s3 sync "$BUILD_DIR" "s3://${S3_BUCKET}" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.html" \
    --cache-control "max-age=600, must-revalidate" \
    --content-type "text/html; charset=utf-8" \
    --delete 2>&1 | tee -a "$LOG_FILE"

# Subir assets con cache largo (1 ano) - tienen hash en el nombre
log_info "Subiendo assets estaticos (cache: 1 ano)..."
aws s3 sync "$BUILD_DIR" "s3://${S3_BUCKET}" \
    --region "$AWS_REGION" \
    --exclude "*.html" \
    --cache-control "max-age=31536000, immutable" \
    2>&1 | tee -a "$LOG_FILE"

log_success "Archivos sincronizados con S3."

# ------------------------------------------------------------------
# 6. Invalidar cache de CloudFront
# ------------------------------------------------------------------
if [ -n "$CLOUDFRONT_ID" ]; then
    log_step "Invalidando cache de CloudFront..."

    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_ID" \
        --paths "/*" \
        --query "Invalidation.Id" \
        --output text)

    log_info "Invalidacion iniciada: $INVALIDATION_ID"
    log_info "Esperando que la invalidacion complete (puede tardar 2-5 minutos)..."

    aws cloudfront wait invalidation-completed \
        --distribution-id "$CLOUDFRONT_ID" \
        --id "$INVALIDATION_ID"

    log_success "Cache de CloudFront invalidado exitosamente."
fi

# ------------------------------------------------------------------
# 7. Verificar despliegue
# ------------------------------------------------------------------
log_step "Verificando despliegue..."

if [ -n "$CLOUDFRONT_URL" ]; then
    URL="https://${CLOUDFRONT_URL}"
else
    URL="https://${S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com"
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    log_success "Sitio respondiendo correctamente (HTTP $HTTP_STATUS)"
else
    log_warn "HTTP $HTTP_STATUS al verificar $URL. El despliegue puede estar en progreso."
fi

# ------------------------------------------------------------------
# 8. Registrar despliegue en CloudWatch
# ------------------------------------------------------------------
log_step "Registrando evento de despliegue en CloudWatch..."

aws cloudwatch put-metric-data \
    --region "$AWS_REGION" \
    --namespace "CultivaFinanzas/Deployments" \
    --metric-data "[
        {
            \"MetricName\": \"DeploymentCount\",
            \"Value\": 1,
            \"Unit\": \"Count\",
            \"Dimensions\": [
                {\"Name\": \"Environment\", \"Value\": \"${ENVIRONMENT}\"}
            ]
        }
    ]" 2>/dev/null || log_warn "No se pudo registrar metrica en CloudWatch."

# ------------------------------------------------------------------
# 9. Resumen
# ------------------------------------------------------------------
echo ""
echo "=============================================="
echo "  Despliegue Completado Exitosamente          "
echo "=============================================="
log_success "Entorno:         $ENVIRONMENT"
log_success "Bucket S3:       $S3_BUCKET"
log_success "URL:             $URL"
log_success "Timestamp:       $TIMESTAMP"
log_success "Log:             $LOG_FILE"
echo ""
