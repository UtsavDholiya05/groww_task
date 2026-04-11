import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper function to fetch fund details
const fetchFundDetailsAsync = async (schemeCode) => {
  try {
    const response = await apiClient.get(`/mf/${schemeCode}`);
    const data = response.data;
    const meta = data.meta || {};
    
    const navHistory = (data.nav || [])
      .map((item) => ({
        date: item.date,
        nav: typeof item.nav === 'string' ? parseFloat(item.nav) : item.nav,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const latestNav = navHistory[navHistory.length - 1];
    return {
      nav: latestNav?.nav || 0,
      date: latestNav?.date || new Date().toISOString().split('T')[0],
    };
  } catch {
    return null;
  }
};

export const fundAPI = {
  searchFunds: async (query) => {
    try {
      const response = await apiClient.get(`/mf/search?q=${encodeURIComponent(query)}`);
      const funds = response.data || [];
      
      return funds.map((fund) => ({
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        schemeType: fund.schemeType || 'Growth',
        amcCode: fund.amcCode,
        amcName: fund.amcName,
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  getFundDetails: async (schemeCode) => {
    try {
      const response = await apiClient.get(`/mf/${schemeCode}`);
      const data = response.data;
      const meta = data.meta || {};
      
      // Parse NAV history
      const navHistory = (data.nav || [])
        .map((item) => ({
          date: item.date,
          nav: typeof item.nav === 'string' ? parseFloat(item.nav) : item.nav,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const latestNav = navHistory[navHistory.length - 1];
      const previousNav = navHistory[navHistory.length - 2];
      
      // Calculate change percentage
      let changePercent = 0;
      if (latestNav && previousNav) {
        changePercent = ((latestNav.nav - previousNav.nav) / previousNav.nav) * 100;
      }

      return {
        schemeName: meta.schemeName || '',
        schemeCode: meta.schemeCode || schemeCode,
        amcName: meta.amcName || '',
        schemeType: meta.schemeType || 'Growth',
        nav: latestNav?.nav || 0,
        date: latestNav?.date || new Date().toISOString().split('T')[0],
        navHistory: navHistory.slice(-365),
        changePercent: parseFloat(changePercent.toFixed(2)),
        riskLevel: meta.riskLevel || 'Moderate',
        expenseRatio: meta.expenseRatio || 0,
        objective: meta.scheme_narrative || '',
      };
    } catch (error) {
      console.error('Fund details error:', error);
      throw error;
    }
  },

  getFundsForCategory: async (query, limit = 4) => {
    try {
      const funds = await fundAPI.searchFunds(query);
      
      // Fetch NAV for first few funds in background
      const fundsWithNav = await Promise.all(
        funds.slice(0, limit).map(async (fund) => {
          const navData = await fetchFundDetailsAsync(fund.schemeCode);
          return { ...fund, ...(navData || {}) };
        })
      );
      
      return fundsWithNav;
    } catch (error) {
      console.error('Category funds error:', error);
      throw error;
    }
  },

  getAllFundsForCategory: async (query, limit = 100) => {
    try {
      const funds = await fundAPI.searchFunds(query);
      return funds.slice(0, limit);
    } catch (error) {
      console.error('All category funds error:', error);
      throw error;
    }
  },
};
