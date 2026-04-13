#!/bin/bash
# =============================================================================
# install-dependencies.sh
# Script de instalacion de dependencias para Cultiva Finanzas (Semilla)
# Uso: bash scripts/install-dependencies.sh
# Compatible con: Ubuntu 20.04/22.04, Amazon Linux 2/2023
# =============================================================================

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_success() { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Versiones requeridas
NODE_VERSION="20"
PYTHON_VERSION="3"
AWS_CLI_VERSION="2"

echo "=============================================="
echo "  Cultiva Finanzas - Instalacion de Entorno  "
echo "=============================================="
echo ""

# ------------------------------------------------------------------
# 1. Deteccion del sistema operativo
# ------------------------------------------------------------------
log_info "Detectando sistema operativo..."

OS=""
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
elif command -v lsb_release &>/dev/null; then
    OS=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
fi

log_info "Sistema detectado: $OS"

# ------------------------------------------------------------------
# 2. Actualizar paquetes del sistema
# ------------------------------------------------------------------
log_info "Actualizando paquetes del sistema..."

case "$OS" in
    ubuntu|debian)
        sudo apt-get update -y -q
        sudo apt-get install -y -q curl wget unzip git build-essential
        ;;
    amzn|rhel|centos|fedora)
        sudo yum update -y -q
        sudo yum install -y -q curl wget unzip git gcc gcc-c++ make
        ;;
    *)
        log_warn "Sistema operativo no reconocido: $OS. Continuando de todas formas..."
        ;;
esac

log_success "Paquetes del sistema actualizados."

# ------------------------------------------------------------------
# 3. Instalar Node.js via NVM
# ------------------------------------------------------------------
log_info "Verificando Node.js..."

if command -v node &>/dev/null; then
    CURRENT_NODE=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$CURRENT_NODE" -ge "$NODE_VERSION" ]; then
        log_success "Node.js ya instalado: $(node --version)"
    else
        log_warn "Node.js version $(node --version) es menor a la requerida v${NODE_VERSION}. Actualizando..."
        INSTALL_NODE=true
    fi
else
    INSTALL_NODE=true
fi

if [ "${INSTALL_NODE:-false}" = true ]; then
    log_info "Instalando Node.js ${NODE_VERSION} via NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    nvm install "$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"

    log_success "Node.js instalado: $(node --version)"
fi

# ------------------------------------------------------------------
# 4. Verificar npm
# ------------------------------------------------------------------
log_info "Verificando npm..."
if command -v npm &>/dev/null; then
    log_success "npm disponible: $(npm --version)"
else
    log_error "npm no encontrado. Verifica la instalacion de Node.js."
fi

# ------------------------------------------------------------------
# 5. Instalar Python 3 y pip
# ------------------------------------------------------------------
log_info "Verificando Python 3..."

if command -v python3 &>/dev/null; then
    log_success "Python3 disponible: $(python3 --version)"
else
    log_info "Instalando Python 3..."
    case "$OS" in
        ubuntu|debian)
            sudo apt-get install -y -q python3 python3-pip python3-venv
            ;;
        amzn|rhel|centos|fedora)
            sudo yum install -y -q python3 python3-pip
            ;;
    esac
    log_success "Python3 instalado: $(python3 --version)"
fi

# ------------------------------------------------------------------
# 6. Instalar AWS CLI v2
# ------------------------------------------------------------------
log_info "Verificando AWS CLI..."

if command -v aws &>/dev/null; then
    AWS_VER=$(aws --version 2>&1 | cut -d'/' -f2 | cut -d'.' -f1)
    if [ "$AWS_VER" -ge "$AWS_CLI_VERSION" ] 2>/dev/null; then
        log_success "AWS CLI ya instalado: $(aws --version 2>&1 | awk '{print $1}')"
    else
        log_warn "AWS CLI v1 detectado. Actualizando a v2..."
        INSTALL_AWSCLI=true
    fi
else
    INSTALL_AWSCLI=true
fi

if [ "${INSTALL_AWSCLI:-false}" = true ]; then
    log_info "Instalando AWS CLI v2..."
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
    elif [ "$ARCH" = "aarch64" ]; then
        curl -s "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "/tmp/awscliv2.zip"
    else
        log_error "Arquitectura no soportada: $ARCH"
    fi

    unzip -q /tmp/awscliv2.zip -d /tmp/
    sudo /tmp/aws/install --update
    rm -rf /tmp/aws /tmp/awscliv2.zip

    log_success "AWS CLI instalado: $(aws --version 2>&1 | awk '{print $1}')"
fi

# ------------------------------------------------------------------
# 7. Instalar dependencias Python para Boto3
# ------------------------------------------------------------------
log_info "Instalando librerias Python (Boto3, botocore)..."

pip3 install --quiet boto3 botocore

log_success "Boto3 instalado: $(python3 -c 'import boto3; print(boto3.__version__)')"

# ------------------------------------------------------------------
# 8. Instalar dependencias del proyecto Node.js
# ------------------------------------------------------------------
log_info "Instalando dependencias del proyecto (npm install)..."

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

if [ -f "package.json" ]; then
    npm install --silent
    log_success "Dependencias del proyecto instaladas."
else
    log_warn "No se encontro package.json. Omitiendo npm install."
fi

# ------------------------------------------------------------------
# 9. Verificar instalacion de Docker (opcional)
# ------------------------------------------------------------------
log_info "Verificando Docker..."

if command -v docker &>/dev/null; then
    log_success "Docker disponible: $(docker --version)"
else
    log_warn "Docker no encontrado. Para desarrollo local con docker-compose, instala Docker manualmente."
    log_info "Guia de instalacion: https://docs.docker.com/engine/install/"
fi

# ------------------------------------------------------------------
# 10. Resumen final
# ------------------------------------------------------------------
echo ""
echo "=============================================="
echo "  Resumen de Instalacion                     "
echo "=============================================="
echo ""
log_success "Node.js:   $(node --version 2>/dev/null || echo 'No disponible')"
log_success "npm:       $(npm --version 2>/dev/null || echo 'No disponible')"
log_success "Python3:   $(python3 --version 2>/dev/null || echo 'No disponible')"
log_success "pip3:      $(pip3 --version 2>/dev/null | awk '{print $2}' || echo 'No disponible')"
log_success "Boto3:     $(python3 -c 'import boto3; print(boto3.__version__)' 2>/dev/null || echo 'No disponible')"
log_success "AWS CLI:   $(aws --version 2>&1 | awk '{print $1}' || echo 'No disponible')"
log_success "Docker:    $(docker --version 2>/dev/null || echo 'No instalado')"
echo ""
log_success "Entorno listo. Ejecuta 'npm run dev' para iniciar el servidor."
echo ""
