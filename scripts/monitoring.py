#!/usr/bin/env python3
"""
monitoring.py
Configuracion y consulta de monitoreo AWS CloudWatch para Cultiva Finanzas.
Crea alarmas, dashboards y consulta metricas con Boto3.

Uso:
    python3 scripts/monitoring.py --action [setup|metrics|alarms|dashboard]

Prerequisitos:
    pip3 install boto3 botocore
    aws configure
"""

import argparse
import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import Optional

import boto3
from botocore.exceptions import ClientError, NoCredentialsError

# ---------------------------------------------------------------------------
# Configuracion
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

PROJECT_NAME = "cultiva-finanzas"
NAMESPACE = "CultivaFinanzas"
DEFAULT_REGION = "us-east-1"


class CloudWatchManager:
    """Gestiona monitoreo CloudWatch para Cultiva Finanzas."""

    def __init__(self, environment: str = "production", region: str = DEFAULT_REGION):
        self.environment = environment
        self.region = region
        self.prefix = f"{PROJECT_NAME}-{environment}"

        try:
            session = boto3.Session(region_name=region)
            self.cw = session.client("cloudwatch")
            self.logs = session.client("logs")
            self.sns = session.client("sns")
            self.s3 = session.client("s3")
            self.cloudfront = session.client("cloudfront")

            sts = session.client("sts")
            identity = sts.get_caller_identity()
            self.account_id = identity["Account"]
            logger.info(f"Conectado a cuenta: {self.account_id} / region: {region}")

        except NoCredentialsError:
            logger.error("Credenciales AWS no encontradas. Ejecuta: aws configure")
            sys.exit(1)

    # -----------------------------------------------------------------------
    # SNS (notificaciones)
    # -----------------------------------------------------------------------
    def create_alarm_topic(self, email: Optional[str] = None) -> str:
        """Crea un topic SNS para alertas y opcionalmente suscribe un email."""
        topic_name = f"{self.prefix}-alerts"
        logger.info(f"Creando topic SNS: {topic_name}")

        response = self.sns.create_topic(
            Name=topic_name,
            Tags=[
                {"Key": "Project", "Value": "CultivaFinanzas"},
                {"Key": "Environment", "Value": self.environment},
            ],
        )
        topic_arn = response["TopicArn"]
        logger.info(f"Topic SNS: {topic_arn}")

        if email:
            self.sns.subscribe(
                TopicArn=topic_arn,
                Protocol="email",
                Endpoint=email,
            )
            logger.info(f"Suscripcion enviada a: {email} (confirmar en bandeja de entrada)")

        return topic_arn

    # -----------------------------------------------------------------------
    # Log Groups
    # -----------------------------------------------------------------------
    def create_log_groups(self) -> list:
        """Crea grupos de logs CloudWatch para el proyecto."""
        log_groups = [
            (f"/cultiva-finanzas/{self.environment}/nginx/access", 30),
            (f"/cultiva-finanzas/{self.environment}/nginx/error", 30),
            (f"/cultiva-finanzas/{self.environment}/app", 90),
            (f"/cultiva-finanzas/{self.environment}/codebuild", 14),
            (f"/cultiva-finanzas/{self.environment}/codepipeline", 14),
            (f"/aws/codebuild/{self.prefix}", 30),
        ]

        created = []
        for group_name, retention_days in log_groups:
            try:
                self.logs.create_log_group(logGroupName=group_name)
                logger.info(f"Grupo de logs creado: {group_name}")
            except self.logs.exceptions.ResourceAlreadyExistsException:
                logger.info(f"Grupo de logs ya existe: {group_name}")

            # Configurar retencion
            self.logs.put_retention_policy(
                logGroupName=group_name,
                retentionInDays=retention_days,
            )
            created.append(group_name)

        logger.info(f"Grupos de logs configurados: {len(created)}")
        return created

    # -----------------------------------------------------------------------
    # Alarmas CloudWatch
    # -----------------------------------------------------------------------
    def setup_alarms(self, topic_arn: str, distribution_id: Optional[str] = None) -> list:
        """
        Configura alarmas CloudWatch para el proyecto.
        Cubre errores HTTP, latencia y metricas de CodeBuild.
        """
        alarms_created = []

        # -- Alarma 1: Errores 5xx en CloudFront
        if distribution_id:
            alarm_name = f"{self.prefix}-cloudfront-5xx"
            logger.info(f"Configurando alarma: {alarm_name}")

            self.cw.put_metric_alarm(
                AlarmName=alarm_name,
                AlarmDescription="Tasa de errores 5xx en CloudFront supera 5% en 5 minutos",
                MetricName="5xxErrorRate",
                Namespace="AWS/CloudFront",
                Statistic="Average",
                Dimensions=[
                    {"Name": "DistributionId", "Value": distribution_id},
                    {"Name": "Region", "Value": "Global"},
                ],
                Period=300,         # 5 minutos
                EvaluationPeriods=2,
                Threshold=5.0,      # 5%
                ComparisonOperator="GreaterThanThreshold",
                AlarmActions=[topic_arn],
                OKActions=[topic_arn],
                TreatMissingData="notBreaching",
                Tags=[{"Key": "Project", "Value": "CultivaFinanzas"}],
            )
            alarms_created.append(alarm_name)

            # -- Alarma 2: Latencia de origen (Origin Latency) CloudFront
            alarm_name = f"{self.prefix}-cloudfront-latency"
            self.cw.put_metric_alarm(
                AlarmName=alarm_name,
                AlarmDescription="Latencia de origen CloudFront supera 3 segundos",
                MetricName="OriginLatency",
                Namespace="AWS/CloudFront",
                Statistic="p95",
                ExtendedStatistic="p95",
                Dimensions=[
                    {"Name": "DistributionId", "Value": distribution_id},
                    {"Name": "Region", "Value": "Global"},
                ],
                Period=300,
                EvaluationPeriods=3,
                Threshold=3000,     # 3000 ms
                ComparisonOperator="GreaterThanThreshold",
                AlarmActions=[topic_arn],
                TreatMissingData="notBreaching",
            )
            alarms_created.append(alarm_name)

        # -- Alarma 3: Fallos en CodeBuild
        alarm_name = f"{self.prefix}-codebuild-failures"
        logger.info(f"Configurando alarma: {alarm_name}")

        self.cw.put_metric_alarm(
            AlarmName=alarm_name,
            AlarmDescription="Mas de 2 builds fallidos en el ultimo dia",
            MetricName="FailedBuilds",
            Namespace="AWS/CodeBuild",
            Statistic="Sum",
            Dimensions=[
                {"Name": "ProjectName", "Value": f"{self.prefix}-build"}
            ],
            Period=86400,       # 24 horas
            EvaluationPeriods=1,
            Threshold=2,
            ComparisonOperator="GreaterThanThreshold",
            AlarmActions=[topic_arn],
            TreatMissingData="notBreaching",
        )
        alarms_created.append(alarm_name)

        # -- Alarma 4: Metrica personalizada - Despliegues fallidos
        alarm_name = f"{self.prefix}-deploy-failures"
        self.cw.put_metric_alarm(
            AlarmName=alarm_name,
            AlarmDescription="Fallo en despliegue detectado",
            MetricName="DeploymentFailures",
            Namespace=f"{NAMESPACE}/Pipeline",
            Statistic="Sum",
            Period=3600,        # 1 hora
            EvaluationPeriods=1,
            Threshold=1,
            ComparisonOperator="GreaterThanOrEqualToThreshold",
            AlarmActions=[topic_arn],
            TreatMissingData="notBreaching",
        )
        alarms_created.append(alarm_name)

        # -- Alarma 5: Uso de CPU en EC2 (si hay instancias)
        alarm_name = f"{self.prefix}-ec2-cpu"
        self.cw.put_metric_alarm(
            AlarmName=alarm_name,
            AlarmDescription="CPU de instancia EC2 supera 80% por 10 minutos",
            MetricName="CPUUtilization",
            Namespace="AWS/EC2",
            Statistic="Average",
            Dimensions=[
                {"Name": "AutoScalingGroupName", "Value": self.prefix}
            ],
            Period=300,
            EvaluationPeriods=2,
            Threshold=80.0,
            ComparisonOperator="GreaterThanThreshold",
            AlarmActions=[topic_arn],
            TreatMissingData="missing",
        )
        alarms_created.append(alarm_name)

        logger.info(f"Alarmas configuradas: {len(alarms_created)}")
        for name in alarms_created:
            logger.info(f"  - {name}")

        return alarms_created

    # -----------------------------------------------------------------------
    # Dashboard
    # -----------------------------------------------------------------------
    def create_dashboard(self, distribution_id: Optional[str] = None) -> str:
        """Crea un dashboard CloudWatch con las metricas del proyecto."""
        dashboard_name = f"{PROJECT_NAME}-{self.environment}"
        logger.info(f"Creando dashboard: {dashboard_name}")

        widgets = []
        y_pos = 0

        # Titulo
        widgets.append({
            "type": "text",
            "x": 0, "y": y_pos, "width": 24, "height": 2,
            "properties": {
                "markdown": f"# Cultiva Finanzas - Dashboard de Monitoreo\n**Entorno:** {self.environment} | **Region:** {self.region} | **Actualizado:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}"
            },
        })
        y_pos += 2

        # CloudFront metrics (si tenemos distribution_id)
        if distribution_id:
            widgets.append({
                "type": "metric",
                "x": 0, "y": y_pos, "width": 12, "height": 6,
                "properties": {
                    "title": "CloudFront - Solicitudes por Minuto",
                    "view": "timeSeries",
                    "stacked": False,
                    "metrics": [
                        ["AWS/CloudFront", "Requests", "DistributionId", distribution_id, "Region", "Global", {"label": "Total Solicitudes", "color": "#2ca02c"}]
                    ],
                    "period": 60,
                    "stat": "Sum",
                    "region": "us-east-1",
                },
            })

            widgets.append({
                "type": "metric",
                "x": 12, "y": y_pos, "width": 12, "height": 6,
                "properties": {
                    "title": "CloudFront - Tasa de Errores",
                    "view": "timeSeries",
                    "metrics": [
                        ["AWS/CloudFront", "4xxErrorRate", "DistributionId", distribution_id, "Region", "Global", {"label": "Errores 4xx", "color": "#ff7f0e"}],
                        ["AWS/CloudFront", "5xxErrorRate", "DistributionId", distribution_id, "Region", "Global", {"label": "Errores 5xx", "color": "#d62728"}],
                    ],
                    "period": 300,
                    "stat": "Average",
                    "region": "us-east-1",
                },
            })
            y_pos += 6

        # CodeBuild metrics
        widgets.append({
            "type": "metric",
            "x": 0, "y": y_pos, "width": 12, "height": 6,
            "properties": {
                "title": "CodeBuild - Builds",
                "view": "timeSeries",
                "metrics": [
                    ["AWS/CodeBuild", "SucceededBuilds", "ProjectName", f"{self.prefix}-build", {"label": "Exitosos", "color": "#2ca02c"}],
                    ["AWS/CodeBuild", "FailedBuilds", "ProjectName", f"{self.prefix}-build", {"label": "Fallidos", "color": "#d62728"}],
                ],
                "period": 86400,
                "stat": "Sum",
                "region": self.region,
            },
        })

        widgets.append({
            "type": "metric",
            "x": 12, "y": y_pos, "width": 12, "height": 6,
            "properties": {
                "title": "CodeBuild - Duracion Promedio",
                "view": "timeSeries",
                "metrics": [
                    ["AWS/CodeBuild", "Duration", "ProjectName", f"{self.prefix}-build", {"label": "Duracion (s)", "color": "#1f77b4"}],
                ],
                "period": 86400,
                "stat": "Average",
                "region": self.region,
            },
        })
        y_pos += 6

        # Despliegues personalizados
        widgets.append({
            "type": "metric",
            "x": 0, "y": y_pos, "width": 24, "height": 6,
            "properties": {
                "title": "Despliegues - Historial",
                "view": "timeSeries",
                "metrics": [
                    [f"{NAMESPACE}/Deployments", "DeploymentCount", "Environment", self.environment, {"label": "Despliegues", "color": "#9467bd"}],
                ],
                "period": 86400,
                "stat": "Sum",
                "region": self.region,
            },
        })
        y_pos += 6

        dashboard_body = json.dumps({"widgets": widgets})

        self.cw.put_dashboard(
            DashboardName=dashboard_name,
            DashboardBody=dashboard_body,
        )

        dashboard_url = (
            f"https://{self.region}.console.aws.amazon.com/cloudwatch/home"
            f"?region={self.region}#dashboards:name={dashboard_name}"
        )
        logger.info(f"Dashboard creado: {dashboard_name}")
        logger.info(f"URL: {dashboard_url}")

        return dashboard_url

    # -----------------------------------------------------------------------
    # Consulta de metricas
    # -----------------------------------------------------------------------
    def get_metrics_summary(
        self,
        hours: int = 24,
        distribution_id: Optional[str] = None,
    ) -> dict:
        """Consulta y muestra un resumen de metricas de las ultimas N horas."""
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(hours=hours)

        logger.info(f"Consultando metricas: ultimas {hours} horas")
        logger.info(f"Rango: {start_time.strftime('%Y-%m-%d %H:%M')} - {end_time.strftime('%Y-%m-%d %H:%M')} UTC")

        summary = {}

        def get_metric_value(namespace, metric_name, dimensions, stat="Sum", period=3600):
            try:
                response = self.cw.get_metric_statistics(
                    Namespace=namespace,
                    MetricName=metric_name,
                    Dimensions=dimensions,
                    StartTime=start_time,
                    EndTime=end_time,
                    Period=period,
                    Statistics=[stat],
                )
                datapoints = response.get("Datapoints", [])
                if datapoints:
                    values = [dp[stat] for dp in datapoints]
                    return sum(values) if stat == "Sum" else sum(values) / len(values)
            except ClientError:
                pass
            return 0

        # CloudFront metricas
        if distribution_id:
            dims_cf = [
                {"Name": "DistributionId", "Value": distribution_id},
                {"Name": "Region", "Value": "Global"},
            ]
            summary["cloudfront_requests"] = get_metric_value(
                "AWS/CloudFront", "Requests", dims_cf, "Sum"
            )
            summary["cloudfront_4xx_rate"] = get_metric_value(
                "AWS/CloudFront", "4xxErrorRate", dims_cf, "Average"
            )
            summary["cloudfront_5xx_rate"] = get_metric_value(
                "AWS/CloudFront", "5xxErrorRate", dims_cf, "Average"
            )

        # CodeBuild metricas
        dims_cb = [{"Name": "ProjectName", "Value": f"{self.prefix}-build"}]
        summary["builds_succeeded"] = get_metric_value(
            "AWS/CodeBuild", "SucceededBuilds", dims_cb, "Sum"
        )
        summary["builds_failed"] = get_metric_value(
            "AWS/CodeBuild", "FailedBuilds", dims_cb, "Sum"
        )
        summary["build_duration_avg"] = get_metric_value(
            "AWS/CodeBuild", "Duration", dims_cb, "Average"
        )

        # Despliegues personalizados
        dims_deploy = [{"Name": "Environment", "Value": self.environment}]
        summary["deployments"] = get_metric_value(
            f"{NAMESPACE}/Deployments", "DeploymentCount", dims_deploy, "Sum"
        )

        # Mostrar resumen
        print("\n" + "=" * 60)
        print(f"  RESUMEN DE METRICAS - Ultimas {hours} horas")
        print("=" * 60)

        if distribution_id:
            print(f"  CloudFront Solicitudes:    {summary.get('cloudfront_requests', 0):,.0f}")
            print(f"  CloudFront Errores 4xx:    {summary.get('cloudfront_4xx_rate', 0):.2f}%")
            print(f"  CloudFront Errores 5xx:    {summary.get('cloudfront_5xx_rate', 0):.2f}%")
            print()

        print(f"  Builds Exitosos:           {summary.get('builds_succeeded', 0):.0f}")
        print(f"  Builds Fallidos:           {summary.get('builds_failed', 0):.0f}")
        print(f"  Duracion Promedio Build:   {summary.get('build_duration_avg', 0):.0f}s")
        print()
        print(f"  Despliegues Realizados:    {summary.get('deployments', 0):.0f}")
        print("=" * 60 + "\n")

        return summary

    def list_alarms(self) -> list:
        """Lista todas las alarmas del proyecto y su estado."""
        logger.info("Consultando alarmas CloudWatch...")

        response = self.cw.describe_alarms(
            AlarmNamePrefix=self.prefix,
        )

        alarms = response.get("MetricAlarms", [])
        composite = response.get("CompositeAlarms", [])

        all_alarms = alarms + composite

        if not all_alarms:
            logger.info("No se encontraron alarmas para este proyecto.")
            return []

        print("\n" + "=" * 60)
        print("  ALARMAS CLOUDWATCH")
        print("=" * 60)

        for alarm in sorted(all_alarms, key=lambda x: x.get("AlarmName", "")):
            state = alarm.get("StateValue", "UNKNOWN")
            name = alarm.get("AlarmName", "N/A")
            state_icon = {"OK": "✓", "ALARM": "✗", "INSUFFICIENT_DATA": "?"}
            icon = state_icon.get(state, "?")
            print(f"  [{icon}] [{state:20s}] {name}")

        print("=" * 60 + "\n")
        return all_alarms


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Monitoreo CloudWatch para Cultiva Finanzas",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Acciones:
  setup      Crear log groups, alarmas y dashboard
  metrics    Consultar metricas recientes
  alarms     Listar estado de alarmas
  dashboard  Crear/actualizar dashboard

