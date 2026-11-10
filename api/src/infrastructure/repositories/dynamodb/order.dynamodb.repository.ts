import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { OrderEntity } from '../../../domain/entities/order.entity';
import { DynamodbConfig } from '../../config/dynamodb.config';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export interface OrderDynamoItem {
  id: string;
  customerId: string;
  orderDate: string;
  createdAt: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

@Injectable()
export class OrderDynamodbRepository implements OrderRepository {
  private readonly logger = new Logger(OrderDynamodbRepository.name);

  constructor(private readonly dynamodbConfig: DynamodbConfig) {}

  async create(order: OrderEntity): Promise<OrderEntity> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const item: OrderDynamoItem = {
      id: order.id,
      customerId: order.customerId,
      orderDate: order.orderDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      total: order.total,
      status: 'pending',
      items: order.items,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    try {
      await documentClient.send(command);
      this.logger.log(`Orden creada exitosamente: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al crear orden: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    try {
      const result = await documentClient.send(command);
      
      if (!result.Item) {
        this.logger.warn(`Orden no encontrada: ${id}`);
        return null;
      }

      const item = result.Item as OrderDynamoItem;
      return this.mapToEntity(item);
    } catch (error) {
      this.logger.error(`Error al buscar orden: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, order: OrderEntity): Promise<OrderEntity> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const updateExpression = 'SET customerId = :customerId, orderDate = :orderDate, total = :total, #status = :status, items = :items';
    const expressionAttributeNames: Record<string, string> = {
      '#status': 'status',
    };
    const expressionAttributeValues: Record<string, unknown> = {
      ':customerId': order.customerId,
      ':orderDate': order.orderDate.toISOString(),
      ':total': order.total,
      ':status': 'pending',
      ':items': order.items,
    };

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    try {
      const result = await documentClient.send(command);
      this.logger.log(`Orden actualizada exitosamente: ${id}`);
      
      const item = result.Attributes as OrderDynamoItem;
      return this.mapToEntity(item);
    } catch (error) {
      this.logger.error(`Error al actualizar orden: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const tableName = this.dynamodbConfig.getTableName();
    const documentClient = this.dynamodbConfig.getDocumentClient();

    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    });

    try {
      await documentClient.send(command);
      this.logger.log(`Orden eliminada exitosamente: ${id}`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden: ${error.message}`);
      throw error;
    }
  }

  private mapToEntity(item: OrderDynamoItem): OrderEntity {
    const entity = new OrderEntity(
      item.id,
      item.customerId,
      new Date(item.orderDate),
      new Date(item.createdAt),
      item.total,
    );
    
    if (item.items) {
      entity.items = item.items;
    }
    
    if (item.status && item.status !== 'pending') {
      entity.updateStatus(item.status);
    }
    
    return entity;
  }
}