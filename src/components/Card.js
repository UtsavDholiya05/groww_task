import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

/**
 * Modern Card Component
 * Reusable container with consistent styling
 */
export const Card = ({
  children,
  style = {},
  onPress = null,
  pressable = false,
  elevation = 'md',
  backgroundColor = COLORS.background,
  noPadding = false,
}) => {
  const containerStyle = [
    styles.card,
    {
      backgroundColor,
      ...SHADOWS[elevation],
    },
    style,
  ];

  const cardContent = (
    <View style={[containerStyle, !noPadding && { padding: SPACING.md }]}>
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={containerStyle}
      >
        <View style={!noPadding && { padding: SPACING.md }}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
});

// Import TouchableOpacity for pressable card
import { TouchableOpacity } from 'react-native';
