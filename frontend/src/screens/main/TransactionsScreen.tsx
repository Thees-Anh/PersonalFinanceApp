import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getTransactions, deleteTransaction } from '../../api/transactions';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import { useTranslation } from '../../utils/i18n';
import Toast from 'react-native-toast-message';

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t, tCategory } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions({ limit: 50 });
      setTransactions(res.transactions || []);
    } catch (error) {
      console.log('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

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
              fetchTransactions();
            } catch (error) {
              Toast.show({ type: 'error', text1: t('error'), text2: t('failed_delete') });
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const isIncome = item.type === 'income';
    return (
      <TouchableOpacity 
        style={[styles.transactionItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        onLongPress={() => handleDelete(item._id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: (item.categoryId?.color || colors.textSecondary) + '20' }]}>
          <Ionicons 
            name={item.categoryId?.icon || 'cash-outline'} 
            size={24} 
            color={item.categoryId?.color || colors.textSecondary} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionName, { color: colors.text }]}>
            {item.note || tCategory(item.categoryId?.name) || 'Transaction'}
          </Text>
          <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('tab_transactions')}</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : transactions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>{t('no_transactions_found')}</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
