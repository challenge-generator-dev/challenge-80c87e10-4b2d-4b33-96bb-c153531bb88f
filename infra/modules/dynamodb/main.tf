resource "aws_dynamodb_table" "orders" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key_attribute_name
  range_key    = var.range_key_attribute_name

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.gsi_configs
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = global_secondary_index.value.range_key
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = global_secondary_index.value.read_capacity
      write_capacity  = global_secondary_index.value.write_capacity
    }
  }

  dynamic "local_secondary_index" {
    for_each = var.lsi_configs
    content {
      name            = local_secondary_index.value.name
      range_key       = local_secondary_index.value.range_key
      projection_type = local_secondary_index.value.projection_type
    }
  }

  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.server_side_encryption_kms_key_arn
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery_enabled
  }

  ttl {
    attribute_name = var.ttl_attribute_name
    enabled        = var.ttl_enabled
  }

  tags = merge(
    var.common_tags,
    {
      Name        = var.table_name
      Environment = var.environment
      Purpose     = "orders-persistence"
    }
  )

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      tags,
      global_secondary_index,
      local_secondary_index
    ]
  }
}

resource "aws_dynamodb_table" "orders_stream" {
  count = var.enable_streams ? 1 : 0

  name         = "${var.table_name}-stream"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.hash_key_attribute_name
  range_key    = var.range_key_attribute_name

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  stream_enabled   = true
  stream_view_type = var.stream_view_type

  server_side_encryption {
    enabled = true
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-stream"
      Environment = var.environment
      Purpose     = "orders-change-stream"
    }
  )

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_contributor_insights" "orders" {
  count = var.enable_contributor_insights ? 1 : 0

  table_name = aws_dynamodb_table.orders.name
  status     = "ENABLED"
}

resource "aws_backup_plan" "orders" {
  count = var.enable_backup ? 1 : 0

  name = "${var.table_name}-backup-plan"

  dynamic "rule" {
    for_each = var.backup_rules
    content {
      name              = rule.value.name
      schedule          = rule.value.schedule
      start_window      = rule.value.start_window
      completion_window = rule.value.completion_window
      lifecycle {
        move_to_cold_storage_after_days = rule.value.move_to_cold_storage_after_days
        delete_after_days               = rule.value.delete_after_days
      }
      copy_action {
        destination_vault_arn = rule.value.destination_vault_arn
      }
    }
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-backup"
      Environment = var.environment
    }
  )

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_backup_selection" "orders" {
  count = var.enable_backup ? 1 : 0

  name         = "${var.table_name}-backup-selection"
  plan_id      = aws_backup_plan.orders[0].id
  resources    = [aws_dynamodb_table.orders.arn]
  iam_role_arn = var.backup_iam_role_arn

  condition {
    string_like {
      key   = "aws:ResourceTag/Purpose"
      value = "orders-*"
    }
  }
}

resource "aws_kms_key" "dynamodb_table" {
  count = var.server_side_encryption_enabled && var.create_kms_key ? 1 : 0

  description             = "KMS key for DynamoDB table ${var.table_name}"
  deletion_window_in_days = 10
  enable_key_rotation     = var.kms_enable_key_rotation
  key_usage               = "ENCRYPT_DECRYPT"

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "dynamodb-kms-key-policy"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${var.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow DynamoDB to use the key"
        Effect = "Allow"
        Principal = {
          Service = "dynamodb.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
          "kms:CreateGrant"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:CallerAccount" = var.account_id
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-kms"
      Environment = var.environment
      Purpose     = "encryption"
    }
  )
}

resource "aws_kms_alias" "dynamodb_table" {
  count = var.server_side_encryption_enabled && var.create_kms_key ? 1 : 0

  name          = "alias/${var.table_name}-${var.environment}"
  target_key_id = aws_kms_key.dynamodb_table[0].key_id
}

resource "aws_cloudwatch_log_group" "dynamodb" {
  count = var.enable_cloudwatch_logs ? 1 : 0

  name              = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.log_kms_key_id

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-logs"
      Environment = var.environment
    }
  )
}

resource "aws_dynamodb_resource_policy" "orders" {
  count = var.enable_resource_policy ? 1 : 0

  table_name = aws_dynamodb_table.orders.name

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "dynamodb-resource-policy"
    Statement = [
      {
        Sid       = "Allow read access for authenticated users"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
        Condition = {
          "Bool" : {
            "aws:SecureTransport" : "true"
          }
        }
      }
    ]
  })
}