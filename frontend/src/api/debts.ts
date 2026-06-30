import api from './client';

export interface Debt {
  _id?: string;
  id?: string;
  name: string;
  type: string; // 'LENT' or 'BORROWED'
  amount: number;
  date: string;
  dueDate?: string;
  interestRate?: number;
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getDebts = async () => {
  const response = await api.get('/debts');
  return response.data;
};

export const createDebt = async (debtData: Partial<Debt>) => {
  const response = await api.post('/debts', debtData);
  return response.data;
};

export const updateDebt = async (id: string, debtData: Partial<Debt>) => {
  const response = await api.put(`/debts/${id}`, debtData);
  return response.data;
};

export const deleteDebt = async (id: string) => {
  const response = await api.delete(`/debts/${id}`);
  return response.data;
};
