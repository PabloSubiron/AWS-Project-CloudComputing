#!/bin/bash
set -e

# --- CONFIGURACIÓN PARA SANDBOX (AWS Academy) ---
REGION="us-east-1"
INSTANCE_NAME="Web Server"
INSTANCE_TYPE="t2.small"          # Permitido en Sandbox (t2.nano a t2.medium)
KEY_NAME="vockey"                 # Clave preconfigurada en Sandbox
INSTANCE_PROFILE="LabInstanceProfile" # Permite acceso por navegador (SSM Session Manager)
SG_NAME="Web-Server-SG-$(date +%s)"
VOLUME_SIZE=10                    # Máximo 35 GB en Sandbox
VOLUME_TYPE="gp2"                 # El Sandbox exige gp2

echo "1. Obteniendo la VPC y Subred por defecto en $REGION..."
VPC_ID=$(aws ec2 describe-vpcs \
    --region $REGION \
    --filters "Name=is-default,Values=true" \
    --query "Vpcs[0].VpcId" \
    --output text)

SUBNET_ID=$(aws ec2 describe-subnets \
    --region $REGION \
    --filters "Name=vpc-id,Values=$VPC_ID" "Name=default-for-az,Values=true" \
    --query "Subnets[0].SubnetId" \
    --output text)

echo "   -> VPC por defecto: $VPC_ID | Subred: $SUBNET_ID"

echo "2. Obteniendo la última AMI oficial de Amazon Linux 2023..."
AMI_ID=$(aws ssm get-parameters \
    --region $REGION \
    --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
    --query "Parameters[0].Value" \
    --output text)

echo "   -> AMI ID: $AMI_ID"

echo "3. Creando Grupo de Seguridad y abriendo puertos HTTP (80) y SSH (22)..."
SG_ID=$(aws ec2 create-security-group \
    --region $REGION \
    --group-name "$SG_NAME" \
    --description "Security group for web server in Sandbox" \
    --vpc-id "$VPC_ID" \
    --query "GroupId" \
    --output text)

# Permitir tráfico Web (HTTP - Puerto 80)
aws ec2 authorize-security-group-ingress \
    --region $REGION \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 > /dev/null

# Permitir acceso SSH (Puerto 22) para subir tu web HTML/JS
aws ec2 authorize-security-group-ingress \
    --region $REGION \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 > /dev/null

echo "   -> Security Group ID: $SG_ID"

echo "4. Preparando instalación automática de Apache (User Data)..."
USER_DATA=$(cat << 'EOF'
#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl enable httpd
systemctl start httpd
usermod -a -G apache ec2-user
chown -R ec2-user:apache /var/www/html
chmod 2775 /var/www/html
echo '<html><h1>Servidor Web Listo en Sandbox!</h1><p>Ya puedes subir tus archivos HTML y JS a /var/www/html/</p></html>' > /var/www/html/index.html
EOF
)

echo "5. Lanzando instancia EC2 ($INSTANCE_TYPE, ${VOLUME_SIZE}GB $VOLUME_TYPE)..."
INSTANCE_ID=$(aws ec2 run-instances \
    --region $REGION \
    --image-id "$AMI_ID" \
    --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" \
    --iam-instance-profile Name="$INSTANCE_PROFILE" \
    --security-group-ids "$SG_ID" \
    --subnet-id "$SUBNET_ID" \
    --associate-public-ip-address \
    --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":$VOLUME_SIZE,\"VolumeType\":\"$VOLUME_TYPE\"}}]" \
    --user-data "$USER_DATA" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value='$INSTANCE_NAME'}]" \
    --query "Instances[0].InstanceId" \
    --output text)

echo "   -> Instancia lanzada: $INSTANCE_ID"
echo "6. Esperando a que la instancia arranque..."
aws ec2 wait instance-running --region $REGION --instance-ids "$INSTANCE_ID"

PUBLIC_IP=$(aws ec2 describe-instances \
    --region $REGION \
    --instance-ids "$INSTANCE_ID" \
    --query "Reservations[0].Instances[0].PublicIpAddress" \
    --output text)

echo "================================================================="
echo "¡Servidor Web desplegado con éxito!"
echo "ID de Instancia: $INSTANCE_ID"
echo "URL Web:         http://$PUBLIC_IP"
echo "Ruta web:        /var/www/html/ (con permisos listos para ec2-user)"
echo "Nota: Espera ~1 minuto mientras termina la instalación de Apache."
echo "================================================================="