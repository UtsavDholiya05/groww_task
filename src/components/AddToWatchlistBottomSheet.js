import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants';

export const AddToWatchlistBottomSheet = ({
  visible,
  watchlists,
  selectedWatchlistIds,
  onClose,
  onAddToExisting,
  onCreateNew,
  isDark = false,
}) => {
  const colors = isDark ? COLORS.darkSurface : COLORS.surface;
  const bg = isDark ? COLORS.darkBg : COLORS.background;
  const textColor = isDark ? COLORS.darkText : COLORS.text;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedWatchlistIds);

  const handleToggleWatchlist = (id) => {
    setLocalSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToExisting = () => {
    onAddToExisting(localSelectedIds);
    onClose();
  };

  const handleCreateAndAdd = () => {
    if (newWatchlistName.trim()) {
      onCreateNew(newWatchlistName);
      setNewWatchlistName('');
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        >
          <View style={[styles.bottomSheet, { backgroundColor: colors }]}>
          <View style={[styles.header, { backgroundColor: bg }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>Add to Watchlist</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeBtn, { color: COLORS.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {watchlists.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Add to Existing</Text>
                {watchlists.map((watchlist) => (
                  <TouchableOpacity
                    key={watchlist.id}
                    style={[
                      styles.watchlistItem,
                      {
                        backgroundColor: bg,
                        borderColor: COLORS.border,
                        borderWidth: localSelectedIds.includes(watchlist.id) ? 2 : 1,
                      },
                    ]}
                    onPress={() => handleToggleWatchlist(watchlist.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: localSelectedIds.includes(watchlist.id)
                            ? COLORS.primary
                            : 'transparent',
                          borderColor: COLORS.primary,
                        },
                      ]}
                    >
                      {localSelectedIds.includes(watchlist.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <View style={styles.watchlistInfo}>
                      <Text style={[styles.watchlistName, { color: textColor }]}>
                        {watchlist.name}
                      </Text>
                      <Text style={[styles.fundCount, { color: textSecondary }]}>
                        {watchlist.funds.length} fund{watchlist.funds.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Create New</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: bg, color: textColor, borderColor: COLORS.border },
                ]}
                placeholder="Watchlist name"
                placeholderTextColor={textSecondary}
                value={newWatchlistName}
                onChangeText={setNewWatchlistName}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.buttonSecondary, { borderColor: COLORS.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: COLORS.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                {
                  backgroundColor: COLORS.primary,
                  opacity: localSelectedIds.length > 0 || newWatchlistName.trim() ? 1 : 0.5,
                },
              ]}
              onPress={() => {
                if (localSelectedIds.length > 0) {
                  handleAddToExisting();
                } else if (newWatchlistName.trim()) {
                  handleCreateAndAdd();
                }
              }}
              disabled={localSelectedIds.length === 0 && !newWatchlistName.trim()}
            >
              <Text style={styles.buttonTextWhite}>Add</Text>
            </TouchableOpacity>
          </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    maxHeight: Dimensions.get('window').height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    fontSize: 24,
    padding: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fundCount: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});
