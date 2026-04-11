import { create } from 'zustand';
import { fundAPI } from '../services/api';
import { storageService } from '../services/storage';
import { CATEGORIES } from '../constants';

export const useAppStore = create((set, get) => ({
  theme: 'light',
  setTheme: async (theme) => {
    await storageService.saveTheme(theme);
    set({ theme });
  },

  exploreCategories: [],
  loadExploreCategories: async () => {
    set({
      exploreCategories: CATEGORIES.map((cat) => ({
        id: cat.id,
        name: cat.name,
        query: cat.query,
        funds: [],
        loading: true,
        error: null,
      })),
    });

    const categories = [];
    for (const category of CATEGORIES) {
      try {
        const cached = await storageService.getCachedData(
          `explore_${category.id}`
        );
        if (cached) {
          categories.push({
            id: category.id,
            name: category.name,
            query: category.query,
            funds: cached,
            loading: false,
            error: null,
          });
        } else {
          const funds = await fundAPI.getFundsForCategory(category.query, 4);
          await storageService.cacheData(`explore_${category.id}`, funds, 120);
          categories.push({
            id: category.id,
            name: category.name,
            query: category.query,
            funds,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        categories.push({
          id: category.id,
          name: category.name,
          query: category.query,
          funds: [],
          loading: false,
          error: error.message || 'Failed to load category',
        });
      }
    }
    set({ exploreCategories: categories });
  },

  watchlists: [],
  loadWatchlists: async () => {
    const watchlists = await storageService.getWatchlists();
    set({ watchlists });
  },

  createWatchlist: async (name) => {
    const watchlist = await storageService.createWatchlist(name);
    set((state) => ({
      watchlists: [...state.watchlists, watchlist],
    }));
  },

  deleteWatchlist: async (id) => {
    await storageService.deleteWatchlist(id);
    set((state) => ({
      watchlists: state.watchlists.filter((w) => w.id !== id),
    }));
  },

  addFundToWatchlist: async (watchlistId, schemeCode) => {
    await storageService.addFundToWatchlist(watchlistId, schemeCode);
    set((state) => ({
      watchlists: state.watchlists.map((w) =>
        w.id === watchlistId && !w.funds.includes(schemeCode)
          ? { ...w, funds: [...w.funds, schemeCode] }
          : w
      ),
    }));
  },

  removeFundFromWatchlist: async (watchlistId, schemeCode) => {
    await storageService.removeFundFromWatchlist(watchlistId, schemeCode);
    set((state) => ({
      watchlists: state.watchlists.map((w) =>
        w.id === watchlistId
          ? { ...w, funds: w.funds.filter((f) => f !== schemeCode) }
          : w
      ),
    }));
  },

  addFundToMultipleWatchlists: async (schemeCode, watchlistIds) => {
    await storageService.addFundToMultipleWatchlists(schemeCode, watchlistIds);
    set((state) => ({
      watchlists: state.watchlists.map((w) =>
        watchlistIds.includes(w.id) && !w.funds.includes(schemeCode)
          ? { ...w, funds: [...w.funds, schemeCode] }
          : w
      ),
    }));
  },

  searchResults: [],
  searchLoading: false,
  searchError: null,
  search: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchError: null });
      return;
    }
    set({ searchLoading: true, searchError: null });
    try {
      const results = await fundAPI.searchFunds(query);
      set({ searchResults: results, searchLoading: false });
    } catch (error) {
      set({ searchError: error.message || 'Search failed', searchLoading: false });
    }
  },

  selectedFund: null,
  fundLoading: false,
  fundError: null,
  loadFundDetails: async (schemeCode) => {
    set({ fundLoading: true, fundError: null });
    try {
      const fund = await fundAPI.getFundDetails(schemeCode);
      set({ selectedFund: fund, fundLoading: false });
    } catch (error) {
      set({
        fundError: error.message || 'Failed to load fund details',
        fundLoading: false,
      });
    }
  },

  isFundInAnyWatchlist: async (schemeCode) => {
    return await storageService.isFundInAnyWatchlist(schemeCode);
  },

  getFundWatchlists: async (schemeCode) => {
    return await storageService.getFundWatchlists(schemeCode);
  },
}));
