variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string

  validation {
    condition     = length(var.table_name) <= 255 && can(regex("^[a-zA-Z0-9_.-]+$", var.table_name))
    error_message = "El nombre de la tabla debe tener máximo 255 caracteres y solo puede contener letras, números, guiones bajos, guiones y puntos."
  }
}

variable "billing_mode" {
  description = "Modo de facturación para DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.read_capacity >= 1 && var.read_capacity <= 10000
    error_message = "La capacidad de lectura debe estar entre 1 y 10000."
  }
}

variable "write_capacity" {
  description = "Capacidad de escritura para DynamoDB (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5

  validation {
    condition     = var.write_capacity >= 1 && var.write_capacity <= 10000
    error_message = "La capacidad de escritura debe estar entre 1 y 10000."
  }
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string

  validation {
    condition     = length(var.hash_key) >= 1 && length(var.hash_key) <= 255
    error_message = "La clave hash debe tener entre 1 y 255 caracteres."
  }
}

variable "range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB (opcional)"
  type        = string
  default     = ""

  validation {
    condition     = var.range_key == "" || (length(var.range_key) >= 1 && length(var.range_key) <= 255)
    error_message = "La clave de rango debe tener entre 1 y 255 caracteres si se especifica."
  }
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = []

  validation {
    condition     = length(var.attributes) == 0 || alltrue([for attr in var.attributes : contains(["S", "N", "B"], attr.type)])
    error_message = "Los tipos de atributos deben ser S (String), N (Number) o B (Binary)."
  }
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
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
    condition     = length(var.global_secondary_indexes) == 0 || alltrue([for gsi in var.global_secondary_indexes : contains(["KEYS_ONLY", "INCLUDE", "ALL"], gsi.projection_type)])
    error_message = "El tipo de proyección debe ser KEYS_ONLY, INCLUDE o ALL."
  }
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

variable "stream_enabled" {
  description = "Habilitar stream para la tabla DynamoDB"
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista para el stream de DynamoDB (solo aplica si stream_enabled es true)"
  type        = string
  default     = "NEW_AND_OLD_IMAGES"

  validation {
    condition     = !var.stream_enabled || contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.stream_view_type)
    error_message = "El tipo de vista del stream debe ser KEYS_ONLY, NEW_IMAGE, OLD_IMAGE o NEW_AND_OLD_IMAGES."
  }
}