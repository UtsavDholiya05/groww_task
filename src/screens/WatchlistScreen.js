import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { EmptyState } from '../components/EmptyState';

export const WatchlistScreen = ({ navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { watchlists, loadWatchlists, createWatchlist, deleteWatchlist } = useAppStore();
  const [showNewInput, setShowNewInput] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('ExploreTab');
  };

  useEffect(() => {
    loadWatchlists();
  }, []);

  // Close input when navigating away from screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowNewInput(false);
        setNewWatchlistName('');
      };
    }, [])
  );

  const handleCreateWatchlist = async () => {
    if (newWatchlistName.trim()) {
      try {
        await createWatchlist(newWatchlistName);
        setNewWatchlistName('');
        setShowNewInput(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to create watchlist');
      }
    }
  };

  const handleDeleteWatchlist = (watchlistId) => {
    Alert.alert('Delete Watchlist', 'Are you sure you want to delete this watchlist?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteWatchlist(watchlistId);
        },
        style: 'destructive',
      },
    ]);
  };

  const renderWatchlistItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.watchlistCard,
        { backgroundColor: surface, borderColor: isDark ? COLORS.darkBg : COLORS.border },
      ]}
      onPress={() => {
        navigation.navigate('WatchlistDetail', { watchlistId: item.id });
      }}
    >
      <View style={styles.watchlistContent}>
        <Text style={[styles.watchlistName, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.fundCount, { color: textSecondary }]}>
          {item.funds.length} fund{item.funds.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteWatchlist(item.id)} style={styles.deleteButton}>
        <Text style={{ color: COLORS.error }}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (watchlists.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>Watchlist</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg }}>
          <EmptyState
            title="No Funds in This Watchlist"
            description="Add funds from the Explore screen"
            isDark={isDark}
            containerStyle={{ flex: 0 }}
          />
          
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: COLORS.primary, width: '80%', marginTop: SPACING.lg }]}
            onPress={() => navigation.navigate('ExploreTab')}
          >
            <Text style={styles.createButtonText}>Explore Funds</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors }]}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Watchlist</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: COLORS.primary }]}
          onPress={() => setShowNewInput(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {showNewInput && (
        <View style={[styles.inputContainer, { backgroundColor: surface }]}>
          <TextInput
            style={[
              styles.newWatchlistInput,
              { color: textColor, borderColor: isDark ? COLORS.darkBg : COLORS.border },
            ]}
            placeholder="Enter watchlist name"
            placeholderTextColor={textSecondary}
            value={newWatchlistName}
            onChangeText={setNewWatchlistName}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.createSmallButton, { backgroundColor: COLORS.primary }]}
            onPress={handleCreateWatchlist}
          >
            <Text style={styles.createSmallButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  backIcon: {
    fontSize: 18,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: -0.3,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  watchlistCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.md,
  },
  watchlistContent: {
    flex: 1,
  },
  watchlistName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  fundCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  createButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: 0,
    ...SHADOWS.md,
  },
  createButtonText: {
    color: 'white',
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newWatchlistInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.base,
  },
  createSmallButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    ...SHADOWS.sm,
  },
  createSmallButtonText: {
    color: 'white',
    fontWeight: TYPOGRAPHY.weights.semibold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
