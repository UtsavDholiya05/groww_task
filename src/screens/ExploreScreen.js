import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { FundCard } from '../components/FundCard';
import { SkeletonLoader } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export const ExploreScreen = ({ navigation, isDark = false }) => {
  const bgColor = isDark ? COLORS.darkBg : COLORS.surfaceLight;
  const colors = isDark ? COLORS.darkBg : COLORS.surfaceLight;
  const surface = isDark ? COLORS.darkSurface : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const borderColor = isDark ? COLORS.darkBorder : COLORS.border;

  const { exploreCategories, loadExploreCategories } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExploreCategories();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExploreCategories();
    setRefreshing(false);
  };

  const handleViewAll = (categoryId, categoryName, query) => {
    navigation.navigate('ViewAll', { categoryId, categoryName, query });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors }]}>
      {/* Header - Outside ScrollView */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>MF Explorer</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>Discover funds that fit your goals</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={[styles.searchIconButton, { backgroundColor: COLORS.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar - Outside ScrollView */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={[styles.searchBar, { backgroundColor: surface, color: textColor, borderColor }]}
          placeholder="Search funds..."
          placeholderTextColor={textSecondary}
          onFocus={() => navigation.navigate('Search')}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {exploreCategories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <View>
                  <Text style={[styles.categoryTitle, { color: textColor }]}>{category.name}</Text>
                  <View style={[styles.categoryUnderline, { backgroundColor: COLORS.primary }]} />
                </View>
                {category.funds.length > 0 && (
                  <TouchableOpacity
                    onPress={() => handleViewAll(category.id, category.name, category.query)}
                    style={styles.viewAllButton}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.viewAllCTA, { color: COLORS.primary }]}>View All →</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Grid Content */}
              {category.loading ? (
                <View style={styles.gridContainer}>
                  <SkeletonLoader isDark={isDark} />
                  <SkeletonLoader isDark={isDark} />
                </View>
              ) : category.error ? (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: COLORS.error }]}>
                    Failed to load {category.name}
                  </Text>
                </View>
              ) : category.funds.length > 0 ? (
                <View style={styles.gridContainer}>
                  {category.funds.slice(0, 4).map((fund) => (
                    <FundCard
                      key={fund.schemeCode}
                      fund={fund}
                      isDark={isDark}
                      onPress={() => {
                        navigation.navigate('ProductDetails', { schemeCode: fund.schemeCode });
                      }}
                    />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="No funds found"
                  description="Try searching or check back later"
                  isDark={isDark}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header Styling
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['4xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: -0.8,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.normal,
    marginTop: SPACING.xs,
  },
  searchIconButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  searchIcon: {
    fontSize: TYPOGRAPHY.sizes.xl,
  },
  // Search Bar Styling
  searchBarContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  searchBar: {
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    borderWidth: 1,
    fontWeight: TYPOGRAPHY.weights.normal,
    ...SHADOWS.md,
  },
  // Categories Container
  categoriesContainer: {
    paddingVertical: SPACING.md,
  },
  categorySection: {
    marginBottom: SPACING['3xl'],
  },
  // Category Header Styling
  categoryHeader: {
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  categoryUnderline: {
    height: 4,
    width: 50,
    borderRadius: BORDER_RADIUS.full,
  },
  viewAllButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  viewAllCTA: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  // Grid and Card Styling
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  // Error Styling
  errorContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
});
