import { useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/OrderForm';
import { createOrder } from '../services/order.service';
import type { CreateOrderDto } from '../services/order.service';

export function CreateOrderPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateOrderDto) => {
    try {
      const newOrder = await createOrder(data);
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Error al crear la orden:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.');
    if (confirmed) {
      navigate('/orders');
    }
  };

  return (
    <div className="create-order-page">
      <header className="create-order-page__header">
        <button 
          onClick={handleCancel} 
          className="btn btn--ghost create-order-page__back-btn"
          aria-label="Volver a la lista de órdenes"
        >
          ← Volver
        </button>
        <h1 className="create-order-page__title">Crear Nueva Orden</h1>
      </header>

      <main className="create-order-page__content">
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
        />
      </main>
    </div>
  );
}

export default CreateOrderPage;