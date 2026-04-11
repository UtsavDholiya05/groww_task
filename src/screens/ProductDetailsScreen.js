import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { COLORS } from '../constants';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { AddToWatchlistBottomSheet } from '../components/AddToWatchlistBottomSheet';
import { formatCurrency, formatDate, getChartData } from '../utils/helpers';

export const ProductDetailsScreen = ({ route, navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { schemeCode } = route.params;
  const {
    selectedFund,
    fundLoading,
    fundError,
    loadFundDetails,
    watchlists,
    addFundToMultipleWatchlists,
    getFundWatchlists,
    createWatchlist,
  } = useAppStore();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isFundInWatchlist, setIsFundInWatchlist] = useState(false);
  const [selectedWatchlistIds, setSelectedWatchlistIds] = useState([]);

  useEffect(() => {
    loadFundDetails(schemeCode);
    checkWatchlistStatus();
  }, [schemeCode]);

  const checkWatchlistStatus = async () => {
    const watchlistIds = await getFundWatchlists(schemeCode);
    setSelectedWatchlistIds(watchlistIds);
    setIsFundInWatchlist(watchlistIds.length > 0);
  };

  const handleAddToWatchlist = async (selectedIds) => {
    try {
      await addFundToMultipleWatchlists(schemeCode, selectedIds);
      setIsFundInWatchlist(selectedIds.length > 0);
      Alert.alert('Success', 'Fund added to watchlists');
    } catch (error) {
      Alert.alert('Error', 'Failed to add fund to watchlist');
    }
  };

  const handleCreateNewWatchlist = async (name) => {
    try {
      const newWatchlist = await createWatchlist(name);
      await addFundToMultipleWatchlists(schemeCode, [newWatchlist.id]);
      Alert.alert('Success', `Fund added to "${name}"`);
      setShowBottomSheet(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create watchlist');
    }
  };

  if (fundLoading) {
    return <LoadingState isDark={isDark} />;
  }

  if (fundError) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Error Loading Fund" description={fundError} isDark={isDark} />
      </View>
    );
  }

  if (!selectedFund) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Fund Not Found" description="Unable to load fund details" isDark={isDark} />
      </View>
    );
  }

  const chartData = getChartData(selectedFund.navHistory || []);

  return (
    <View style={[styles.container, { backgroundColor: colors }, { paddingTop: 10 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.headerCard, { backgroundColor: surface }]}>
          <Text style={[styles.schemeName, { color: textColor }]} numberOfLines={3}>
            {selectedFund.schemeName}
          </Text>
          <Text style={[styles.amcName, { color: textSecondary }]}>{selectedFund.amcName}</Text>

          <View style={styles.navInfoContainer}>
            <View>
              <Text style={[styles.label, { color: textSecondary }]}>Current NAV</Text>
              <Text style={[styles.navValue, { color: COLORS.primary }]}>
                {formatCurrency(selectedFund.nav)}
              </Text>
            </View>
            <View>
              <Text style={[styles.label, { color: textSecondary }]}>Date</Text>
              <Text style={[styles.dateValue, { color: textColor }]}>
                {formatDate(selectedFund.date)}
              </Text>
            </View>
          </View>

          <View style={[styles.detailsGrid, { borderTopColor: isDark ? COLORS.darkBg : COLORS.border }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: textSecondary }]}>Scheme Type</Text>
              <Text style={[styles.detailValue, { color: textColor }]}>{selectedFund.schemeType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: textSecondary }]}>Risk Level</Text>
              <Text style={[styles.detailValue, { color: textColor }]}>{selectedFund.riskLevel}</Text>
            </View>
          </View>
        </View>

        {chartData.datasets[0].data.length > 0 ? (
          <View style={[styles.chartContainer, { backgroundColor: surface }]}>
            <Text style={[styles.chartTitle, { color: textColor }]}>NAV History (Last 12 Months)</Text>
            <View style={styles.simpleChart}>
              {chartData.datasets[0].data.map((value, index) => {
                const maxValue = Math.max(...chartData.datasets[0].data);
                const minValue = Math.min(...chartData.datasets[0].data);
                const range = maxValue - minValue || 1;
                const heightPercent = ((value - minValue) / range) * 100;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(10, heightPercent)}%`,
                          backgroundColor: COLORS.primary,
                        },
                      ]}
                    />
                    <Text style={[styles.chartLabel, { color: textSecondary }]}>
                      {chartData.labels[index]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[
              styles.watchlistButton,
              {
                backgroundColor: isFundInWatchlist ? COLORS.primary : 'transparent',
                borderColor: COLORS.primary,
                borderWidth: 1,
              },
            ]}
            onPress={() => setShowBottomSheet(true)}
          >
            <Text
              style={[
                styles.watchlistButtonText,
                { color: isFundInWatchlist ? 'white' : COLORS.primary },
              ]}
            >
              {isFundInWatchlist ? '❤️ Add to Portfolio' : '🤍 Add to Portfolio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddToWatchlistBottomSheet
        visible={showBottomSheet}
        watchlists={watchlists}
        selectedWatchlistIds={selectedWatchlistIds}
        onClose={() => setShowBottomSheet(false)}
        onAddToExisting={handleAddToWatchlist}
        onCreateNew={handleCreateNewWatchlist}
        isDark={isDark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amcName: {
    fontSize: 14,
    marginBottom: 16,
  },
  navInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  navValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  simpleChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    paddingVertical: 12,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  actionButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  watchlistButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  watchlistButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
