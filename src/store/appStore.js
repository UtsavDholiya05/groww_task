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
    console.log('\n📱 ===== LOADING EXPLORE CATEGORIES =====');
    
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
        console.log(`\n📂 Loading category: ${category.name} (query: "${category.query}")`);
        
        let funds = [];
        const cached = await storageService.getCachedData(
          `explore_${category.id}`
        );
        
        // Use cache only if it has valid NAV data
        if (cached && cached.length > 0 && cached[0].nav && cached[0].nav > 0) {
          console.log(`  ✅ Using cached data: ${cached.length} funds with NAV`);
          if (cached.length > 0) {
            console.log(`     First fund: ${cached[0].schemeName} - NAV: ₹${cached[0].nav}`);
          }
          funds = cached;
        } else {
          // Fetch fresh if cache is empty or doesn't have NAV
          if (cached) {
            console.log(`  ⚠️  Cache exists but has no NAV data, fetching fresh...`);
          } else {
            console.log(`  🔄 No cache, fetching fresh data from API...`);
          }
          
          funds = await fundAPI.getFundsForCategory(category.query, 4);
          console.log(`  📥 Received ${funds.length} funds from API`);
          if (funds.length > 0) {
            console.log(`     First fund: ${funds[0].schemeName} - NAV: ₹${funds[0].nav || 'N/A'}`);
          }
          
          // Only cache if we got valid data with NAV
          if (funds.length > 0 && funds[0].nav) {
            await storageService.cacheData(`explore_${category.id}`, funds, 120);
            console.log(`  💾 Cached for 120 seconds`);
          } else {
            console.log(`  ⚠️  Data has no NAV, not caching`);
          }
        }
        
        categories.push({
          id: category.id,
          name: category.name,
          query: category.query,
          funds,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error(`  ❌ Error loading ${category.name}:`, error.message);
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
    
    console.log('\n✨ EXPLORE CATEGORIES LOADED');
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
      
      // Fetch full details (with NAV) for first 10 results
      const resultsWithNav = await Promise.all(
        results.slice(0, 10).map(async (fund) => {
          try {
            const details = await fundAPI.getFundDetails(fund.schemeCode);
            return details;
          } catch (err) {
            console.error(`Failed to get details for ${fund.schemeCode}:`, err.message);
            return { ...fund, nav: 0 };
          }
        })
      );
      
      // For remaining results, keep basic info
      const remainingResults = results.slice(10);
      
      set({ searchResults: [...resultsWithNav, ...remainingResults], searchLoading: false });
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
