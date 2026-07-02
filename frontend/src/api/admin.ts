import client from './client';

export const getSystemStats = async () => {
  const response = await client.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async (search?: string) => {
  const params = search ? { search } : undefined;
  const response = await client.get('/admin/users', { params });
  return response.data;
};

export const toggleUserBan = async (userId: string) => {
  const response = await client.put(`/admin/users/${userId}/ban`);
  return response.data;
};
