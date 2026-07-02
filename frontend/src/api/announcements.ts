import client from './client';

export const getAdminAnnouncements = async () => {
  const response = await client.get('/admin/announcements');
  return response.data;
};

export const createAnnouncement = async (title: string, content: string) => {
  const response = await client.post('/admin/announcements', { title, content });
  return response.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await client.delete(`/admin/announcements/${id}`);
  return response.data;
};

export const getUserAnnouncements = async () => {
  const response = await client.get('/announcements');
  return response.data;
};
