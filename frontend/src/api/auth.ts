import client from './client';

export const login = async (credentials: any) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await client.post('/auth/register', userData);
  return response.data;
};

export const updateProfile = async (data: { name: string }) => {
  const response = await client.put('/auth/profile', data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await client.put('/auth/password', data);
  return response.data;
};
