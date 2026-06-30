import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { useSettingsStore } from './src/store/useSettingsStore';

export default function App() {
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
