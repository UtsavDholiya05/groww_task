import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS } from '../constants';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency, getChartData } from '../utils/helpers';

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
  } = useAppStore();

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('ALL');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Analysis',
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Watchlist')}
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
  const changePercent = selectedFund.changePercent !== undefined ? selectedFund.changePercent : 0;
  const fundCategory = selectedFund.schemeType || 'Equity';

  return (
    <View style={[styles.container, { backgroundColor: colors }]}>
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
            <Text style={[styles.changePercent, { color: COLORS.success }]}>
              ↑ {changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Chart with Time Period Selector */}
        {chartData.datasets[0].data.length > 0 ? (
          <View style={[styles.chartSection, { backgroundColor: surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
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
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Line Chart Visualization */}
            <View style={styles.lineChartContainer}>
              <View style={styles.chartArea}>
                {/* Chart line - simplified visualization */}
                {chartData.datasets[0].data.map((value, index) => {
                  const maxValue = Math.max(...chartData.datasets[0].data);
                  const minValue = Math.min(...chartData.datasets[0].data);
                  const range = maxValue - minValue || 1;
                  const heightPercent = ((value - minValue) / range) * 100;
                  const isLast = index === chartData.datasets[0].data.length - 1;
                  
                  return (
                    <View
                      key={index}
                      style={[
                        styles.chartPoint,
                        {
                          flex: 1,
                          height: '100%',
                          borderLeftWidth: index > 0 ? 1 : 0,
                          borderLeftColor: COLORS.primary,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.pointIndicator,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: 'transparent',
                          },
                        ]}
                      >
                        {isLast && <View style={styles.point} />}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  fundTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  navSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  navAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartSection: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  timePeriodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timePeriodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lineChartContainer: {
    height: 140,
    marginVertical: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  infoTable: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
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
    marginHorizontal: 12,
  },
  tableLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
