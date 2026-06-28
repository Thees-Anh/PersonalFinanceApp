import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your local IP address for physical devices, or 10.0.2.2 for Android Emulators
const API_URL = 'http://192.168.2.235:5000/api';

const client = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the JWT token to every request
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from SecureStore', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
