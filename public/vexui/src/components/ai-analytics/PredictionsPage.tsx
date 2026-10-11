import { useState } from "react";
import {
  Target,
  TrendingUp,
  ShieldCheck,
  Play,
  Download,
  Search,
  ArrowUpRight,
  SlidersHorizontal,
  Clock3,
} from "lucide-react";
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

const forecasts = [
  {
    id: "PRE-201",
    title: "Revenue",
    category: "Revenue",
    unit: "usd",
    current: 114000,
    forecast: 128400,
    confidence: 94,
    lowerBetter: false,
    history: [97000, 102000, 99000, 106000, 110000, 108000, 114000],
    owner: "Revenue team",
    model: "Revenue forecast v2.4",
    source: "Sample order totals",
    samples: 1240,
    driver: "Returning customer demand",
    assumption: "Customer mix and average order value remain stable.",
    risk: "Seasonal changes or campaign discounts may shift demand.",
    action: "Compare conversion and average order value before adjusting the revenue plan.",
  },
  {
    id: "PRE-202",
    title: "Customer churn",
    category: "Customers",
    unit: "percent",
    current: 6,
    forecast: 4.8,
    confidence: 89,
    lowerBetter: true,
    history: [7.2, 6.8, 6.9, 6.5, 6.4, 6.1, 6],
    owner: "Customer success",
    model: "Retention forecast v1.8",
    source: "Sample retention cohorts",
    samples: 960,
    driver: "Improved onboarding",
    assumption: "Onboarding completion continues at the sample rate.",
    risk: "A change in acquisition channels may alter retention.",
    action: "Review high-risk customer cohorts and test a targeted follow-up.",
  },
  {
    id: "PRE-203",
    title: "Support demand",
    category: "Operations",
    unit: "count",
    current: 1146,
    forecast: 1240,
    confidence: 91,
    lowerBetter: true,
    history: [960, 980, 1015, 990, 1080, 1100, 1146],
    owner: "Support team",
    model: "Demand forecast v2.1",
    source: "Sample support tickets",
    samples: 846,
    driver: "New customer volume",
    assumption: "Ticket mix and self-service usage stay consistent.",
    risk: "Product incidents can create demand outside this sample pattern.",
    action: "Check staffing capacity before reallocating the next support shift.",
  },
  {
    id: "PRE-204",
    title: "Campaign conversions",
    category: "Marketing",
    unit: "count",
    current: 727,
    forecast: 846,
    confidence: 86,
    lowerBetter: false,
    history: [550, 595, 580, 640, 665, 690, 727],
    owner: "Marketing team",
    model: "Conversion forecast v1.6",
    source: "Sample campaign reports",
    samples: 3200,
    driver: "Audience segmentation",
    assumption: "Campaign budget and audience quality remain unchanged.",
    risk: "Ad saturation or delivery costs may reduce conversion efficiency.",
    action: "Validate conversion tracking and compare channel performance.",
  },
  {
    id: "PRE-205",
    title: "Inventory coverage",
    category: "Operations",
    unit: "days",
    current: 18,
    forecast: 12,
    confidence: 88,
    lowerBetter: false,
    history: [25, 24, 23, 21, 20, 19, 18],
    owner: "Inventory team",
    model: "Stock coverage v1.3",
    source: "Sample inventory snapshots",
    samples: 184,
    driver: "Top-seller demand",
    assumption: "No additional purchase orders arrive during the projected period.",
    risk: "Supplier lead time variability may reduce available coverage.",
    action: "Review pending purchase orders and prioritize low-stock products.",
  },
  {
    id: "PRE-206",
    title: "Qualified leads",
    category: "Marketing",
    unit: "count",
    current: 702,
    forecast: 780,
    confidence: 90,
    lowerBetter: false,
    history: [540, 565, 590, 625, 640, 670, 702],
    owner: "Growth team",
    model: "Lead forecast v2.0",
    source: "Sample acquisition reports",
    samples: 780,
    driver: "Organic content referrals",
    assumption: "Traffic sources and lead qualification rules remain stable.",
    risk: "Changes in lead definitions can affect comparisons.",
    action: "Compare lead quality by source before expanding content spend.",
  },
];
type Forecast = (typeof forecasts)[number];
type Scenario = "Base case" | "Optimistic" | "Adverse";
function format(value: number, f: Forecast) {
  return f.unit === "usd"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    : f.unit === "percent"
      ? `${value.toFixed(1)}%`
      : f.unit === "days"
        ? `${value.toFixed(1)} days`
        : Math.round(value).toLocaleString("en-US");
}
function estimate(f: Forecast, horizon: number, scenario: Scenario) {
  const baseline = f.current + (f.forecast - f.current) * (horizon / 30);
  const direction = f.lowerBetter ? -1 : 1;
  return Math.max(
    0,
    baseline *
      (1 +
        (scenario === "Optimistic"
          ? 0.08 * direction
          : scenario === "Adverse"
            ? -0.08 * direction
            : 0)),
  );
}
export function PredictionsPage() {
  const [selected, setSelected] = useState(forecasts[0].id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [horizon, setHorizon] = useState(30);
  const [scenario, setScenario] = useState<Scenario>("Base case");
  const [detail, setDetail] = useState(false);
  const [runs, setRuns] = useState(0);
  const [notice, setNotice] = useState("");
  const { base } = useChartTheme();
  const active = forecasts.find((f) => f.id === selected)!;
  const projected = estimate(active, horizon, scenario);
  const baseEstimate = estimate(active, horizon, "Base case");
  const movement = ((projected - active.current) / active.current) * 100;
  const favorable = active.lowerBetter ? movement <= 0 : movement >= 0;
  const visible = forecasts.filter(
    (f) =>
      (category === "All" || f.category === category) &&
      `${f.title} ${f.id} ${f.owner}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const future = [1, 2, 3].map((i) => Math.round((horizon * i) / 3));
  const categories = [
    "D-6",
    "D-5",
    "D-4",
    "D-3",
    "D-2",
    "D-1",
    "Now",
    ...future.map((d) => `D+${d}`),
  ];
  const trend = (target: number) => [
    ...Array(6).fill(null),
    active.current,
    ...future.map((d) => active.current + ((target - active.current) * d) / horizon),
  ];
  const options = mergeOptions(base, {
    colors: [token("--primary"), token("--info"), token("--success"), token("--warning")],
    stroke: { curve: "smooth", width: [3, 3, 1.5, 1.5], dashArray: [0, 6, 3, 3] },
    markers: { size: 0 },
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: { min: 0, labels: { formatter: (v: number) => format(v, active) } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true, intersect: false, y: { formatter: (v: number) => format(v, active) } },
    annotations: {
      xaxis: [
        {
          x: "Now",
          borderColor: token("--muted-foreground"),
          label: {
            text: "Forecast starts",
            style: { color: token("--foreground"), background: token("--muted") },
          },
        },
      ],
    },
  });
  const exportForecast = () => {
    const rows = [
      ["Metric", "Horizon days", "Scenario", "Current", "Projected", "Confidence score"],
      ...visible.map((f) => [
        f.title,
        String(horizon),
        scenario,
        String(f.current),
        String(estimate(f, horizon, scenario).toFixed(2)),
        String(f.confidence),
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        [rows.map((r) => r.map((v) => '"' + v.replaceAll('"', '""') + '"').join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-predictions.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} sample predictions.`);
  };
  return (
    <>
      <PageHeader
        title="Predictions"
        subtitle="Compare business forecasts, explore scenarios, and review the assumptions behind each estimate."
        breadcrumb={["Management", "AI Analytics", "Predictions"]}
        actions={
          <>
            <Button variant="outline" onClick={exportForecast}>
              <Download className="size-4" />
              Export
            </Button>
            <Button
              onClick={() => {
                setRuns((n) => n + 1);
                setNotice(
                  "Sample forecast run completed using the selected scenario and horizon. Fixed demo inputs are unchanged; no live model is connected.",
                );
              }}
            >
              <Play className="size-4" />
              Run sample forecast
            </Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Tracked forecasts",
            value: String(forecasts.length),
            caption: "Across four business areas",
            Icon: Target,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Average sample confidence",
            value: `${Math.round(forecasts.reduce((n, f) => n + f.confidence, 0) / forecasts.length)}%`,
            caption: "Illustrative scores, not validation results",
            Icon: ShieldCheck,
            color: "bg-success/10 text-success",
          },
          {
            label: "Forecast horizon",
            value: `${horizon} days`,
            caption: `${scenario} scenario`,
            Icon: Clock3,
            color: "bg-info/10 text-info",
          },
          {
            label: "Sample runs",
            value: String(runs),
            caption: "Runs in this session",
            Icon: TrendingUp,
            color: "bg-warning/10 text-warning",
          },
        ].map((s) => (
          <Card key={s.label} bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <span className={`grid size-10 place-items-center rounded-xl ${s.color}`}>
                <s.Icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.caption}</p>
          </Card>
        ))}
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-4 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card
          title={`${active.title} outlook`}
          description="Fixed sample history through Oct 9, 2026; forecast dates are relative to this sample date."
          action={<Badge tone="primary">{active.id}</Badge>}
          bodyClassName="p-5"
        >
          <div className="mb-5 flex flex-wrap gap-3">
            <select
              aria-label="Forecast metric"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="h-10 max-w-full rounded-lg border border-border bg-card px-3 text-sm"
            >
              {forecasts.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
            <select
              aria-label="Forecast horizon"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            >
              {[7, 14, 30].map((d) => (
                <option key={d} value={d}>
                  Next {d} days
                </option>
              ))}
            </select>
            <select
              aria-label="Forecast scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            >
              {["Base case", "Optimistic", "Adverse"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Projected at day {horizon}</p>
              <p className="mt-1 text-3xl font-semibold" data-testid="projected-value">
                {format(projected, active)}
              </p>
            </div>
            <Badge tone={favorable ? "success" : "warning"}>
              {movement >= 0 ? "+" : ""}
              {movement.toFixed(1)}% vs current
            </Badge>
          </div>
          <ApexChart
            type="line"
            height={300}
            options={options}
            series={[
              { name: "Sample history", data: [...active.history, null, null, null] },
              { name: "Selected scenario", data: trend(projected) },
              { name: "Illustrative upper bound", data: trend(projected * 1.12) },
              { name: "Illustrative lower bound", data: trend(projected * 0.88) },
            ]}
          />
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
            Dashed lines show forecasts. Bounds are illustrative +/-12% ranges, not statistical
            confidence intervals. Sample confidence scores do not describe these bounds.
          </p>
        </Card>
        <div className="space-y-5">
          <Card
            title="Scenario comparison"
            description="Explore a simple sensitivity model"
            bodyClassName="p-5"
          >
            <div className="space-y-3">
              {(["Base case", "Optimistic", "Adverse"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  aria-pressed={scenario === s}
                  onClick={() => setScenario(s)}
                  className={`w-full rounded-xl border p-4 text-start ${scenario === s ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{s}</span>
                    <span className="text-sm font-semibold">
                      {format(estimate(active, horizon, s), active)}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {s === "Base case"
                      ? "Linear sample trend"
                      : s === "Optimistic"
                        ? "8% shift in a favorable direction"
                        : "8% shift in an adverse direction"}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Base case: {format(baseEstimate, active)}. Scenario shifts are illustrative
              assumptions you can compare; they are not model-generated probabilities.
            </p>
          </Card>
          <Card title="Key forecast driver" bodyClassName="p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-info/10 text-info">
              <SlidersHorizontal className="size-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold">{active.driver}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{active.assumption}</p>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setDetail(true)}>
              Review assumptions
              <ArrowUpRight className="size-4" />
            </Button>
          </Card>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Forecast library</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {visible.length} predictions - click a metric to explore its outlook
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-3">
          <div className="relative min-w-0">
            <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search predictions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search forecasts..."
              className="ps-9"
            />
          </div>
          <select
            aria-label="Prediction category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          >
            {["All", "Revenue", "Customers", "Operations", "Marketing"].map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((f) => {
          const value = estimate(f, horizon, scenario);
          const change = ((value - f.current) / f.current) * 100;
          const good = f.lowerBetter ? change <= 0 : change >= 0;
          return (
            <Card
              key={f.id}
              className={selected === f.id ? "ring-1 ring-primary/40" : ""}
              bodyClassName="p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge tone="info">{f.category}</Badge>
                <span className="text-[10px] text-muted-foreground">{f.id}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-3xl font-semibold">{format(value, f)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone={good ? "success" : "warning"}>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Current: {format(f.current, f)}
                </span>
              </div>
              <div className="mt-5 flex justify-between text-xs">
                <span className="text-muted-foreground">Sample confidence</span>
                <span>{f.confidence}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${f.confidence}%` }}
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {horizon} days / {scenario} / {f.owner}
              </p>
              <Button
                variant={selected === f.id ? "default" : "outline"}
                className="mt-4 w-full"
                aria-label={`Explore ${f.id}`}
                onClick={() => setSelected(f.id)}
              >
                {selected === f.id ? "Viewing forecast" : "Explore forecast"}
                <ArrowUpRight className="size-4" />
              </Button>
            </Card>
          );
        })}
      </div>
      {!visible.length && (
        <Card bodyClassName="p-8 text-center">
          <p className="text-sm text-muted-foreground">No matching predictions.</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset filters
          </Button>
        </Card>
      )}
      <Dialog open={detail} onOpenChange={setDetail}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{active.title} assumptions</DialogTitle>
            <DialogDescription>
              {active.id} / {active.model} / Sample forecast
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Source</p>
              <p className="mt-1 text-sm font-medium">{active.source}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sample records</p>
              <p className="mt-1 text-sm font-medium">{active.samples.toLocaleString()}</p>
            </div>
          </div>
          {[
            ["Core assumption", active.assumption],
            ["Risk to monitor", active.risk],
            ["Recommended next step", active.action],
          ].map(([label, text]) => (
            <div key={label}>
              <h3 className="text-sm font-semibold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
          <p className="text-xs leading-5 text-muted-foreground">
            The base estimate linearly scales a fixed 30-day sample trend to your selected horizon.
            Optimistic and adverse scenarios adjust it by 8%. No live model or external data is
            connected.
          </p>
          <Button onClick={() => setDetail(false)}>Close assumptions</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
