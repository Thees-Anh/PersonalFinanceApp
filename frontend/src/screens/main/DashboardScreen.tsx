import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { getMonthlySummary } from '../../api/analytics';
import { getTransactions, deleteTransaction } from '../../api/transactions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import { useTranslation } from '../../utils/i18n';

export default function DashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t, tCategory } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      // Get current month summary
      const now = new Date();
      const summaryData = await getMonthlySummary(now.getMonth() + 1, now.getFullYear());
      setSummary({ 
        totalIncome: summaryData.totalIncome || 0, 
        totalExpense: summaryData.totalExpense || 0 
      });

      // Get recent transactions (e.g., limit to 5)
      const txData = await getTransactions({ page: 1, limit: 5 });
      setTransactions(txData.transactions || []);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch dashboard data',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const balance = summary.totalIncome - summary.totalExpense;

  const renderSkeleton = () => (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.cardSkeleton, { backgroundColor: colors.card }]} />
      <View style={[styles.itemSkeleton, { backgroundColor: colors.card }]} />
      <View style={[styles.itemSkeleton, { backgroundColor: colors.card }]} />
      <View style={[styles.itemSkeleton, { backgroundColor: colors.card }]} />
    </SafeAreaView>
  );

  if (loading && !refreshing) {
    return renderSkeleton();
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      t('delete_transaction'),
      t('delete_confirm'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('delete'), 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteTransaction(id);
              Toast.show({ type: 'success', text1: t('success'), text2: t('transaction_deleted') });
              fetchData();
            } catch (error) {
              Toast.show({ type: 'error', text1: t('error'), text2: t('failed_delete') });
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderTransaction = ({ item }: any) => {
    const isIncome = item.type === 'income';
    return (
      <TouchableOpacity 
        style={[styles.transactionItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        onLongPress={() => handleDelete(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Ionicons 
              name={item.categoryId?.icon || 'cash-outline'} 
              size={24} 
              color={item.categoryId?.color || colors.textSecondary} 
            />
          </View>
          <View>
            <Text style={[styles.transactionNote, { color: colors.text }]}>
              {item.note || tCategory(item.categoryId?.name) || 'Transaction'}
            </Text>
            <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={transactions}
        keyExtractor={(item: any) => item._id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={[colors.primary, '#2563EB']}
              style={styles.balanceCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceTitle}>{t('total_balance')}</Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {showBalance ? formatCurrency(balance, currency) : '••••••'}
              </Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <View style={styles.statRow}>
                    <Ionicons name="arrow-down-circle" size={20} color="#10B981" />
                    <Text style={styles.statLabel}>{t('income')}</Text>
                  </View>
                  <Text style={styles.statValue}>{formatCurrency(summary.totalIncome, currency)}</Text>
                </View>
                <View style={styles.statBox}>
                  <View style={styles.statRow}>
                    <Ionicons name="arrow-up-circle" size={20} color="#EF4444" />
                    <Text style={styles.statLabel}>{t('expense')}</Text>
                  </View>
                  <Text style={styles.statValue}>{formatCurrency(summary.totalExpense, currency)}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('GoalsScreen' as never)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Ionicons name="flag" size={24} color="#10B981" />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>{t('goals') || 'Goals'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('SubsScreen' as never)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Ionicons name="card" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>{t('subs') || 'Subs'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('DebtsScreen' as never)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Ionicons name="people" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>{t('debts') || 'Debts'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recent_transactions')}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>{t('no_recent')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 6,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionNote: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  // Skeleton styles
  cardSkeleton: {
    margin: 20,
    height: 200,
    borderRadius: 24,
    opacity: 0.5,
  },
  itemSkeleton: {
    marginHorizontal: 20,
    marginBottom: 12,
    height: 80,
    borderRadius: 16,
    opacity: 0.5,
  },
});
