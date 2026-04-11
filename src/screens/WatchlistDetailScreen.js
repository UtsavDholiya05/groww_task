import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { COLORS } from '../constants';
import { fundAPI } from '../services/api';
import { EmptyState } from '../components/EmptyState';

export const WatchlistDetailScreen = ({ route, navigation, isDark = false }) => {
  const colors = isDark ? COLORS.darkBg : COLORS.background;
  const surface = isDark ? COLORS.darkSurface : COLORS.surface;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const { watchlistId } = route.params;
  const { watchlists, removeFundFromWatchlist, updateWatchlist } = useAppStore();

  const watchlist = watchlists.find((w) => w.id === watchlistId);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(watchlist?.name || '');

  useEffect(() => {
    loadWatchlistFunds();
  }, [watchlist?.funds]);

  const loadWatchlistFunds = async () => {
    if (!watchlist) return;
    setLoading(true);
    try {
      const fundPromises = watchlist.funds.map((schemeCode) =>
        fundAPI.getFundDetails(schemeCode).catch(() => null)
      );
      const fundDetails = await Promise.all(fundPromises);
      setFunds(fundDetails.filter((f) => f !== null));
    } catch (error) {
      console.error('Error loading watchlist funds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFund = (schemeCode) => {
    Alert.alert('Remove Fund', 'Are you sure you want to remove this fund?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Remove',
        onPress: async () => {
          await removeFundFromWatchlist(watchlistId, schemeCode);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSaveName = async () => {
    if (newName.trim() && newName !== watchlist?.name) {
      await updateWatchlist(watchlistId, newName);
    }
    setEditingName(false);
  };

  if (!watchlist) {
    return (
      <View style={[styles.container, { backgroundColor: colors }]}>
        <EmptyState title="Watchlist Not Found" description="This watchlist no longer exists" isDark={isDark} />
      </View>
    );
  }

  const renderFundItem = ({ item }) => (
    <View style={[styles.fundItem, { backgroundColor: surface, borderColor: isDark ? COLORS.darkBg : COLORS.border }]}>
      <TouchableOpacity
        style={styles.fundContent}
        onPress={() => {
          navigation.navigate('ProductDetails', { schemeCode: item.schemeCode });
        }}
      >
        <Text style={[styles.fundName, { color: textColor }]} numberOfLines={2}>
          {item.schemeName}
        </Text>
        <Text style={[styles.navValue, { color: COLORS.primary }]}>₹{item.nav ? (typeof item.nav === 'string' ? parseFloat(item.nav).toFixed(2) : item.nav.toFixed(2)) : 'N/A'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRemoveFund(item.schemeCode)} style={styles.removeButton}>
        <Text style={{ color: COLORS.error }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors }, { paddingTop: 10 }]}>
      <View style={styles.header}>
        {editingName ? (
          <View style={styles.editingContainer}>
            <TextInput
              style={[
                styles.editInput,
                { color: textColor, borderColor: COLORS.primary },
              ]}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TouchableOpacity
              onPress={handleSaveName}
              style={[styles.saveButton, { backgroundColor: COLORS.primary }]}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditingName(true)}>
            <Text style={[styles.title, { color: textColor }]}>{watchlist.name}</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: textSecondary }}>Loading...</Text>
        </View>
      ) : funds.length === 0 ? (
        <EmptyState
          title="No Funds in This Watchlist"
          description="Add funds from the Explore screen"
          isDark={isDark}
        />
      ) : (
        <FlatList
          data={funds}
          renderItem={renderFundItem}
          keyExtractor={(item) => item.schemeCode}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fundItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fundContent: {
    flex: 1,
    marginRight: 12,
  },
  fundName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  navValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
