data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    sid    = "AllowDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:ConditionCheckItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeLimits",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:DescribeContinuousBackups",
      "dynamodb:DescribeBackup",
      "dynamodb:ListTagsOfResource",
      "dynamodb:GetItem",
      "dynamodb:UpdateTimeToLive"
    ]

    resources = [
      var.dynamodb_table_arn,
      "${var.dynamodb_table_arn}/index/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "AllowStreamAccess"
    effect = "Allow"

    actions = [
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams"
    ]

    resources = [var.dynamodb_stream_arn]
  }

  statement {
    sid    = "AllowKMSDecrypt"
    effect = "Allow"

    actions = [
      "kms:Decrypt",
      "kms:DescribeKey",
      "kms:Encrypt",
      "kms:GenerateDataKey*",
      "kms:ReEncrypt*"
    ]

    resources = [var.kms_key_arn]

    condition {
      test     = "StringLike"
      variable = "kms:ViaService"
      values   = ["dynamodb.*.amazonaws.com"]
    }
  }

  statement {
    sid    = "DenyIAMActions"
    effect = "Deny"

    actions = [
      "dynamodb:DeleteTable",
      "dynamodb:UpdateTable",
      "dynamodb:DeleteItem",
      "dynamodb:*"
    ]

    resources = [var.dynamodb_table_arn]

    condition {
      test     = "StringEquals"
      variable = "aws:RequestedRegion"
      values   = var.restricted_regions
    }

    not_actions = [
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
  }
}

resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.policy_name_prefix}-dynamodb-access"
  description = "Política de acceso a DynamoDB para la tabla de órdenes con principio de mínimo privilegio"
  policy      = data.aws_iam_policy_document.dynamodb_access.json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-access"
      Environment = var.environment
      Purpose     = "dynamodb-access"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "dynamodb_readonly" {
  count = var.enable_readonly_policy ? 1 : 0

  statement {
    sid    = "AllowReadOnlyDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:DescribeTable",
      "dynamodb:DescribeTimeToLive",
      "dynamodb:DescribeContinuousBackups",
      "dynamodb:ListTagsOfResource"
    ]

    resources = [
      var.dynamodb_table_arn,
      "${var.dynamodb_table_arn}/index/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "DenyWriteActions"
    effect = "Deny"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchWriteItem"
    ]

    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "dynamodb_readonly" {
  count = var.enable_readonly_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-dynamodb-readonly"
  description = "Política de solo lectura a DynamoDB para la tabla de órdenes"
  policy      = data.aws_iam_policy_document.dynamodb_readonly[0].json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-readonly"
      Environment = var.environment
      Purpose     = "dynamodb-readonly"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "dynamodb_writeonly" {
  count = var.enable_writeonly_policy ? 1 : 0

  statement {
    sid    = "AllowWriteOnlyDynamoDBAccess"
    effect = "Allow"

    actions = [
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:DescribeTable"
    ]

    resources = [var.dynamodb_table_arn]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "DenyReadActions"
    effect = "Deny"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchGetItem"
    ]

    resources = [var.dynamodb_table_arn]
  }
}

resource "aws_iam_policy" "dynamodb_writeonly" {
  count = var.enable_writeonly_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-dynamodb-writeonly"
  description = "Política de solo escritura a DynamoDB para la tabla de órdenes"
  policy      = data.aws_iam_policy_document.dynamodb_writeonly[0].json

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-dynamodb-writeonly"
      Environment = var.environment
      Purpose     = "dynamodb-writeonly"
      Module      = "iam"
    }
  )
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    sid    = "AllowAssumeRole"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "lambda.amazonaws.com", "ecs-tasks.amazonaws.com", "states.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }

  statement {
    sid    = "AllowAssumeRoleWithPrincipalTag"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = var.trusted_iam_principals
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringEquals"
      variable = "iam:ResourceTag/${var.principal_tag_key}"
      values   = [var.principal_tag_value]
    }
  }
}

