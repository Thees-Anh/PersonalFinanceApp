import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { updateProfile, changePassword } from '../../api/auth';
import { useTranslation } from '../../utils/i18n';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuthStore();
  const { currency, toggleCurrency, language, toggleLanguage, notifications, toggleNotifications } = useSettingsStore();
  const { t } = useTranslation();

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  
  const [newName, setNewName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('log_out'),
      t('log_out_confirm'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('log_out'), 
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const handleMockPress = (featureName: string) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: `The ${featureName} feature will be available in the next update!`,
    });
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    try {
      setLoading(true);
      const res = await updateProfile({ name: newName });
      await updateUser(res.user);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated' });
      setEditProfileVisible(false);
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return;
    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Password updated successfully' });
      setChangePasswordVisible(false);
      setOldPassword('');
      setNewPassword('');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = (icon: any, title: string, color: string, onPress: () => void, isDestructive = false) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.menuText, { color: isDestructive ? colors.expense : colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>{t('profile_title')}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userInfoContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('account')}</Text>
          <View style={[styles.card, { borderColor: colors.border }]}>
            {renderMenuItem('person-outline', t('edit_profile'), colors.primary, () => setEditProfileVisible(true))}
            {renderMenuItem('lock-closed-outline', t('change_password'), colors.primary, () => setChangePasswordVisible(true))}
            {renderMenuItem(notifications ? 'notifications' : 'notifications-off-outline', t('notifications'), colors.primary, toggleNotifications)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('preferences')}</Text>
          <View style={[styles.card, { borderColor: colors.border }]}>
            {renderMenuItem(
              theme === 'dark' ? 'moon-outline' : 'sunny-outline', 
              `${t('theme')}: ${theme === 'dark' ? t('dark') : t('light')}`, 
              '#F59E0B', 
              toggleTheme
            )}
            {renderMenuItem('cash-outline', `${t('currency')} (${currency})`, '#10B981', toggleCurrency)}
            {renderMenuItem('language-outline', `${t('language')} (${language.toUpperCase()})`, '#3B82F6', toggleLanguage)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('support')}</Text>
          <View style={[styles.card, { borderColor: colors.border }]}>
            {renderMenuItem('help-circle-outline', t('help_center'), '#8B5CF6', () => handleMockPress(t('help_center')))}
            {renderMenuItem('document-text-outline', t('terms'), '#8B5CF6', () => handleMockPress(t('terms')))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.expense }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.expense} style={{ marginRight: 8 }} />
          <Text style={[styles.logoutText, { color: colors.expense }]}>{t('log_out')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('edit_profile_title')}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={newName}
              onChangeText={setNewName}
              placeholder={t('name')}
              placeholderTextColor={colors.textSecondary}
            />
            <Button title={loading ? t('saving') : t('save')} onPress={handleUpdateProfile} loading={loading} style={{ marginBottom: 10 }} />
            <Button title={t('close')} onPress={() => setEditProfileVisible(false)} variant="secondary" />
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={changePasswordVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('change_password_title')}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder={t('old_password')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('new_password')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <Button title={loading ? t('saving') : t('save')} onPress={handleChangePassword} loading={loading} style={{ marginBottom: 10 }} />
            <Button title={t('close')} onPress={() => setChangePasswordVisible(false)} variant="secondary" />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 10 },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
