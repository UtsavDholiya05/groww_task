import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { Card } from './Card';

/**
 * Professional Fund Item Component
 * Displays fund name, category, NAV, and performance
 */
export const FundItem = ({
  fund,
  onPress,
  showGrowth = true,
  isDark = false,
  style = {},
}) => {
  const {
    schemeName = '',
    schemeType = 'Fund',
    nav = 0,
    changePercent = 0,
  } = fund || {};

  const fundInitials = schemeName
    ?.split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'MF';

  const isPositive = changePercent >= 0;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const secondaryColor = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const bgColor = isDark ? COLORS.darkSurface : COLORS.surface;

  const formatNumber = (num) => {
    if (typeof num === 'string') {
      num = parseFloat(num);
    }
    return !isNaN(num) ? num.toFixed(2) : '0.00';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
    >
      <Card
        elevation="sm"
        backgroundColor={bgColor}
        style={styles.container}
      >
        {/* Fund Header */}
        <View style={styles.header}>
          {/* Fund Avatar */}
          <View style={[styles.avatar, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={[styles.avatarText, { color: COLORS.primary }]}>
              {fundInitials}
            </Text>
          </View>

          {/* Fund Info */}
          <View style={styles.fundInfo}>
            <Text
              style={[
                styles.fundName,
                { color: textColor },
              ]}
              numberOfLines={1}
            >
              {schemeName}
            </Text>
            <Text
              style={[
                styles.fundCategory,
                { color: secondaryColor },
              ]}
              numberOfLines={1}
            >
              {schemeType}
            </Text>
          </View>

          {/* NAV and Growth */}
          <View style={styles.priceSection}>
            <Text
              style={[
                styles.nav,
                { color: textColor },
              ]}
            >
              ₹{formatNumber(nav)}
            </Text>
            {showGrowth && (
              <View
                style={[
                  styles.growthBadge,
                  {
                    backgroundColor: isPositive
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                  },
                ]}
              >
                <Text
                  style={{
                    color: isPositive ? COLORS.success : COLORS.error,
                    fontSize: TYPOGRAPHY.sizes.sm,
                    fontWeight: TYPOGRAPHY.weights.semibold,
                  }}
                >
                  {isPositive ? '↑' : '↓'} {formatNumber(Math.abs(changePercent))}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.xs,
  },
  fundCategory: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  priceSection: {
    alignItems: 'flex-end',
    marginLeft: SPACING.md,
  },
  nav: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.xs,
  },
  growthBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
});
