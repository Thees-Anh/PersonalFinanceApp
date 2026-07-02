import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/main/DashboardScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import AddTransactionScreen from '../screens/main/AddTransactionScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import BudgetScreen from '../screens/main/BudgetScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../utils/i18n';
import { useAuthStore } from '../store/useAuthStore';
import AdminNavigator from './AdminNavigator';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Transactions') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Budget') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Admin') iconName = focused ? 'shield' : 'shield-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: t('tab_home') }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: t('tab_transactions') }} />
      <Tab.Screen name="Add" component={AddTransactionScreen} options={{ tabBarLabel: t('tab_add') }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: t('tab_analytics') }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ tabBarLabel: t('tab_budget') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tab_profile') }} />
      {isAdmin && (
        <Tab.Screen name="Admin" component={AdminNavigator} options={{ tabBarLabel: 'Admin' }} />
      )}
    </Tab.Navigator>
  );
}
