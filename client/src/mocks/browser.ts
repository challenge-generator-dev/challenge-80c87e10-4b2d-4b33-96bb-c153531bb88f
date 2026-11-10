import { setupWorker } from 'msw/browser';
import { http, HttpResponse, delay } from 'msw';

interface MockOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const mockOrders: MockOrder[] = [
  {
    id: 'ord-001',
    customerName: 'Juan Pérez',
    customerEmail: 'juan.perez@example.com',
    items: [
      { productId: 'prod-001', productName: 'Laptop Pro', quantity: 1, unitPrice: 1299.99 },
      { productId: 'prod-002', productName: 'Mouse Inalámbrico', quantity: 2, unitPrice: 29.99 }
    ],
    totalAmount: 1359.97,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z'
  },
  {
    id: 'ord-002',
    customerName: 'María García',
    customerEmail: 'maria.garcia@example.com',
    items: [
      { productId: 'prod-003', productName: 'Monitor 27"', quantity: 1, unitPrice: 399.99 }
    ],
    totalAmount: 399.99,
    status: 'processing',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T11:20:00Z'
  },
  {
    id: 'ord-003',
    customerName: 'Carlos López',
    customerEmail: 'carlos.lopez@example.com',
    items: [
      { productId: 'prod-004', productName: 'Teclado Mecánico', quantity: 1, unitPrice: 149.99 },
      { productId: 'prod-005', productName: 'Alfombrilla XL', quantity: 1, unitPrice: 24.99 },
      { productId: 'prod-006', productName: 'Auriculares USB', quantity: 1, unitPrice: 79.99 }
    ],
    totalAmount: 254.97,
    status: 'pending',
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z'
  }
];

const generateId = () => `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const handlers = [
  http.get('http://localhost:3000/orders', async () => {
    await delay(300);
    return HttpResponse.json(mockOrders);
  }),

  http.get('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  http.post('http://localhost:3000/orders', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Omit<MockOrder, 'id' | 'createdAt' | 'updatedAt'>;
    const newOrder: MockOrder = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockOrders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.put('http://localhost:3000/orders/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Partial<MockOrder>;
    const index = mockOrders.findIndex(o => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockOrders[index] = {
      ...mockOrders[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(mockOrders[index]);
  }),

  http.delete('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const index = mockOrders.findIndex(o => o.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockOrders.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  })
];

export const worker = setupWorker(...handlers);