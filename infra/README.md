# Módulo de Infraestructura - DynamoDB y IAM

Este módulo de Terraform provisiona los recursos de infraestructura necesarios para la aplicación de gestión de órdenes, incluyendo una tabla de DynamoDB y las políticas IAM asociadas.

## Recursos Provisionados

### Amazon DynamoDB
- Tabla de DynamoDB para almacenamiento de órdenes con capacidad bajo demanda
- Clave primaria: `orderId` (String)
- Índice secundario global para consultas por `customerId`
- Habilitación de Streams para captura de cambios
- Punto de acceso DAX (DynamoDB Accelerator) opcional para caché en memoria

### AWS Identity and Access Management (IAM)
- Rol de Lambda con permisos de lectura/escritura en la tabla
- Política de acceso con principio de mínimo privilegio
- Usuario de aplicación con credenciales programáticas
- Grupo de IAM para gestión centralizada de permisos

## Uso Básico

```hcl
module "infra" {
  source = "./infra"

  aws_region         = "us-east-1"
  project_name       = "ordenes-app"
  environment        = "dev"
  dynamodb_table_name = "ordenes"

  # Configuración de capacidad de DynamoDB
  dynamodb_billing_mode = "PAY_PER_REQUEST"
  dynamodb_hash_key     = "orderId"

  # Configuración de redundancy
  enable_dax         = false
  enable_point_in_time_recovery = true

  repository_url = "https://github.com/empresa/ordenes-app"
}
```

##Variables Requeridas

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `aws_region` | string | Región AWS donde se crearán los recursos |
| `project_name` | string | Nombre del proyecto para tagging |
| `environment` | string | Entorno (dev, staging, prod) |
| `dynamodb_table_name` | string | Nombre de la tabla DynamoDB |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `dynamodb_billing_mode` | string | "PAY_PER_REQUEST" | Modo de facturación |
| `dynamodb_hash_key` | string | "orderId" | Clave primaria de la tabla |
| `enable_dax` | bool | false | Habilitar DAX para caché |
| `enable_point_in_time_recovery` | bool | true | Recuperación a punto en tiempo |
| `dynamodb_attributes` | list(object) | [] | Atributos adicionales para índices |
| `repository_url` | string | "" | URL del repositorio |

## Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `dynamodb_table_name` | string | Nombre de la tabla creada |
| `dynamodb_table_arn` | string | ARN de la tabla |
| `dynamodb_table_stream_arn` | string | ARN del stream de la tabla |
| `iam_role_arn` | string | ARN del rol de Lambda |
| `iam_user_access_key` | string | ID de la clave de acceso |
| `iam_user_name` | string | Nombre del usuario IAM |

## Validación Local

Para validar la configuración de Terraform antes de aplicar:

```bash
cd infra
terraform init
terraform validate
terraform plan -var-file=../environments/dev/terraform.tfvars
```

## Recursos de Seguridad

- Cifrado en reposo con AWS KMS managed keys
- Cifrado en tránsito habilitado
- Políticas IAM con mínimo privilegio específico por operación
- CloudTrail habilitado para auditoría de operaciones
- VPC endpoint opcional para acceso privado a DynamoDB

## Consideraciones de Costos

- DynamoDB en modo PAY_PER_REQUEST facturado por solicitud
- DAX facturado por nodo por hora (si está habilitado)
- S3 para DynamoDB Streams (si está habilitado)
- IAM es servicio gratuito dentro de la cuenta

## Dependencias Externas

- Terraform >= 1.0
- Proveedor AWS ~> 5.0
- Credenciales AWS configuradas localmente o en entorno CI/CD