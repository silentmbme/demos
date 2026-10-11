import { useState } from "react";
import { ArrowLeftRight, Star, Wallet, Download, Coins } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import {
  CRYPTO_ASSETS,
  getCryptoHistory,
  cryptoCompact,
  type CryptoRange,
} from "@/data/crypto-dashboard-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
type Kind = "market" | "wallet" | "exchange" | "transactions";
const titles = {
  market: "Crypto Market",
  wallet: "Crypto Wallet",
  exchange: "Exchange Preview",
  transactions: "Crypto Transactions",
};
const activity = [
  {
    id: "CTX-101",
    asset: "BTC",
    type: "Buy",
    amount: 0.025,
    status: "Completed",
    date: "2026-10-09",
  },
  {
    id: "CTX-102",
    asset: "ETH",
    type: "Receive",
    amount: 0.4,
    status: "Completed",
    date: "2026-10-08",
  },
  { id: "CTX-103", asset: "SOL", type: "Sell", amount: 3, status: "Pending", date: "2026-10-08" },
  {
    id: "CTX-104",
    asset: "BNB",
    type: "Receive",
    amount: 0.6,
    status: "Completed",
    date: "2026-10-07",
  },
  {
    id: "CTX-105",
    asset: "BTC",
    type: "Send",
    amount: 0.012,
    status: "Completed",
    date: "2026-10-06",
  },
  {
    id: "CTX-106",
    asset: "ETH",
    type: "Buy",
    amount: 0.8,
    status: "Completed",
    date: "2026-10-05",
  },
  {
    id: "CTX-107",
    asset: "SOL",
    type: "Receive",
    amount: 12,
    status: "Completed",
    date: "2026-10-04",
  },
  { id: "CTX-108", asset: "AVAX", type: "Send", amount: 5, status: "Failed", date: "2026-10-03" },
  {
    id: "CTX-109",
    asset: "BNB",
    type: "Sell",
    amount: 1.2,
    status: "Completed",
    date: "2026-10-02",
  },
  {
    id: "CTX-110",
    asset: "ETH",
    type: "Send",
    amount: 0.15,
    status: "Pending",
    date: "2026-10-01",
  },
];
export function CryptoPage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      <CryptoWorkspace key={kind} kind={kind} />
    </AppShell>
  );
}
function CryptoWorkspace({ kind }: { kind: Kind }) {
  const [transactionType, setTransactionType] = useState("All");
  const [transactionSort, setTransactionSort] = useState("newest");
  const [transactionDetail, setTransactionDetail] = useState<(typeof activity)[number] | null>(
    null,
  );
  const [sort, setSort] = useState("cap");
  const [chartSymbol, setChartSymbol] = useState("BTC");
  const [range, setRange] = useState<CryptoRange>("24h");
  const [detail, setDetail] = useState<(typeof CRYPTO_ASSETS)[number] | null>(null);
  const { base } = useChartTheme();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["BTC", "ETH"]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [from, setFrom] = useState("BTC");
  const [to, setTo] = useState("ETH");
  const [amount, setAmount] = useState("0.1");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("All");
  const visible = CRYPTO_ASSETS.filter(
    (a) =>
      `${a.name} ${a.symbol}`.toLowerCase().includes(query.toLowerCase()) &&
      (!onlyFavorites || favorites.includes(a.symbol)),
  );
  visible.sort((a, b) =>
    sort === "gainers"
      ? b.change - a.change
      : sort === "losers"
        ? a.change - b.change
        : sort === "volume"
          ? b.volume - a.volume
          : b.marketCap - a.marketCap,
  );
  const chartAsset = CRYPTO_ASSETS.find((a) => a.symbol === chartSymbol)!;
  const history = getCryptoHistory(chartAsset, range);
  const priceOptions = mergeOptions(base, {
    colors: [token("--primary")],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.03 } },
    xaxis: { type: "datetime" },
    yaxis: { labels: { formatter: (value: number) => money(value) } },
    tooltip: { x: { format: "MMM dd HH:mm" }, y: { formatter: (value: number) => money(value) } },
  });
  const source = CRYPTO_ASSETS.find((a) => a.symbol === from)!;
  const target = CRYPTO_ASSETS.find((a) => a.symbol === to)!;
  const value = Number(amount);
  const valid = Number.isFinite(value) && value > 0 && value <= 1000000 && from !== to;
  const gross = valid ? value * source.price : 0;
  const fee = gross * 0.0025;
  const receive = (gross - fee) / target.price;
  const total = CRYPTO_ASSETS.reduce((sum, a) => sum + a.holding * a.price, 0);
  const costBasis = CRYPTO_ASSETS.reduce((sum, a) => sum + a.holding * a.entry, 0);
  const allocationOptions = mergeOptions(base, {
    labels: CRYPTO_ASSETS.map((a) => a.symbol),
    colors: CRYPTO_ASSETS.map((a) => token(a.color)),
    stroke: { width: 3, colors: [token("--card")] },
    dataLabels: { enabled: false },
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Portfolio",
              formatter: () => money(total),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (value: number) => money(value) } },
  });
  const records = activity.filter(
    (r) =>
      (status === "All" || r.status === status) &&
      (transactionType === "All" || r.type === transactionType) &&
      `${r.id} ${r.asset} ${r.type}`.toLowerCase().includes(query.toLowerCase()),
  );
  records.sort((a, b) =>
    transactionSort === "value"
      ? b.amount * (CRYPTO_ASSETS.find((asset) => asset.symbol === b.asset)?.price ?? 0) -
        a.amount * (CRYPTO_ASSETS.find((asset) => asset.symbol === a.asset)?.price ?? 0)
      : b.date.localeCompare(a.date),
  );
  const transactionValue = (record: (typeof activity)[number]) =>
    record.amount * (CRYPTO_ASSETS.find((asset) => asset.symbol === record.asset)?.price ?? 0);
  function exportRecords() {
    const rows =
      kind === "transactions"
        ? [
            ["ID", "Asset", "Type", "Amount", "Status", "Date"],
            ...records.map((r) => [r.id, r.asset, r.type, r.amount, r.status, r.date]),
          ]
        : [
            ["Asset", "Name", "Sample price USD", "Holding", "Value USD"],
            ...visible.map((a) => [a.symbol, a.name, a.price, a.holding, a.holding * a.price]),
          ];
    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `crypto-${kind}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title={titles[kind]}
        subtitle="Explore sample digital asset data in a focused workspace."
        breadcrumb={["Management", "Crypto", titles[kind]]}
        actions={
          kind !== "exchange" ? (
            <Button variant="outline" onClick={exportRecords}>
              <Download className="size-4" />
              Export
            </Button>
          ) : undefined
        }
      />
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
        Illustrative prices and balances. No live feed, connected wallet, or real transactions.
        Changes stay in this page session.
      </div>
      {kind === "market" && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Tracked market cap",
                value: cryptoCompact(
                  CRYPTO_ASSETS.reduce((sum, a) => sum + a.marketCap * 1000000, 0),
                ),
              },
              {
                label: "Sample 24h volume",
                value: cryptoCompact(CRYPTO_ASSETS.reduce((sum, a) => sum + a.volume * 1000000, 0)),
              },
              {
                label: "Advancing assets",
                value:
                  CRYPTO_ASSETS.filter((a) => a.change > 0).length + " / " + CRYPTO_ASSETS.length,
              },
              { label: "Watchlist assets", value: favorites.length.toString() },
            ].map((m) => (
              <section key={m.label} className="vexui-card p-5">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-3 text-2xl font-semibold">{m.value}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Sample tracked asset universe
                </p>
              </section>
            ))}
          </div>
          <div className="mb-6 grid gap-6 xl:grid-cols-3">
            <Card
              title={chartAsset.name + " price activity"}
              description="Illustrative price history ending October 9, 2026"
              className="xl:col-span-2"
              action={
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Chart asset"
                    className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
                    value={chartSymbol}
                    onChange={(e) => setChartSymbol(e.target.value)}
                  >
                    {CRYPTO_ASSETS.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                  {(["24h", "7d", "30d"] as const).map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={range === value ? "default" : "outline"}
                      aria-pressed={range === value}
                      onClick={() => setRange(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              }
            >
              <div className="px-3 pt-3">
                <p className="text-2xl font-semibold">{money(chartAsset.price)}</p>
                <p
                  className={
                    "mt-1 text-xs " + (history.change >= 0 ? "text-success" : "text-destructive")
                  }
                >
                  {history.change > 0 ? "+" : ""}
                  {history.change.toFixed(2)}% over {range}
                </p>
              </div>
              <ApexChart
                type="area"
                height={265}
                options={priceOptions}
                series={[{ name: chartAsset.symbol, data: history.prices }]}
              />
            </Card>
            <Card
              title="Market movers"
              description="Highest sample 24h changes"
              bodyClassName="p-5"
            >
              <div className="space-y-4">
                {[...CRYPTO_ASSETS]
                  .sort((a, b) => b.change - a.change)
                  .slice(0, 4)
                  .map((a) => (
                    <button
                      key={a.symbol}
                      className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-start hover:bg-muted/30"
                      onClick={() => setChartSymbol(a.symbol)}
                    >
                      <span
                        className={
                          "grid size-9 place-items-center rounded-lg text-xs font-semibold " +
                          a.tone
                        }
                      >
                        {a.symbol.slice(0, 2)}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{a.symbol}</p>
                        <p className="text-[11px] text-muted-foreground">{money(a.price)}</p>
                      </div>
                      <span
                        className={
                          "text-xs font-semibold " +
                          (a.change >= 0 ? "text-success" : "text-destructive")
                        }
                      >
                        {a.change > 0 ? "+" : ""}
                        {a.change}%
                      </span>
                    </button>
                  ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {kind === "exchange" ? (
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section className="vexui-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold">Exchange assets</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore a quote before you decide
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <ArrowLeftRight className="size-5" />
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-medium">You pay</span>
                  <span className="text-muted-foreground">
                    Sample holding: {source.holding} {from}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    aria-label="Exchange amount"
                    className="h-12 min-w-0 flex-1 border-0 bg-transparent px-0 text-2xl font-semibold shadow-none"
                    type="number"
                    min="0.00000001"
                    max={1000000}
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <select
                    aria-label="From asset"
                    className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-semibold"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  >
                    {CRYPTO_ASSETS.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {money(gross)} estimated value
                  </span>
                  <div className="flex gap-1">
                    {[25, 50, 100].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        className="rounded-md bg-card px-2 py-1 text-[10px] font-semibold text-primary"
                        onClick={() =>
                          setAmount(String(Number(((source.holding * percent) / 100).toFixed(8))))
                        }
                      >
                        {percent === 100 ? "Max" : percent + "%"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Reverse exchange pair"
                  className="rounded-xl"
                  onClick={() => {
                    setFrom(to);
                    setTo(from);
                    setAmount("");
                  }}
                >
                  <ArrowLeftRight className="size-4" />
                </Button>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-medium">You receive</span>
                  <Badge tone="primary" size="sm">
                    Estimate
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <p className="min-w-0 flex-1 break-all text-2xl font-semibold">
                    {receive.toFixed(6)}
                  </p>
                  <select
                    aria-label="To asset"
                    className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-semibold"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  >
                    {CRYPTO_ASSETS.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {target.name} / {money(gross - fee)} after sample fee
                </p>
              </div>
              {!valid && (
                <p role="status" className="text-xs text-muted-foreground">
                  Choose different assets and enter a positive amount up to 1,000,000.
                </p>
              )}
              <Button className="h-11 w-full" disabled={!valid} onClick={() => setPreview(true)}>
                Review exchange estimate
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                Preview only. No order or payment is submitted.
              </p>
            </div>
          </section>
          <div className="space-y-5">
            <Card
              title="Quote breakdown"
              description="Fixed sample prices / 0.25% fee"
              bodyClassName="p-5"
            >
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Exchange rate before fee</p>
                <p className="mt-2 text-lg font-semibold">
                  1 {from} = {(source.price / target.price).toFixed(6)} {to}
                </p>
              </div>
              <div className="mt-5 space-y-4 text-sm">
                {[
                  { label: "Source price", value: money(source.price) },
                  { label: "Destination price", value: money(target.price) },
                  { label: "Input value", value: money(gross) },
                  { label: "Sample fee (0.25%)", value: money(fee) },
                  { label: "After fee", value: money(gross - fee) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <section className="vexui-card p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-info/10 text-info">
                  <Coins className="size-5" />
                </span>
                <h2 className="text-sm font-semibold">How this preview works</h2>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "Choose the source and destination assets.",
                  "Enter an amount or use a sample balance shortcut.",
                  "Review the estimate using fixed prices.",
                ].map((text, i) => (
                  <div key={text} className="flex gap-3 text-xs leading-5 text-muted-foreground">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold">
                      {i + 1}
                    </span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <>
          {kind === "wallet" && (
            <div className="mb-6 grid gap-6 xl:grid-cols-3">
              <section className="vexui-card relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card p-6 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-5 text-primary" />
                    <p className="text-sm font-semibold">Portfolio overview</p>
                  </div>
                  <Badge tone="primary">Sample wallet</Badge>
                </div>
                <p className="mt-7 text-xs text-muted-foreground">Total asset value ? USD</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{money(total)}</p>
                <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Cost basis</p>
                    <p className="mt-2 text-lg font-semibold">{money(costBasis)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unrealized gain / loss</p>
                    <p
                      className={
                        "mt-2 text-lg font-semibold " +
                        (total >= costBasis ? "text-success" : "text-destructive")
                      }
                    >
                      {money(total - costBasis)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Assets held</p>
                    <p className="mt-2 text-lg font-semibold">{CRYPTO_ASSETS.length}</p>
                  </div>
                </div>
                <p className="mt-6 text-[11px] text-muted-foreground">
                  Portfolio totals include all sample holdings, independent of search filters.
                </p>
              </section>
              <Card title="Asset allocation" description="Share of the complete sample portfolio">
                <ApexChart
                  type="donut"
                  height={285}
                  options={allocationOptions}
                  series={CRYPTO_ASSETS.map((a) => a.holding * a.price)}
                />
              </Card>
            </div>
          )}
          {kind === "transactions" && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Transactions in view",
                  value: records.length.toString(),
                  color: "--primary",
                },
                {
                  label: "Completed records",
                  value: records.filter((r) => r.status === "Completed").length.toString(),
                  color: "--success",
                },
                {
                  label: "Pending records",
                  value: records.filter((r) => r.status === "Pending").length.toString(),
                  color: "--warning",
                },
                {
                  label: "Illustrative value",
                  value: money(
                    records
                      .filter((r) => r.status !== "Failed")
                      .reduce((sum, r) => sum + transactionValue(r), 0),
                  ),
                  color: "--info",
                },
              ].map((metric) => (
                <section key={metric.label} className="vexui-card p-5">
                  <span
                    className="mb-3 grid size-9 place-items-center rounded-xl"
                    style={{
                      color: `var(${metric.color})`,
                      background: `color-mix(in oklch,var(${metric.color}) 12%,transparent)`,
                    }}
                  >
                    <ArrowLeftRight className="size-4" />
                  </span>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                </section>
              ))}
            </div>
          )}
          <Card
            title={
              kind === "market"
                ? "Market watch"
                : kind === "wallet"
                  ? "Asset balances"
                  : "Transaction history"
            }
            description="Sample records"
            bodyClassName="p-5"
            action={
              <div className="flex flex-wrap gap-2">
                <Input
                  aria-label="Search crypto records"
                  placeholder="Search assets or records…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="sm:w-60"
                />
                {kind === "market" && (
                  <select
                    aria-label="Sort market assets"
                    className="rounded-lg border border-border bg-card px-3 text-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="cap">Market cap</option>
                    <option value="gainers">Top gainers</option>
                    <option value="losers">Top losers</option>
                    <option value="volume">Volume</option>
                  </select>
                )}
                {kind === "market" && (
                  <Button
                    variant={onlyFavorites ? "default" : "outline"}
                    aria-pressed={onlyFavorites}
                    onClick={() => setOnlyFavorites((v) => !v)}
                  >
                    <Star className="size-4" />
                    Watchlist
                  </Button>
                )}
                {kind === "transactions" && (
                  <>
                    <select
                      aria-label="Transaction type"
                      className="rounded-lg border border-border bg-card px-3 text-sm"
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      {["All", "Buy", "Sell", "Receive", "Send"].map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Sort crypto transactions"
                      className="rounded-lg border border-border bg-card px-3 text-sm"
                      value={transactionSort}
                      onChange={(e) => setTransactionSort(e.target.value)}
                    >
                      <option value="newest">Newest first</option>
                      <option value="value">Largest value</option>
                    </select>
                  </>
                )}
                {kind === "transactions" && (
                  <select
                    aria-label="Crypto transaction status"
                    className="rounded-lg border border-border bg-card px-3 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {["All", "Completed", "Pending", "Failed"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                )}
              </div>
            }
          >
            {kind === "transactions" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {["ID", "Asset", "Type", "Quantity", "Sample value", "Status", "Date", ""].map(
                      (h) => (
                        <TableHead key={h || "actions"}>{h}</TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.asset}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>
                        {r.amount} {r.asset}
                      </TableCell>
                      <TableCell>{money(transactionValue(r))}</TableCell>
                      <TableCell>
                        <Badge tone={r.status === "Completed" ? "success" : "warning"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={"View transaction " + r.id}
                          onClick={() => setTransactionDetail(r)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : kind === "wallet" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((a) => (
                  <article
                    key={a.symbol}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div
                      className="p-5"
                      style={{
                        background: `linear-gradient(135deg,color-mix(in oklch,var(${a.color}) 6%,var(--card)),var(--card))`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            "grid size-11 place-items-center rounded-xl font-semibold " + a.tone
                          }
                        >
                          {a.symbol.slice(0, 2)}
                        </span>
                        <div>
                          <h2 className="font-semibold">{a.name}</h2>
                          <p className="text-xs text-muted-foreground">{a.symbol}</p>
                        </div>
                      </div>
                      <p className="mt-5 text-2xl font-semibold">
                        {a.holding}{" "}
                        <span className="text-sm text-muted-foreground">{a.symbol}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {money(a.holding * a.price)}
                      </p>
                      <div className="mt-4 h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: ((a.holding * a.price) / total) * 100 + "%" }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {(((a.holding * a.price) / total) * 100).toFixed(1)}% of sample portfolio
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Unrealized gain / loss</p>
                        <p
                          className={
                            "mt-1 text-xs font-semibold " +
                            (a.price >= a.entry ? "text-success" : "text-destructive")
                          }
                        >
                          {money(a.holding * (a.price - a.entry))}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={"Balance details " + a.symbol}
                        onClick={() => setDetail(a)}
                      >
                        Details
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {["", "Asset", "Price", "24h change", "Sample volume", "Market cap", ""].map(
                      (h, i) => (
                        <TableHead key={i}>{h}</TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((a) => (
                    <TableRow key={a.symbol}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Watch ${a.symbol}`}
                          aria-pressed={favorites.includes(a.symbol)}
                          onClick={() =>
                            setFavorites((current) =>
                              current.includes(a.symbol)
                                ? current.filter((s) => s !== a.symbol)
                                : [...current, a.symbol],
                            )
                          }
                        >
                          <Star
                            className={
                              "size-4 " +
                              (favorites.includes(a.symbol)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground")
                            }
                          />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.symbol}</p>
                      </TableCell>
                      <TableCell>{money(a.price)}</TableCell>
                      <TableCell className={a.change >= 0 ? "text-success" : "text-destructive"}>
                        {a.change > 0 ? "+" : ""}
                        {a.change}%
                      </TableCell>
                      <TableCell>{cryptoCompact(a.volume * 1000000)}</TableCell>
                      <TableCell>{cryptoCompact(a.marketCap * 1000000)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View ${a.symbol}`}
                          onClick={() => setDetail(a)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {(kind === "transactions" ? records.length : visible.length) === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No matching records.
              </p>
            )}
          </Card>
        </>
      )}
      <Dialog
        open={!!transactionDetail}
        onOpenChange={(open) => {
          if (!open) setTransactionDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction details</DialogTitle>
            <DialogDescription>
              {transactionDetail?.id} / Sample record, not an on-chain transaction
            </DialogDescription>
          </DialogHeader>
          {transactionDetail && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-primary/5 p-5">
                <Badge tone={transactionDetail.status === "Completed" ? "success" : "warning"}>
                  {transactionDetail.status}
                </Badge>
                <p className="mt-4 text-3xl font-semibold">
                  {transactionDetail.amount} {transactionDetail.asset}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {money(transactionValue(transactionDetail))} at current sample price
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="mt-1 text-sm font-medium">{transactionDetail.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="mt-1 text-sm">{transactionDetail.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Asset</p>
                  <p className="mt-1 text-sm">
                    {CRYPTO_ASSETS.find((a) => a.symbol === transactionDetail.asset)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="mt-1 text-sm">{transactionDetail.id}</p>
                </div>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                USD values use fixed sample prices, not historical execution prices. No wallet
                address or transaction hash is connected.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setTransactionDetail(null)}
              >
                Close details
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detail?.name} / {detail?.symbol}
            </DialogTitle>
            <DialogDescription>
              {kind === "wallet"
                ? "Sample balance and cost basis. No connected wallet."
                : "Illustrative asset details. No live market feed."}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="rounded-xl bg-primary/5 p-5">
                <p className="text-xs text-muted-foreground">Sample price</p>
                <p className="mt-2 text-3xl font-semibold">{money(detail.price)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">24h change</p>
                  <p className="mt-1">{detail.change}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market cap</p>
                  <p className="mt-1">{cryptoCompact(detail.marketCap * 1000000)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h volume</p>
                  <p className="mt-1">{cryptoCompact(detail.volume * 1000000)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sample holdings</p>
                  <p className="mt-1">
                    {detail.holding} {detail.symbol}
                  </p>
                </div>
              </div>
              {kind === "wallet" && (
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-border p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Holding value</p>
                    <p className="mt-1 font-semibold">{money(detail.holding * detail.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost basis</p>
                    <p className="mt-1 font-semibold">{money(detail.holding * detail.entry)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Portfolio share</p>
                    <p className="mt-1">
                      {(((detail.holding * detail.price) / total) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unrealized gain / loss</p>
                    <p className="mt-1">{money(detail.holding * (detail.price - detail.entry))}</p>
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                onClick={() => {
                  setChartSymbol(detail.symbol);
                  setDetail(null);
                }}
              >
                {kind === "wallet" ? "Close balance details" : "View price chart"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ArrowLeftRight className="size-6" />
            </span>
            <DialogTitle>Review exchange estimate</DialogTitle>
            <DialogDescription>
              Estimate only. No order is placed or balance changed.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-primary/5 p-5">
            <p className="text-sm">
              {amount} {from}
            </p>
            <ArrowLeftRight className="my-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">
              {receive.toFixed(6)} {to}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Includes a sample fee of {money(fee)}.</p>
          <Button onClick={() => setPreview(false)}>Close preview</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
