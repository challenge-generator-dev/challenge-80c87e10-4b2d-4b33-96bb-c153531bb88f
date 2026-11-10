import axios, { AxiosResponse } from 'axios';
import {
  OrderEntity,
  CreateOrderPayload,
  UpdateOrderPayload,
} from '../../../shared/hooks/useApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateOrderDto extends CreateOrderPayload {}

export interface UpdateOrderDto extends UpdateOrderPayload {}

export interface OrderResponse extends OrderEntity {}

export const orderService = {
  async createOrder(data: CreateOrderDto): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.post<OrderEntity>(
      '/orders',
      data
    );
    return response.data;
  },

  async getOrder(id: string): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.get<OrderEntity>(
      `/orders/${id}`
    );
    return response.data;
  },

  async updateOrder(id: string, data: UpdateOrderDto): Promise<OrderEntity> {
    const response: AxiosResponse<OrderEntity> = await apiClient.put<OrderEntity>(
      `/orders/${id}`,
      data
    );
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },

  async getAllOrders(): Promise<OrderEntity[]> {
    const response: AxiosResponse<OrderEntity[]> = await apiClient.get<OrderEntity[]>(
      '/orders'
    );
    return response.data;
  },
};

export const createOrder = orderService.createOrder;
export const getOrder = orderService.getOrder;
export const updateOrder = orderService.updateOrder;
export const deleteOrder = orderService.deleteOrder;
export const getAllOrders = orderService.getAllOrders;

export type { OrderEntity, CreateOrderPayload, UpdateOrderPayload };