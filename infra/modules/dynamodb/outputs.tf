output "table_name" {
  description = "Nombre de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.id
}

output "table_stream_arn" {
  description = "ARN del stream de la tabla DynamoDB (si está habilitado)"
  value       = try(aws_dynamodb_table.orders_stream[0].stream_arn, null)
}

output "table_stream_label" {
  description = "Etiqueta del stream de la tabla DynamoDB"
  value       = try(aws_dynamodb_table.orders_stream[0].stream_label, null)
}

output "table_arn_suffix" {
  description = "Sufijo del ARN de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.arn_suffix
}

output "kms_key_arn" {
  description = "ARN de la clave KMS utilizada para el cifrado (si se creó)"
  value       = try(aws_kms_key.dynamodb_table[0].arn, var.server_side_encryption_kms_key_arn)
}

output "kms_key_id" {
  description = "ID de la clave KMS utilizada para el cifrado (si se creó)"
  value       = try(aws_kms_key.dynamodb_table[0].key_id, null)
}

output "backup_plan_id" {
  description = "ID del plan de backup de AWS Backup (si está habilitado)"
  value       = try(aws_backup_plan.orders[0].id, null)
}

output "backup_selection_id" {
  description = "ID de la selección de backup (si está habilitado)"
  value       = try(aws_backup_selection.orders[0].id, null)
}

output "contributor_insights_status" {
  description = "Estado de Contributor Insights (si está habilitado)"
  value       = try(aws_dynamodb_contributor_insights.orders[0].status, null)
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch (si está habilitado)"
  value       = try(aws_cloudwatch_log_group.dynamodb[0].name, null)
}

output "resource_policy_id" {
  description = "ID de la política de recursos (si está habilitada)"
  value       = try(aws_dynamodb_resource_policy.orders[0].id, null)
}

output "global_secondary_indexes" {
  description = "Lista de índices secundarios globales y sus estados"
  value = [
    for gsi in aws_dynamodb_table.orders.global_secondary_index : {
      name   = gsi.name
      status = gsi.status
    }
  ]
}

output "local_secondary_indexes" {
  description = "Lista de índices secundarios locales"
  value = [
    for lsi in aws_dynamodb_table.orders.local_secondary_index : {
      name = lsi.name
    }
  ]
}

output "replica_regions" {
  description = "Regiones de réplica configuradas (para tablas globales)"
  value       = aws_dynamodb_table.orders.replica
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.orders.tags
}

output "table_size_bytes" {
  description = "Tamaño estimado de la tabla en bytes"
  value       = aws_dynamodb_table.orders.table_size_bytes
}

output "item_count" {
  description = "Cantidad estimada de elementos en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}