import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './MainNavigator';
import GoalsScreen from '../screens/main/GoalsScreen';
import GoalDetailScreen from '../screens/main/GoalDetailScreen';
import SubsScreen from '../screens/main/SubsScreen';
import DebtsScreen from '../screens/main/DebtsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="GoalsScreen" component={GoalsScreen} />
      <Stack.Screen name="GoalDetailScreen" component={GoalDetailScreen} />
      <Stack.Screen name="SubsScreen" component={SubsScreen} />
      <Stack.Screen name="DebtsScreen" component={DebtsScreen} />
    </Stack.Navigator>
  );
}
