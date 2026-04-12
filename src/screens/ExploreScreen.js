import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, DEBOUNCE_DELAY } from '../constants';
import { FundCard } from '../components/FundCard';
import { SkeletonLoader } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { debounceSearch, formatCurrency } from '../utils/helpers';

export const ExploreScreen = ({ navigation, isDark = false }) => {
  const bgColor = isDark ? COLORS.darkBg : COLORS.surfaceLight;
  const colors = isDark ? COLORS.darkBg : COLORS.surfaceLight;
  const surface = isDark ? COLORS.darkSurface : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;
  const borderColor = isDark ? COLORS.darkBorder : COLORS.border;

  const { exploreCategories, loadExploreCategories, searchResults, searchLoading, searchError, search } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedSearch = useCallback(debounceSearch((q) => search(q), DEBOUNCE_DELAY), [search]);

  useEffect(() => {
    loadExploreCategories();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExploreCategories();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    search('');
  };

  const handleViewAll = (categoryId, categoryName, query) => {
    navigation.navigate('ViewAll', { categoryId, categoryName, query });
  };

  const renderFundResult = ({ item }) => {
    const fundType = item.schemeName?.split(' ')[0]?.substring(0, 3) || 'MF';
    return (
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}
        onPress={() => {
          navigation.navigate('ProductDetails', { schemeCode: item.schemeCode });
        }}
      >
        <View style={[styles.badge, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={styles.badgeText}>{fundType}</Text>
        </View>
        <View style={styles.fundInfo}>
          <Text style={[styles.fundName, { color: textColor }]} numberOfLines={1}>
            {item.schemeName}
          </Text>
          <Text style={[styles.fundCategory, { color: textSecondary }]}>
            {item.schemeType || 'Fund'} - NAV: {item.nav ? formatCurrency(item.nav) : 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
        <View style={[styles.searchInputContainer, { backgroundColor: surface, borderColor }]}>
          <Text style={{ fontSize: 16, marginRight: 8, color: textSecondary }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search funds..."
            placeholderTextColor={textSecondary}
            value={query}
            onChangeText={handleSearch}
          />
          {query ? (
            <TouchableOpacity onPress={handleClear} style={styles.clearButtonContainer}>
              <Text style={[styles.clearButton, { color: textSecondary }]}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {query ? (
        // Search Results View
        searchLoading ? (
          <SkeletonLoader count={5} isDark={isDark} />
        ) : searchError ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: COLORS.error }]}>{searchError}</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: textSecondary }]}>No funds found for "{query}"</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.resultsLabel, { color: textSecondary }]}>Search Results</Text>
            <FlatList
              data={searchResults}
              renderItem={renderFundResult}
              keyExtractor={(item) => item.schemeCode}
              contentContainerStyle={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={false}
            />
          </>
        )
      ) : (
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
      )}
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
    paddingTop: SPACING.md,
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
    paddingTop: 0,
    paddingBottom: SPACING.md,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.normal,
    textAlign: 'center',
  },
  // Search Input Styling
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.normal,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    color: COLORS.text,
  },
  clearButtonContainer: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  clearButton: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  // Search Results Styling
  resultsLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  resultsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.md,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  fundCategory: {
    fontSize: TYPOGRAPHY.sizes.sm,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.normal,
    textAlign: 'center',
  },
});
