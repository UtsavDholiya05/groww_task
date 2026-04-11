import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
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

  const renderFundCard = ({ item }) => {
    const fundType = item.schemeName?.split(' ')[0]?.substring(0, 3) || 'MF';
    return (
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}
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
          <Text style={[styles.navLabel, { color: textSecondary }]}>NAV</Text>
        </View>
        <Text style={[styles.navValue, { color: COLORS.primary }]}>
          ₹{item.nav ? (typeof item.nav === 'string' ? parseFloat(item.nav).toFixed(2) : item.nav.toFixed(2)) : 'N/A'}
        </Text>
      </TouchableOpacity>
    );
  };

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
        contentContainerStyle={styles.listContent}
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
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
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  navValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
