import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from './src/store/appStore';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/constants';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { theme, loadWatchlists, loadExploreCategories } = useAppStore();
  const [isReady, setIsReady] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      await loadWatchlists();
      await loadExploreCategories();
    } catch (e) {
      console.error('Error bootstrapping app:', e);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? COLORS.darkBg : COLORS.background}
        translucent={false}
      />
      <NavigationContainer>
        <RootNavigator isDark={isDark} />
      </NavigationContainer>
    </>
  );
}
