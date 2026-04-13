#!/bin/bash
# =============================================================================
# ec2-setup.sh
# Script de configuracion de instancia EC2 para Cultiva Finanzas
# Uso: bash scripts/ec2-setup.sh
# Se ejecuta como user-data en el lanzamiento de la instancia EC2,
# o manualmente via SSH despues del lanzamiento.
# Sistema operativo: Amazon Linux 2023 / Ubuntu 22.04
# =============================================================================

set -euo pipefail

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_success() { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

SETUP_LOG="/var/log/cultiva-setup.log"
exec > >(tee -a "$SETUP_LOG") 2>&1

echo "=============================================="
echo "  Cultiva Finanzas - Configuracion EC2        "
echo "  $(date '+%Y-%m-%d %H:%M:%S')               "
echo "=============================================="

# ------------------------------------------------------------------
# 1. Actualizar sistema
# ------------------------------------------------------------------
log_info "Actualizando sistema operativo..."

if command -v yum &>/dev/null; then
    PKG_MGR="yum"
    sudo yum update -y -q
    sudo yum install -y -q git curl wget unzip htop tree
elif command -v apt-get &>/dev/null; then
    PKG_MGR="apt"
    sudo apt-get update -y -q
    sudo apt-get upgrade -y -q
    sudo apt-get install -y -q git curl wget unzip htop tree build-essential
fi

log_success "Sistema actualizado. Gestor de paquetes: $PKG_MGR"

# ------------------------------------------------------------------
# 2. Instalar Node.js 20 LTS
# ------------------------------------------------------------------
log_info "Instalando Node.js 20 LTS..."

if [ "$PKG_MGR" = "yum" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y -q nodejs
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y -q nodejs
fi

log_success "Node.js instalado: $(node --version)"
log_success "npm instalado: $(npm --version)"

# ------------------------------------------------------------------
# 3. Instalar Python 3 y Boto3
# ------------------------------------------------------------------
log_info "Instalando Python 3 y Boto3..."

if [ "$PKG_MGR" = "yum" ]; then
    sudo yum install -y -q python3 python3-pip
else
    sudo apt-get install -y -q python3 python3-pip python3-venv
fi

sudo pip3 install --quiet boto3 botocore requests

log_success "Python3: $(python3 --version)"
log_success "Boto3: $(python3 -c 'import boto3; print(boto3.__version__)')"

# ------------------------------------------------------------------
# 4. Instalar AWS CLI v2
# ------------------------------------------------------------------
log_info "Instalando AWS CLI v2..."

ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
else
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "/tmp/awscliv2.zip"
fi

unzip -q /tmp/awscliv2.zip -d /tmp/
sudo /tmp/aws/install
rm -rf /tmp/aws /tmp/awscliv2.zip

log_success "AWS CLI: $(aws --version 2>&1 | awk '{print $1}')"

# ------------------------------------------------------------------
# 5. Instalar CodeDeploy Agent (para despliegues automatizados)
# ------------------------------------------------------------------
log_info "Instalando CodeDeploy Agent..."

if [ "$PKG_MGR" = "yum" ]; then
    sudo yum install -y -q ruby wget
    cd /tmp
    wget -q https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
    chmod +x ./install
    sudo ./install auto
    sudo systemctl start codedeploy-agent
    sudo systemctl enable codedeploy-agent
    log_success "CodeDeploy Agent instalado y activo."
    rm -f /tmp/install
else
    log_warn "CodeDeploy Agent auto-instalacion disponible solo en Amazon Linux. Instalar manualmente en Ubuntu."
fi

# ------------------------------------------------------------------
# 6. Instalar Nginx (servidor web de respaldo)
# ------------------------------------------------------------------
log_info "Instalando Nginx..."

if [ "$PKG_MGR" = "yum" ]; then
    sudo yum install -y -q nginx
else
    sudo apt-get install -y -q nginx
fi

# Configuracion de Nginx para SPA (Single Page Application)
sudo tee /etc/nginx/conf.d/cultiva-finanzas.conf > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    server_name _;
    root /var/www/cultiva-finanzas;
    index index.html;

    # Compresion gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache para assets estaticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA: todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
NGINX_CONF

sudo mkdir -p /var/www/cultiva-finanzas
sudo chown -R nginx:nginx /var/www/cultiva-finanzas 2>/dev/null || \
    sudo chown -R www-data:www-data /var/www/cultiva-finanzas

sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

log_success "Nginx instalado y configurado."

# ------------------------------------------------------------------
# 7. Configurar CloudWatch Agent
# ------------------------------------------------------------------
log_info "Instalando CloudWatch Unified Agent..."

if [ "$PKG_MGR" = "yum" ]; then
    sudo yum install -y -q amazon-cloudwatch-agent
else
    wget -q https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O /tmp/cwagent.deb
    sudo dpkg -i /tmp/cwagent.deb
    rm /tmp/cwagent.deb
fi

# Configuracion del agente CloudWatch
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null << 'CW_CONFIG'
{
    "agent": {
        "metrics_collection_interval": 60,
        "run_as_user": "root"
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/nginx/access.log",
                        "log_group_name": "/cultiva-finanzas/nginx/access",
                        "log_stream_name": "{instance_id}",
                        "retention_in_days": 30
                    },
                    {
                        "file_path": "/var/log/nginx/error.log",
                        "log_group_name": "/cultiva-finanzas/nginx/error",
                        "log_stream_name": "{instance_id}",
                        "retention_in_days": 30
                    },
                    {
                        "file_path": "/var/log/cultiva-setup.log",
                        "log_group_name": "/cultiva-finanzas/ec2/setup",
                        "log_stream_name": "{instance_id}",
                        "retention_in_days": 7
                    }
                ]
            }
        }
    },
    "metrics": {
        "namespace": "CultivaFinanzas/EC2",
        "metrics_collected": {
            "cpu": {
                "measurement": ["cpu_usage_idle", "cpu_usage_user", "cpu_usage_system"],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": ["used_percent"],
                "resources": ["/"],
                "metrics_collection_interval": 60
            },
            "mem": {
                "measurement": ["mem_used_percent", "mem_available_percent"],
                "metrics_collection_interval": 60
            }
        }
    }
}
CW_CONFIG

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
    -s 2>/dev/null || log_warn "CloudWatch Agent puede necesitar configuracion de IAM role."

