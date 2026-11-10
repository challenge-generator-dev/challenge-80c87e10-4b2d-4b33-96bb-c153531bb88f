aws_region = "us-east-1"

environment = "dev"

project_name = "orders-management"

dynamodb_table_config = {
  table_name         = "orders-dev"
  billing_mode       = "PAY_PER_REQUEST"
  read_capacity      = 5
  write_capacity     = 5
  partition_key      = "orderId"
  partition_key_type = "S"
  sort_key           = "createdAt"
  sort_key_type      = "S"
  enable_ttl         = true
  ttl_attribute      = "expiresAt"
  enable_stream      = true
  stream_view_type   = "NEW_AND_OLD_IMAGES"
}

s3_config = {
  bucket_name     = "orders-artifacts-dev"
  versioning      = true
  lifecycle_rule  = true
  expiration_days = 30
}

iam_config = {
  role_name              = "orders-dynamodb-access-dev"
  enable_dynamodb_access = true
  enable_s3_read_access  = true
  enable_s3_write_access = true
  enable_cloudwatch_logs = true
}

tags = {
  Environment = "dev"
  Project     = "orders-management"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
  Team        = "platform"
}

vpc_config = {
  enable_vpc      = false
  vpc_cidr        = "10.0.0.0/16"
  public_subnets  = []
  private_subnets = []
}

network_config = {
  enable_nat_gateway   = false
  enable_vpc_endpoints = false
}

monitoring_config = {
  enable_cloudwatch          = true
  log_retention_days         = 7
  enable_deletion_protection = false
}

backup_config = {
  enable_backup   = false
  backup_schedule = "cron(0 5 ? * * *)"
  retention_days  = 7
}

kms_config = {
  enable_encryption    = true
  key_description      = "Clave KMS para datos de órdenes en ambiente dev"
  deletion_window_days = 7
  enable_key_rotation  = false
}

dynamodb_backup_config = {
  enable_point_in_time_recovery = true
  enable_on_demand_backup       = false
}

cognito_config = {
  enable_user_pool = false
  user_pool_name   = "orders-users-dev"
  enable_mfa       = false
}

api_gateway_config = {
  enable_api_gateway = false
  stage_name         = "dev"
  enable_caching     = false
}