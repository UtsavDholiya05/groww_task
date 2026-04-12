import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency, getChartData } from '../utils/helpers';
import { SimpleLineChart } from '../components/SimpleLineChart';

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
    loadWatchlists,
    createWatchlist,
    addFundToWatchlist,
  } = useAppStore();

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedWatchlists, setSelectedWatchlists] = useState([]);

  useEffect(() => {
    loadWatchlists();
  }, []);

  useEffect(() => {
    loadWatchlists();
  }, []);

  const handleAddToWatchlists = async () => {
    try {
      if (selectedWatchlists.length === 0 && !newWatchlistName.trim()) {
        Alert.alert('Select Action', 'Please select a watchlist or create a new one');
        return;
      }

      // Create new watchlist if needed
      if (newWatchlistName.trim()) {
        await createWatchlist(newWatchlistName);
        // Reload watchlists to get the newly created one
        await loadWatchlists();
      }

      // Add to selected watchlists
      for (const watchlistId of selectedWatchlists) {
        await addFundToWatchlist(watchlistId, schemeCode);
      }

      // Reload watchlists to ensure store is updated with new funds
      await loadWatchlists();

      Alert.alert('Success', 'Fund added to portfolio(s)!');
      setShowModal(false);
      setNewWatchlistName('');
      setSelectedWatchlists([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add fund to watchlist');
    }
  };

  const handleAddNewWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      Alert.alert('Error', 'Please enter a portfolio name');
      return;
    }

    try {
      await createWatchlist(newWatchlistName);
      await loadWatchlists();
      
      // Find the newly created watchlist by name
      const newWatchlist = watchlists.find((w) => w.name === newWatchlistName.trim());
      if (newWatchlist) {
        setSelectedWatchlists((prev) => [...prev, newWatchlist.id]);
      }
      
      setNewWatchlistName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create portfolio');
    }
  };

  const toggleWatchlistSelection = (watchlistId) => {
    setSelectedWatchlists((prev) =>
      prev.includes(watchlistId)
        ? prev.filter((id) => id !== watchlistId)
        : [...prev, watchlistId]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Analysis',
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowModal(true)}
          style={{ marginRight: 16 }}
        >
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadFundDetails(schemeCode);
  }, [schemeCode]);

  // Get filtered chart data based on selected time period
  const getFilteredChartData = () => {
    const navHistory = selectedFund.navHistory || [];
    if (navHistory.length === 0) return [];

    const now = new Date();
    const cutoffDate = new Date();

    if (selectedTimePeriod === '6M') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    } else if (selectedTimePeriod === '1Y') {
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    }

    return navHistory.filter((item) => {
      if (selectedTimePeriod === 'ALL') return true;
      const itemDate = new Date(item.date || 0);
      return itemDate >= cutoffDate;
    });
  };

  // Calculate change percentage for selected period
  const getChangePercent = () => {
    const filteredData = getFilteredChartData();
    if (filteredData.length < 2) return selectedFund.changePercent || 0;

    const oldestNav = filteredData[0].nav;
    const currentNav = filteredData[filteredData.length - 1].nav;

    if (oldestNav > 0) {
      return ((currentNav - oldestNav) / oldestNav) * 100;
    }
    return 0;
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
  const changePercent = getChangePercent();
  const filteredChartData = getFilteredChartData();
  const fundCategory = selectedFund.schemeType || 'Equity';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fund Title and Category */}
        <View style={styles.titleSection}>
          <Text style={[styles.fundTitle, { color: textColor }]} numberOfLines={2}>
            {selectedFund.schemeName}
          </Text>
          <Text style={[styles.categoryLabel, { color: textSecondary }]}>
            Category: {fundCategory} - Large Cap
          </Text>
        </View>

        {/* NAV and Change Percentage */}
        <View style={styles.navSection}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.navLabel, { color: textColor, marginRight: 8 }]}>NAV</Text>
            <Text style={[styles.navAmount, { color: textColor, marginRight: 16 }]}>
              {formatCurrency(selectedFund.nav)}
            </Text>
            <Text style={[styles.changePercent, { color: changePercent >= 0 ? COLORS.success : COLORS.error }]}>
              {changePercent >= 0 ? '↑' : '↓'} {Math.abs(changePercent).toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Chart with Time Period Selector */}
        {(selectedFund.navHistory || []).length > 0 ? (
          <View style={[styles.chartSection, { backgroundColor: surface }]}>
            {/* Time Period Buttons */}
            <View style={styles.timePeriodContainer}>
              {['6M', '1Y', 'ALL'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.timePeriodButton,
                    selectedTimePeriod === period && { borderBottomColor: COLORS.primary, borderBottomWidth: 3 },
                  ]}
                  onPress={() => setSelectedTimePeriod(period)}
                >
                  <Text
                    style={[
                      styles.timePeriodText,
                      { color: selectedTimePeriod === period ? COLORS.primary : textSecondary },
                      selectedTimePeriod === period && { fontWeight: '600' },
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart Component */}
            {filteredChartData.length > 0 ? (
              <SimpleLineChart data={filteredChartData} isDark={isDark} />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={{ color: textSecondary }}>No data for selected period</Text>
              </View>
            )}
          </View>
        ) : null}

        {/* Fund Description/Objective */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.description, { color: textSecondary }]}>
            {selectedFund.objective || 
              'This mutual fund aims to provide long-term capital appreciation through a diversified portfolio alignment with the selected scheme objective.'}
          </Text>
        </View>

        {/* Divider Line */}
        <View style={[styles.divider, { backgroundColor: isDark ? COLORS.darkBg : COLORS.border }]} />

        {/* Info Table (Type, Size, NAV) */}
        <View style={[styles.infoTable, { backgroundColor: surface }]}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={[styles.tableLabel, { color: textSecondary }]}>Type</Text>
              <Text style={[styles.tableValue, { color: textColor }]}>{selectedFund.schemeType || 'Growth'}</Text>
            </View>
            <View style={styles.tableDivider} />
            <View style={styles.tableCell}>
              <Text style={[styles.tableLabel, { color: textSecondary }]}>Size</Text>
              <Text style={[styles.tableValue, { color: textColor }]}>₹35k Cr</Text>
            </View>
            <View style={styles.tableDivider} />
            <View style={styles.tableCell}>
              <Text style={[styles.tableLabel, { color: textSecondary }]}>NAV</Text>
              <Text style={[styles.tableValue, { color: textColor }]}>{formatCurrency(selectedFund.nav)}</Text>
            </View>
          </View>
        </View>


      </ScrollView>

      {/* Add to Watchlist Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: surface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Add to Portfolio</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Text style={{ fontSize: 24, color: textSecondary }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* New Watchlist Input */}
            <View style={styles.newWatchlistSection}>
              <TextInput
                style={[
                  styles.watchlistInput,
                  {
                    color: textColor,
                    borderColor: COLORS.primary,
                    placeholderTextColor: textSecondary,
                  },
                ]}
                placeholder="New Portfolio Name..."
                value={newWatchlistName}
                onChangeText={setNewWatchlistName}
              />
              <TouchableOpacity
                onPress={handleAddNewWatchlist}
                style={[styles.addButton, { backgroundColor: COLORS.primary }]}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDark ? COLORS.darkBg : COLORS.border }]} />

            {/* Existing Watchlists */}
            <View style={styles.watchlistsContainer}>
              {watchlists.length === 0 ? (
                <Text style={[styles.emptyText, { color: textSecondary }]}>
                  No portfolios yet. Create one above.
                </Text>
              ) : (
                watchlists.map((watchlist) => (
                  <TouchableOpacity
                    key={watchlist.id}
                    style={styles.watchlistItem}
                    onPress={() => toggleWatchlistSelection(watchlist.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: selectedWatchlists.includes(watchlist.id)
                            ? COLORS.primary
                            : 'transparent',
                          borderColor: COLORS.primary,
                        },
                      ]}
                    >
                      {selectedWatchlists.includes(watchlist.id) && (
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.watchlistName, { color: textColor }]}>
                      {watchlist.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.buttonCancel, { backgroundColor: isDark ? COLORS.darkBg : COLORS.border }]}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddToWatchlists}
                style={[styles.buttonAdd, { backgroundColor: COLORS.primary }]}
              >
                <Text style={styles.buttonTextWhite}>Add to Portfolio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fundTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.sm,
  },
  categoryLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  navSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginRight: SPACING.sm,
  },
  navAmount: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    marginRight: SPACING.lg,
  },
  changePercent: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  chartSection: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  timePeriodButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  timePeriodText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  lineChartContainer: {
    height: 140,
    marginVertical: SPACING.md,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  chartPoint: {
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  pointIndicator: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  descriptionSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.normal,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  infoTable: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
  },
  tableDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  tableLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.sm,
  },
  tableValue: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xl,
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  newWatchlistSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  watchlistInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    borderColor: COLORS.border,
  },
  addButton: {
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  addButtonText: {
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.semibold,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  watchlistsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    maxHeight: 300,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.base,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  buttonCancel: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonAdd: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  buttonText: {
    fontWeight: TYPOGRAPHY.weights.semibold,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  buttonTextWhite: {
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.semibold,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
});
