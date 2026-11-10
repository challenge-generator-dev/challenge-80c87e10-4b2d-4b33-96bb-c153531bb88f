# Configuración principal de infraestructura para la aplicación de órdenes
# Este archivo orquesta los módulos de DynamoDB e IAM necesarios para persistir y acceder a las órdenes

# Módulo de DynamoDB para almacenamiento de órdenes
# Proporciona la tabla con clave primaria orderId e índice secundario por customerId
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name     = var.dynamodb_table_name
  billing_mode   = var.dynamodb_billing_mode
  hash_key       = var.dynamodb_hash_key
  range_key      = var.dynamodb_range_key
  environment    = var.environment
  project_name   = var.project_name
  repository_url = var.repository_url

  # Configuración de atributos para índices secundarios
  attributes = var.dynamodb_attributes

  # Configuración de TTL para limpieza automática de órdenes antiguas
  ttl_attribute_name = var.dynamodb_ttl_attribute
  enable_ttl         = var.dynamodb_enable_ttl

  # Configuración de redundancia y recuperación
  enable_dax                    = var.enable_dax
  enable_point_in_time_recovery = var.enable_point_in_time_recovery
  enable_streams                = var.dynamodb_enable_streams

  # Configuración de capacidad (solo para modo PROVISIONED)
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  # Configuración de cifrado
  server_side_encryption_enabled = var.dynamodb_encryption_enabled
  kms_key_arn                    = var.dynamodb_kms_key_arn

  # Configuración de timeouts
  timeouts = {
    create = var.dynamodb_create_timeout
    update = var.dynamodb_update_timeout
    delete = var.dynamodb_delete_timeout
  }
}

# Módulo de IAM para acceso a la tabla de DynamoDB
# Crea el rol, políticas y usuario necesarios para que la aplicación acceda a DynamoDB
module "iam" {
  source = "./modules/iam"

  project_name   = var.project_name
  environment    = var.environment
  repository_url = var.repository_url

  # Nombre de la tabla DynamoDB para los permisos
  dynamodb_table_name = module.dynamodb.table_name
  dynamodb_table_arn  = module.dynamodb.table_arn

  # Habilitar generación de credenciales para usuario de aplicación
  create_app_user = var.create_iam_user

  # Configuración de permisos específicos
  enable_dynamodb_get_item    = var.iam_allow_get_item
  enable_dynamodb_put_item    = var.iam_allow_put_item
  enable_dynamodb_update_item = var.iam_allow_update_item
  enable_dynamodb_delete_item = var.iam_allow_delete_item
  enable_dynamodb_query       = var.iam_allow_query
  enable_dynamodb_scan        = var.iam_allow_scan
  enable_dynamodb_batch       = var.iam_allow_batch_operations

  # Permisos adicionales
  enable_cloudwatch_logs = var.iam_allow_cloudwatch
  enable_xray            = var.iam_allow_xray

  # Nombre del rol de Lambda
  lambda_role_name = "${var.project_name}-lambda-role-${var.environment}"

  # Nombre del usuario de aplicación
  app_user_name = "${var.project_name}-app-${var.environment}"
}

# Recurso adicional: SNS topic para notificaciones de órdenes
# Descomenta si necesitas notificaciones cuando se crean/actualizan órdenes
# resource "aws_sns_topic" "order_notifications" {
#   name = "${var.project_name}-orders-${var.environment}"
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# Recurso adicional: EventBridge rule para procesar eventos de DynamoDB Streams
# Descomenta si necesitas procesar eventos de cambios en órdenes
# resource "aws_cloudwatch_event_rule" "dynamodb_stream_rule" {
#   name           = "${var.project_name}-dynamodb-events-${var.environment}"
#   description   = "Rule para capturar eventos de DynamoDB Streams"
#   event_pattern = jsonencode({
#     "source" : ["aws.dynamodb"],
#     "detail-type" : ["INSERT", "MODIFY", "REMOVE"]
#   })
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# Recurso adicional: S3 bucket para logs de auditoría
# Descomenta si necesitas almacenar logs de operaciones con órdenes
# resource "aws_s3_bucket" "audit_logs" {
#   bucket = "${var.project_name}-audit-logs-${var.environment}"
#   tags = {
#     Project     = var.project_name
#     Environment = var.environment
#     ManagedBy   = "terraform"
#   }
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "audit_logs" {
#   bucket = aws_s3_bucket.audit_logs.id
#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

# Data source para obtener información de la cuenta AWS
# Útil para referencias cruzadas en políticas
data "aws_caller_identity" "current" {}

# Data source para obtener la zona de disponibilidad actual
data "aws_availability_zones" "available" {
  state = "available"
}

# Locals para construir ARNs y referencias comunes
locals {
  account_id     = data.aws_caller_identity.current.account_id
  partition      = data.aws_caller_identity.current.partition
  region         = var.aws_region
  table_name     = var.dynamodb_table_name
  full_table_arn = "arn:${local.partition}:dynamodb:${local.region}:${local.account_id}:table/${local.table_name}"
}

# Alias para el output del módulo DynamoDB
# Proporciona una interfaz unificada para otros módulos que consumen esta infraestructura
output "table_info" {
  description = "Información de la tabla DynamoDB"
  value = {
    name       = module.dynamodb.table_name
    arn        = module.dynamodb.table_arn
    stream_arn = module.dynamodb.stream_arn
    endpoint   = module.dynamodb.endpoint
  }
}

# Alias para los outputs del módulo IAM
output "access_info" {
  description = "Información de acceso IAM"
  value = {
    role_arn      = module.iam.role_arn
    user_name     = var.create_iam_user ? module.iam.user_name : null
    access_key_id = var.create_iam_user ? module.iam.access_key_id : null
  }
}