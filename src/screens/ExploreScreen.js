import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { FundCard } from '../components/FundCard';
import { SkeletonLoader } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export const ExploreScreen = ({ navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

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
    <View style={[styles.container, { backgroundColor: colors }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={[styles.header, { backgroundColor: surface }]}>
          <Text style={[styles.title, { color: textColor }]}>MF Explorer</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={[styles.searchButton, { backgroundColor: isDark ? COLORS.darkBg : COLORS.primaryLight }]}
          >
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={[styles.searchBar, { backgroundColor: surface, color: textColor }]}
            placeholder="Search funds..."
            placeholderTextColor={textSecondary}
            onFocus={() => navigation.navigate('Search')}
          />
        </View>

        <View style={styles.categoriesContainer}>
          {exploreCategories.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={[styles.categoryTitle, { color: textColor }]}>{category.name}</Text>
                {category.funds.length > 0 && (
                  <TouchableOpacity onPress={() => handleViewAll(category.id, category.name, category.query)}>
                    <Text style={[styles.viewAllCTA, { color: COLORS.primary }]}>View All →</Text>
                  </TouchableOpacity>
                )}
              </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchBar: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  categoriesContainer: {
    paddingVertical: SPACING.sm,
  },
  categorySection: {
    marginBottom: SPACING['2xl'],
  },
  categoryHeader: {
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewAllCTA: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    justifyContent: 'space-between',
  },
  errorContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});
