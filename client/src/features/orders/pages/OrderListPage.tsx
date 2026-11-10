import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderList } from '../components/OrderList';
import type { OrderEntity } from '../services/order.service';

export function OrderListPage() {
  const navigate = useNavigate();
  const { orders, isLoading, error, refetch } = useOrders();

  const handleViewDetails = (order: OrderEntity) => {
    navigate(`/orders/${order.id}`);
  };

  const handleEdit = (order: OrderEntity) => {
    navigate(`/orders/${order.id}/edit`);
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
    if (!confirmed) return;
    
    try {
      const { deleteOrder } = await import('../services/order.service');
      await deleteOrder(orderId);
      refetch();
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
      alert('No se pudo eliminar la orden. Intenta de nuevo.');
    }
  };

  const handleCreateNew = () => {
    navigate('/orders/new');
  };

  if (isLoading) {
    return (
      <div className="order-list-page">
        <div className="order-list-page__loading">
          <div className="spinner" aria-label="Cargando órdenes"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-list-page">
        <div className="order-list-page__error">
          <h2>Error al cargar las órdenes</h2>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn--primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list-page">
      <header className="order-list-page__header">
        <h1 className="order-list-page__title">Gestión de Órdenes</h1>
        <button 
          onClick={handleCreateNew} 
          className="btn btn--primary order-list-page__create-btn"
          aria-label="Crear nueva orden"
        >
          + Nueva Orden
        </button>
      </header>

      <section className="order-list-page__content">
        <OrderList
          orders={orders || []}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {orders && orders.length === 0 && (
        <div className="order-list-page__empty">
          <p>No hay órdenes registradas.</p>
          <button 
            onClick={handleCreateNew} 
            className="btn btn--secondary"
          >
            Crear primera orden
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderListPage;