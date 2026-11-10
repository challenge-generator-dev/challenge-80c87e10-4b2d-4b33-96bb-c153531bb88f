output "dynamodb_table_name" {
  description = "Nombre de la tabla de ordenes en DynamoDB"
  value       = module.dynamodb.orders_table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de ordenes en DynamoDB"
  value       = module.dynamodb.orders_table_arn
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de ordenes en DynamoDB"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "dynamodb_partition_key" {
  description = "Nombre de la clave de particion de la tabla"
  value       = module.dynamodb.orders_table_partition_key_name
}

output "dynamodb_sort_key" {
  description = "Nombre de la clave de ordenamiento de la tabla"
  value       = module.dynamodb.orders_table_sort_key_name
}

output "iam_role_arn" {
  description = "ARN del rol IAM para acceso a DynamoDB"
  value       = module.iam.dynamodb_access_role_arn
}

output "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = module.iam.dynamodb_access_role_name
}

output "project_environment" {
  description = "Ambiente de despliegue"
  value       = var.environment
}

output "aws_region" {
  description = "Region de AWS configurada"
  value       = var.aws_region
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.orders_table_stream_arn
}

output "bucket_name" {
  description = "Nombre del bucket de S3 para artifacts"
  value       = aws_s3_bucket.artifacts.id
}

output "bucket_arn" {
  description = "ARN del bucket de S3 para artifacts"
  value       = aws_s3_bucket.artifacts.arn
}

output "complete_dynamodb_endpoint" {
  description = "Endpoint completo para conexion desde la aplicacion"
  value       = "dynamodb.${var.aws_region}.amazonaws.com"
}

output "table_endpoint_url" {
  description = "URL del endpoint de la tabla para SDK"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com/${module.dynamodb.orders_table_name}"
}