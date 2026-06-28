import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface SettingsState {
  currency: 'USD' | 'VND';
  language: 'en' | 'vi';
  notifications: boolean;
  toggleCurrency: () => void;
  toggleLanguage: () => void;
  toggleNotifications: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  currency: 'USD',
  language: 'en',
  notifications: true,
  
  toggleCurrency: async () => {
    const newCurrency = get().currency === 'USD' ? 'VND' : 'USD';
    await SecureStore.setItemAsync('currency', newCurrency);
    set({ currency: newCurrency });
  },

  toggleLanguage: async () => {
    const newLang = get().language === 'en' ? 'vi' : 'en';
    await SecureStore.setItemAsync('language', newLang);
    set({ language: newLang });
  },

  toggleNotifications: async () => {
    const newNotif = !get().notifications;
    await SecureStore.setItemAsync('notifications', newNotif ? '1' : '0');
    set({ notifications: newNotif });
  },

  loadSettings: async () => {
    try {
      const storedCurrency = await SecureStore.getItemAsync('currency');
      if (storedCurrency === 'VND' || storedCurrency === 'USD') {
        set({ currency: storedCurrency });
      }

      const storedLang = await SecureStore.getItemAsync('language');
      if (storedLang === 'vi' || storedLang === 'en') {
        set({ language: storedLang });
      }

      const storedNotif = await SecureStore.getItemAsync('notifications');
      if (storedNotif) {
        set({ notifications: storedNotif === '1' });
      }
    } catch (e) {
      // ignore
    }
  }
}));

export const formatCurrency = (amount: number, currency: 'USD' | 'VND') => {
  if (currency === 'VND') {
    // VN format: 1.000.000 đ
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  } else {
    // US format: $1,000.00
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
};
