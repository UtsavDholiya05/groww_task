import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const LoadingState = ({ size = 'large', isDark = false }) => {
  const bg = isDark ? COLORS.darkBg : COLORS.background;
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
};

export const SkeletonLoader = ({ isDark = false }) => {
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const border = isDark ? COLORS.darkBg : COLORS.border;

  return (
    <View style={[styles.skeleton, { backgroundColor: surface }]}>
      <View style={[styles.skeletonLine, { backgroundColor: border }]} />
      <View style={[styles.skeletonLine, { backgroundColor: border, marginTop: 8 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeleton: {
    padding: 12,
    margin: 8,
    borderRadius: 12,
    height: 100,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
});
