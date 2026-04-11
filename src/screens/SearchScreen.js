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
import { FundCard } from '../components/FundCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { debounceSearch } from '../utils/helpers';

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

  const renderFundCard = ({ item }) => (
    <View style={styles.cardWrapper}>
      <FundCard
        fund={item}
        isDark={isDark}
        onPress={() => {
          navigation.navigate('ProductDetails', { schemeCode: item.schemeCode });
        }}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors }, { paddingTop: 10 }]}>
      <View style={[styles.searchBar, { backgroundColor: surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search funds..."
          placeholderTextColor={textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query ? (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: textSecondary }}>🔍</Text>
        )}
      </View>

      {searchLoading ? (
        <LoadingState size="small" isDark={isDark} />
      ) : searchError ? (
        <View style={styles.errorContainer}>
          <EmptyState title="Search Error" description={searchError} isDark={isDark} />
        </View>
      ) : query && searchResults.length === 0 ? (
        <EmptyState title="No Funds Found" description={`No results for "${query}"`} isDark={isDark} />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderFundCard}
          keyExtractor={(item) => item.schemeCode}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  clearButton: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cardWrapper: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
  },
});
