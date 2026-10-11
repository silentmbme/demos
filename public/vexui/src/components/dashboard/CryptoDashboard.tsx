import { useState, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  Bitcoin,
  CircleDollarSign,
  Download,
  Globe2,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CRYPTO_ASSETS,
  CRYPTO_CASH,
  CRYPTO_TRANSACTIONS,
  cryptoCompact,
  cryptoMoney,
  getCryptoHistory,
  type CryptoAsset,
  type CryptoRange,
} from "@/data/crypto-dashboard-data";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";

function Coin({ asset, small = false }: { asset: CryptoAsset; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${small ? "size-8 text-lg" : "size-11 text-2xl"} ${asset.tone}`}
    >
      {asset.mark}
    </span>
  );
}

function Change({ value }: { value: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${value >= 0 ? "text-success" : "text-destructive"}`}
    >
      {value >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
      {value > 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function Stat({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  note: ReactNode;
}) {
  return (
    <section className="vexui-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[27px] font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-3 text-xs text-muted-foreground">{note}</div>
    </section>
  );
}

export function CryptoDashboard() {
  const [symbol, setSymbol] = useState("BTC");
  const [range, setRange] = useState<CryptoRange>("7d");
  const [query, setQuery] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>(["BTC", "ETH", "SOL"]);
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [exchangeSymbol, setExchangeSymbol] = useState("BTC");
  const [amount, setAmount] = useState("1000");
  const [reverse, setReverse] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { base } = useChartTheme();
  const asset = CRYPTO_ASSETS.find((item) => item.symbol === symbol) ?? CRYPTO_ASSETS[0];
  const exchangeAsset =
    CRYPTO_ASSETS.find((item) => item.symbol === exchangeSymbol) ?? CRYPTO_ASSETS[0];
  const history = getCryptoHistory(asset, range);
  const holdings = CRYPTO_ASSETS.reduce((sum, item) => sum + item.price * item.holding, 0);
  const invested = CRYPTO_ASSETS.reduce((sum, item) => sum + item.entry * item.holding, 0);
  const profit = holdings - invested;
  const dayProfit = CRYPTO_ASSETS.reduce(
    (sum, item) => sum + item.holding * (item.price - item.price / (1 + item.change / 100)),
    0,
  );
  const visibleAssets = CRYPTO_ASSETS.filter(
    (item) =>
      (!onlyWatchlist || watchlist.includes(item.symbol)) &&
      `${item.name} ${item.symbol}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const transactions = CRYPTO_TRANSACTIONS.filter(
    (item) => transactionType === "all" || item.type === transactionType,
  );
  const entered = Number(amount);
  const validAmount = amount.trim() !== "" && Number.isFinite(entered) && entered > 0;
  const converted = validAmount
    ? reverse
      ? entered * exchangeAsset.price
      : entered / exchangeAsset.price
    : 0;
  const output = reverse ? cryptoMoney(converted) : `${converted.toFixed(6)} ${exchangeSymbol}`;
  const priceOptions = mergeOptions(base, {
    chart: { type: "area" },
    colors: [token("--primary")],
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.02 } },
    xaxis: {
      type: "datetime",
      tickAmount: 5,
      labels: { datetimeUTC: true, format: range === "24h" ? "HH:mm" : "MMM dd" },
    },
    yaxis: {
      min: Math.min(...history.prices.map((point) => point.y)) * 0.992,
      max: Math.max(...history.prices.map((point) => point.y)) * 1.008,
      labels: { formatter: (value: number) => "$" + cryptoCompact(value) },
    },
    tooltip: { x: { format: "MMM dd, HH:mm" }, y: { formatter: cryptoMoney } },
  });
  const volumeOptions = mergeOptions(base, {
    colors: [token("--chart-2")],
    stroke: { width: 0 },
    plotOptions: { bar: { columnWidth: "45%", borderRadius: 3 } },
    xaxis: {
      type: "datetime",
      tickAmount: 5,
      labels: { datetimeUTC: true, format: range === "24h" ? "HH:mm" : "MMM dd" },
    },
    yaxis: { labels: { formatter: (value: number) => "$" + cryptoCompact(value) + "M" } },
    tooltip: {
      x: { format: "MMM dd, HH:mm" },
      y: { formatter: (value: number) => cryptoMoney(value * 1000000) },
    },
  });
  const allocationOptions = mergeOptions(base, {
    labels: CRYPTO_ASSETS.map((item) => item.symbol),
    colors: CRYPTO_ASSETS.map((item) => token(item.color)),
    legend: { show: false },
    stroke: { width: 4, colors: [token("--card")] },
    plotOptions: {
      pie: {
        donut: {
          size: "78%",
          labels: {
            show: true,
            value: { formatter: (value: string) => cryptoMoney(Number(value)) },
            total: {
              show: true,
              showAlways: true,
              label: "Total assets",
              formatter: () => cryptoMoney(holdings),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: cryptoMoney } },
  });
  function toggleWatchlist(value: string) {
    setWatchlist((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }
  function exportPortfolio() {
    const rows = [
      ["Asset", "Quantity", "Price (USD)", "Value (USD)", "Unrealized P/L (USD)"],
      ...CRYPTO_ASSETS.map((item) => [
        item.symbol,
        item.holding,
        item.price,
        (item.price * item.holding).toFixed(2),
        ((item.price - item.entry) * item.holding).toFixed(2),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "crypto-portfolio.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <PageHeader
        title="Crypto Dashboard"
        subtitle="Your portfolio, market movements, and digital assets in one place."
        breadcrumb={["Dashboards", "Crypto"]}
        actions={
          <>
            <Badge tone="primary">Sample market data</Badge>
            <Button variant="outline" onClick={exportPortfolio}>
              <Download className="size-4" />
              Export portfolio
            </Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Portfolio balance"
          value={cryptoMoney(holdings + CRYPTO_CASH)}
          icon={<Wallet className="size-5" />}
          note={
            <span className="flex flex-wrap items-center gap-2">
              <Change value={(dayProfit / (holdings + CRYPTO_CASH - dayProfit)) * 100} />
              <span>{cryptoMoney(dayProfit)} today</span>
            </span>
          }
        />
        <Stat
          label="Unrealized profit"
          value={cryptoMoney(profit)}
          icon={<TrendingUp className="size-5" />}
          note={
            <span className="flex items-center gap-2">
              <Change value={(profit / invested) * 100} />
              <span>vs. purchase cost</span>
            </span>
          }
        />
        <Stat
          label="Available cash"
          value={cryptoMoney(CRYPTO_CASH)}
          icon={<CircleDollarSign className="size-5" />}
          note="USD balance in your sample wallet"
        />
        <Stat
          label="Assets held"
          value={String(CRYPTO_ASSETS.length)}
          icon={<Layers3 className="size-5" />}
          note={
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              Diversified across five assets
            </span>
          }
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CRYPTO_ASSETS.slice(0, 4).map((item) => (
          <button
            type="button"
            key={item.symbol}
            aria-pressed={symbol === item.symbol}
            onClick={() => setSymbol(item.symbol)}
            className={`vexui-card p-4 text-start transition-colors hover:border-primary/50 ${symbol === item.symbol ? "border-primary/50 bg-primary/5" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Coin asset={item} small />
              <div>
                <p className="text-[13px] font-semibold">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.symbol} / USD</p>
              </div>
              <span className="ms-auto">
                <Change value={item.change} />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-xl font-semibold tabular-nums">{cryptoMoney(item.price)}</p>
              <svg viewBox="0 0 100 32" className="h-8 w-20" aria-hidden>
                <polyline
                  points={
                    item.change >= 0
                      ? "0,26 10,22 20,25 30,14 40,18 50,12 60,17 70,7 80,10 90,4 100,6"
                      : "0,5 10,8 20,4 30,12 40,9 50,18 60,14 70,25 80,22 90,29 100,26"
                  }
                  fill="none"
                  stroke={`var(${item.change >= 0 ? "--success" : "--destructive"})`}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Market overview"
          description="Illustrative prices ending October 9, 2026"
          className="xl:col-span-2"
          bodyClassName="px-3 pb-3 pt-5"
          action={
            <div className="flex flex-wrap gap-2">
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger aria-label="Chart asset" className="h-8 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_ASSETS.map((item) => (
                    <SelectItem key={item.symbol} value={item.symbol}>
                      {item.symbol} / USD
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                {(["24h", "7d", "30d"] as const).map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={range === value}
                    onClick={() => setRange(value)}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${range === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap items-center gap-3 px-3">
            <Coin asset={asset} />
            <div>
              <p className="text-xs text-muted-foreground">{asset.name} / USD</p>
              <p className="mt-0.5 text-2xl font-semibold">{cryptoMoney(asset.price)}</p>
            </div>
            <div className="ms-auto text-end">
              <Change value={history.change} />
              <p className="mt-1 text-[11px] text-muted-foreground">over {range}</p>
            </div>
          </div>
          <ApexChart
            type="area"
            height={265}
            options={priceOptions}
            series={[{ name: asset.symbol, data: history.prices }]}
          />
          <div className="mx-3 mt-2 flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">Trading volume</span>
            <span className="font-medium">{asset.symbol} / USD</span>
          </div>
          <ApexChart
            type="bar"
            height={145}
            options={volumeOptions}
            series={[{ name: "Volume", data: history.volume }]}
          />
        </Card>
        <Card
          title="Portfolio allocation"
          description="Your digital asset balance"
          bodyClassName="p-5"
        >
          <ApexChart
            type="donut"
            height={250}
            options={allocationOptions}
            series={CRYPTO_ASSETS.map((item) => item.price * item.holding)}
          />
          <div className="space-y-4">
            {CRYPTO_ASSETS.map((item) => (
              <div key={item.symbol} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: `var(${item.color})` }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ms-auto font-semibold">
                  {(((item.price * item.holding) / holdings) * 100).toFixed(1)}%
                </span>
                <span className="w-20 text-end text-muted-foreground">
                  {cryptoMoney(item.price * item.holding)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-xs">
            <span className="text-muted-foreground">Cash held separately</span>
            <span className="font-semibold">{cryptoMoney(CRYPTO_CASH)}</span>
          </div>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Market watchlist"
          description="Explore assets and save your favorites"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <button
              type="button"
              aria-pressed={onlyWatchlist}
              onClick={() => setOnlyWatchlist(!onlyWatchlist)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${onlyWatchlist ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              <Star className="size-3.5" />
              Favorites ({watchlist.length})
            </button>
          }
        >
          <div className="px-5 py-3">
            <div className="relative">
              <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                aria-label="Search crypto assets"
                placeholder="Search name or symbol..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="ps-9"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-5">Asset</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h change</TableHead>
                <TableHead>Market cap</TableHead>
                <TableHead className="pe-5">
                  <span className="sr-only">Watchlist</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleAssets.map((item) => (
                <TableRow key={item.symbol}>
                  <TableCell className="ps-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSymbol(item.symbol)}
                      className="flex items-center gap-2.5 text-start"
                      aria-label={`Show ${item.name} chart`}
                    >
                      <Coin asset={item} small />
                      <span>
                        <span className="block text-[13px] font-semibold">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground">{item.symbol}</span>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {cryptoMoney(item.price)}
                  </TableCell>
                  <TableCell>
                    <Change value={item.change} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    ${cryptoCompact(item.marketCap * 1000000)}
                  </TableCell>
                  <TableCell className="pe-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${watchlist.includes(item.symbol) ? "Remove" : "Add"} ${item.symbol} ${watchlist.includes(item.symbol) ? "from" : "to"} watchlist`}
                      aria-pressed={watchlist.includes(item.symbol)}
                      onClick={() => toggleWatchlist(item.symbol)}
                    >
                      <Star
                        className={`size-4 ${watchlist.includes(item.symbol) ? "fill-warning text-warning" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {visibleAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No assets match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            Showing {visibleAssets.length} of {CRYPTO_ASSETS.length} assets · Sample prices
          </div>
        </Card>
        <Card
          title="Quick exchange"
          description="Try a conversion with sample rates"
          bodyClassName="p-5"
          action={<ArrowDownUp className="size-4 text-primary" />}
        >
          <label
            htmlFor="crypto-exchange-amount"
            className="mb-2 block text-xs text-muted-foreground"
          >
            You pay ({reverse ? exchangeSymbol : "USD"})
          </label>
          <Input
            id="crypto-exchange-amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-12 text-lg font-semibold"
          />
          <div className="my-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <Button
              variant="outline"
              size="icon"
              aria-label="Reverse conversion"
              onClick={() => {
                setReverse(!reverse);
                setAmount("1");
              }}
            >
              <ArrowDownUp className="size-4" />
            </Button>
            <div className="h-px flex-1 bg-border" />
          </div>
          <label
            htmlFor="crypto-exchange-asset"
            className="mb-2 block text-xs text-muted-foreground"
          >
            Crypto asset
          </label>
          <Select value={exchangeSymbol} onValueChange={setExchangeSymbol}>
            <SelectTrigger id="crypto-exchange-asset" aria-label="Exchange asset" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRYPTO_ASSETS.map((item) => (
                <SelectItem key={item.symbol} value={item.symbol}>
                  {item.name} ({item.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Estimated amount ({reverse ? "USD" : exchangeSymbol})
            </p>
            <p className="mt-2 break-words text-xl font-semibold tabular-nums">{output}</p>
          </div>
          <p className="my-3 text-[11px] text-muted-foreground">
            1 {exchangeSymbol} = {cryptoMoney(exchangeAsset.price)} · No fee in this preview.
          </p>
          <Button className="w-full" disabled={!validAmount} onClick={() => setPreviewOpen(true)}>
            Preview exchange <ArrowUpRight className="size-4" />
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Demo only. No funds are moved.
          </p>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <section className="vexui-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Staking overview</h2>
              <p className="text-xs text-muted-foreground">Sample ETH position</p>
            </div>
            <Badge tone="success" size="sm">
              Active
            </Badge>
          </div>
          <p className="text-2xl font-semibold">1.20 ETH</p>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-muted-foreground">Estimated APR</span>
            <span className="font-semibold text-success">3.8%</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">Monthly reward estimate</span>
            <span className="font-semibold">
              {cryptoMoney((1.2 * (CRYPTO_ASSETS[1]?.price ?? 0) * 0.038) / 12)}
            </span>
          </div>
        </section>
        <section className="vexui-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-warning/15 text-warning">
              <Bitcoin className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Bitcoin exposure</h2>
              <p className="text-xs text-muted-foreground">Share of your crypto balance</p>
            </div>
          </div>
          <p className="text-2xl font-semibold">
            {(((CRYPTO_ASSETS[0].holding * CRYPTO_ASSETS[0].price) / holdings) * 100).toFixed(1)}%
          </p>
          <div className="my-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-warning"
              style={{
                width: `${((CRYPTO_ASSETS[0].holding * CRYPTO_ASSETS[0].price) / holdings) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {CRYPTO_ASSETS[0].holding} BTC ·{" "}
            {cryptoMoney(CRYPTO_ASSETS[0].holding * CRYPTO_ASSETS[0].price)}
          </p>
        </section>
        <section className="vexui-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-info/10 text-info">
              <Globe2 className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Market snapshot</h2>
              <p className="text-xs text-muted-foreground">Tracked assets only</p>
            </div>
          </div>
          <p className="text-2xl font-semibold">
            ${cryptoCompact(CRYPTO_ASSETS.reduce((sum, item) => sum + item.volume * 1000000, 0))}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">combined sample 24h volume</p>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="text-success">3 advancing</span>
            <span className="text-destructive">2 declining</span>
          </div>
        </section>
      </div>

      <Card
        title="Recent transactions"
        description="Sample wallet activity from October 8–9, 2026"
        bodyClassName="p-0"
        action={
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger aria-label="Filter transactions" className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All transactions</SelectItem>
              {["Buy", "Sell", "Deposit"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-5">Transaction</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pe-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="ps-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid size-8 place-items-center rounded-lg ${item.type === "Sell" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}
                    >
                      {item.type === "Sell" ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownLeft className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium">{item.type}</p>
                      <p className="text-[11px] text-muted-foreground">{item.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.symbol}</TableCell>
                <TableCell className="tabular-nums">
                  {item.quantity} {item.symbol}
                </TableCell>
                <TableCell className="tabular-nums">{cryptoMoney(item.amount)}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {item.time}
                </TableCell>
                <TableCell className="pe-5">
                  <Badge tone={item.status === "Completed" ? "success" : "warning"} size="sm">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Showing {transactions.length} transactions
        </div>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exchange preview</DialogTitle>
            <DialogDescription>
              Illustrative conversion using the sample {exchangeSymbol} price. This preview does not
              place an order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">You pay</span>
              <span className="font-semibold">
                {reverse ? `${entered} ${exchangeSymbol}` : cryptoMoney(entered)}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">You receive</span>
              <span className="font-semibold">{output}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-3 text-xs">
              <span className="text-muted-foreground">Rate</span>
              <span>
                1 {exchangeSymbol} = {cryptoMoney(exchangeAsset.price)}
              </span>
            </div>
          </div>
          <Button onClick={() => setPreviewOpen(false)}>Close preview</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
