import React from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';

/**
 * Modern Input Field Component
 * Supports label, placeholder, icons, and different sizes
 */
export const Input = ({
  label = '',
  placeholder = '',
  value = '',
  onChangeText = () => {},
  onFocus = () => {},
  onBlur = () => {},
  error = '',
  icon = null,
  rightIcon = null,
  multiline = false,
  numberOfLines = 1,
  size = 'md',
  disabled = false,
  isDark = false,
  style = {},
}) => {
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const secondaryColor = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const borderColor = error ? COLORS.error : COLORS.border;
  const bgColor = isDark ? COLORS.darkSurface : COLORS.background;

  const getHeightBySize = () => {
    switch (size) {
      case 'sm':
        return 40;
      case 'lg':
        return 56;
      default:
        return 48;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: bgColor,
            minHeight: getHeightBySize(),
          },
          error && styles.errorBorder,
        ]}
      >
        {icon && <View style={styles.leftIcon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              paddingLeft: icon ? 0 : SPACING.md,
              paddingRight: rightIcon ? 0 : SPACING.md,
              fontSize: TYPOGRAPHY.sizes.base,
              fontWeight: TYPOGRAPHY.weights.medium,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={secondaryColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          selectionColor={COLORS.primary}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: COLORS.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    fontWeight: TYPOGRAPHY.weights.regular,
    paddingVertical: SPACING.md,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  errorBorder: {
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});
