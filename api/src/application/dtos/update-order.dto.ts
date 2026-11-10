import { IsString, IsOptional, IsNumber, IsEnum, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'ID del cliente que realiza la orden', example: 'cust_12345' })
  @IsOptional()
  @IsString()
  readonly customerId?: string;

  @ApiPropertyOptional({ description: 'Fecha de la orden', example: '2024-01-15T10:30:00Z' })
  @IsOptional()
  @IsDateString()
  readonly orderDate?: string;

  @ApiPropertyOptional({ description: 'Monto total de la orden', example: 150.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly total?: number;

  @ApiPropertyOptional({ description: 'Estado de la orden', enum: ['pending', 'completed', 'cancelled'], example: 'pending' })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  readonly status?: 'pending' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Notas adicionales de la orden', example: 'Entregar en puerta principal' })
  @IsOptional()
  @IsString()
  readonly notes?: string;

  constructor(partial: Partial<UpdateOrderDto>) {
    Object.assign(this, partial);
  }

  validate(): void {
    if (!this.customerId && !this.orderDate && !this.total && !this.status && !this.notes) {
      throw new Error('Debe proporcionar al menos un campo para actualizar');
    }
    
    if (this.total !== undefined && this.total < 0) {
      throw new Error('El total no puede ser negativo');
    }
  }
}