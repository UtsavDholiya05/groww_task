import axios from 'axios';
import { API_BASE_URL } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fundAPI = {
  searchFunds: async (query) => {
    try {
      const response = await apiClient.get(`/mf/search?q=${query}`);
      return response.data || [];
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
      const navHistory = (data.nav || [])
        .map((item) => ({
          date: item.date,
          nav: parseFloat(item.nav),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const latestNav = navHistory[navHistory.length - 1];

      return {
        schemeName: meta.schemeName || data.schemeName || '',
        schemeCode: meta.schemeCode || data.schemeCode || schemeCode,
        amcName: meta.amcName || data.amcName || '',
        schemeType: meta.schemeType || data.schemeType || 'Growth',
        nav: latestNav?.nav || 0,
        date: latestNav?.date || new Date().toISOString().split('T')[0],
        navHistory: navHistory.slice(-365),
        riskLevel: meta.riskLevel || 'Moderate',
        expenseRatio: meta.expenseRatio || 0,
      };
    } catch (error) {
      console.error('Fund details error:', error);
      throw error;
    }
  },

  getFundsForCategory: async (query, limit = 4) => {
    try {
      const funds = await fundAPI.searchFunds(query);
      return funds.slice(0, limit);
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
