import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService, OrderEntity, UpdateOrderDto } from '../services/order.service';
import { OrderForm } from '../components/OrderForm';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

const updateOrderSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerEmail: z.string().email('Email inválido'),
  totalAmount: z.number().positive('El monto debe ser positivo'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'Debe tener al menos un producto'),
});

type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;

export function UpdateOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateOrderFormData>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      totalAmount: 0,
      status: 'pending',
      items: [],
    },
  });

  useEffect(() => {
    if (!id) {
      setError('ID de orden no proporcionado');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
        reset({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          totalAmount: data.totalAmount,
          status: data.status,
          items: data.items,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la orden');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, reset]);

  const onSubmit = async (data: UpdateOrderFormData) => {
    if (!id) return;

    try {
      const updateData: UpdateOrderDto = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        totalAmount: data.totalAmount,
        status: data.status,
        items: data.items,
      };

      await orderService.updateOrder(id, updateData);
      navigate(`/orders/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la orden');
    }
  };

  if (isLoading) {
    return (
      <div className="update-order-page">
        <div className="update-order-page__loading">
          <LoadingSpinner />
          <p>Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="update-order-page">
          <div className="update-order-page__error">
            <p className="update-order-page__error-message">{error}</p>
            <button 
              className="update-order-page__retry-button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!order) {
    return (
      <ErrorBoundary>
        <div className="update-order-page">
          <div className="update-order-page__not-found">
            <p>Orden no encontrada</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="update-order-page">
      <header className="update-order-page__header">
        <h1 className="update-order-page__title">Actualizar Orden</h1>
        <p className="update-order-page__subtitle">
          Modifica los detalles de la orden #{order.id}
        </p>
      </header>

      <section className="update-order-page__content">
        <OrderForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={false}
          submitLabel="Actualizar Orden"
          onCancel={() => navigate(`/orders/${id}`)}
        />
      </section>
    </div>
  );
}