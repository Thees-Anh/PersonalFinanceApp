import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getDebts, createDebt, updateDebt, deleteDebt, Debt } from '../../api/debts';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../utils/i18n';

export default function DebtsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t } = useTranslation();

  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('BORROWED'); // 'LENT' or 'BORROWED'
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState('BORROWED');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [interestRate, setInterestRate] = useState('');
  
  const fetchDebts = async () => {
    try {
      const data = await getDebts();
      setDebts(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch debts' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDebts();
    }, [])
  );

  const filteredDebts = debts.filter(d => d.type === activeTab);

  const openCreateModal = () => {
    setEditingId(null);
    setType(activeTab);
    setName('');
    setAmount('');
    setDate(new Date());
    setDueDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    setInterestRate('');
    setModalVisible(true);
  };

  const openEditModal = (item: Debt) => {
    setEditingId(item.id || item._id || null);
    setType(item.type);
    setName(item.name);
    setAmount(item.amount.toString());
    setDate(new Date(item.date));
    setDueDate(item.dueDate ? new Date(item.dueDate) : new Date());
    setInterestRate(item.interestRate ? item.interestRate.toString() : '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !amount) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill name and amount' });
      return;
    }

    const payload: Partial<Debt> = {
      name,
      type,
      amount: parseFloat(amount),
      date: date.toISOString(),
      dueDate: dueDate.toISOString(),
      interestRate: interestRate ? parseFloat(interestRate) : 0,
      isPaid: false, // Default to false when creating new
    };

    try {
      if (editingId) {
        // If editing, preserve isPaid status by fetching it from the list
        const existing = debts.find(d => d.id === editingId || d._id === editingId);
        if (existing) {
          payload.isPaid = existing.isPaid;
        }
        await updateDebt(editingId, payload);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Debt updated' });
      } else {
        await createDebt(payload);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Debt created' });
      }
      setModalVisible(false);
      fetchDebts();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save debt' });
    }
  };

  const togglePaidStatus = async (item: Debt) => {
    const itemId = item.id || item._id;
    if (!itemId) return;
    
    try {
      await updateDebt(itemId, { isPaid: !item.isPaid });
      fetchDebts();
      Toast.show({ type: 'success', text1: 'Success', text2: item.isPaid ? 'Marked as Unpaid' : 'Marked as Paid' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update status' });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Debt', 'Are you sure you want to delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDebt(id);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Record deleted' });
            fetchDebts();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete record' });
          }
        }
      }
    ]);
  };

  const renderDebt = ({ item }: { item: Debt }) => {
    const itemId = item.id || item._id;
    const isOverdue = !item.isPaid && item.dueDate && new Date(item.dueDate) < new Date();

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: item.isPaid ? '#10B981' : colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.personRow}>
            <View style={[styles.avatar, { backgroundColor: item.type === 'BORROWED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="person" size={18} color={item.type === 'BORROWED' ? '#EF4444' : '#10B981'} />
            </View>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: item.type === 'BORROWED' ? '#EF4444' : '#10B981' }]}>
              {formatCurrency(item.amount, currency)}
            </Text>
            {item.interestRate ? (
              <Text style={[styles.interest, { color: colors.textSecondary }]}>+{item.interestRate}% Interest</Text>
            ) : null}
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.dueContainer}>
            <Text style={[styles.dueText, { color: isOverdue ? '#EF4444' : colors.textSecondary, fontWeight: isOverdue ? 'bold' : 'normal' }]}>
              {t('due') || 'Due'}: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'} {isOverdue && `(${t('overdue') || 'Overdue'})`}
            </Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.statusBtn, { backgroundColor: item.isPaid ? '#10B981' : colors.border }]}
              onPress={() => togglePaidStatus(item)}
            >
              <Text style={{ color: item.isPaid ? '#fff' : colors.text, fontSize: 12, fontWeight: 'bold' }}>
                {item.isPaid ? (t('paid') || 'PAID') : (t('unpaid') || 'UNPAID')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
              <Ionicons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => itemId && handleDelete(itemId)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('debts') || 'Debts'}</Text>
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'BORROWED' && { borderBottomColor: '#EF4444' }]}
          onPress={() => setActiveTab('BORROWED')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'BORROWED' ? '#EF4444' : colors.textSecondary }]}>{t('i_borrowed') || 'I Borrowed'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'LENT' && { borderBottomColor: '#10B981' }]}
          onPress={() => setActiveTab('LENT')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'LENT' ? '#10B981' : colors.textSecondary }]}>{t('i_lent') || 'I Lent'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        renderItem={renderDebt}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>{t('no_debts') || 'No records found.'}</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', maxHeight: '90%' }}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {editingId ? (t('edit_record') || 'Edit Record') : (t('new_record') || 'New Record')}
                  </Text>
                  
                  <View style={styles.typeContainer}>
                    <TouchableOpacity 
                      style={[styles.typeBtn, { borderColor: colors.border }, type === 'BORROWED' && { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
                      onPress={() => setType('BORROWED')}
                    >
                      <Text style={{ color: type === 'BORROWED' ? '#fff' : colors.text }}>{t('i_borrowed') || 'I Borrowed'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.typeBtn, { borderColor: colors.border }, type === 'LENT' && { backgroundColor: '#10B981', borderColor: '#10B981' }]}
                      onPress={() => setType('LENT')}
                    >
                      <Text style={{ color: type === 'LENT' ? '#fff' : colors.text }}>{t('i_lent') || 'I Lent'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder={t('person_name') || 'Person Name'}
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                  
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder={t('amount') || 'Amount'}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />

                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder={t('interest_rate') || 'Interest Rate % (Optional)'}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={interestRate}
                    onChangeText={setInterestRate}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('date_borrowed_lent') || 'Date Borrowed/Lent'}</Text>
                  <TouchableOpacity 
                    style={[styles.input, { borderColor: colors.border, justifyContent: 'center' }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: colors.text }}>{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date} mode="date" display="default"
                      onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
                    />
                  )}

                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('due_date') || 'Due Date'}</Text>
                  <TouchableOpacity 
                    style={[styles.input, { borderColor: colors.border, justifyContent: 'center' }]}
                    onPress={() => setShowDueDatePicker(true)}
                  >
                    <Text style={{ color: colors.text }}>{dueDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDueDatePicker && (
                    <DateTimePicker
                      value={dueDate} mode="date" display="default"
                      onChange={(e, d) => { setShowDueDatePicker(Platform.OS === 'ios'); if (d) setDueDate(d); }}
                    />
                  )}

                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                      <Text style={{ color: colors.textSecondary }}>{t('cancel') || 'Cancel'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                      <Text style={{ color: '#fff' }}>{t('save') || 'Save'}</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  addButton: { padding: 5 },
  
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: { fontSize: 16, fontWeight: 'bold' },
  
  listContainer: { padding: 20 },
  
  card: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  date: { fontSize: 12 },
  
  amountContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  interest: { fontSize: 11, marginTop: 2 },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  dueContainer: { flex: 1 },
  dueText: { fontSize: 13 },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  iconBtn: { marginLeft: 12 },
  
  emptyContainer: { padding: 40, alignItems: 'center' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  cancelBtn: { padding: 12, marginRight: 10 },
  saveBtn: { padding: 12, borderRadius: 8, paddingHorizontal: 24 },
});
