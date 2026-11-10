terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Validaciones de entrada mediante locals para usar en variables
locals {
  valid_regions        = ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "eu-west-1", "eu-central-1"]
  valid_environments   = ["dev", "staging", "prod"]
  is_valid_region      = contains(local.valid_regions, var.aws_region)
  is_valid_environment = contains(local.valid_environments, var.environment)
}

# Validaciones cruzadas para la configuración de DynamoDB
locals {
  is_provisioned_mode = var.dynamodb_billing_mode == "PROVISIONED"
  capacity_configured = var.dynamodb_read_capacity > 0 && var.dynamodb_write_capacity > 0
  valid_capacity_mode = !local.is_provisioned_mode || local.capacity_configured
  table_name_valid    = var.dynamodb_table_name != "" && length(var.dynamodb_table_name) <= 255
  project_name_valid  = length(var.project_name) >= 3 && length(var.project_name) <= 50
}

# Mensajes de error para validaciones
locals {
  region_error_message       = "La región debe ser una región AWS válida: ${join(", ", local.valid_regions)}"
  environment_error_message  = "El entorno debe ser uno de: ${join(", ", local.valid_environments)}"
  project_name_error_message = "El nombre del proyecto debe tener entre 3 y 50 caracteres"
  table_name_error_message   = "El nombre de la tabla DynamoDB no puede estar vacío y debe tener máximo 255 caracteres"
  capacity_error_message     = "Para modo PROVISIONED, se deben especificar read_capacity y write_capacity mayores a 0"
}

# Output interno para validaciones (usado por variables)
output "_validation_outputs" {
  description = "Internal validation results"
  value = {
    is_valid_region            = local.is_valid_region
    is_valid_environment       = local.is_valid_environment
    valid_capacity_mode        = local.valid_capacity_mode
    table_name_valid           = local.table_name_valid
    project_name_valid         = local.project_name_valid
    region_error_message       = local.region_error_message
    environment_error_message  = local.environment_error_message
    project_name_error_message = local.project_name_error_message
    table_name_error_message   = local.table_name_error_message
    capacity_error_message     = local.capacity_error_message
  }
  sensitive = true
}