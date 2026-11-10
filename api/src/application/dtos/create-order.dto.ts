import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para validar los datos de entrada al crear una orden.
 * Utiliza decoradores de class-validator para validación automática.
 */
class ProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsNumber()
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity: number;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  /**
   * Valida que el DTO cumpla con las reglas de negocio.
   * @throws Error si alguna validación falla.
   */
  validate(): void {
    if (!this.customerId || this.customerId.trim() === '') {
      throw new Error('Customer ID is required');
    }
    if (!this.products || this.products.length === 0) {
      throw new Error('At least one product is required');
    }
    this.products.forEach(product => {
      if (!product.productId || product.productId.trim() === '') {
        throw new Error('Product ID is required');
      }
      if (product.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (product.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
    });
  }
}