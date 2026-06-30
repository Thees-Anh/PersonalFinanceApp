import api from './client';

export interface Subscription {
  _id?: string;
  id?: string;
  name: string;
  amount: number;
  cycle: string;
  nextPaymentDate: string;
  color?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getSubscriptions = async () => {
  const response = await api.get('/subs');
  return response.data;
};

export const createSubscription = async (subData: Partial<Subscription>) => {
  const response = await api.post('/subs', subData);
  return response.data;
};

export const updateSubscription = async (id: string, subData: Partial<Subscription>) => {
  const response = await api.put(`/subs/${id}`, subData);
  return response.data;
};

export const deleteSubscription = async (id: string) => {
  const response = await api.delete(`/subs/${id}`);
  return response.data;
};
