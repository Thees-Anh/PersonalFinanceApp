import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { getAdminAnnouncements, createAnnouncement, deleteAnnouncement } from '../../api/announcements';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function AdminAnnouncementsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const data = await getAdminAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải danh sách thông báo' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Vui lòng nhập đầy đủ tiêu đề và nội dung' });
      return;
    }
    try {
      await createAnnouncement(title, content);
      Toast.show({ type: 'success', text1: 'Thành công', text2: 'Đã tạo thông báo mới' });
      setModalVisible(false);
      setTitle('');
      setContent('');
      setLoading(true);
      fetchAnnouncements();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tạo thông báo' });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa thông báo', 'Bạn có chắc chắn muốn xóa thông báo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAnnouncement(id);
            Toast.show({ type: 'success', text1: 'Thành công', text2: 'Đã xóa thông báo' });
            fetchAnnouncements();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể xóa thông báo' });
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
        {new Date(item.createdAt).toLocaleString('vi-VN')}
      </Text>
      <Text style={[styles.cardContent, { color: colors.text }]} numberOfLines={3}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Quản lý Thông báo</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.text, opacity: 0.6 }}>Chưa có thông báo nào.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Tạo Thông báo Mới</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Tiêu đề..."
              placeholderTextColor={colors.text + '80'}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
              placeholder="Nội dung..."
              placeholderTextColor={colors.text + '80'}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.text }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleCreate}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng Thông báo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  listContent: { padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  card: { padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  cardDate: { fontSize: 12, opacity: 0.7, marginBottom: 10 },
  cardContent: { fontSize: 14, lineHeight: 20 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { width: '100%', padding: 20, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  textArea: { height: 120 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, justifyContent: 'center' }
});