log_success "CloudWatch Agent configurado."

# ------------------------------------------------------------------
# 8. Configurar firewall (security groups complementarios)
# ------------------------------------------------------------------
log_info "Configurando reglas de firewall local..."

if command -v ufw &>/dev/null; then
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https
    log_success "UFW firewall configurado."
elif command -v firewall-cmd &>/dev/null; then
    sudo systemctl start firewalld
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    log_success "Firewalld configurado."
fi

# ------------------------------------------------------------------
# 9. Clonar repositorio (si existe)
# ------------------------------------------------------------------
GITHUB_REPO="${GITHUB_REPO:-}"
if [ -n "$GITHUB_REPO" ]; then
    log_info "Clonando repositorio: $GITHUB_REPO"
    cd /tmp
    git clone "https://github.com/${GITHUB_REPO}.git" cultiva-finanzas
    cd cultiva-finanzas
    npm install
    npm run build
    sudo cp -r dist/* /var/www/cultiva-finanzas/
    log_success "Repositorio clonado y build deployado."
else
    log_warn "GITHUB_REPO no definido. Repositorio no clonado automaticamente."
fi

# ------------------------------------------------------------------
# 10. Resumen final
# ------------------------------------------------------------------
echo ""
echo "=============================================="
echo "  Configuracion EC2 Completada               "
echo "=============================================="
log_success "Node.js:    $(node --version)"
log_success "Python3:    $(python3 --version)"
log_success "AWS CLI:    $(aws --version 2>&1 | awk '{print $1}')"
log_success "Nginx:      $(nginx -v 2>&1)"
log_success "Log:        $SETUP_LOG"
echo ""
log_info "Servicios activos:"
log_success "nginx:          $(systemctl is-active nginx 2>/dev/null || echo 'desconocido')"
log_success "codedeploy:     $(systemctl is-active codedeploy-agent 2>/dev/null || echo 'N/A')"
log_success "cloudwatch:     $(systemctl is-active amazon-cloudwatch-agent 2>/dev/null || echo 'configurar IAM role')"
echo ""
log_info "Web accesible en: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'IP-PUBLICA')"
echo ""
