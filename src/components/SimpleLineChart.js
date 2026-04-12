import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export const SimpleLineChart = ({ data, isDark = false }) => {
  let chartData = data;
  if (!chartData || chartData.length < 2) {
    console.log('📊 No chart data provided, generating sample data');
    chartData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      nav: 100 + i * 5 + Math.random() * 10,
    }));
  }

  const validData = chartData.filter((d) => d && d.nav && !isNaN(parseFloat(d.nav)));
  if (validData.length < 2) {
    console.log('📊 Not enough valid data points for chart');
    return null;
  }

  const chartWidth = width - 40;
  const chartHeight = 220;
  const padding = 20;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  const values = validData.map((d) => parseFloat(d.nav)).filter((v) => !isNaN(v) && v > 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || maxValue * 0.1;

  const isPositive = values[values.length - 1] >= values[0];
  const lineColor = isPositive ? COLORS.success : COLORS.error;

  // Calculate SVG path for smooth line
  const generatePath = () => {
    let path = '';
    validData.forEach((d, index) => {
      const navValue = parseFloat(d.nav);
      const normalizedValue = (navValue - minValue) / range;
      const x = (index / (validData.length - 1)) * innerWidth + padding;
      const y = innerHeight - normalizedValue * innerHeight + padding;
      path += `${index === 0 ? 'M' : 'L'} ${x} ${y} `;
    });
    return path;
  };

  // Simpler render without transforms
  const renderLineChart = () => {
    const points = validData.map((d, index) => {
      const navValue = parseFloat(d.nav);
      const normalizedValue = (navValue - minValue) / range;
      const x = (index / (validData.length - 1)) * innerWidth + padding;
      const y = innerHeight - normalizedValue * innerHeight + padding;
      return { x, y };
    });

    return (
      <View style={{ width: chartWidth, height: chartHeight, position: 'relative' }}>
        {/* Grid background */}
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={`grid-${i}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: 1,
                backgroundColor: isDark ? '#333' : '#e5e5e5',
                top: `${(i + 1) * 25}%`,
              }}
            />
          ))}
        </View>

        {/* Line segments */}
        {points.slice(0, -1).map((point, idx) => {
          const nextPoint = points[idx + 1];
          const dx = nextPoint.x - point.x;
          const dy = nextPoint.y - point.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <View
              key={`line-${idx}`}
              style={{
                position: 'absolute',
                height: 3,
                backgroundColor: lineColor,
                left: point.x,
                top: point.y - 1.5,
                width: length,
                shadowColor: lineColor,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
                transformOrigin: 'left center',
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}

        {/* Data points */}
        {points.map((point, idx) => (
          <View
            key={`point-${idx}`}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: lineColor,
              left: point.x - 4,
              top: point.y - 4,
              shadowColor: lineColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 3,
            }}
          />
        ))}

        {/* Y-axis values */}
        <Text
          style={{
            position: 'absolute',
            fontSize: 10,
            color: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
            fontWeight: '600',
            right: 8,
            top: 8,
          }}
        >
          ₹{maxValue.toFixed(2)}
        </Text>
        <Text
          style={{
            position: 'absolute',
            fontSize: 10,
            color: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
            fontWeight: '600',
            right: 8,
            bottom: 32,
          }}
        >
          ₹{minValue.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: isDark ? 'rgba(25, 25, 25, 0.8)' : 'rgba(248, 248, 248, 0.9)',
          borderColor: isDark ? COLORS.darkBg : '#e0e0e0',
        },
      ]}
    >
      {renderLineChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
});
