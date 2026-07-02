import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { getSystemStats } from '../../api/admin';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function AdminDashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalGoals: 0 });

  const fetchStats = async () => {
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải dữ liệu thống kê' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const renderCard = (title: string, value: number | null, iconName: any, color: string, onPress?: () => void) => {
    const CardComponent = onPress ? TouchableOpacity : View;
    return (
      <CardComponent 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={iconName} size={28} color={color} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          {value !== null && <Text style={[styles.cardValue, { color: colors.primary }]}>{value}</Text>}
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
        )}
      </CardComponent>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tổng quan Hệ thống</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.statsContainer}>
          {renderCard('Tổng số Người dùng', stats.totalUsers, 'people', '#3b82f6', () => navigation.navigate('AdminUsers'))}
          {renderCard('Quản lý Thông báo', null, 'notifications', '#ec4899', () => navigation.navigate('AdminAnnouncements'))}
          {renderCard('Tổng số Giao dịch', stats.totalTransactions, 'swap-horizontal', '#10b981')}
          {renderCard('Tổng số Mục tiêu', stats.totalGoals, 'flag', '#f59e0b')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { padding: 15 },
  statsContainer: { gap: 15 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, marginBottom: 4, opacity: 0.8 },
  cardValue: { fontSize: 28, fontWeight: 'bold' },
});
