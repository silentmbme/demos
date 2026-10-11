import { useState, type ReactNode } from "react";
import {
  Activity,
  Gauge,
  Coins,
  FileText,
  Cpu,
  Target,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  Layers3,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { Button } from "@/components/ui/button";
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
  AI_MODELS,
  AI_WORKLOADS,
  formatAiCost,
  formatAiNumber,
  getAiAnalytics,
  type AiModel,
  type AiPeriod,
} from "@/data/ai-analytics-data";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";

function Metric({
  label,
  value,
  icon,
  detail,
  trend,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  detail: string;
  trend: string;
}) {
  return (
    <section className="vexui-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-success/10 px-1.5 py-1 font-medium text-success">
          {trend}
        </span>
        <span className="text-muted-foreground">{detail}</span>
      </div>
    </section>
  );
}

export function AiAnalyticsDashboard() {
  const [period, setPeriod] = useState<AiPeriod>("30");
  const [modelId, setModelId] = useState("all");
  const [chartMetric, setChartMetric] = useState<"requests" | "tokens">("requests");
  const [selectedModel, setSelectedModel] = useState<AiModel | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState("1000");
  const { base } = useChartTheme();
  const data = getAiAnalytics(period, modelId);
  const selected = data.models.find((model) => model.id === selectedModel?.id);
  const usageSeries =
    chartMetric === "requests"
      ? [
          {
            name: "Successful",
            data: data.requestSeries.map((value, index) => value - (data.failedSeries[index] ?? 0)),
          },
          { name: "Failed", data: data.failedSeries },
        ]
      : [
          { name: "Input", data: data.inputTokenSeries },
          { name: "Output", data: data.outputTokenSeries },
          { name: "Cached", data: data.cachedTokenSeries },
        ];
  const periodBudget = (Number(monthlyBudget) * Number(period)) / 30;
  const budgetPercent = (data.cost / periodBudget) * 100;
  const workloads = AI_WORKLOADS.filter(
    (workload) => modelId === "all" || workload.modelId === modelId,
  );
  const usageOptions = mergeOptions(base, {
    colors:
      chartMetric === "requests"
        ? [token("--primary"), token("--warning")]
        : [token("--primary"), token("--chart-2"), token("--chart-3")],
    chart: { type: "bar", stacked: true },
    stroke: { width: 0 },
    fill: { type: "solid", opacity: 1 },
    plotOptions: {
      bar: {
        columnWidth: "42%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    legend: { show: true, position: "top", horizontalAlign: "left" },
    xaxis: { categories: data.labels, tickAmount: 6 },
    yaxis: { labels: { formatter: formatAiNumber } },
    tooltip: { y: { formatter: (value: number) => value.toLocaleString("en-US") } },
  });
  const distributionOptions = mergeOptions(base, {
    colors: data.models.map((model) => token(model.color)),
    chart: { type: "bar" },
    plotOptions: {
      bar: { horizontal: true, distributed: true, barHeight: "38%", borderRadius: 5 },
    },
    stroke: { width: 0 },
    fill: { type: "solid", opacity: 0.95 },
    legend: { show: false },
    xaxis: {
      categories: data.models.map((model) => model.name),
      tickAmount: 3,
      labels: { formatter: (value: string) => formatAiCost(Number(value)) },
    },
    yaxis: { labels: { maxWidth: 90 } },
    grid: {
      padding: { left: 0, right: 12 },
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: { y: { formatter: formatAiCost } },
  });
  const latencyOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 5] },
    xaxis: { categories: data.labels, tickAmount: 5 },
    yaxis: { min: 0, labels: { formatter: (value: number) => value.toFixed(1) + "s" } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { y: { formatter: (value: number) => value.toFixed(2) + " seconds" } },
  });
  const heatmapOptions = mergeOptions(base, {
    colors: [token("--primary")],
    stroke: { width: 3, colors: [token("--card")] },
    plotOptions: {
      heatmap: {
        radius: 5,
        shadeIntensity: 0.65,
        colorScale: {
          min: 0,
          max: Math.max(...data.activity.flatMap((day) => day.data.map((point) => point.y))),
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: { labels: { rotate: 0, style: { fontSize: "10px" } }, tooltip: { enabled: false } },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: { show: false, padding: { left: 0, right: 0 } },
    tooltip: { y: { formatter: (value: number) => value.toLocaleString("en-US") + " requests" } },
  });
  const budgetOptions = mergeOptions(base, {
    colors: [token(budgetPercent >= 100 ? "--destructive" : "--primary")],
    labels: ["Budget used"],
    stroke: { lineCap: "round" },
    plotOptions: {
      radialBar: {
        startAngle: -125,
        endAngle: 125,
        hollow: { size: "70%" },
        track: { background: token("--muted"), strokeWidth: "100%" },
        dataLabels: {
          name: { fontSize: "12px", offsetY: 24 },
          value: {
            fontSize: "28px",
            fontWeight: 600,
            offsetY: -15,
            formatter: () => budgetPercent.toFixed(1) + "%",
          },
        },
      },
    },
  });

  function exportReport() {
    const rows = [
      [
        "Model",
        "Period (days)",
        "Requests",
        "Tokens",
        "Cost (USD)",
        "Latency (seconds)",
        "Success rate (%)",
      ],
      ...data.models.map((model) => [
        model.name,
        period,
        model.requests,
        model.tokens,
        model.cost.toFixed(2),
        model.latency,
        model.success,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ai-analytics-${modelId}-${period}-days.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <PageHeader
        title="AI Analytics"
        subtitle="A clearer view of your AI usage, performance, and spend."
        breadcrumb={["Dashboards", "AI Analytics"]}
        actions={
          <>
            <Select value={period} onValueChange={(value) => setPeriod(value as AiPeriod)}>
              <SelectTrigger className="h-10 w-[166px] bg-card" aria-label="Analytics period">
                <CalendarDays className="me-2 size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportReport}>
              <Download className="size-4" /> Export report
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-card text-primary shadow-sm">
            <Sparkles className="size-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Your AI workspace, at a glance</h2>
              <Badge tone="primary" size="sm">
                Sample data
              </Badge>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {data.models.length} {data.models.length === 1 ? "model" : "models"} in view ·{" "}
              {data.success.toFixed(1)}% successful requests · Period ending Oct 9, 2026
            </p>
          </div>
        </div>
        <Select value={modelId} onValueChange={setModelId}>
          <SelectTrigger className="h-10 w-full bg-card sm:w-[180px]" aria-label="Filter AI model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All models</SelectItem>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total requests"
          value={formatAiNumber(data.requests)}
          icon={<Bot className="size-5" />}
          trend={`↗ ${data.change.toFixed(1)}%`}
          detail="vs. previous period"
        />
        <Metric
          label="Tokens processed"
          value={formatAiNumber(data.tokens)}
          icon={<Layers3 className="size-5" />}
          trend={`${Math.round(data.tokens / (data.requests || 1))} tokens`}
          detail="average per request"
        />
        <Metric
          label="Total AI spend"
          value={formatAiCost(data.cost)}
          icon={<CircleDollarSign className="size-5" />}
          trend={formatAiCost((data.cost / (data.requests || 1)) * 1000)}
          detail="per 1,000 requests"
        />
        <Metric
          label="Average latency"
          value={`${data.latency.toFixed(2)}s`}
          icon={<Zap className="size-5" />}
          trend={`${data.success.toFixed(1)}%`}
          detail="request success rate"
        />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="AI usage over time"
          description={`Request and token volume over the last ${period} days`}
          className="xl:col-span-2"
          bodyClassName="px-3 pb-3 pt-5"
          action={
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {(["requests", "tokens"] as const).map((metric) => (
                <button
                  type="button"
                  key={metric}
                  aria-pressed={chartMetric === metric}
                  onClick={() => setChartMetric(metric)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${chartMetric === metric ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {metric}
                </button>
              ))}
            </div>
          }
        >
          <div className="mb-1 flex items-baseline gap-2 px-3">
            <span className="text-2xl font-semibold tabular-nums">
              {formatAiNumber(chartMetric === "requests" ? data.requests : data.tokens)}
            </span>
            <span className="text-xs text-muted-foreground">total {chartMetric}</span>
            <span className="ms-auto inline-flex items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="size-3.5" />
              {data.change.toFixed(1)}%
            </span>
          </div>
          <ApexChart type="bar" height={285} options={usageOptions} series={usageSeries} />
        </Card>
        <Card
          title="Spend by model"
          description="Compare the cost of each AI model"
          bodyClassName="px-5 pb-5 pt-2"
        >
          <ApexChart
            type="bar"
            height={235}
            options={distributionOptions}
            series={[{ name: "Spend", data: data.models.map((model) => model.cost) }]}
          />
          <div className="space-y-3">
            {data.models.map((model) => (
              <div className="flex items-center gap-2 text-xs" key={model.id}>
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: `var(${model.color})` }}
                />
                <span className="text-muted-foreground">{model.name}</span>
                <span className="ms-auto font-semibold tabular-nums">
                  {((model.cost / (data.cost || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Daily throughput",
            value: formatAiNumber(Math.round(data.requests / Number(period))),
            note: "requests per day",
            icon: <Cpu className="size-5" />,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Cached tokens",
            value: formatAiNumber(data.cachedTokens),
            note: "12% of processed tokens",
            icon: <Layers3 className="size-5" />,
            tone: "bg-info/10 text-info",
          },
          {
            label: "Estimated cache savings",
            value: formatAiCost(data.cost * 0.12),
            note: "at the average token rate",
            icon: <Coins className="size-5" />,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Failed requests",
            value: formatAiNumber(data.failedRequests),
            note: `${(100 - data.success).toFixed(2)}% of total requests`,
            icon: <ShieldCheck className="size-5" />,
            tone: "bg-warning/10 text-warning",
          },
        ].map((metric) => (
          <section key={metric.label} className="vexui-card flex items-center gap-4 p-4">
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${metric.tone}`}>
              {metric.icon}
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{metric.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{metric.note}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Response time trends"
          description="Sample average and tail latency"
          bodyClassName="px-3 pb-2 pt-4"
        >
          <div className="flex items-baseline gap-2 px-2">
            <span className="text-2xl font-semibold">{data.latency.toFixed(2)}s</span>
            <span className="text-xs text-muted-foreground">weighted average</span>
          </div>
          <ApexChart
            type="line"
            height={250}
            options={latencyOptions}
            series={[
              {
                name: "Average",
                data: data.labels.map((_, index) =>
                  Number((data.latency * (1 + Math.sin(index * 1.8) * 0.12)).toFixed(2)),
                ),
              },
              {
                name: "P95 (sample)",
                data: data.labels.map((_, index) =>
                  Number((data.latency * (1.85 + Math.cos(index * 1.2) * 0.18)).toFixed(2)),
                ),
              },
            ]}
          />
        </Card>
        <Card
          title="Request activity"
          description={`Requests grouped by weekday and hour over ${period} days`}
          bodyClassName="px-3 pb-4 pt-3"
        >
          <ApexChart type="heatmap" height={265} options={heatmapOptions} series={data.activity} />
          <div className="flex items-center justify-end gap-2 px-3 text-[11px] text-muted-foreground">
            <span>Less</span>
            {[0.15, 0.3, 0.5, 0.7, 1].map((opacity) => (
              <span key={opacity} className="size-3 rounded-sm bg-primary" style={{ opacity }} />
            ))}
            <span>More requests</span>
          </div>
        </Card>
        <Card
          title="AI spend budget"
          description="Manage your sample spending target"
          className="md:col-span-2 xl:col-span-1"
          bodyClassName="px-5 pb-5 pt-2"
          action={<Gauge className="size-4 text-muted-foreground" />}
        >
          <ApexChart
            type="radialBar"
            height={205}
            options={budgetOptions}
            series={[Math.min(budgetPercent, 100)]}
          />
          <div className="mb-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[11px] text-muted-foreground">Spent</p>
              <p className="mt-1 text-base font-semibold">{formatAiCost(data.cost)}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">
                {budgetPercent > 100 ? "Over budget" : "Remaining"}
              </p>
              <p
                className={`mt-1 text-base font-semibold ${budgetPercent > 100 ? "text-destructive" : "text-success"}`}
              >
                {formatAiCost(Math.abs(periodBudget - data.cost))}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <label htmlFor="ai-monthly-budget" className="text-xs text-muted-foreground">
              Monthly target
            </label>
            <Select value={monthlyBudget} onValueChange={setMonthlyBudget}>
              <SelectTrigger
                id="ai-monthly-budget"
                className="h-8 w-[110px]"
                aria-label="Monthly AI budget"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["500", "1000", "2000", "5000"].map((amount) => (
                  <SelectItem key={amount} value={amount}>
                    {formatAiCost(Number(amount))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Target adjusted to {formatAiCost(periodBudget)} for {period} days.
          </p>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Token breakdown"
          description="Understand where your tokens go"
          bodyClassName="p-5"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Layers3 className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">{formatAiNumber(data.tokens)}</p>
              <p className="text-xs text-muted-foreground">total processed tokens</p>
            </div>
          </div>
          <div
            className="mb-5 flex h-3 overflow-hidden rounded-full"
            aria-label="Token mix: 60% input, 28% output, 12% cached"
          >
            <span className="w-[60%] bg-primary" />
            <span className="w-[28%] bg-chart-2" />
            <span className="w-[12%] bg-chart-3" />
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Input tokens",
                value: data.inputTokens,
                percent: "60%",
                color: "bg-primary",
              },
              {
                label: "Output tokens",
                value: data.outputTokens,
                percent: "28%",
                color: "bg-chart-2",
              },
              {
                label: "Cached tokens",
                value: data.cachedTokens,
                percent: "12%",
                color: "bg-chart-3",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span className={`size-2.5 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
                <span className="ms-auto font-semibold">{formatAiNumber(item.value)}</span>
                <span className="w-9 text-end text-muted-foreground">{item.percent}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-success/5 p-3 text-xs text-success">
            <Target className="size-4 shrink-0" />
            <span>Cached context helps reduce repeated processing.</span>
          </div>
        </Card>
        <Card
          title="Recent AI workloads"
          description="Sample runs from October 9, 2026"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Badge tone="primary" size="sm">
              {workloads.length} runs
            </Badge>
          }
        >
          <div className="divide-y divide-border">
            {workloads.map((workload) => (
              <div key={workload.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{workload.name}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {AI_MODELS.find((model) => model.id === workload.modelId)?.name} ·{" "}
                    {workload.time}
                  </p>
                </div>
                <div className="hidden text-end sm:block">
                  <p className="text-xs font-medium">{formatAiNumber(workload.tokens)} tokens</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{workload.duration}</p>
                </div>
                <Badge tone={workload.status === "Completed" ? "success" : "warning"} size="sm">
                  {workload.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View model for ${workload.name}`}
                  onClick={() =>
                    setSelectedModel(
                      AI_MODELS.find((model) => model.id === workload.modelId) ?? null,
                    )
                  }
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <WandSparkles className="size-4 text-primary" />
        <h2 className="text-[15px] font-semibold">Workspace insights</h2>
        <span className="ms-auto text-xs text-muted-foreground">Based on the selected sample</span>
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Insight
          icon={<ArrowUpRight className="size-5" />}
          title="Usage is growing"
          tone="bg-primary/10 text-primary"
          description={`Request volume is up ${data.change.toFixed(1)}% compared with the previous period. Track capacity as your AI workflows scale.`}
          footer={`${data.requests.toLocaleString("en-US")} requests processed`}
        />
        <Insight
          icon={<ArrowDownRight className="size-5" />}
          title="Keep an eye on cost"
          tone="bg-success/10 text-success"
          description={`Your average cost is ${formatAiCost((data.cost / (data.requests || 1)) * 1000)} per 1,000 requests. Route simple tasks to smaller models to keep spend predictable.`}
          footer={`${formatAiCost(data.cost / Number(period))} average daily spend`}
        />
        <Insight
          icon={<ShieldCheck className="size-5" />}
          title="Quality stays consistent"
          tone="bg-info/10 text-info"
          description={`${data.success.toFixed(1)}% of requests completed successfully. ${data.models.some((model) => model.status === "Elevated latency") ? "Vision One has elevated latency; review image sizes and request complexity." : "All selected models are operating within their latency targets."}`}
          footer={`${data.latency.toFixed(2)}s weighted average response`}
        />
      </div>

      <Card
        title="Model performance"
        description="Compare usage, reliability, and cost across your AI models"
        action={<Badge tone="primary">{data.models.length} models</Badge>}
        bodyClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-5">Model</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Avg. latency</TableHead>
              <TableHead>Success rate</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-5">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.models.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="ps-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                      <Bot className="size-4" style={{ color: `var(${model.color})` }} />
                    </span>
                    <div>
                      <p className="whitespace-nowrap text-[13px] font-semibold">{model.name}</p>
                      <p className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
                        {model.category}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{formatAiNumber(model.requests)}</TableCell>
                <TableCell className="tabular-nums">{formatAiNumber(model.tokens)}</TableCell>
                <TableCell className="tabular-nums">{model.latency.toFixed(2)}s</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <Check className="size-3.5" />
                    {model.success}%
                  </span>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatAiCost(model.cost)}
                </TableCell>
                <TableCell>
                  <Badge tone={model.status === "Healthy" ? "success" : "warning"} size="sm">
                    {model.status}
                  </Badge>
                </TableCell>
                <TableCell className="pe-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${model.name} details`}
                    onClick={() =>
                      setSelectedModel(AI_MODELS.find((item) => item.id === model.id) ?? null)
                    }
                  >
                    <ChevronRight className="size-4 rtl:rotate-180" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            Showing {data.models.length} of {AI_MODELS.length} models
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Activity className="size-3.5" />
            Sample reporting period · Last {period} days
          </span>
        </div>
      </Card>

      <Dialog
        open={selectedModel !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedModel(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedModel?.name} performance</DialogTitle>
            <DialogDescription>
              Sample analytics for the last {period} days, ending October 9, 2026.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Requests", selected.requests.toLocaleString("en-US")],
                  ["Tokens", formatAiNumber(selected.tokens)],
                  ["Total cost", formatAiCost(selected.cost)],
                  ["Success rate", `${selected.success}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4 text-sm">
                <Clock3 className="size-4 text-primary" />
                <span>
                  Average response time: <strong>{selected.latency.toFixed(2)}s</strong>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selected.category}.{" "}
                {selected.status === "Healthy"
                  ? "This model is operating within its latency target."
                  : "Review image input sizes and request complexity to reduce response time."}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Insight({
  icon,
  title,
  description,
  footer,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  footer: string;
  tone: string;
}) {
  return (
    <section className="vexui-card flex flex-col p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${tone}`}>{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <p className="mt-4 border-t border-border pt-3 text-xs font-medium">{footer}</p>
    </section>
  );
}
