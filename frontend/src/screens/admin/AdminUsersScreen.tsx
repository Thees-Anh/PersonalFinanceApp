import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { getAllUsers, toggleUserBan } from '../../api/admin';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function AdminUsersScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchUsers = async (query = '') => {
    try {
      const data = await getAllUsers(query);
      setUsers(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải danh sách người dùng' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers(searchQuery);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(searchQuery);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      setLoading(true);
      fetchUsers(text);
    }, 500);
    setSearchTimeout(timeout);
  };

  const handleToggleBan = (userId: string, currentStatus: boolean, email: string) => {
    Alert.alert(
      currentStatus ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
      `Bạn có chắc chắn muốn ${currentStatus ? 'mở khóa' : 'khóa'} tài khoản ${email}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: currentStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              const res = await toggleUserBan(userId);
              Toast.show({ type: 'success', text1: 'Thành công', text2: res.message });
              fetchUsers(searchQuery);
            } catch (error: any) {
              Toast.show({ type: 'error', text1: 'Lỗi', text2: error.response?.data?.message || 'Có lỗi xảy ra' });
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isAdmin = item.roles && item.roles.includes('ROLE_ADMIN');
    return (
      <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: item.banned ? 0.7 : 1 }]}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={54} color={isAdmin ? '#ef4444' : (item.banned ? '#9ca3af' : colors.primary)} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.userEmail, { color: colors.text }]}>{item.email}</Text>
          <Text style={[styles.userDate, { color: colors.text }]}>Đăng ký: {formatDate(item.createdAt)}</Text>
          
          <View style={styles.roleBadgeContainer}>
            {item.roles && item.roles.map((role: string, index: number) => (
              <View key={index} style={[styles.roleBadge, { backgroundColor: role === 'ROLE_ADMIN' ? '#fee2e2' : '#dbeafe' }]}>
                <Text style={[styles.roleText, { color: role === 'ROLE_ADMIN' ? '#ef4444' : '#3b82f6' }]}>
                  {role.replace('ROLE_', '')}
                </Text>
              </View>
            ))}
            {item.banned && (
              <View style={[styles.roleBadge, { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#ef4444' }]}>
                <Text style={[styles.roleText, { color: '#ef4444' }]}>BANNED</Text>
              </View>
            )}
          </View>
        </View>
        
        {!isAdmin && (
          <TouchableOpacity 
            style={[styles.banButton, { backgroundColor: item.banned ? '#ef4444' : '#10b981' }]}
            onPress={() => handleToggleBan(item.id, item.banned, item.email)}
          >
            <Ionicons name={item.banned ? "lock-closed" : "lock-open"} size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Quản lý Người dùng</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>Tổng số: {users.length}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.text} style={{ opacity: 0.5, marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Tìm kiếm theo email..."
            placeholderTextColor={colors.text + '80'}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.text} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.text, opacity: 0.6 }}>Không tìm thấy người dùng nào.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, opacity: 0.7, marginBottom: 4 },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 16 },
  listContent: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  userCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarContainer: { marginRight: 15 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  userEmail: { fontSize: 14, opacity: 0.7, marginBottom: 2 },
  userDate: { fontSize: 12, opacity: 0.5, marginBottom: 8 },
  roleBadgeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { fontSize: 12, fontWeight: 'bold' },
  banButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
