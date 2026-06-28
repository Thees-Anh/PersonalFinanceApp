import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getBudgetStatus } from '../../api/analytics';
import { createBudget, updateBudget, deleteBudget } from '../../api/budgets';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../utils/i18n';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import Button from '../../components/ui/Button';

const EXPENSE_CATEGORIES = [
  { id: '605c72ef2f8a4b0015b6d1a1', name: 'Food', icon: 'restaurant-outline', color: '#F59E0B' },
  { id: '605c72ef2f8a4b0015b6d1a2', name: 'Transport', icon: 'car-outline', color: '#3B82F6' },
  { id: '605c72ef2f8a4b0015b6d1a4', name: 'Entertainment', icon: 'film-outline', color: '#8B5CF6' },
  { id: '605c72ef2f8a4b0015b6d1a5', name: 'Shopping', icon: 'cart-outline', color: '#EC4899' },
  { id: '605c72ef2f8a4b0015b6d1a7', name: 'Health', icon: 'medical-outline', color: '#10B981' },
];

export default function BudgetScreen() {
  const { colors } = useTheme();
  const { t, tCategory } = useTranslation();
  const { currency } = useSettingsStore();
  
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgetStatus();
      setBudgets(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error.response?.data?.message || 'Failed to fetch budget status',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBudgets();
    }, [])
  );

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setSelectedCategoryId(null);
    setAmountStr('');
    setModalVisible(true);
  };

  const openEditModal = (budget: any) => {
    setIsEditing(true);
    setEditingId(budget.budgetId);
    setSelectedCategoryId(budget.category._id);
    setAmountStr(budget.limitAmount.toString());
    setModalVisible(true);
  };

  const handleSaveBudget = async () => {
    const amount = parseFloat(amountStr);
    if (!selectedCategoryId) {
      Toast.show({ type: 'error', text1: t('error'), text2: t('select_category') });
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Toast.show({ type: 'error', text1: t('error'), text2: t('please_enter_amount') });
      return;
    }

    try {
      setSaving(true);
      if (isEditing && editingId) {
        await updateBudget(editingId, amount);
        Toast.show({ type: 'success', text1: t('success'), text2: t('budget_updated') });
      } else {
        const now = new Date();
        await createBudget({
          categoryId: selectedCategoryId,
          limitAmount: amount,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
        Toast.show({ type: 'success', text1: t('success'), text2: t('budget_added') });
      }
      setModalVisible(false);
      fetchBudgets();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error.response?.data?.message || 'Failed to save budget',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = (id: string) => {
    Alert.alert(
      t('delete_budget'),
      t('delete_budget_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteBudget(id);
              Toast.show({ type: 'success', text1: t('success'), text2: 'Budget deleted' });
              fetchBudgets();
            } catch (error) {
              Toast.show({ type: 'error', text1: t('error'), text2: 'Failed to delete' });
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLongPress = (item: any) => {
    Alert.alert(
      t('edit_budget'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => handleDeleteBudget(item.budgetId) },
        { text: t('edit_budget'), onPress: () => openEditModal(item) }
      ]
    );
  };

  const renderBudget = ({ item }: any) => {
    const { category, limitAmount, spentAmount, percentageUsed } = item;
    const isOverWarning = percentageUsed >= 80;
    const isOverLimit = percentageUsed >= 100;

    const progressWidth = `${Math.min(percentageUsed, 100)}%`;
    const progressColor = isOverWarning ? colors.expense : colors.primary;

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryInfo}>
            <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
              <Ionicons name={category?.icon || 'wallet-outline'} size={24} color={category?.color || colors.text} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{tCategory(category?.name) || 'Unknown'}</Text>
          </View>
          <Text style={[styles.percentage, { color: progressColor }]}>
            {percentageUsed.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.amountsRow}>
          <Text style={{ color: colors.textSecondary }}>{t('spent')}: {formatCurrency(spentAmount, currency)}</Text>
          <Text style={{ color: colors.textSecondary }}>{t('budget_limit')}: {formatCurrency(limitAmount, currency)}</Text>
        </View>

        <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: progressWidth, backgroundColor: progressColor }
            ]} 
          />
        </View>
        
        {isOverLimit && (
          <Text style={[styles.warningText, { color: colors.expense }]}>
            {t('exceeded_budget')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('monthly_budgets')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.budgetId}
          renderItem={renderBudget}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('no_budgets')}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {isEditing ? t('edit_budget') : t('add_budget')}
                  </Text>

                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('select_category')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <TouchableOpacity 
                        key={cat.id} 
                        style={[
                          styles.categoryItem, 
                          { borderColor: selectedCategoryId === cat.id ? cat.color : colors.border, backgroundColor: colors.background }
                        ]}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        disabled={isEditing} // Prevent changing category when editing
                      >
                        <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                        <Text style={[styles.categoryNameSmall, { color: colors.text }]}>{tCategory(cat.name)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>{t('limit_amount')}</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.textSecondary}
                    value={amountStr}
                    onChangeText={setAmountStr}
                  />

                  <View style={styles.modalActions}>
                    <Button 
                      title={t('cancel')} 
                      onPress={() => setModalVisible(false)} 
                      variant="outline" 
                      style={{ flex: 1, marginRight: 10 }}
                    />
                    <Button 
                      title={saving ? t('saving') : t('save')} 
                      onPress={handleSaveBudget} 
                      loading={saving}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  warningText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  categoryItem: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryNameSmall: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 30,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40, // padding for bottom safe area
  },
});
