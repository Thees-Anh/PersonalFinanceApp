import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({ title, loading, style, variant = 'primary', ...props }: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    if (variant === 'outline') {
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
    }
    if (variant === 'secondary') {
      return { backgroundColor: colors.border };
    }
    return { backgroundColor: colors.primary };
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: colors.primary };
    }
    if (variant === 'secondary') {
      return { color: colors.text };
    }
    return { color: '#fff' };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
