import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrder } from '../services/order.service';
import type { OrderEntity } from '../services/order.service';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID de orden no proporcionado');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar la orden';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleBack = () => {
    navigate('/orders');
  };

  const handleEdit = () => {
    if (order) {
      navigate(`/orders/${order.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      const { deleteOrder } = await import('../services/order.service');
      await deleteOrder(order.id);
      navigate('/orders');
    } catch (err) {
      console.error('Error al eliminar la orden:', err);
      alert('No se pudo eliminar la orden. Intenta de nuevo.');
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-page__loading">
          <div className="spinner" aria-label="Cargando detalles de la orden"></div>
          <p>Cargando detalles de la orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-page__error">
          <h2>Error al cargar la orden</h2>
          <p>{error || 'Orden no encontrada'}</p>
          <button onClick={handleBack} className="btn btn--primary">
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <header className="order-detail-page__header">
        <button 
          onClick={handleBack} 
          className="btn btn--ghost order-detail-page__back-btn"
          aria-label="Volver a la lista de órdenes"
        >
          ← Volver
        </button>
        <div className="order-detail-page__actions">
          <button 
            onClick={handleEdit} 
            className="btn btn--secondary"
            aria-label="Editar orden"
          >
            Editar
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn--danger"
            aria-label="Eliminar orden"
          >
            Eliminar
          </button>
        </div>
      </header>

      <main className="order-detail-page__content">
        <section className="order-detail-page__info">
          <h1 className="order-detail-page__title">Orden #{order.id}</h1>
          
          <div className="order-detail-page__status">
            <span className={`badge badge--${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <dl className="order-detail-page__details">
            <div className="order-detail-page__detail-item">
              <dt>Cliente:</dt>
              <dd>{order.customerName}</dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Email:</dt>
              <dd>{order.customerEmail}</dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Total:</dt>
              <dd className="order-detail-page__total">
                {formatCurrency(order.total)}
              </dd>
            </div>
            
            <div className="order-detail-page__detail-item">
              <dt>Fecha de creación:</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            
            {order.updatedAt && (
              <div className="order-detail-page__detail-item">
                <dt>Última actualización:</dt>
                <dd>{formatDate(order.updatedAt)}</dd>
              </div>
            )}
          </dl>
        </section>

        {order.items && order.items.length > 0 && (
          <section className="order-detail-page__items">
            <h2 className="order-detail-page__section-title">Artículos</h2>
            <table className="order-detail-page__items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default OrderDetailPage;