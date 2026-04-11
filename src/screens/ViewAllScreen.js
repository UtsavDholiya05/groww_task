import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';
import { fundAPI } from '../services/api';
import { FundCard } from '../components/FundCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export const ViewAllScreen = ({ route, navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { categoryId, categoryName, query } = route.params;
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadFunds();
  }, [query]);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fundAPI.getAllFundsForCategory(query, 100);
      setFunds(data);
    } catch (err) {
      setError(err.message || 'Failed to load funds');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || funds.length === 0) return;
    setLoadingMore(true);
    try {
      const data = await fundAPI.getAllFundsForCategory(query, funds.length + 50);
      setFunds(data);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  if (loading) {
    return <LoadingState isDark={isDark} />;
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Error Loading Funds" description={error} isDark={isDark} />
      </View>
    );
  }

  if (funds.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="No Funds Found" description="No funds available in this category" isDark={isDark} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors }, { paddingTop: 10 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{categoryName}</Text>
        <Text style={[styles.count, { color: textSecondary }]}>{funds.length} funds</Text>
      </View>

      <FlatList
        data={funds}
        renderItem={renderFundCard}
        keyExtractor={(item) => item.schemeCode}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
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
  footerLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
