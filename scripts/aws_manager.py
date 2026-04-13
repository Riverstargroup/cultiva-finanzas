#!/usr/bin/env python3
"""
aws_manager.py
Gestion de recursos AWS para Cultiva Finanzas (Semilla)
con AWS SDK para Python (Boto3).

Uso:
    python3 scripts/aws_manager.py --action [s3|ec2|stack|all] [--env production|staging]

Prerequisitos:
    pip3 install boto3 botocore
    aws configure  # credenciales AWS configuradas
"""

import argparse
import json
import logging
import sys
import time
from datetime import datetime
from typing import Optional

import boto3
from botocore.exceptions import ClientError, NoCredentialsError

# ---------------------------------------------------------------------------
# Configuracion de logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(f"/tmp/aws_manager_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
    ],
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constantes del proyecto
# ---------------------------------------------------------------------------
PROJECT_NAME = "cultiva-finanzas"
DEFAULT_REGION = "us-east-1"

TAGS = [
    {"Key": "Project", "Value": "CultivaFinanzas"},
    {"Key": "ManagedBy", "Value": "aws_manager.py"},
    {"Key": "Team", "Value": "EnactusMexico"},
]


# ---------------------------------------------------------------------------
# Clase principal de gestion AWS
# ---------------------------------------------------------------------------
class AWSManager:
    """Gestiona recursos AWS para el proyecto Cultiva Finanzas."""

    def __init__(self, environment: str = "production", region: str = DEFAULT_REGION):
        self.environment = environment
        self.region = region
        self.suffix = f"{PROJECT_NAME}-{environment}"

        try:
            self.session = boto3.Session(region_name=region)
            self.s3 = self.session.client("s3")
            self.ec2 = self.session.client("ec2")
            self.cfn = self.session.client("cloudformation")
            self.cw = self.session.client("cloudwatch")
            self.iam = self.session.client("iam")
            self.cloudfront = self.session.client("cloudfront")
            self.ssm = self.session.client("ssm")

            # Verificar credenciales
            sts = self.session.client("sts")
            identity = sts.get_caller_identity()
            logger.info(
                f"Autenticado como: {identity['Arn']} "
                f"(cuenta: {identity['Account']})"
            )
        except NoCredentialsError:
            logger.error("No se encontraron credenciales AWS. Ejecuta: aws configure")
            sys.exit(1)

    # -----------------------------------------------------------------------
    # Gestion de S3
    # -----------------------------------------------------------------------
    def create_website_bucket(self) -> dict:
        """Crea y configura un bucket S3 para hosting de sitio web estatico."""
        bucket_name = f"{self.suffix}-website-{int(time.time())}"

        logger.info(f"Creando bucket S3: {bucket_name}")

        try:
            # Crear el bucket
            if self.region == "us-east-1":
                self.s3.create_bucket(Bucket=bucket_name)
            else:
                self.s3.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={"LocationConstraint": self.region},
                )

            # Deshabilitar block public access
            self.s3.put_public_access_block(
                Bucket=bucket_name,
                PublicAccessBlockConfiguration={
                    "BlockPublicAcls": False,
                    "IgnorePublicAcls": False,
                    "BlockPublicPolicy": False,
                    "RestrictPublicBuckets": False,
                },
            )

            # Configurar website hosting
            self.s3.put_bucket_website(
                Bucket=bucket_name,
                WebsiteConfiguration={
                    "IndexDocument": {"Suffix": "index.html"},
                    "ErrorDocument": {"Key": "index.html"},  # SPA fallback
                },
            )

            # Politica de acceso publico
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicReadGetObject",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{bucket_name}/*",
                    }
                ],
            }
            self.s3.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(policy),
            )

            # Configurar versionado
            self.s3.put_bucket_versioning(
                Bucket=bucket_name,
                VersioningConfiguration={"Status": "Enabled"},
            )

            # Tags
            self.s3.put_bucket_tagging(
                Bucket=bucket_name,
                Tagging={"TagSet": TAGS + [{"Key": "Environment", "Value": self.environment}]},
            )

            website_url = f"http://{bucket_name}.s3-website-{self.region}.amazonaws.com"
            logger.info(f"Bucket S3 creado exitosamente: {bucket_name}")
            logger.info(f"URL del sitio: {website_url}")

            return {"bucket_name": bucket_name, "website_url": website_url}

        except ClientError as e:
            logger.error(f"Error al crear bucket S3: {e.response['Error']['Message']}")
            raise

    def create_artifacts_bucket(self) -> str:
        """Crea un bucket S3 para almacenar artefactos de CodePipeline/CodeBuild."""
        bucket_name = f"{self.suffix}-artifacts-{int(time.time())}"

        logger.info(f"Creando bucket de artefactos: {bucket_name}")

        try:
            if self.region == "us-east-1":
                self.s3.create_bucket(Bucket=bucket_name)
            else:
                self.s3.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={"LocationConstraint": self.region},
                )

            # Habilitar versionado (requerido por CodePipeline)
            self.s3.put_bucket_versioning(
                Bucket=bucket_name,
                VersioningConfiguration={"Status": "Enabled"},
            )

            # Encriptacion por defecto
            self.s3.put_bucket_encryption(
                Bucket=bucket_name,
                ServerSideEncryptionConfiguration={
                    "Rules": [
                        {
                            "ApplyServerSideEncryptionByDefault": {
                                "SSEAlgorithm": "AES256"
                            }
                        }
                    ]
                },
            )

            # Ciclo de vida (eliminar artefactos viejos)
            self.s3.put_bucket_lifecycle_configuration(
                Bucket=bucket_name,
                LifecycleConfiguration={
                    "Rules": [
                        {
                            "ID": "CleanOldArtifacts",
                            "Status": "Enabled",
                            "Expiration": {"Days": 90},
                            "NoncurrentVersionExpiration": {"NoncurrentDays": 30},
                        }
                    ]
                },
            )

            self.s3.put_bucket_tagging(
                Bucket=bucket_name,
                Tagging={"TagSet": TAGS + [{"Key": "Purpose", "Value": "CI/CD Artifacts"}]},
            )

            logger.info(f"Bucket de artefactos creado: {bucket_name}")
            return bucket_name

        except ClientError as e:
            logger.error(f"Error creando bucket de artefactos: {e}")
            raise

    def list_project_buckets(self) -> list:
        """Lista todos los buckets del proyecto."""
        logger.info("Listando buckets del proyecto...")
        all_buckets = self.s3.list_buckets().get("Buckets", [])
        project_buckets = [
            b for b in all_buckets
            if b["Name"].startswith(PROJECT_NAME)
        ]
        for bucket in project_buckets:
            logger.info(f"  - {bucket['Name']} (creado: {bucket['CreationDate']})")
        return project_buckets

    # -----------------------------------------------------------------------
    # Gestion de EC2
    # -----------------------------------------------------------------------
    def create_security_group(self, vpc_id: Optional[str] = None) -> str:
        """Crea un Security Group para la instancia EC2."""
        sg_name = f"{self.suffix}-sg"
        logger.info(f"Creando Security Group: {sg_name}")

        kwargs = {
            "GroupName": sg_name,
            "Description": f"Security Group para {PROJECT_NAME} ({self.environment})",
        }
        if vpc_id:
            kwargs["VpcId"] = vpc_id

        try:
            response = self.ec2.create_security_group(**kwargs)
            sg_id = response["GroupId"]

            # Reglas de entrada: SSH y HTTP/HTTPS
            self.ec2.authorize_security_group_ingress(
                GroupId=sg_id,
                IpPermissions=[
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 22,
                        "ToPort": 22,
                        "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "SSH admin"}],
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 80,
                        "ToPort": 80,
                        "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "HTTP"}],
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 443,
                        "ToPort": 443,
                        "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "HTTPS"}],
                    },
                ],
            )

            self.ec2.create_tags(
                Resources=[sg_id],
                Tags=TAGS + [
                    {"Key": "Name", "Value": sg_name},
                    {"Key": "Environment", "Value": self.environment},
                ],
            )

            logger.info(f"Security Group creado: {sg_id}")
            return sg_id

        except ClientError as e:
            if "InvalidGroup.Duplicate" in str(e):
                logger.warning(f"Security Group '{sg_name}' ya existe.")
                sgs = self.ec2.describe_security_groups(
                    Filters=[{"Name": "group-name", "Values": [sg_name]}]
                )
                return sgs["SecurityGroups"][0]["GroupId"]
            raise

    def launch_ec2_instance(
        self,
        instance_type: str = "t3.micro",
        key_name: Optional[str] = None,
        ami_id: Optional[str] = None,
    ) -> dict:
        """
        Lanza una instancia EC2 con el script de configuracion incluido.
        Por defecto usa Amazon Linux 2023 en us-east-1.
        """
        logger.info(f"Lanzando instancia EC2 ({instance_type})...")

        # AMI de Amazon Linux 2023 por region
        AMI_MAP = {
            "us-east-1": "ami-0230bd60aa48260c6",
            "us-west-2": "ami-04e914639d0cca79a",
            "eu-west-1": "ami-0694d931cee176e7d",
        }

        if not ami_id:
            ami_id = AMI_MAP.get(self.region, AMI_MAP["us-east-1"])

        sg_id = self.create_security_group()

        # User data script (ejecutado al inicio de la instancia)
        user_data = """#!/bin/bash
set -euo pipefail
exec > /var/log/cultiva-userdata.log 2>&1

# Clonar repositorio y ejecutar setup
yum update -y
yum install -y git
git clone https://github.com/riverstargroup/cultiva-finanzas.git /tmp/cultiva-finanzas
bash /tmp/cultiva-finanzas/scripts/ec2-setup.sh
"""

        try:
            response = self.ec2.run_instances(
                ImageId=ami_id,
                InstanceType=instance_type,
                MinCount=1,
                MaxCount=1,
                SecurityGroupIds=[sg_id],
                UserData=user_data,
                IamInstanceProfile={"Name": f"{self.suffix}-ec2-profile"} if key_name else {},
                TagSpecifications=[
                    {
                        "ResourceType": "instance",
                        "Tags": TAGS + [
                            {"Key": "Name", "Value": f"{self.suffix}-server"},
                            {"Key": "Environment", "Value": self.environment},
                        ],
                    }
                ],
                **({"KeyName": key_name} if key_name else {}),
                MetadataOptions={
                    "HttpTokens": "required",  # IMDSv2 obligatorio
                    "HttpEndpoint": "enabled",
                },
                BlockDeviceMappings=[
                    {
                        "DeviceName": "/dev/xvda",
                        "Ebs": {
                            "VolumeSize": 20,
                            "VolumeType": "gp3",
                            "Encrypted": True,
                            "DeleteOnTermination": True,
                        },
                    }
                ],
            )

            instance = response["Instances"][0]
            instance_id = instance["InstanceId"]
            logger.info(f"Instancia lanzada: {instance_id}")
            logger.info("Esperando que la instancia este en estado 'running'...")

            waiter = self.ec2.get_waiter("instance_running")
            waiter.wait(InstanceIds=[instance_id])

            # Obtener IP publica
            info = self.ec2.describe_instances(InstanceIds=[instance_id])
            inst = info["Reservations"][0]["Instances"][0]
            public_ip = inst.get("PublicIpAddress", "N/A")
            public_dns = inst.get("PublicDnsName", "N/A")

            logger.info(f"Instancia corriendo:")
            logger.info(f"  ID:        {instance_id}")
            logger.info(f"  Tipo:      {instance_type}")
            logger.info(f"  IP publica: {public_ip}")
            logger.info(f"  DNS:       {public_dns}")

            return {
                "instance_id": instance_id,
                "public_ip": public_ip,
                "public_dns": public_dns,
            }

        except ClientError as e:
            logger.error(f"Error lanzando EC2: {e}")
            raise

    def list_ec2_instances(self) -> list:
        """Lista todas las instancias EC2 del proyecto."""
        logger.info("Listando instancias EC2 del proyecto...")

        response = self.ec2.describe_instances(
            Filters=[
                {"Name": "tag:Project", "Values": ["CultivaFinanzas"]},
                {"Name": "instance-state-name", "Values": ["running", "stopped", "pending"]},
            ]
        )

        instances = []
        for reservation in response["Reservations"]:
            for inst in reservation["Instances"]:
                name = next(
                    (t["Value"] for t in inst.get("Tags", []) if t["Key"] == "Name"),
                    "Sin nombre",
                )
                logger.info(
                    f"  [{inst['State']['Name']}] {inst['InstanceId']} "
                    f"({inst['InstanceType']}) - {name} - "
                    f"IP: {inst.get('PublicIpAddress', 'N/A')}"
                )
                instances.append(inst)

        if not instances:
            logger.info("No se encontraron instancias EC2 del proyecto.")

        return instances

    def stop_ec2_instance(self, instance_id: str) -> None:
        """Detiene una instancia EC2."""
        logger.info(f"Deteniendo instancia: {instance_id}")
        self.ec2.stop_instances(InstanceIds=[instance_id])
        waiter = self.ec2.get_waiter("instance_stopped")
        waiter.wait(InstanceIds=[instance_id])
        logger.info(f"Instancia detenida: {instance_id}")

    # -----------------------------------------------------------------------
    # Gestion de CloudFormation
    # -----------------------------------------------------------------------
    def deploy_stack(
        self,
        template_path: str = "infrastructure/cloudformation.yaml",
        github_token: Optional[str] = None,
    ) -> dict:
        """Despliega o actualiza el stack de CloudFormation."""
        stack_name = self.suffix
        logger.info(f"Desplegando stack CloudFormation: {stack_name}")

        with open(template_path, "r") as f:
            template_body = f.read()

        parameters = [
            {"ParameterKey": "Environment", "ParameterValue": self.environment},
        ]

        if github_token:
            parameters.append(
                {"ParameterKey": "GithubToken", "ParameterValue": github_token}
            )

        try:
            # Verificar si el stack existe
            existing_stacks = self.cfn.list_stacks(
                StackStatusFilter=["CREATE_COMPLETE", "UPDATE_COMPLETE", "ROLLBACK_COMPLETE"]
            )
            stack_exists = any(
                s["StackName"] == stack_name
                for s in existing_stacks.get("StackSummaries", [])
            )

            if stack_exists:
                logger.info("Stack existente detectado. Actualizando...")
                response = self.cfn.update_stack(
                    StackName=stack_name,
                    TemplateBody=template_body,
                    Parameters=parameters,
                    Capabilities=["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"],
                )
                waiter = self.cfn.get_waiter("stack_update_complete")
            else:
                logger.info("Creando nuevo stack...")
                response = self.cfn.create_stack(
                    StackName=stack_name,
                    TemplateBody=template_body,
                    Parameters=parameters,
                    Capabilities=["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"],
                    Tags=TAGS + [{"Key": "Environment", "Value": self.environment}],
                    OnFailure="ROLLBACK",
                )
                waiter = self.cfn.get_waiter("stack_create_complete")

            logger.info("Esperando que el stack este listo (puede tardar varios minutos)...")
            waiter.wait(
                StackName=stack_name,
                WaiterConfig={"Delay": 15, "MaxAttempts": 60},
            )

            # Obtener outputs
            stack_info = self.cfn.describe_stacks(StackName=stack_name)
            outputs = {
                o["OutputKey"]: o["OutputValue"]
                for o in stack_info["Stacks"][0].get("Outputs", [])
            }

            logger.info("Stack desplegado exitosamente. Outputs:")
            for key, value in outputs.items():
                logger.info(f"  {key}: {value}")

            return outputs

        except ClientError as e:
            if "No updates are to be performed" in str(e):
                logger.info("No hay cambios en el stack.")
                return {}
            logger.error(f"Error desplegando stack: {e}")
            raise

    def describe_stack(self) -> dict:
        """Muestra el estado actual del stack."""
        try:
            response = self.cfn.describe_stacks(StackName=self.suffix)
            stack = response["Stacks"][0]
            logger.info(f"Stack: {stack['StackName']}")
            logger.info(f"Estado: {stack['StackStatus']}")
            logger.info(f"Creado: {stack.get('CreationTime', 'N/A')}")

            logger.info("Outputs:")
            for output in stack.get("Outputs", []):
                logger.info(f"  {output['OutputKey']}: {output['OutputValue']}")

            return stack
        except ClientError:
            logger.warning(f"Stack '{self.suffix}' no encontrado.")
            return {}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Gestiona recursos AWS para Cultiva Finanzas",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Acciones disponibles:
  s3        Gestionar buckets S3 (crear website bucket, artefactos, listar)
  ec2       Gestionar instancias EC2 (lanzar, listar, detener)
  stack     Gestionar stack CloudFormation (desplegar, describir)
  all       Crear infraestructura completa

