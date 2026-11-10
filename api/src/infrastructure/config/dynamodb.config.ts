import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamodbConfig {
  private readonly documentClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: NestConfigService) {
    const clientConfig = this.buildClientConfig();
    const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
    const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
    
    const client = new DynamoDBClient(clientConfig);
    this.documentClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    });
    
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'orders');
  }

  private buildClientConfig(): DynamoDBClientConfig {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const endpoint = this.configService.get<string>('DYNAMODB_ENDPOINT');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const config: DynamoDBClientConfig = {
      region,
    };

    if (endpoint) {
      config.endpoint = endpoint;
    }

    if (accessKeyId && secretAccessKey) {
      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    return config;
  }

  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }

  getTableName(): string {
    return this.tableName;
  }
}