import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@groww_watchlists';
const CACHE_KEY = '@groww_cache_';
const THEME_KEY = '@groww_theme';

export const storageService = {
  getWatchlists: async () => {
    try {
      const data = await AsyncStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get watchlists error:', error);
      return [];
    }
  },

  saveWatchlists: async (watchlists) => {
    try {
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlists));
    } catch (error) {
      console.error('Save watchlists error:', error);
    }
  },

  createWatchlist: async (name) => {
    const watchlist = {
      id: Date.now().toString(),
      name,
      funds: [],
      createdAt: new Date().toISOString(),
    };
    const watchlists = await storageService.getWatchlists();
    watchlists.push(watchlist);
    await storageService.saveWatchlists(watchlists);
    return watchlist;
  },

  addFundToWatchlist: async (watchlistId, schemeCode) => {
    const watchlists = await storageService.getWatchlists();
    const watchlist = watchlists.find((w) => w.id === watchlistId);
    if (watchlist && !watchlist.funds.includes(schemeCode)) {
      watchlist.funds.push(schemeCode);
      await storageService.saveWatchlists(watchlists);
    }
  },

  removeFundFromWatchlist: async (watchlistId, schemeCode) => {
    const watchlists = await storageService.getWatchlists();
    const watchlist = watchlists.find((w) => w.id === watchlistId);
    if (watchlist) {
      watchlist.funds = watchlist.funds.filter((f) => f !== schemeCode);
      await storageService.saveWatchlists(watchlists);
    }
  },

  addFundToMultipleWatchlists: async (schemeCode, watchlistIds) => {
    const watchlists = await storageService.getWatchlists();
    watchlistIds.forEach((id) => {
      const watchlist = watchlists.find((w) => w.id === id);
      if (watchlist && !watchlist.funds.includes(schemeCode)) {
        watchlist.funds.push(schemeCode);
      }
    });
    await storageService.saveWatchlists(watchlists);
  },

  deleteWatchlist: async (watchlistId) => {
    const watchlists = await storageService.getWatchlists();
    const filtered = watchlists.filter((w) => w.id !== watchlistId);
    await storageService.saveWatchlists(filtered);
  },

  isFundInAnyWatchlist: async (schemeCode) => {
    const watchlists = await storageService.getWatchlists();
    return watchlists.some((w) => w.funds.includes(schemeCode));
  },

  getFundWatchlists: async (schemeCode) => {
    const watchlists = await storageService.getWatchlists();
    return watchlists
      .filter((w) => w.funds.includes(schemeCode))
      .map((w) => w.id);
  },

  cacheData: async (key, data, ttlMinutes = 60) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000,
      };
      await AsyncStorage.setItem(
        `${CACHE_KEY}${key}`,
        JSON.stringify(cacheEntry)
      );
    } catch (error) {
      console.error('Cache data error:', error);
    }
  },

  getCachedData: async (key) => {
    try {
      const data = await AsyncStorage.getItem(`${CACHE_KEY}${key}`);
      if (!data) return null;
      const cacheEntry = JSON.parse(data);
      const now = Date.now();
      if (now - cacheEntry.timestamp > cacheEntry.ttl) {
        await AsyncStorage.removeItem(`${CACHE_KEY}${key}`);
        return null;
      }
      return cacheEntry.data;
    } catch (error) {
      console.error('Get cached data error:', error);
      return null;
    }
  },

  saveTheme: async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Save theme error:', error);
    }
  },

  getTheme: async () => {
    try {
      const theme = await AsyncStorage.getItem(THEME_KEY);
      return theme || 'light';
    } catch (error) {
      console.error('Get theme error:', error);
      return 'light';
    }
  },
};