resource "aws_iam_role" "dynamodb_access_role" {
  name                 = "${var.role_name_prefix}-dynamodb-access"
  description          = "Rol de acceso a DynamoDB para la tabla de órdenes"
  assume_role_policy   = data.aws_iam_policy_document.assume_role.json
  max_session_duration = var.max_session_duration

  permissions_boundary = var.permissions_boundary_arn

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-dynamodb-access"
      Environment = var.environment
      Purpose     = "dynamodb-access"
      Module      = "iam"
    }
  )

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "dynamodb_access_attach" {
  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_role_policy_attachment" "dynamodb_readonly_attach" {
  count = var.enable_readonly_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_readonly[0].arn
}

resource "aws_iam_role_policy_attachment" "dynamodb_writeonly_attach" {
  count = var.enable_writeonly_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.dynamodb_writeonly[0].arn
}

resource "aws_iam_instance_profile" "dynamodb_access" {
  count = var.create_instance_profile ? 1 : 0

  name = "${var.role_name_prefix}-dynamodb-access"
  role = aws_iam_role.dynamodb_access_role.name

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-dynamodb-access"
      Environment = var.environment
      Module      = "iam"
    }
  )
}

resource "aws_iam_user" "dynamodb_operator" {
  count = var.create_iam_user ? 1 : 0

  name = "${var.user_name_prefix}-dynamodb-operator"
  path = "/operators/"

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.user_name_prefix}-dynamodb-operator"
      Environment = var.environment
      Purpose     = "dynamodb-operator"
      Module      = "iam"
    }
  )
}

resource "aws_iam_user_policy_attachment" "dynamodb_operator_attach" {
  count = var.create_iam_user ? 1 : 0

  user       = aws_iam_user.dynamodb_operator[0].name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_access_key" "dynamodb_operator" {
  count = var.create_iam_user && var.create_access_key ? 1 : 0

  user = aws_iam_user.dynamodb_operator[0].name

  pgp_key = var.pgp_key

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.user_name_prefix}-dynamodb-operator"
      Environment = var.environment
      Module      = "iam"
    }
  )
}

resource "aws_iam_policy" "deny_delete_table" {
  name        = "${var.policy_name_prefix}-deny-delete-table"
  description = "Política para denegar la eliminación de la tabla DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DenyDeleteTable"
        Effect   = "Deny"
        Action   = "dynamodb:DeleteTable"
        Resource = var.dynamodb_table_arn
      },
      {
        Sid      = "DenyDeleteTableIndex"
        Effect   = "Deny"
        Action   = "dynamodb:DeleteTable"
        Resource = "${var.dynamodb_table_arn}/index/*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-deny-delete-table"
      Environment = var.environment
      Purpose     = "prevent-accidental-deletion"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "deny_delete_attach" {
  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.deny_delete_table.arn
}

resource "aws_iam_role" "cross_account_access_role" {
  count = var.create_cross_account_role ? 1 : 0

  name                 = "${var.role_name_prefix}-cross-account-dynamodb"
  description          = "Rol de acceso entre cuentas a DynamoDB"
  max_session_duration = var.max_session_duration

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          AWS = var.cross_account_principal_arn
        }
        Condition = {
          StringEquals = {
            "sts:ExternalId" = var.external_id
          }
        }
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.role_name_prefix}-cross-account-dynamodb"
      Environment = var.environment
      Purpose     = "cross-account-access"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "cross_account_dynamodb_attach" {
  count = var.create_cross_account_role ? 1 : 0

  role       = aws_iam_role.cross_account_access_role[0].name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_iam_policy" "tagging_policy" {
  count = var.enable_tagging_policy ? 1 : 0

  name        = "${var.policy_name_prefix}-tagging"
  description = "Política para permitir únicamente operaciones de etiquetado en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowTagOperations"
        Effect = "Allow"
        Action = [
          "dynamodb:TagResource",
          "dynamodb:UntagResource",
          "dynamodb:ListTagsOfResource"
        ]
        Resource = var.dynamodb_table_arn
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.policy_name_prefix}-tagging"
      Environment = var.environment
      Purpose     = "tagging-access"
      Module      = "iam"
    }
  )
}

resource "aws_iam_role_policy_attachment" "tagging_policy_attach" {
  count = var.enable_tagging_policy ? 1 : 0

  role       = aws_iam_role.dynamodb_access_role.name
  policy_arn = aws_iam_policy.tagging_policy[0].arn
}