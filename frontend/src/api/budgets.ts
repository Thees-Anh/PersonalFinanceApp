import api from './client';

export interface BudgetPayload {
  categoryId: string;
  limitAmount: number;
  month: number;
  year: number;
}

export const createBudget = async (data: BudgetPayload) => {
  const response = await api.post('/budgets', data);
  return response.data;
};

export const updateBudget = async (id: string, limitAmount: number) => {
  const response = await api.put(`/budgets/${id}`, { limitAmount });
  return response.data;
};

export const deleteBudget = async (id: string) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};
