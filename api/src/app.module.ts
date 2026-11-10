import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { OrderRepository } from './domain/repositories/order.repository';
import { OrderDynamodbRepository } from './infrastructure/repositories/dynamodb/order.dynamodb.repository';
import { DynamodbConfig } from './infrastructure/config/dynamodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: (configService: ConfigService) => {
        const requiredVars = ['AWS_REGION', 'DYNAMODB_TABLE_ORDERS'];
        const missing = requiredVars.filter(v => !configService.get(v));
        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return true;
      },
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderRepository,
      useClass: OrderDynamodbRepository,
    },
    DynamodbConfig,
    {
      provide: APP_GUARD,
      useValue: [],
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: [],
    },
  ],
  exports: [OrderService, OrderRepository],
})
export class AppModule {}