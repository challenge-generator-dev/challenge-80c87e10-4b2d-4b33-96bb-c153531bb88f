import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const OrderListPage = lazy(() => import('@/features/orders/pages/OrderListPage'));
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'));
const CreateOrderPage = lazy(() => import('@/features/orders/pages/CreateOrderPage'));
const UpdateOrderPage = lazy(() => import('@/features/orders/pages/UpdateOrderPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}> 
        <Routes>
          <Route path="/" element={<OrderListPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/edit" element={<UpdateOrderPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;