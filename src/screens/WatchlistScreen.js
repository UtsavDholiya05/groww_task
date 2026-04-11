import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import { COLORS } from '../constants';
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
      <View style={[styles.container, { backgroundColor: colors, paddingTop: 16 }]}>
        <EmptyState
          title="My Portfolio"
          description="No watchlists yet. Start by creating one!"
          isDark={isDark}
        />
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: COLORS.primary }]}
          onPress={() => setShowNewInput(true)}
        >
          <Text style={styles.createButtonText}>+ Create Watchlist</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors, paddingTop: 16 }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  watchlistCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  watchlistContent: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fundCount: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  createButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newWatchlistInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  createSmallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createSmallButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});
