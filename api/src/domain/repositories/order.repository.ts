import { OrderEntity } from '../entities/order.entity';

/**
 * Interfaz del repositorio de órdenes que define los métodos CRUD.
 * La implementación concreta reside en la capa de infraestructura.
 */
export interface OrderRepository {
  /**
   * Crea una nueva orden en el almacén de datos.
   * @param order La orden a crear.
   * @returns La orden creada con su ID generado.
   */
  create(order: OrderEntity): Promise<OrderEntity>;

  /**
   * Busca una orden por su ID.
   * @param id El ID de la orden.
   * @returns La orden si existe, o null si no se encuentra.
   */
  findById(id: string): Promise<OrderEntity | null>;

  /**
   * Actualiza una orden existente.
   * @param id El ID de la orden a actualizar.
   * @param order Los datos actualizados de la orden.
   * @returns La orden actualizada.
   */
  update(id: string, order: OrderEntity): Promise<OrderEntity>;

  /**
   * Elimina una orden por su ID.
   * @param id El ID de la orden a eliminar.
   */
  delete(id: string): Promise<void>;
}