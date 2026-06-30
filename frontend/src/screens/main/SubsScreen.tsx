import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription, Subscription } from '../../api/subs';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../utils/i18n';

export default function SubsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t } = useTranslation();

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState('Monthly'); // 'Monthly' or 'Yearly'
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [color, setColor] = useState(colors.primary);
  const [icon, setIcon] = useState('card-outline');

  const fetchSubs = async () => {
    try {
      const data = await getSubscriptions();
      setSubs(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch subscriptions' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSubs();
    }, [])
  );

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setCycle('Monthly');
    setNextPaymentDate(new Date());
    setColor(colors.primary);
    setIcon('card-outline');
    setModalVisible(true);
  };

  const openEditModal = (item: Subscription) => {
    setEditingId(item.id || item._id || null);
    setName(item.name);
    setAmount(item.amount.toString());
    setCycle(item.cycle || 'Monthly');
    setNextPaymentDate(item.nextPaymentDate ? new Date(item.nextPaymentDate) : new Date());
    setColor(item.color || colors.primary);
    setIcon(item.icon || 'card-outline');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !amount) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill name and amount' });
      return;
    }

    const payload: Partial<Subscription> = {
      name,
      amount: parseFloat(amount),
      cycle,
      nextPaymentDate: nextPaymentDate.toISOString(),
      color,
      icon,
    };

    try {
      if (editingId) {
        await updateSubscription(editingId, payload);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Subscription updated' });
      } else {
        await createSubscription(payload);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Subscription created' });
      }
      setModalVisible(false);
      fetchSubs();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save subscription' });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Subscription', 'Are you sure you want to delete this subscription?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSubscription(id);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Subscription deleted' });
            fetchSubs();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete subscription' });
          }
        }
      }
    ]);
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return t('overdue') || 'Overdue';
    if (diffDays === 0) return t('today') || 'Today';
    if (diffDays === 1) return t('tomorrow') || 'Tomorrow';
    return `${diffDays} ${t('days_left') || 'days left'}`;
  };

  const renderSub = ({ item }: { item: Subscription }) => {
    const itemId = item.id || item._id;
    const daysRemaining = getDaysRemaining(item.nextPaymentDate);
    const isOverdue = daysRemaining === 'Overdue';
    const isSoon = daysRemaining === 'Today' || daysRemaining === 'Tomorrow' || (typeof daysRemaining === 'string' && daysRemaining.includes('days') && parseInt(daysRemaining) <= 3);

    return (
      <View style={[styles.subCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.iconContainer, { backgroundColor: item.color || colors.primary }]}>
              <Ionicons name={(item.icon as any) || 'card-outline'} size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.subName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.subCycle, { color: colors.textSecondary }]}>
                {item.cycle === 'Monthly' ? (t('monthly') || 'Monthly') : (t('yearly') || 'Yearly')}
              </Text>
            </View>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: colors.text }]}>
              {formatCurrency(item.amount, currency)}
            </Text>
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={isOverdue ? '#EF4444' : (isSoon ? '#F59E0B' : colors.textSecondary)} />
            <Text style={[
              styles.dateText, 
              { color: isOverdue ? '#EF4444' : (isSoon ? '#F59E0B' : colors.textSecondary), fontWeight: isSoon || isOverdue ? 'bold' : 'normal' }
            ]}>
              {daysRemaining} ({new Date(item.nextPaymentDate).toLocaleDateString()})
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}>
              <Ionicons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => itemId && handleDelete(itemId)} style={styles.actionBtn}>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('subscriptions') || 'Subscriptions'}</Text>
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={subs}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        renderItem={renderSub}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>{t('no_subs') || 'No subscriptions tracked yet.'}</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', maxHeight: '85%' }}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {editingId ? (t('edit_sub') || 'Edit Subscription') : (t('add_sub') || 'Add Subscription')}
                  </Text>
                  
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder={t('name') || "Name (e.g. Netflix, Spotify)"}
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                  />
                  
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder={t('amount') || "Amount"}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />

                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('cycle') || 'Cycle'}</Text>
                  <View style={styles.cycleContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.cycleBtn, 
                        { borderColor: colors.border },
                        cycle === 'Monthly' && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                      onPress={() => setCycle('Monthly')}
                    >
                      <Text style={{ color: cycle === 'Monthly' ? '#fff' : colors.text }}>{t('monthly') || 'Monthly'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.cycleBtn, 
                        { borderColor: colors.border },
                        cycle === 'Yearly' && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                      onPress={() => setCycle('Yearly')}
                    >
                      <Text style={{ color: cycle === 'Yearly' ? '#fff' : colors.text }}>{t('yearly') || 'Yearly'}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.label, { color: colors.textSecondary }]}>{t('next_payment_date') || 'Next Payment Date'}</Text>
                  <TouchableOpacity 
                    style={[styles.input, { borderColor: colors.border, justifyContent: 'center' }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: colors.text }}>
                      {nextPaymentDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={nextPaymentDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) {
                          setNextPaymentDate(selectedDate);
                        }
                      }}
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
  listContainer: { padding: 20 },
  
  subCard: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  iconTitleRow: {
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
  subName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  subCycle: { fontSize: 12 },
  
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: { fontSize: 16, fontWeight: 'bold' },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: { marginLeft: 6, fontSize: 13 },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: { marginLeft: 16 },
  
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
  cycleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cycleBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
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
