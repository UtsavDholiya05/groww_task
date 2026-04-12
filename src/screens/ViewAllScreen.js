import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
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

  const handleFundPress = async (fund) => {
    // If fund doesn't have NAV, fetch it before navigating
    if (!fund.nav || fund.nav === 0) {
      try {
        const fullDetails = await fundAPI.getFundDetails(fund.schemeCode);
        // Update the fund with full details
        setFunds((prev) =>
          prev.map((f) => (f.schemeCode === fund.schemeCode ? fullDetails : f))
        );
      } catch (err) {
        console.error('Failed to fetch fund details:', err);
      }
    }
    
    navigation.navigate('ProductDetails', { schemeCode: fund.schemeCode });
  };

  const renderFundCard = ({ item }) => {
    const fundType = item.schemeName?.split(' ')[0]?.substring(0, 3) || 'MF';
    const navDisplay = item.nav && item.nav > 0 
      ? `₹${typeof item.nav === 'string' ? parseFloat(item.nav).toFixed(2) : item.nav.toFixed(2)}`
      : 'N/A';
    
    return (
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}
        onPress={() => handleFundPress(item)}
      >
        <View style={[styles.badge, { borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
          <Text style={styles.badgeText}>{fundType}</Text>
        </View>
        <View style={styles.fundInfo}>
          <Text style={[styles.fundName, { color: textColor }]} numberOfLines={2}>
            {item.schemeName}
          </Text>
          <Text style={[styles.navInfo, { color: textSecondary }]}>
            NAV: {navDisplay}
          </Text>
        </View>
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Error Loading Funds" description={error} isDark={isDark} />
      </SafeAreaView>
    );
  }

  if (funds.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="No Funds Found" description="No funds available in this category" isDark={isDark} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 2,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
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
  navInfo: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  footerLoader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
});
