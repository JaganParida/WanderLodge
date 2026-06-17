// Base currency in database is INR
const EXCHANGE_RATES = {
  'INR': 1,
  'USD': 0.012, // 1 INR = 0.012 USD
  'EUR': 0.011,
  'GBP': 0.0095,
  'AUD': 0.018,
  'CAD': 0.016,
  'JPY': 1.8,
  'CNY': 0.086
};

/**
 * Formats a price (assumed to be in INR) into the selected currency.
 * @param {number} priceInINR - The price from the database in INR.
 * @param {string} currencyString - The currency string (e.g. "USD - $", "INR - ₹").
 * @returns {string} - Formatted price string.
 */
export const formatCurrency = (priceInINR, currencyString) => {
  if (priceInINR === null || priceInINR === undefined || isNaN(priceInINR)) return '';
  
  const code = currencyString ? currencyString.split(' ')[0] : 'INR';
  const rate = EXCHANGE_RATES[code] || 1;
  const convertedPrice = priceInINR * rate;
  
  return new Intl.NumberFormat(code === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0
  }).format(convertedPrice);
};
