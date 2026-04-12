import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, DEBOUNCE_DELAY } from '../constants';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { debounceSearch, formatCurrency } from '../utils/helpers';

export const SearchScreen = ({ navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { searchResults, searchLoading, searchError, search } = useAppStore();
  const [query, setQuery] = useState('');
  const debouncedSearch = useCallback(debounceSearch((q) => search(q), DEBOUNCE_DELAY), [search]);

  const handleSearch = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    search('');
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
      {/* Search Input */}
      <View style={[styles.searchInputContainer, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBg : COLORS.border, marginHorizontal: SPACING.lg }]}>
        <Text style={{ fontSize: 16, marginRight: 8, color: textSecondary }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search funds..."
          placeholderTextColor={textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButtonContainer}>
            <Text style={[styles.clearButton, { color: textSecondary }]}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {searchLoading ? (
        <LoadingState isDark={isDark} />
      ) : searchError ? (
        <View style={styles.errorContainer}>
          <EmptyState title="Search Error" description={searchError} isDark={isDark} />
        </View>
      ) : query && searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState title="No Funds Found" description={`No results for "${query}"`} isDark={isDark} />
        </View>
      ) : query ? (
        <>
          <Text style={[styles.resultsLabel, { color: textSecondary }]}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderFundResult}
            keyExtractor={(item) => item.schemeCode}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: 0,
    marginTop: -20,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.lg,
    height: 48,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  clearButtonContainer: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  clearButton: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
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
    marginBottom: SPACING.xs,
  },
  fundCategory: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
  },
});
