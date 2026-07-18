export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return amount.toLocaleString('vi-VN') + "₫";
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export const formatVnd = (amount: number): string => vndFormatter.format(amount);

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDiscountPercent = (originalPrice: number, currentPrice: number): string => {
  if (!originalPrice || originalPrice <= currentPrice) return "";
  return `-${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%`;
};
