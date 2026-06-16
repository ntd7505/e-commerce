export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return amount.toLocaleString('vi-VN') + "₫";
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const calculateDiscountPercent = (originalPrice: number, currentPrice: number): string => {
  if (!originalPrice || originalPrice <= currentPrice) return "";
  return `-${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%`;
};
