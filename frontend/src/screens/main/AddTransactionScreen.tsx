import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createTransaction } from '../../api/transactions';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from 'react-native-toast-message';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import { useTranslation } from '../../utils/i18n';

const DUMMY_CATEGORIES = [
  { id: '605c72ef2f8a4b0015b6d1a1', name: 'Food', icon: 'restaurant-outline', color: '#F59E0B', type: 'expense' },
  { id: '605c72ef2f8a4b0015b6d1a2', name: 'Transport', icon: 'car-outline', color: '#3B82F6', type: 'expense' },
  { id: '605c72ef2f8a4b0015b6d1a4', name: 'Entertainment', icon: 'film-outline', color: '#8B5CF6', type: 'expense' },
  { id: '605c72ef2f8a4b0015b6d1a5', name: 'Shopping', icon: 'cart-outline', color: '#EC4899', type: 'expense' },
  { id: '605c72ef2f8a4b0015b6d1a7', name: 'Health', icon: 'medical-outline', color: '#10B981', type: 'expense' },
  { id: '605c72ef2f8a4b0015b6d1a3', name: 'Salary', icon: 'cash-outline', color: '#10B981', type: 'income' },
  { id: '605c72ef2f8a4b0015b6d1a6', name: 'Investment', icon: 'trending-up-outline', color: '#14B8A6', type: 'income' },
];

export default function AddTransactionScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t, tCategory } = useTranslation();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('0');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCategories = DUMMY_CATEGORIES.filter((c) => c.type === type);

  const handleNumpadPress = (val: string) => {
    if (val === 'DEL') {
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '.') {
      if (amountStr.includes('.')) return;
      setAmountStr((prev) => prev + '.');
      return;
    }
    setAmountStr((prev) => {
      if (prev === '0') return val;
      if (prev.includes('.')) {
        const [, decimal] = prev.split('.');
        if (decimal?.length >= 2) return prev;
      }
      return prev + val;
    });
  };

  const handleSave = async () => {
    const amount = parseFloat(amountStr);
    if (amount <= 0 || isNaN(amount)) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('please_enter_amount'),
      });
      return;
    }
    if (!categoryId) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('please_select_category'),
      });
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        amount,
        categoryId,
        date: date.toISOString(),
        note,
        type,
      });
      setAmountStr('0');
      setNote('');
      setCategoryId(null);
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('transaction_added'),
      });
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error.response?.data?.message || 'Failed to save transaction',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.toggleContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.toggleButton, type === 'expense' && { backgroundColor: colors.expense }]}
            onPress={() => { setType('expense'); setCategoryId(null); }}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.activeToggleText, { color: colors.text }]}>{t('expense')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, type === 'income' && { backgroundColor: colors.income }]}
            onPress={() => { setType('income'); setCategoryId(null); }}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.activeToggleText, { color: colors.text }]}>{t('income')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.amountDisplay, { color: type === 'income' ? colors.income : colors.expense }]}>
          {formatCurrency(parseFloat(amountStr) || 0, currency)}
        </Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('category')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.categoryItem, 
                { borderColor: categoryId === cat.id ? cat.color : colors.border, backgroundColor: colors.card }
              ]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              <Text style={[styles.categoryName, { color: colors.text }]}>{tCategory(cat.name)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputSection}>
          <TouchableOpacity 
            style={[styles.datePickerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <Input 
            placeholder={t('note')}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.numpadContainer}>
          {[['1','2','3'], ['4','5','6'], ['7','8','9'], ['.','0','DEL']].map((row, i) => (
            <View key={i} style={styles.numpadRow}>
              {row.map((key) => (
                <TouchableOpacity 
                  key={key} 
                  style={[styles.numpadKey, { backgroundColor: colors.card }]}
                  onPress={() => handleNumpadPress(key)}
                >
                  {key === 'DEL' ? (
                    <Ionicons name="backspace-outline" size={24} color={colors.text} />
                  ) : (
                    <Text style={[styles.numpadText, { color: colors.text }]}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <Button 
          title={loading ? t('saving') : t('save')}
          onPress={handleSave} 
          loading={loading}
          style={{ marginHorizontal: 20, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 40, // for mobile status bar roughly
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    width: '80%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 16,
  },
  activeToggleText: {
    color: '#fff',
  },
  amountDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryName: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  numpadContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numpadKey: {
    width: '30%',
    aspectRatio: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numpadText: {
    fontSize: 24,
    fontWeight: '500',
  },
});
