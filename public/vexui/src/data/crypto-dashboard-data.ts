export type CryptoRange = "24h" | "7d" | "30d";

// Illustrative prices and balances for this template, not a live market feed.
export const CRYPTO_ASSETS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    mark: "₿",
    price: 67482.5,
    change: 2.84,
    holding: 0.42,
    entry: 59200,
    volume: 24800,
    marketCap: 1330000,
    color: "--warning",
    tone: "bg-warning/15 text-warning",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    mark: "Ξ",
    price: 3524.8,
    change: 1.62,
    holding: 4.8,
    entry: 2880,
    volume: 12600,
    marketCap: 423000,
    color: "--primary",
    tone: "bg-primary/10 text-primary",
  },
  {
    symbol: "SOL",
    name: "Solana",
    mark: "◎",
    price: 172.64,
    change: 5.21,
    holding: 36,
    entry: 148,
    volume: 2840,
    marketCap: 78200,
    color: "--chart-2",
    tone: "bg-info/15 text-info",
  },
  {
    symbol: "BNB",
    name: "BNB",
    mark: "◇",
    price: 586.32,
    change: -0.74,
    holding: 8.5,
    entry: 615,
    volume: 1420,
    marketCap: 86500,
    color: "--chart-4",
    tone: "bg-warning/15 text-warning",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    mark: "▲",
    price: 38.46,
    change: -1.36,
    holding: 42,
    entry: 34.8,
    volume: 468,
    marketCap: 14800,
    color: "--chart-5",
    tone: "bg-destructive/10 text-destructive",
  },
] as const;

export type CryptoAsset = (typeof CRYPTO_ASSETS)[number];

export const CRYPTO_CASH = 3240;
export const CRYPTO_TRANSACTIONS = [
  {
    id: "TX-1058",
    type: "Buy",
    symbol: "BTC",
    quantity: 0.025,
    amount: 1687.06,
    time: "Oct 9, 14:32",
    status: "Completed",
  },
  {
    id: "TX-1057",
    type: "Deposit",
    symbol: "USD",
    quantity: 1500,
    amount: 1500,
    time: "Oct 9, 12:48",
    status: "Completed",
  },
  {
    id: "TX-1056",
    type: "Sell",
    symbol: "SOL",
    quantity: 4,
    amount: 690.56,
    time: "Oct 9, 11:15",
    status: "Completed",
  },
  {
    id: "TX-1055",
    type: "Buy",
    symbol: "ETH",
    quantity: 0.5,
    amount: 1762.4,
    time: "Oct 8, 16:20",
    status: "Completed",
  },
  {
    id: "TX-1054",
    type: "Deposit",
    symbol: "ETH",
    quantity: 0.25,
    amount: 881.2,
    time: "Oct 8, 10:42",
    status: "Pending",
  },
] as const;

export function cryptoMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function cryptoCompact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function getCryptoHistory(asset: CryptoAsset, range: CryptoRange) {
  const count = range === "24h" ? 24 : range === "7d" ? 14 : 30;
  const span = range === "24h" ? 24 * 3600000 : range === "7d" ? 7 * 86400000 : 30 * 86400000;
  const end = Date.UTC(2026, 9, 9, 12);
  const growth = (asset.change / 100) * (range === "24h" ? 1 : range === "7d" ? 2.4 : 4.8);
  const opening = asset.price / (1 + growth);
  const prices = Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const wave = Math.sin(index * 1.3) * Math.sin(progress * Math.PI) * asset.price * 0.007;
    return {
      x: Math.round(end - span * (1 - progress)),
      y: Number((opening + (asset.price - opening) * progress + wave).toFixed(2)),
    };
  });
  const volumeWeights = prices.map((_, index) => 0.7 + (index % 5) * 0.16);
  const weightTotal = volumeWeights.reduce((sum, weight) => sum + weight, 0);
  const totalVolume = asset.volume * (range === "24h" ? 1 : range === "7d" ? 7 : 30);
  const volume = prices.map((point, index) => ({
    x: point.x,
    y: Math.floor((totalVolume * (volumeWeights[index] ?? 0)) / weightTotal),
  }));
  const lastVolume = volume[count - 1];
  if (lastVolume) lastVolume.y += totalVolume - volume.reduce((sum, point) => sum + point.y, 0);
  return { prices, volume, change: growth * 100 };
}
