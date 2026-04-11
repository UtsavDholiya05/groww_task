import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

export const FundCard = ({ fund, onPress, isDark = false }) => {
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const surfaceColor = isDark ? COLORS.darkSurface : COLORS.surface;

  // Extract fund type from scheme name (first word or abbreviation)
  const fundType = fund.schemeName?.split(' ')[0]?.substring(0, 3) || 'MF';
  const fundName = fund.schemeName?.substring(0, 20) || 'Fund';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surfaceColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
        <Text style={styles.iconText}>{fundType}</Text>
      </View>

      <Text style={[styles.fundName, { color: textColor }]} numberOfLines={2}>
        {fundName}
      </Text>

      <Text style={[styles.navValue, { color: COLORS.primary }]}>
        ₹{fund.nav ? (typeof fund.nav === 'string' ? parseFloat(fund.nav).toFixed(2) : fund.nav.toFixed(2)) : 'N/A'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    minHeight: 160,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fundName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  navValue: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
