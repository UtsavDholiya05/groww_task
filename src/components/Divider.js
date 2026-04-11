import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants';

/**
 * Divider Component
 * Horizontal or vertical separator line
 */
export const Divider = ({
  variant = 'full',
  color = COLORS.border,
  thickness = 1,
  margin = SPACING.md,
  style = {},
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          borderBottomWidth: thickness,
          borderBottomColor: color,
          marginVertical: margin,
        },
        style,
      ]}
    />
  );
};

/**
 * Section Divider - Larger spacing
 */
export const SectionDivider = ({ style = {} }) => (
  <Divider margin={SPACING.lg} style={style} />
);

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
