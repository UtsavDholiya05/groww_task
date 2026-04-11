import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS, DEBOUNCE_DELAY } from '../constants';
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
    <View style={[styles.container, { backgroundColor: colors }]}>
      {/* Header with Search Input */}
      <View style={[styles.header, { backgroundColor: colors }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  clearButtonContainer: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 12,
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
  },
});