Ejemplos:
  python3 scripts/aws_manager.py --action s3
  python3 scripts/aws_manager.py --action ec2 --env staging
  python3 scripts/aws_manager.py --action stack --env production
  python3 scripts/aws_manager.py --action all
        """,
    )
    parser.add_argument(
        "--action",
        choices=["s3", "ec2", "stack", "all"],
        required=True,
        help="Accion a ejecutar",
    )
    parser.add_argument(
        "--env",
        default="production",
        choices=["production", "staging", "development"],
        help="Entorno objetivo (default: production)",
    )
    parser.add_argument(
        "--region",
        default=DEFAULT_REGION,
        help=f"Region AWS (default: {DEFAULT_REGION})",
    )
    parser.add_argument(
        "--instance-type",
        default="t3.micro",
        help="Tipo de instancia EC2 (default: t3.micro)",
    )
    parser.add_argument(
        "--key-name",
        help="Nombre del key pair EC2 para SSH",
    )

    args = parser.parse_args()

    manager = AWSManager(environment=args.env, region=args.region)

    if args.action == "s3":
        manager.list_project_buckets()
        result = manager.create_website_bucket()
        logger.info(f"Website bucket: {result['bucket_name']}")
        logger.info(f"URL: {result['website_url']}")

    elif args.action == "ec2":
        manager.list_ec2_instances()
        result = manager.launch_ec2_instance(
            instance_type=args.instance_type,
            key_name=args.key_name,
        )
        logger.info(f"Instancia creada: {result['instance_id']}")
        logger.info(f"IP publica: {result['public_ip']}")

    elif args.action == "stack":
        manager.describe_stack()
        result = manager.deploy_stack()
        if result:
            logger.info("Stack actualizado con outputs:")
            for k, v in result.items():
                logger.info(f"  {k}: {v}")

    elif args.action == "all":
        logger.info("=== Creando infraestructura completa ===")
        bucket_info = manager.create_website_bucket()
        artifacts_bucket = manager.create_artifacts_bucket()
        stack_outputs = manager.deploy_stack()
        logger.info("=== Infraestructura completa creada ===")
        logger.info(f"Website bucket:    {bucket_info['bucket_name']}")
        logger.info(f"Artifacts bucket:  {artifacts_bucket}")
        if stack_outputs:
            for k, v in stack_outputs.items():
                logger.info(f"{k}: {v}")


if __name__ == "__main__":
    main()
