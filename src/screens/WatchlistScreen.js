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
  SafeAreaView,
} from 'react-native';
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
        <EmptyState
          title="My Portfolio"
          description="No watchlists yet. Start by creating one!"
          isDark={isDark}
        />
        
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

        {!showNewInput && (
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: COLORS.primary }]}
            onPress={() => setShowNewInput(true)}
          >
            <Text style={styles.createButtonText}>+ Create Watchlist</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Portfolio</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: -0.5,
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
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
