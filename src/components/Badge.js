import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';

/**
 * Badge/Chip Component
 * Displays tags, labels, or status indicators
 */
export const Badge = ({
  label = '',
  variant = 'default',
  size = 'md',
  icon = null,
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderColor: COLORS.success,
        };
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: COLORS.error,
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: COLORS.warning,
        };
      case 'info':
        return {
          backgroundColor: COLORS.secondaryLight,
          borderColor: COLORS.secondary,
        };
      case 'primary':
        return {
          backgroundColor: COLORS.primaryLight,
          borderColor: COLORS.primary,
        };
      default:
        return {
          backgroundColor: '#E5E7EB',
          borderColor: COLORS.border,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
          borderRadius: BORDER_RADIUS.sm,
        };
      case 'lg':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
        };
      default:
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          borderRadius: BORDER_RADIUS.sm,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'warning':
        return COLORS.warning;
      case 'info':
        return COLORS.secondary;
      case 'primary':
        return COLORS.primary;
      default:
        return COLORS.text;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        getSizeStyles(),
        { borderWidth: 1 },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: size === 'sm' ? TYPOGRAPHY.sizes.xs : TYPOGRAPHY.sizes.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});
