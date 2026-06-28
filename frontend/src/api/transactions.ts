import client from './client';

export const getTransactions = async (params?: any) => {
  const response = await client.get('/transactions', { params });
  return response.data;
};

export const createTransaction = async (data: any) => {
  const response = await client.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id: string, data: any) => {
  const response = await client.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await client.delete(`/transactions/${id}`);
  return response.data;
};
