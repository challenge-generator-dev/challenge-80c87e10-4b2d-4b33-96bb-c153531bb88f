import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  register: UseFormRegister<OrderFormData>;
  errors: FieldErrors<OrderFormData>;
  isLoading?: boolean;
  initialData?: Partial<OrderFormData>;
  submitLabel?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  register,
  errors,
  isLoading = false,
  initialData,
  submitLabel = 'Crear Orden'
}) => {
  const inputBaseClasses = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2';
  const inputNormalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  const inputErrorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  const errorTextClasses = 'text-xs text-red-600 mt-1';
  const buttonBaseClasses = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const getInputClasses = (hasError: boolean) =>
    `${inputBaseClasses} ${hasError ? inputErrorClasses : inputNormalClasses}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: OrderFormData = {
          customerName: formData.get('customerName') as string,
          customerEmail: formData.get('customerEmail') as string,
          product: formData.get('product') as string,
          quantity: Number(formData.get('quantity')),
          price: Number(formData.get('price')),
          status: (formData.get('status') as OrderFormData['status']) || 'pending'
        };
        onSubmit(data);
      }}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customerName" className={labelClasses}>
            Nombre del Cliente
          </label>
          <input
            id="customerName"
            type="text"
            {...register('customerName', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
            defaultValue={initialData?.customerName}
            className={getInputClasses(!!errors.customerName)}
            placeholder="Juan Pérez"
          />
          {errors.customerName && (
            <p className={errorTextClasses}>{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className={labelClasses}>
            Correo Electrónico
          </label>
          <input
            id="customerEmail"
            type="email"
            {...register('customerEmail', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido'
              }
            })}
            defaultValue={initialData?.customerEmail}
            className={getInputClasses(!!errors.customerEmail)}
            placeholder="juan@ejemplo.com"
          />
          {errors.customerEmail && (
            <p className={errorTextClasses}>{errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="product" className={labelClasses}>
            Producto
          </label>
          <input
            id="product"
            type="text"
            {...register('product', {
              required: 'El producto es requerido',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' }
            })}
            defaultValue={initialData?.product}
            className={getInputClasses(!!errors.product)}
            placeholder="Laptop Pro X"
          />
          {errors.product && (
            <p className={errorTextClasses}>{errors.product.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className={labelClasses}>
            Cantidad
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            {...register('quantity', {
              required: 'La cantidad es requerida',
              min: { value: 1, message: 'Mínimo 1 unidad' },
              valueAsNumber: true
            })}
            defaultValue={initialData?.quantity || 1}
            className={getInputClasses(!!errors.quantity)}
          />
          {errors.quantity && (
            <p className={errorTextClasses}>{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className={labelClasses}>
            Precio Unitario ($)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            {...register('price', {
              required: 'El precio es requerido',
              min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
              valueAsNumber: true
            })}
            defaultValue={initialData?.price || 0}
            className={getInputClasses(!!errors.price)}
            placeholder="99.99"
          />
          {errors.price && (
            <p className={errorTextClasses}>{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className={labelClasses}>
            Estado
          </label>
          <select
            id="status"
            {...register('status', { required: 'El estado es requerido' })}
            defaultValue={initialData?.status || 'pending'}
            className={getInputClasses(!!errors.status)}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          {errors.status && (
            <p className={errorTextClasses}>{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className={`${buttonBaseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Procesando...
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
};