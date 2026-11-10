import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/services/order.service';
import { OrderEntity } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dtos/create-order.dto';
import { UpdateOrderDto } from '../src/application/dtos/update-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const mockOrderEntity = new OrderEntity(
    'order-123',
    'customer-456',
    new Date('2024-01-15T10:00:00Z'),
    new Date('2024-01-15T10:00:00Z'),
    151.00,
  );
  mockOrderEntity.items = [
    { productId: 'prod-1', quantity: 2, price: 25.50 },
    { productId: 'prod-2', quantity: 1, price: 100.00 },
  ];

  const mockCreateOrderDto: CreateOrderDto = {
    customerId: 'customer-456',
    items: [
      { productId: 'prod-1', quantity: 2, price: 25.50 },
      { productId: 'prod-2', quantity: 1, price: 100.00 },
    ],
  };

  const mockUpdateOrderDto: UpdateOrderDto = {
    status: 'completed',
  };

  beforeEach(async () => {
    const mockService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  describe('createOrder', () => {
    it('debería crear una nueva orden y retornar 201', async () => {
      service.createOrder.mockResolvedValue(mockOrderEntity);

      const result = await controller.createOrder(mockCreateOrderDto);

      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar excepción cuando el DTO es inválido', async () => {
      const invalidDto = { customerId: '', items: [] };
      service.createOrder.mockRejectedValue(new BadRequestException('Validation failed'));

      await expect(controller.createOrder(invalidDto as any)).rejects.toThrow(BadRequestException);
    });

    it('debería manejar errores del servicio correctamente', async () => {
      service.createOrder.mockRejectedValue(new Error('Internal error'));

      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow();
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por ID y retornar 200', async () => {
      service.getOrder.mockResolvedValue(mockOrderEntity);

      const result = await controller.getOrder('order-123');

      expect(service.getOrder).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar NotFoundException cuando la orden no existe', async () => {
      service.getOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.getOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('debería validar que el ID no esté vacío', async () => {
      service.getOrder.mockRejectedValue(new BadRequestException('ID is required'));

      await expect(controller.getOrder('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden y retornar 200', async () => {
      const updatedOrder = new OrderEntity(
        'order-123',
        'customer-456',
        new Date('2024-01-15T10:00:00Z'),
        new Date('2024-01-15T10:00:00Z'),
        151.00,
      );
      updatedOrder.items = [
        { productId: 'prod-1', quantity: 2, price: 25.50 },
        { productId: 'prod-2', quantity: 1, price: 100.00 },
      ];
      updatedOrder.updateStatus('completed');
      service.updateOrder.mockResolvedValue(updatedOrder);

      const result = await controller.updateOrder('order-123', mockUpdateOrderDto);

      expect(service.updateOrder).toHaveBeenCalledWith('order-123', mockUpdateOrderDto);
      expect(result.status).toBe('completed');
    });

    it('debería lanzar NotFoundException al actualizar orden inexistente', async () => {
      service.updateOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(
        controller.updateOrder('non-existent', mockUpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería validar el formato del ID', async () => {
      service.updateOrder.mockRejectedValue(new BadRequestException('Invalid ID format'));

      await expect(
        controller.updateOrder('invalid-id-format', mockUpdateOrderDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      service.deleteOrder.mockResolvedValue();

      await controller.deleteOrder('order-123');

      expect(service.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar NotFoundException al eliminar orden inexistente', async () => {
      service.deleteOrder.mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.deleteOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('debería manejar errores de validación del ID', async () => {
      service.deleteOrder.mockRejectedValue(new BadRequestException('Invalid ID'));

      await expect(controller.deleteOrder('')).rejects.toThrow(BadRequestException);
    });
  });
});