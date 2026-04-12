import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING, SHADOWS } from '../constants';

export const FundCard = ({ fund, onPress, isDark = false }) => {
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const surfaceColor = isDark ? COLORS.darkSurface : COLORS.background;
  const borderColor = isDark ? COLORS.darkBorder : COLORS.border;

  // Extract fund type from scheme name (first word or abbreviation)
  const fundType = fund.schemeName?.split(' ')[0]?.substring(0, 3) || 'MF';
  const fundName = fund.schemeName?.substring(0, 25) || 'Fund';
  
  // Improved NAV display with better handling
  let navDisplay = 'N/A';
  if (fund.nav !== undefined && fund.nav !== null && fund.nav !== 0) {
    if (typeof fund.nav === 'string') {
      const parsed = parseFloat(fund.nav);
      navDisplay = !isNaN(parsed) ? `${parsed.toFixed(2)}` : 'N/A';
    } else if (typeof fund.nav === 'number') {
      navDisplay = fund.nav.toFixed(2);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
        <Text style={styles.iconText}>{fundType}</Text>
      </View>

      <Text style={[styles.fundName, { color: textColor }]} numberOfLines={3}>
        {fundName}
      </Text>

      <Text style={[styles.navValue, { color: COLORS.primary }]}>
        ₹{navDisplay}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 170,
    justifyContent: 'flex-start',
    borderWidth: 1,
    ...SHADOWS.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  iconText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  fundName: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.sizes.sm,
  },
  navValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
  },
});
