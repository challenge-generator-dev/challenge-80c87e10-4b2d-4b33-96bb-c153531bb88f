import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { UpdateOrderDto } from '../../application/dtos/update-order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Orden creada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de orden inválidos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    try {
      this.logger.log(`Creando orden para cliente: ${createOrderDto.customerId}`);
      createOrderDto.validate();
      const order = await this.orderService.createOrder(createOrderDto);
      this.logger.log(`Orden creada exitosamente con ID: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al crear orden: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la orden');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden encontrada',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async getOrder(@Param('id') id: string): Promise<OrderEntity> {
    try {
      this.logger.log(`Buscando orden con ID: ${id}`);
      const order = await this.orderService.getOrder(id);
      
      if (!order) {
        this.logger.warn(`Orden no encontrada: ${id}`);
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      return order;
    } catch (error) {
      this.logger.error(`Error al obtener orden: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la orden');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una orden existente' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orden actualizada exitosamente',
    type: OrderEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de orden inválidos',
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    try {
      this.logger.log(`Actualizando orden con ID: ${id}`);
      
      const existingOrder = await this.orderService.getOrder(id);
      if (!existingOrder) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      updateOrderDto.validate();
      const order = await this.orderService.updateOrder(id, updateOrderDto);
      this.logger.log(`Orden actualizada exitosamente: ${id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error al actualizar orden: ${error.message}`);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la orden');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Orden eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    try {
      this.logger.log(`Eliminando orden con ID: ${id}`);
      
      const existingOrder = await this.orderService.getOrder(id);
      if (!existingOrder) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      await this.orderService.deleteOrder(id);
      this.logger.log(`Orden eliminada exitosamente: ${id}`);
    } catch (error) {
      this.logger.error(`Error al eliminar orden: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la orden');
    }
  }
}