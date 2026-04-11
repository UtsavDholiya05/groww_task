import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

/**
 * Modern Button Component
 * Variants: 'primary' | 'secondary' | 'ghost' | 'outline'
 * Sizes: 'sm' | 'md' | 'lg'
 */
export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  style = {},
  textStyle = {},
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.textTertiary : COLORS.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondaryLight,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: COLORS.background,
          borderWidth: 1.5,
          borderColor: disabled ? COLORS.border : COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
        };
      case 'md':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          borderRadius: BORDER_RADIUS.lg,
        };
      default:
        return {};
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return TYPOGRAPHY.sizes.sm;
      case 'md':
        return TYPOGRAPHY.sizes.base;
      case 'lg':
        return TYPOGRAPHY.sizes.lg;
      default:
        return TYPOGRAPHY.sizes.base;
    }
  };

  const getTextColor = () => {
    if (variant === 'primary') return COLORS.textInverse;
    if (variant === 'secondary') return COLORS.primary;
    if (variant === 'outline') return disabled ? COLORS.textTertiary : COLORS.primary;
    return COLORS.primary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        variant === 'primary' && !disabled && SHADOWS.sm,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            styles.text,
            {
              fontSize: getTextSize(),
              color: getTextColor(),
            },
            textStyle,
          ]}
        >
          {isLoading ? '...' : label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});
