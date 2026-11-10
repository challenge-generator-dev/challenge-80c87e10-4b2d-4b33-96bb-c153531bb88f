import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/services/order.service';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { OrderEntity } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dtos/create-order.dto';
import { UpdateOrderDto } from '../src/application/dtos/update-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<OrderRepository>;

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
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(OrderRepository);
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente cuando los datos son válidos', async () => {
      repository.create.mockResolvedValue(mockOrderEntity);

      const result = await service.createOrder(mockCreateOrderDto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: mockCreateOrderDto.customerId,
          items: mockCreateOrderDto.items,
        }),
      );
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar BadRequestException cuando el DTO es inválido', async () => {
      const invalidDto: CreateOrderDto = {
        customerId: '',
        items: [],
      };

      await expect(service.createOrder(invalidDto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el repositorio falla', async () => {
      repository.create.mockRejectedValue(new Error('DynamoDB connection failed'));

      await expect(service.createOrder(mockCreateOrderDto)).rejects.toThrow();
    });

    it('debería calcular el total correctamente al crear la orden', async () => {
      repository.create.mockImplementation(async (order: OrderEntity) => {
        return order;
      });

      const result = await service.createOrder(mockCreateOrderDto);

      expect(result.total).toBe(151.00);
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por su ID exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrderEntity);

      const result = await service.getOrder('order-123');

      expect(repository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderEntity);
    });

    it('debería lanzar NotFoundException cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getOrder('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException cuando el ID está vacío', async () => {
      await expect(service.getOrder('')).rejects.toThrow(BadRequestException);
      expect(repository.findById).not.toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
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

      repository.findById.mockResolvedValue(mockOrderEntity);
      repository.update.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder('order-123', mockUpdateOrderDto);

      expect(repository.update).toHaveBeenCalledWith('order-123', expect.any(OrderEntity));
      expect(result.status).toBe('completed');
    });

    it('debería lanzar NotFoundException al actualizar una orden inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateOrder('non-existent-id', mockUpdateOrderDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería validar el estado antes de actualizar', async () => {
      const invalidUpdateDto: UpdateOrderDto = {
        status: 'invalid-status' as any,
      };

      await expect(
        service.updateOrder('order-123', invalidUpdateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrderEntity);
      repository.delete.mockResolvedValue();

      await service.deleteOrder('order-123');

      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar NotFoundException al eliminar una orden inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteOrder('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException cuando el ID está vacío', async () => {
      await expect(service.deleteOrder('')).rejects.toThrow(BadRequestException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});