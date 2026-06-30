import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getGoals, createGoal, Goal } from '../../api/goals';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import Toast from 'react-native-toast-message';
import { useTranslation } from '../../utils/i18n';

export default function GoalsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { currency } = useSettingsStore();
  const { t } = useTranslation();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [color, setColor] = useState(colors.primary);
  const [icon, setIcon] = useState('flag');
  const [description, setDescription] = useState('');

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch goals' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  const handleSave = async () => {
    if (!name || !targetAmount || !targetDate) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill name and target amount' });
      return;
    }

    const payload: Partial<Goal> = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      targetDate: targetDate.toISOString(),
      color,
      icon,
      description,
    };

    try {
      await createGoal(payload);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Goal created' });
      setModalVisible(false);
      
      // Reset form
      setName('');
      setTargetAmount('');
      setTargetDate(new Date());
      setDescription('');
      
      fetchGoals();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save goal' });
    }
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    const percent = Math.min(100, Math.round((item.currentAmount / item.targetAmount) * 100)) || 0;
    const isCompleted = item.isCompleted || percent >= 100;
    const cardBg = isCompleted ? 'rgba(16, 185, 129, 0.1)' : colors.card;
    const cardBorder = isCompleted ? '#10B981' : colors.border;
    const remaining = Math.max(0, item.targetAmount - item.currentAmount);

    return (
      <TouchableOpacity 
        style={[styles.goalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
        onPress={() => navigation.navigate('GoalDetailScreen', { goalId: item.id || item._id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.iconContainer, { backgroundColor: item.color || colors.primary }]}>
              <Ionicons name={(item.icon as any) || 'flag'} size={20} color="#fff" />
            </View>
            <Text style={[styles.goalName, { color: colors.text }]}>{item.name}</Text>
          </View>
          <Text style={[styles.percentText, { color: isCompleted ? '#10B981' : colors.primary }]}>
            {percent}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${percent}%`, backgroundColor: isCompleted ? '#10B981' : (item.color || colors.primary) }
              ]} 
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('saved') || 'Saved'}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{formatCurrency(item.currentAmount, currency)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {isCompleted ? (t('completed') || 'Completed') : (t('remaining') || 'Remaining')}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {isCompleted ? (t('done') || 'Done!') : formatCurrency(remaining, currency)}
            </Text>
          </View>
        </View>
        
        {!isCompleted && item.targetDate && (
          <Text style={[styles.deadlineText, { color: colors.textSecondary }]}>
            {t('deadline') || 'Deadline'}: {new Date(item.targetDate).toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('saving_goals') || 'Saving Goals'}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        renderItem={renderGoal}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>{t('no_goals') || 'No goals yet. Create one!'}</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', maxHeight: '80%' }}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('create_goal') || 'Create New Goal'}</Text>
              
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('goal_name') || 'Goal Name (e.g. iPhone 16)'}
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
              
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('target_amount') || 'Target Amount'}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
              />

              <TouchableOpacity 
                style={[styles.input, { borderColor: colors.border, justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: colors.text }}>
                  {t('target_date') || 'Target Date'}: {targetDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={targetDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setTargetDate(selectedDate);
                    }
                  }}
                />
              )}
              
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('description_optional') || 'Description (Optional)'}
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
              />

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
  
  goalCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalName: { fontSize: 16, fontWeight: 'bold' },
  percentText: { fontSize: 18, fontWeight: 'bold' },
  
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: { fontSize: 12, marginBottom: 2 },
  value: { fontSize: 14, fontWeight: '600' },
  deadlineText: { fontSize: 12, marginTop: 4 },
  
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
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
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
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: { padding: 12, marginRight: 10 },
  saveBtn: { padding: 12, borderRadius: 8, paddingHorizontal: 24 },
});
