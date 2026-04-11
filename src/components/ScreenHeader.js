import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

/**
 * Modern Header Component for Screens
 * Supports title, subtitle, and right action
 */
export const ScreenHeader = ({
  title = '',
  subtitle = '',
  onBackPress = null,
  rightAction = null,
  isDark = false,
  style = {},
}) => {
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const secondaryColor = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.lg,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Left - Back Button */}
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}

        {/* Center - Title and Subtitle */}
        <View style={[styles.titleSection, onBackPress && { marginLeft: SPACING.md }]}>
          <Text
            style={[
              styles.title,
              { color: textColor },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: secondaryColor },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right - Action Button */}
        {rightAction && (
          <View style={styles.rightAction}>
            {rightAction}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  rightAction: {
    marginLeft: SPACING.md,
  },
});
