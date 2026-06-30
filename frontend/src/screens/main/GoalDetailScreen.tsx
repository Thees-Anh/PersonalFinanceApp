import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { getGoal, addGoalFund, deleteGoal, Goal } from '../../api/goals';
import { useSettingsStore, formatCurrency } from '../../store/useSettingsStore';
import Toast from 'react-native-toast-message';

export default function GoalDetailScreen({ route, navigation }: any) {
  const { goalId } = route.params;
  const { colors } = useTheme();
  const { currency } = useSettingsStore();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundModalVisible, setFundModalVisible] = useState(false);

  // Fund Form State
  const [fundAmount, setFundAmount] = useState('');
  const [fundNote, setFundNote] = useState('');
  const [fundDate, setFundDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchGoalDetail = async () => {
    try {
      const data = await getGoal(goalId);
      setGoal(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch goal details' });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoalDetail();
    }, [goalId])
  );

  const handleAddFund = async () => {
    if (!fundAmount) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter amount' });
      return;
    }

    try {
      await addGoalFund(goalId, {
        amount: parseFloat(fundAmount),
        note: fundNote || 'Added funds',
        date: fundDate.toISOString(),
      });
      
      Toast.show({ type: 'success', text1: 'Success', text2: 'Funds added successfully' });
      setFundModalVisible(false);
      setFundAmount('');
      setFundNote('');
      setFundDate(new Date());
      fetchGoalDetail();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to add funds' });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              Toast.show({ type: 'success', text1: 'Success', text2: 'Goal deleted' });
              navigation.goBack();
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete goal' });
            }
          }
        }
      ]
    );
  };

  if (loading || !goal) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0;
  const isCompleted = goal.isCompleted || percent >= 100;
  const cardBg = isCompleted ? 'rgba(16, 185, 129, 0.1)' : colors.card;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Goal Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isCompleted && (
          <View style={[styles.congratsBanner, { backgroundColor: '#10B981' }]}>
            <Ionicons name="trophy" size={24} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.congratsText}>Congratulations! Goal completed!</Text>
          </View>
        )}

        <View style={[styles.mainCard, { backgroundColor: cardBg, borderColor: isCompleted ? '#10B981' : colors.border }]}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.iconContainer, { backgroundColor: goal.color || colors.primary }]}>
              <Ionicons name={(goal.icon as any) || 'flag'} size={32} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
              {goal.description ? (
                <Text style={[styles.goalDesc, { color: colors.textSecondary }]}>{goal.description}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.textSecondary }]}>Progress</Text>
              <Text style={[styles.percentText, { color: isCompleted ? '#10B981' : colors.primary }]}>{percent}%</Text>
            </View>
            
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${percent}%`, backgroundColor: isCompleted ? '#10B981' : (goal.color || colors.primary) }
                ]} 
              />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{formatCurrency(goal.currentAmount, currency)}</Text>
              </View>
              <View style={[styles.statBox, { alignItems: 'center' }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Target</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{formatCurrency(goal.targetAmount, currency)}</Text>
              </View>
              <View style={[styles.statBox, { alignItems: 'flex-end' }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Remaining</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{isCompleted ? '0' : formatCurrency(remaining, currency)}</Text>
              </View>
            </View>
          </View>

          {goal.targetDate && (
            <View style={[styles.dateSection, { borderTopColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                Target Date: {new Date(goal.targetDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.addFundBtn, { backgroundColor: colors.primary, opacity: isCompleted ? 0.5 : 1 }]}
          onPress={() => setFundModalVisible(true)}
          disabled={isCompleted}
        >
          <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addFundBtnText}>Add Funds</Text>
        </TouchableOpacity>

        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>Funding History</Text>
          {(!goal.funds || goal.funds.length === 0) && (
            <Text style={{ color: colors.textSecondary, marginTop: 10 }}>No funds added yet.</Text>
          )}
          {goal.funds?.slice().reverse().map((fund, index) => (
            <View key={index} style={[styles.fundRow, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.fundNote, { color: colors.text }]}>{fund.note}</Text>
                <Text style={[styles.fundDate, { color: colors.textSecondary }]}>
                  {new Date(fund.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.fundAmount, { color: colors.income }]}>
                +{formatCurrency(fund.amount, currency)}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <Modal visible={fundModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', maxHeight: '80%' }}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Funds to Goal</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={fundAmount}
              onChangeText={setFundAmount}
            />
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Note (e.g. Salary, Bonus)"
              placeholderTextColor={colors.textSecondary}
              value={fundNote}
              onChangeText={setFundNote}
            />

            <TouchableOpacity 
              style={[styles.input, { borderColor: colors.border, justifyContent: 'center' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: colors.text }}>
                Date: {fundDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={fundDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFundDate(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setFundModalVisible(false)}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleAddFund}>
                <Text style={{ color: '#fff' }}>Add</Text>
              </TouchableOpacity>
              </View>
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
  deleteButton: { padding: 5 },
  
  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
  },
  congratsText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  mainCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  goalDesc: { fontSize: 14 },
  
  progressSection: { marginBottom: 20 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: { fontSize: 14 },
  percentText: { fontSize: 16, fontWeight: 'bold' },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: { flex: 1 },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: 'bold' },
  
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  dateText: { marginLeft: 8, fontSize: 14 },
  
  addFundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
  },
  addFundBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  historySection: {
    padding: 20,
    marginTop: 10,
  },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  fundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  fundNote: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  fundDate: { fontSize: 12 },
  fundAmount: { fontSize: 16, fontWeight: 'bold' },
  
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtn: { padding: 12, marginRight: 10 },
  saveBtn: { padding: 12, borderRadius: 8, paddingHorizontal: 24 },
});
