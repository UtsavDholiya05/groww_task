import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { fundAPI } from '../services/api';
import { EmptyState } from '../components/EmptyState';

export const WatchlistDetailScreen = ({ route, navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { watchlistId } = route.params;
  const { watchlists, removeFundFromWatchlist } = useAppStore();

  const watchlist = watchlists.find((w) => w.id === watchlistId);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWatchlistFunds();
  }, [watchlist?.funds]);

  useFocusEffect(
    React.useCallback(() => {
      loadWatchlistFunds();
    }, [watchlist?.funds])
  );

  const loadWatchlistFunds = async () => {
    if (!watchlist || !watchlist.funds || watchlist.funds.length === 0) {
      setFunds([]);
      return;
    }
    
    setLoading(true);
    console.log(`\n\n🚀 ===== LOADING WATCHLIST FUNDS =====`);
    console.log(`Total funds to load: ${watchlist.funds.length}`);
    console.log(`Watchlist ID: ${watchlistId}`);
    console.log(`Fund scheme codes:`, watchlist.funds);
    console.log('=====================================\n');
    
    try {
      const fundPromises = watchlist.funds.map(async (schemeCode) => {
        try {
          console.log(`\n📡 Calling getFundDetails for: ${schemeCode}`);
          const fundDetails = await fundAPI.getFundDetails(schemeCode);
          
          console.log(`\n📊 Received for ${schemeCode}:`, {
            schemeName: fundDetails?.schemeName,
            nav: fundDetails?.nav,
            schemeCode: fundDetails?.schemeCode,
          });
          
          // Ensure we have required fields
          if (fundDetails && fundDetails.schemeName && fundDetails.schemeCode) {
            console.log(`✅ Valid fund: ${fundDetails.schemeName}, NAV: ₹${fundDetails.nav}`);
            return fundDetails;
          }
          
          console.warn(`⚠️ Invalid fund details for ${schemeCode}:`, fundDetails);
          return null;
        } catch (err) {
          console.error(`❌ Error loading fund ${schemeCode}:`, err.message);
          return null;
        }
      });

      const fundDetails = await Promise.all(fundPromises);
      const validFunds = fundDetails.filter((f) => f !== null);
      
      console.log(`\n\n✨ FINAL RESULT ✨`);
      console.log(`Loaded ${validFunds.length} funds out of ${watchlist.funds.length}`);
      console.log(`Funds to display:`, validFunds.map(f => ({
        name: f.schemeName,
        nav: f.nav,
        code: f.schemeCode
      })));
      console.log('==============================\n\n');
      
      setFunds(validFunds);
    } catch (error) {
      console.error('Error loading watchlist funds:', error);
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFund = (schemeCode) => {
    Alert.alert('Remove Fund', 'Are you sure you want to remove this fund?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Remove',
        onPress: async () => {
          await removeFundFromWatchlist(watchlistId, schemeCode);
        },
        style: 'destructive',
      },
    ]);
  };



  if (!watchlist) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Watchlist Not Found" description="This watchlist no longer exists" isDark={isDark} />
      </View>
    );
  }

  const renderFundItem = ({ item }) => {
    // Check if NAV is valid - be lenient with the check
    const navValue = item.nav;
    const isValidNav = navValue !== null && navValue !== undefined && navValue !== 0;
    
    // Detailed NAV display logic
    let navDisplay = '';
    if (isValidNav && typeof navValue === 'number' && navValue > 0) {
      navDisplay = `₹${navValue.toFixed(2)}`;
    } else if (isValidNav && typeof navValue === 'string') {
      const parsed = parseFloat(navValue);
      if (!isNaN(parsed)) {
        navDisplay = `₹${parsed.toFixed(2)}`;
      } else {
        navDisplay = 'Fetching...';
      }
    } else {
      navDisplay = 'Fetching...';
    }
    
    // Log for debugging
    console.log(`📊 Fund: ${item.schemeName}, Code: ${item.schemeCode}, NAV Value: [${navValue}], Type: ${typeof navValue}, Display: ${navDisplay}`);
    
    return (
      <View style={[styles.fundItem, { backgroundColor: surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
        <TouchableOpacity
          style={styles.fundContent}
          onPress={() => {
            if (item.schemeCode) {
              navigation.navigate('ProductDetails', { schemeCode: item.schemeCode });
            }
          }}
        >
          <Text style={[styles.fundName, { color: textColor }]} numberOfLines={2}>
            {item.schemeName || `Fund (${item.schemeCode})`}
          </Text>
          <Text style={[styles.navValue, { color: COLORS.primary }]}>
            {navDisplay}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveFund(item.schemeCode)} style={styles.removeButton}>
          <Text style={{ color: COLORS.error }}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: textSecondary }}>Loading...</Text>
        </View>
      ) : funds.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors }]}>
          <EmptyState
            title="No Funds in This Watchlist"
            description="Add funds from the Explore screen"
            isDark={isDark}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Explore')}
            style={[styles.exploreFundsButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.exploreFundsButtonText}>Explore Funds</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={funds}
          renderItem={renderFundItem}
          keyExtractor={(item) => item.schemeCode}
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
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.lg,
  },
  fundItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  fundContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  fundName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.xs,
  },
  navValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  exploreFundsButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  },
  exploreFundsButtonText: {
    color: 'white',
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    textAlign: 'center',
  },
});
