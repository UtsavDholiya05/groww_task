import debounce from 'lodash.debounce';

export const debounceSearch = (callback, delay = 300) => {
  return debounce(callback, delay);
};

export const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `₹${isNaN(numValue) ? '0.00' : numValue.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getChartData = (navHistory) => {
  if (!navHistory || navHistory.length === 0) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const sortedData = [...navHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const step = Math.ceil(sortedData.length / 12);
  const labels = sortedData
    .filter((_, index) => index % step === 0)
    .map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

  const data = sortedData
    .filter((_, index) => index % step === 0)
    .map((item) => {
      const navValue = parseFloat(item.nav);
      return isNaN(navValue) ? 0 : navValue;
    });

  return {
    labels,
    datasets: [{ data }],
  };
};
