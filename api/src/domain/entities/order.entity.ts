import { v4 as uuidv4 } from 'uuid';

/**
 * Entidad de dominio que representa una orden de compra con sus atributos.
 * Incluye validaciones de invariantes para asegurar consistencia.
 */
export class OrderEntity {
  readonly id: string;
  readonly customerId: string;
  readonly products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  readonly orderDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    products: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
    id?: string,
    status?: 'pending' | 'completed' | 'cancelled',
    orderDate?: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required');
    }
    if (!products || products.length === 0) {
      throw new Error('At least one product is required');
    }
    products.forEach(product => {
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

    this.id = id || uuidv4();
    this.customerId = customerId;
    this.products = products;
    this.orderDate = orderDate || new Date();
    this.status = status || 'pending';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Calcula el total de la orden sumando el precio de todos los productos.
   */
  get total(): number {
    return this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  /**
   * Actualiza el estado de la orden y registra la fecha de actualización.
   */
  updateStatus(status: 'pending' | 'completed' | 'cancelled'): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Valida que la orden cumpla con las invariantes del dominio.
   */
  validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Order ID is required');
    }
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
    if (!['pending', 'completed', 'cancelled'].includes(this.status)) {
      throw new Error('Invalid order status');
    }
  }
}