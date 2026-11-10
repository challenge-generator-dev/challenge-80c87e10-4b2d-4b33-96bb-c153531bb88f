variable "policy_name" {
  description = "Nombre de la política IAM"
  type        = string

  validation {
    condition     = length(var.policy_name) <= 128 && can(regex("^[a-zA-Z0-9_-]+$", var.policy_name))
    error_message = "El nombre de la política debe tener máximo 128 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "role_name" {
  description = "Nombre del rol IAM"
  type        = string

  validation {
    condition     = length(var.role_name) <= 64 && can(regex("^[a-zA-Z0-9_-]+$", var.role_name))
    error_message = "El nombre del rol debe tener máximo 64 caracteres y solo puede contener letras, números, guiones y guiones bajos."
  }
}

variable "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB para la que se otorgarán permisos"
  type        = string

  validation {
    condition     = can(regex("^arn:aws:dynamodb:[a-z0-9-]+:[0-9]+:table/[a-zA-Z0-9_.-]+$", var.dynamodb_table_arn))
    error_message = "El ARN de la tabla DynamoDB debe tener un formato válido."
  }
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para construir el ARN"
  type        = string

  validation {
    condition     = length(var.dynamodb_table_name) >= 1 && length(var.dynamodb_table_name) <= 255
    error_message = "El nombre de la tabla debe tener entre 1 y 255 caracteres."
  }
}

variable "additional_permissions" {
  description = "Permisos adicionales para la política IAM"
  type = list(object({
    effect    = string
    actions   = list(string)
    resources = list(string)
  }))
  default = []

  validation {
    condition     = length(var.additional_permissions) == 0 || alltrue([for perm in var.additional_permissions : contains(["Allow", "Deny"], perm.effect)])
    error_message = "El efecto debe ser Allow o Deny."
  }
}

variable "trusted_entities" {
  description = "Entidades confiables para asumir el rol IAM"
  type        = list(string)
  default     = ["lambda.amazonaws.com"]

  validation {
    condition     = length(var.trusted_entities) > 0
    error_message = "Debe especificarse al menos una entidad confiable."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para los recursos IAM"
  type        = map(string)
  default     = {}
}

variable "aws_region" {
  description = "Región AWS para construir el ARN de la tabla"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = can(regex("^[a-z]+-[a-z]+-[0-9]+$", var.aws_region))
    error_message = "La región debe tener un formato válido de AWS (ej: us-east-1)."
  }
}

variable "aws_account_id" {
  description = "ID de la cuenta AWS para construir el ARN de la tabla"
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "El ID de cuenta debe tener exactamente 12 dígitos."
  }
}