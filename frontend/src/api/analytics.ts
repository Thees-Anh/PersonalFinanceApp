import client from './client';

export const getMonthlySummary = async (month?: number, year?: number) => {
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const response = await client.get('/analytics/summary', { params });
  return response.data;
};

export const getBudgetStatus = async (month?: number, year?: number) => {
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const response = await client.get('/analytics/budgets', { params });
  return response.data;
};

export const getWeeklyTrends = async () => {
  const response = await client.get('/analytics/weekly-trends');
  return response.data;
};
