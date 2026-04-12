import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, SPACING, SHADOWS } from '../constants';
import { ExploreScreen } from '../screens/ExploreScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ViewAllScreen } from '../screens/ViewAllScreen';
import { WatchlistDetailScreen } from '../screens/WatchlistDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ExploreStackNavigator = ({ isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
          borderBottomColor: isDark ? COLORS.darkBg : COLORS.border,
          borderBottomWidth: 1,
          height: 100,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: '600',
          color: textColor,
        },
        headerTitleContainerStyle: {
          paddingTop: 30,
        },
        headerLeftContainerStyle: {
          paddingTop: 30,
        },
        headerRightContainerStyle: {
          paddingTop: 30,
        },
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: colors },
      }}
    >
      <Stack.Screen
        name="ExploreMain"
        options={{ title: 'Explore Funds', headerShown: false }}
      >
        {(props) => <ExploreScreen {...props} isDark={isDark} />}
      </Stack.Screen>

      <Stack.Screen
        name="ProductDetails"
        options={({ route }) => ({
          title: 'Fund Details',
        })}
      >
        {(props) => <ProductDetailsScreen {...props} isDark={isDark} />}
      </Stack.Screen>

      <Stack.Screen
        name="ViewAll"
        options={({ route }) => ({
          title: route.params?.categoryName || 'View All',
        })}
      >
        {(props) => <ViewAllScreen {...props} isDark={isDark} />}
      </Stack.Screen>

      <Stack.Screen
        name="Search"
        options={{ title: 'Search Funds' }}
      >
        {(props) => <SearchScreen {...props} isDark={isDark} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const WatchlistStackNavigator = ({ isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;

  return (
    <Stack.Navigator
      initialRouteName="WatchlistMain"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
          borderBottomColor: isDark ? COLORS.darkBg : COLORS.border,
          borderBottomWidth: 1,
          height: 100,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: '600',
          color: textColor,
        },
        headerTitleContainerStyle: {
          paddingTop: 30,
        },
        headerLeftContainerStyle: {
          paddingTop: 30,
        },
        headerRightContainerStyle: {
          paddingTop: 30,
        },
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: colors },
      }}
    >
      <Stack.Screen
        name="WatchlistMain"
        options={{ title: 'My Watchlists', headerShown: false }}
      >
        {(props) => <WatchlistScreen {...props} isDark={isDark} />}
      </Stack.Screen>

      <Stack.Screen
        name="WatchlistDetail"
        options={({ route }) => ({
          title: route.params?.watchlistName || 'Watchlist',
        })}
      >
        {(props) => <WatchlistDetailScreen {...props} isDark={isDark} />}
      </Stack.Screen>

      <Stack.Screen
        name="ProductDetails"
        options={{
          title: 'Fund Details',
        }}
      >
        {(props) => <ProductDetailsScreen {...props} isDark={isDark} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export const RootNavigator = ({ isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.surfaceLight;
  const surfaceColor = isDark ? COLORS.darkSurface : COLORS.background;
  const inactiveColor = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: surfaceColor,
          borderTopColor: isDark ? COLORS.darkBorder : COLORS.border,
          borderTopWidth: 1.5,
          paddingBottom: SPACING.md,
          paddingTop: SPACING.md,
          height: 72,
          ...SHADOWS.xl,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: SPACING.xs,
          fontWeight: '600',
          marginBottom: SPACING.xs,
        },
      }}
    >
      <Tab.Screen
        name="ExploreTab"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🔍</Text>
          ),
        }}
      >
        {(props) => <ExploreStackNavigator {...props} isDark={isDark} />}
      </Tab.Screen>

      <Tab.Screen
        name="WatchlistTab"
        options={{
          tabBarLabel: 'Watchlist',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📑</Text>
          ),
        }}
      >
        {(props) => <WatchlistStackNavigator {...props} isDark={isDark} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
