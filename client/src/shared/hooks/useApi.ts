import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiReturn<T, D = unknown> extends UseApiState<T> {
  execute: (config?: AxiosRequestConfig<D>) => Promise<T | null>;
  reset: () => void;
}

export interface UseApiConfig<D = unknown> extends AxiosRequestConfig<D> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
}

export interface UpdateOrderPayload {
  status?: string;
  customerName?: string;
  customerEmail?: string;
  items?: OrderItem[];
  total?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderEntity {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function parseError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message,
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  return {
    message: 'Error desconocido',
  };
}

export function useApi<T = unknown, D = unknown>(
  url: string,
  config?: UseApiConfig<D>
): UseApiReturn<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(config?.immediate ?? false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig<D>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const mergedConfig: AxiosRequestConfig<D> = {
          ...config,
          ...overrideConfig,
          baseURL: API_BASE_URL,
          url,
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
            ...overrideConfig?.headers,
          },
        };

        const response: AxiosResponse<T> = await axios.request<T>(mergedConfig);
        setData(response.data);
        config?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);
        config?.onError?.(parsedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, config]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (config?.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export function useCreateOrder<T = unknown>() {
  return useApi<T, CreateOrderPayload>('/orders', { method: 'POST' });
}

export function useGetOrder<T = unknown>(orderId: string) {
  return useApi<T>(`/orders/${orderId}`, { method: 'GET' });
}

export function useUpdateOrder<T = unknown>(orderId: string) {
  return useApi<T, UpdateOrderPayload>(`/orders/${orderId}`, { method: 'PUT' });
}

export function useDeleteOrder<T = unknown>(orderId: string) {
  return useApi<T>(`/orders/${orderId}`, { method: 'DELETE' });
}

interface UseListApiState<T> extends UseApiState<T[]> {
  execute: (config?: AxiosRequestConfig) => Promise<T[] | null>;
}

export function useListOrders<T = OrderEntity>(): UseListApiState<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (): Promise<T[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T[]> = await axios.get<T[]>(
        `${API_BASE_URL}/orders`
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
}

interface UseMutationOptions<T, D> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useMutation<T, D = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<T, D>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (payload?: D): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<T> = await axios.request<T>({
          baseURL: API_BASE_URL,
          url,
          method,
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);
        options?.onError?.(parsedError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, options]
  );

  return {
    data,
    loading,
    error,
    mutate,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
}