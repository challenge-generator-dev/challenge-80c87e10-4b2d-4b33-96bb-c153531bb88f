import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => OrderRepository))
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderEntity> {
    dto.validate();
    
    const orderId = this.generateId();
    const now = new Date();
    const orderDate = dto.orderDate ? new Date(dto.orderDate) : now;

    const order = new OrderEntity(
      orderId,
      dto.customerId,
      orderDate,
      now,
    );

    order.validate();
    return this.orderRepository.create(order);
  }

  async getOrder(id: string): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto): Promise<OrderEntity> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    dto.validate();

    const existingOrder = await this.orderRepository.findById(id);
    
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    const updatedOrder = new OrderEntity(
      id,
      dto.customerId || existingOrder.customerId,
      dto.orderDate ? new Date(dto.orderDate) : existingOrder.orderDate,
      existingOrder.createdAt,
    );

    if (dto.status) {
      updatedOrder.updateStatus(dto.status);
    }

    updatedOrder.validate();
    return this.orderRepository.update(id, updatedOrder);
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('El ID de la orden es requerido');
    }

    const existingOrder = await this.orderRepository.findById(id);
    
    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    if (existingOrder.status === 'completed') {
      throw new BadRequestException('No se puede eliminar una orden completada');
    }

    return this.orderRepository.delete(id);
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `ord_${timestamp}_${randomPart}`;
  }
}