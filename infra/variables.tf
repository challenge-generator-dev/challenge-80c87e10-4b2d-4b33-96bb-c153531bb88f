variable "aws_region" {
  description = "Región AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"], var.aws_region)
    error_message = "La región debe ser una de las siguientes: us-east-1, us-west-2, eu-west-1, ap-southeast-1."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetado de recursos"
  type        = string
  default     = "order-management"

  validation {
    condition     = length(var.project_name) >= 1 && length(var.project_name) <= 64
    error_message = "El nombre del proyecto debe tener entre 1 y 64 caracteres."
  }
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"

  validation {
    condition     = length(var.dynamodb_table_name) <= 255 && can(regex("^[a-zA-Z0-9_.-]+$", var.dynamodb_table_name))
    error_message = "El nombre de la tabla debe tener máximo 255 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos."
  }
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.dynamodb_billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.dynamodb_read_capacity >= 1 && var.dynamodb_read_capacity <= 10000
    error_message = "La capacidad de lectura debe estar entre 1 y 10000."
  }
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.dynamodb_write_capacity >= 1 && var.dynamodb_write_capacity <= 10000
    error_message = "La capacidad de escritura debe estar entre 1 y 10000."
  }
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "orderId"

  validation {
    condition     = length(var.dynamodb_hash_key) >= 1 && length(var.dynamodb_hash_key) <= 255
    error_message = "La clave hash debe tener entre 1 y 255 caracteres."
  }
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB (opcional)"
  type        = string
  default     = ""

  validation {
    condition     = var.dynamodb_range_key == "" || (length(var.dynamodb_range_key) >= 1 && length(var.dynamodb_range_key) <= 255)
    error_message = "La clave de rango debe tener entre 1 y 255 caracteres si se especifica."
  }
}

variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "OrderManagementDynamoDBAccess"

  validation {
    condition     = length(var.iam_policy_name) <= 128 && can(regex("^[a-zA-Z0-9_-]+$", var.iam_policy_name))
    error_message = "El nombre de la política debe tener máximo 128 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "iam_role_name" {
  description = "Nombre del rol IAM para la aplicación"
  type        = string
  default     = "OrderManagementAppRole"

  validation {
    condition     = length(var.iam_role_name) <= 64 && can(regex("^[a-zA-Z0-9_-]+$", var.iam_role_name))
    error_message = "El nombre del rol debe tener máximo 64 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = []

  validation {
    condition     = length(var.dynamodb_attributes) == 0 || alltrue([for attr in var.dynamodb_attributes : contains(["S", "N", "B"], attr.type)])
    error_message = "Los tipos de atributos deben ser S (String), N (Number) o B (Binary)."
  }
}

variable "dynamodb_gsi" {
  description = "Índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name               = string
    hash_key           = string
    range_key          = optional(string, "")
    projection_type    = string
    read_capacity      = number
    write_capacity     = number
    non_key_attributes = list(string)
  }))
  default = []

  validation {
    condition     = length(var.dynamodb_gsi) == 0 || alltrue([for gsi in var.dynamodb_gsi : contains(["KEYS_ONLY", "INCLUDE", "ALL"], gsi.projection_type)])
    error_message = "El tipo de proyección debe ser KEYS_ONLY, INCLUDE o ALL."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para los recursos"
  type        = map(string)
  default     = {}
}