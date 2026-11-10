terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Configuración adicional para DynamoDB
provider "aws" {
  alias  = "dynamodb"
  region = var.aws_region
}

# Configuración para IAM
provider "aws" {
  alias  = "iam"
  region = "us-east-1" # IAM es global pero requiere región
}

# Validación de variables de entrada
locals {
  required_tags = {
    Project     = var.project_name != "" ? var.project_name : "order-management"
    Environment = contains(["dev", "staging", "prod"], var.environment) ? var.environment : "dev"
  }

  dynamodb_config = {
    billing_mode   = var.dynamodb_billing_mode
    read_capacity  = var.dynamodb_read_capacity
    write_capacity = var.dynamodb_write_capacity
    hash_key       = var.dynamodb_hash_key
    range_key      = var.dynamodb_range_key != "" ? var.dynamodb_range_key : null
  }
}

# Output de configuración para uso en otros módulos
output "project_tags" {
  description = "Tags aplicados a todos los recursos"
  value       = local.required_tags
}

output "dynamodb_config" {
  description = "Configuración de DynamoDB"
  value       = local.dynamodb_config
  sensitive   = true
}

output "aws_region_configured" {
  description = "Región AWS configurada"
  value       = var.aws_region
}