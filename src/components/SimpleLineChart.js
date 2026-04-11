import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export const SimpleLineChart = ({ data, isDark = false }) => {
  // Generate sample data if none provided or empty
  let chartData = data;
  if (!chartData || chartData.length < 2) {
    console.log('📊 No chart data provided, generating sample data');
    // Generate sample upward trend for demo
    chartData = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      nav: 100 + i * 5 + Math.random() * 10, // Upward trend with some variation
    }));
  }

  const validData = chartData.filter((d) => d && d.nav && !isNaN(d.nav));
  if (validData.length < 2) {
    console.log('📊 Not enough valid data points for chart');
    return null;
  }

  const chartWidth = width - 40;
  const chartHeight = 220;
  const padding = 16;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  // Extract nav values
  const values = validData.map((d) => parseFloat(d.nav) || 0).filter((v) => v > 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || maxValue * 0.1;

  // Determine trend
  const isPositive = values[values.length - 1] >= values[0];
  const lineColor = isPositive ? COLORS.success : COLORS.error;
  const fillColor = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  // Calculate point positions for line chart
  const points = validData.map((d, index) => {
    const navValue = parseFloat(d.nav);
    const normalizedValue = (navValue - minValue) / range;
    const x = (index / (validData.length - 1)) * innerWidth + padding;
    const y = innerHeight - normalizedValue * innerHeight + padding;
    return { x, y, nav: navValue, date: d.date };
  });

  // Create SVG-like line path using positioning
  const renderLineChart = () => {
    return (
      <View style={{ position: 'relative', width: chartWidth, height: chartHeight }}>
        {/* Background grid */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.3,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={`grid-${i}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: 1,
                backgroundColor: isDark ? '#444' : '#e0e0e0',
                top: `${(i + 1) * 25}%`,
              }}
            />
          ))}
        </View>

        {/* Connecting lines between points */}
        {points.slice(0, -1).map((point, idx) => {
          const nextPoint = points[idx + 1];
          const dx = nextPoint.x - point.x;
          const dy = nextPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <View
              key={`line-${idx}`}
              style={{
                position: 'absolute',
                width: distance,
                height: 2,
                backgroundColor: lineColor,
                left: point.x,
                top: point.y,
                transformOrigin: '0 50%',
                transform: [{ rotate: `${angle}deg` }],
                opacity: 0.8,
              }}
            />
          );
        })}

        {/* Data points (circles) */}
        {points.map((point, idx) => (
          <View
            key={`point-${idx}`}
            style={{
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: lineColor,
              left: point.x - 3,
              top: point.y - 3,
              shadowColor: lineColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 3,
            }}
          />
        ))}

        {/* Y-axis labels */}
        <Text
          style={{
            position: 'absolute',
            fontSize: 9,
            color: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
            fontWeight: '500',
            right: 8,
            top: padding - 6,
          }}
        >
          ₹{maxValue.toFixed(0)}
        </Text>
        <Text
          style={{
            position: 'absolute',
            fontSize: 9,
            color: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
            fontWeight: '500',
            right: 8,
            bottom: padding - 6,
          }}
        >
          ₹{minValue.toFixed(0)}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 250, 0.8)',
          borderRadius: 12,
          borderColor: isDark ? COLORS.darkBg : '#e0e0e0',
          borderWidth: 1,
        },
      ]}
    >
      {renderLineChart()}

      {/* X-axis labels (time periods) */}
      <View style={styles.xAxisLabels}>
        {['6M', '1Y', 'ALL'].map((label, idx) => (
          <Text
            key={`xlabel-${idx}`}
            style={{
              fontSize: 10,
              color: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
              fontWeight: '500',
              marginHorizontal: 12,
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 16,
    marginHorizontal: 0,
    paddingBottom: 24,
    paddingTop: 8,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
    paddingTop: 8,
  },
});
