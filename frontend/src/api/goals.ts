import api from './client';

export interface GoalFund {
  amount: number;
  note: string;
  date: string;
}

export interface Goal {
  _id?: string;
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color?: string;
  icon?: string;
  description?: string;
  isCompleted?: boolean;
  funds?: GoalFund[];
  createdAt?: string;
  updatedAt?: string;
}

export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

export const getGoal = async (id: string) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

export const createGoal = async (goalData: Partial<Goal>) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

export const addGoalFund = async (id: string, fundData: GoalFund) => {
  const response = await api.post(`/goals/${id}/funds`, fundData);
  return response.data;
};

export const deleteGoal = async (id: string) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};