Ejemplos:
  python3 scripts/monitoring.py --action setup --email alerta@empresa.com
  python3 scripts/monitoring.py --action metrics --hours 48
  python3 scripts/monitoring.py --action alarms
  python3 scripts/monitoring.py --action dashboard --cf-id E1234567890
        """,
    )
    parser.add_argument(
        "--action",
        choices=["setup", "metrics", "alarms", "dashboard"],
        required=True,
        help="Accion a ejecutar",
    )
    parser.add_argument("--env", default="production", help="Entorno (default: production)")
    parser.add_argument("--region", default=DEFAULT_REGION, help=f"Region AWS (default: {DEFAULT_REGION})")
    parser.add_argument("--email", help="Email para notificaciones SNS")
    parser.add_argument("--cf-id", dest="cf_id", help="ID de distribucion CloudFront")
    parser.add_argument("--hours", type=int, default=24, help="Horas hacia atras para metricas (default: 24)")

    args = parser.parse_args()

    mgr = CloudWatchManager(environment=args.env, region=args.region)

    if args.action == "setup":
        logger.info("=== Configurando monitoreo completo ===")
        topic_arn = mgr.create_alarm_topic(email=args.email)
        mgr.create_log_groups()
        mgr.setup_alarms(topic_arn=topic_arn, distribution_id=args.cf_id)
        mgr.create_dashboard(distribution_id=args.cf_id)
        logger.info("=== Monitoreo configurado exitosamente ===")

    elif args.action == "metrics":
        mgr.get_metrics_summary(hours=args.hours, distribution_id=args.cf_id)

    elif args.action == "alarms":
        mgr.list_alarms()

    elif args.action == "dashboard":
        url = mgr.create_dashboard(distribution_id=args.cf_id)
        print(f"\nDashboard disponible en: {url}\n")


if __name__ == "__main__":
    main()
