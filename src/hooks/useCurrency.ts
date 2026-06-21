import { useStore, currencies } from '../store/useStore';

export function useCurrency() {
  const currency = useStore((s) => s.currency);
  const currencyInfo = currencies.find((c) => c.code === currency) || currencies[0];

  const formatPrice = (priceUSD: number): string => {
    const converted = priceUSD * currencyInfo.rate;
    if (currency === 'SAR') {
      return `${converted.toFixed(2)} ${currencyInfo.symbol}`;
    }
    return `${currencyInfo.symbol}${converted.toFixed(2)}`;
  };

  return { formatPrice, currency, currencyInfo };
}
