import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

export const themeColors = {
  light: {
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    primary: '#3B82F6',
    income: '#10B981', // Green for income
    expense: '#EF4444', // Red for expense
    border: '#E2E8F0',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#3B82F6',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    primary: '#3B82F6',
    income: '#10B981', // Green for income
    expense: '#EF4444', // Red for expense
    border: '#334155',
    tabIconDefault: '#64748B',
    tabIconSelected: '#3B82F6',
  }
};

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof themeColors.light;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: themeColors.light,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme || 'light');

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentColors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
