import { useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  Bookmark,
  CheckCheck,
  Search,
  Download,
  Target,
  Layers,
  TrendingUp,
  RotateCcw,
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

const records = [
  {
    id: "INS-101",
    title: "Returning customers drive revenue growth",
    category: "Revenue",
    confidence: 96,
    impact: "High",
    metric: "+18.4%",
    label: "Revenue opportunity",
    owner: "Revenue team",
    source: "Customer cohorts",
    sample: 1240,
    evidence: "Returning customers contribute 62% of revenue in the sample cohort.",
    action: "Test a loyalty offer for customers with two or more purchases.",
    trend: [38, 42, 48, 46, 58, 62, 71],
  },
  {
    id: "INS-102",
    title: "Support requests peak on Mondays",
    category: "Operations",
    confidence: 92,
    impact: "Medium",
    metric: "28%",
    label: "Weekly support demand",
    owner: "Support team",
    source: "Support tickets",
    sample: 846,
    evidence: "Monday accounts for 28% of weekly requests, with the highest demand before noon.",
    action: "Move an additional support shift to Monday mornings and compare response times.",
    trend: [30, 34, 28, 42, 38, 46, 48],
  },
  {
    id: "INS-103",
    title: "Trial activation needs a stronger onboarding path",
    category: "Customers",
    confidence: 89,
    impact: "High",
    metric: "2.1x",
    label: "Conversion potential",
    owner: "Product team",
    source: "Onboarding events",
    sample: 620,
    evidence: "Trial users completing the onboarding checklist are 2.1 times as likely to convert.",
    action: "Add a guided checklist and test a reminder after 48 hours of inactivity.",
    trend: [20, 25, 24, 32, 38, 43, 51],
  },
  {
    id: "INS-104",
    title: "Inventory coverage is low for top sellers",
    category: "Operations",
    confidence: 94,
    impact: "High",
    metric: "3 SKUs",
    label: "Reorder recommendations",
    owner: "Inventory team",
    source: "Inventory snapshots",
    sample: 184,
    evidence: "Three high-demand products have less than ten days of inventory coverage.",
    action: "Review supplier lead times and reorder thresholds before the next campaign.",
    trend: [75, 68, 65, 54, 48, 36, 29],
  },
  {
    id: "INS-105",
    title: "Segmented campaigns improve engagement",
    category: "Marketing",
    confidence: 87,
    impact: "Medium",
    metric: "+7.8%",
    label: "Click-through lift",
    owner: "Marketing team",
    source: "Campaign reports",
    sample: 3200,
    evidence: "Segmented campaigns show a 7.8% click-through lift over the unsegmented sample.",
    action: "Test separate campaign messages for new and returning customers.",
    trend: [25, 29, 32, 30, 38, 45, 49],
  },
  {
    id: "INS-106",
    title: "Retention improves after guided onboarding",
    category: "Customers",
    confidence: 95,
    impact: "Medium",
    metric: "+4.2 pts",
    label: "Retention change",
    owner: "Success team",
    source: "Retention cohorts",
    sample: 960,
    evidence: "The guided onboarding sample shows a 4.2-point improvement in retention.",
    action: "Review the most successful onboarding journeys and reuse their steps.",
    trend: [52, 54, 53, 58, 61, 64, 67],
  },
  {
    id: "INS-107",
    title: "Checkout abandonment spikes on mobile",
    category: "Revenue",
    confidence: 91,
    impact: "High",
    metric: "34%",
    label: "Mobile abandonment",
    owner: "Commerce team",
    source: "Checkout events",
    sample: 2150,
    evidence: "Mobile users leave the payment step more often than desktop users in this sample.",
    action: "Test a shorter checkout and review payment validation messages on mobile.",
    trend: [24, 27, 26, 30, 32, 35, 34],
  },
  {
    id: "INS-108",
    title: "Organic content attracts qualified leads",
    category: "Marketing",
    confidence: 90,
    impact: "Medium",
    metric: "+11.2%",
    label: "Qualified lead growth",
    owner: "Growth team",
    source: "Acquisition reports",
    sample: 780,
    evidence: "Organic content referrals produce 11.2% more qualified leads in the sample period.",
    action: "Extend the two highest-performing topics and measure lead quality.",
    trend: [22, 28, 26, 34, 40, 44, 52],
  },
];
const palette = {
  Revenue: "primary",
  Customers: "info",
  Operations: "warning",
  Marketing: "success",
} as const;
const colors: Record<string, { text: string; soft: string; light: string; solid: string }> = {
  primary: {
    text: "text-primary",
    soft: "bg-primary/10 text-primary",
    light: "bg-primary/5",
    solid: "bg-primary",
  },
  info: { text: "text-info", soft: "bg-info/10 text-info", light: "bg-info/5", solid: "bg-info" },
  warning: {
    text: "text-warning",
    soft: "bg-warning/10 text-warning",
    light: "bg-warning/5",
    solid: "bg-warning",
  },
  success: {
    text: "text-success",
    soft: "bg-success/10 text-success",
    light: "bg-success/5",
    solid: "bg-success",
  },
};
type Status = "New" | "Reviewed" | "In progress";
export function InsightsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("priority");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [selected, setSelected] = useState<(typeof records)[number] | null>(null);
  const [notice, setNotice] = useState("");
  const { base } = useChartTheme();
  const reviewed = records.filter((r) => statuses[r.id] === "Reviewed").length;
  const inProgress = records.filter((r) => statuses[r.id] === "In progress").length;
  const visible = records
    .filter(
      (r) =>
        `${r.title} ${r.id} ${r.owner} ${r.source}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (category === "All" || category === r.category) &&
        (status === "All" || status === (statuses[r.id] ?? "New")) &&
        (!savedOnly || saved.includes(r.id)),
    )
    .sort((a, b) =>
      sort === "confidence"
        ? b.confidence - a.confidence
        : sort === "title"
          ? a.title.localeCompare(b.title)
          : Number(b.impact === "High") - Number(a.impact === "High") ||
            b.confidence - a.confidence,
    );
  const chartOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--info")],
    stroke: { width: [0, 3], curve: "smooth" },
    plotOptions: { bar: { columnWidth: "35%", borderRadius: 4 } },
    fill: { type: ["solid", "gradient"], opacity: [0.85, 0.2] },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9"] },
    yaxis: { min: 0, forceNiceScale: true, title: { text: "Insights" } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true, intersect: false },
  });
  const download = () => {
    const rows = [
      ["ID", "Title", "Category", "Impact", "Confidence", "Status", "Owner"],
      ...visible.map((r) => [
        r.id,
        r.title,
        r.category,
        r.impact,
        String(r.confidence),
        statuses[r.id] ?? "New",
        r.owner,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((v) => '"' + v.replaceAll('"', '""') + '"').join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-insights.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} insights.`);
  };
  const update = (value: Status) => {
    if (selected) {
      setStatuses((prev) => ({ ...prev, [selected.id]: value }));
      setNotice(`${selected.id} marked ${value.toLowerCase()}.`);
      setSelected(null);
    }
  };
  return (
    <>
      <PageHeader
        title="AI Insights"
        subtitle="Turn signals into focused actions. Explore illustrative findings across your business."
        breadcrumb={["Management", "AI Analytics", "AI Insights"]}
        actions={
          <Button variant="outline" onClick={download}>
            <Download className="size-4" />
            Export insights
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Insights discovered",
            value: records.length,
            caption: "Across four business areas",
            Icon: Sparkles,
            tone: "primary",
          },
          {
            label: "High-impact opportunities",
            value: records.filter((r) => r.impact === "High").length,
            caption: "Prioritize for your next review",
            Icon: TrendingUp,
            tone: "warning",
          },
          {
            label: "Reviewed insights",
            value: reviewed,
            caption: `${records.length - reviewed} remaining to review`,
            Icon: CheckCheck,
            tone: "success",
          },
          {
            label: "Actions in progress",
            value: inProgress,
            caption: "Recommendations being evaluated",
            Icon: Target,
            tone: "info",
          },
        ].map(({ label, value, caption, Icon, tone }) => (
          <Card key={label} bodyClassName="p-5">
            <div className="flex items-center gap-3">
              <span className={`grid size-11 place-items-center rounded-2xl ${colors[tone].soft}`}>
                <Icon className="size-5" />
              </span>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div className="mt-4 flex items-end justify-between gap-2">
              <p className="text-3xl font-semibold">{value}</p>
              <span className={`${colors[tone].text}`}>
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card
          title="Insight discovery"
          description="Fixed sample history for Oct 3-9, 2026"
          action={<Badge tone="primary">7-day overview</Badge>}
        >
          <ApexChart
            type="line"
            height={245}
            options={chartOptions}
            series={[
              { name: "Discovered", type: "column", data: [12, 18, 15, 24, 20, 28, 32] },
              { name: "High impact", type: "area", data: [4, 6, 5, 9, 8, 11, 13] },
            ]}
          />
        </Card>
        <Card
          title="Focus areas"
          description="Choose a business area to explore its findings"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {Object.entries(palette).map(([name, tone]) => {
              const count = records.filter((r) => r.category === name).length;
              return (
                <button
                  key={name}
                  onClick={() => setCategory(category === name ? "All" : name)}
                  aria-pressed={category === name}
                  className={`w-full rounded-xl border p-3 text-start ${category === name ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className={`size-2 rounded-full ${colors[tone].solid}`} />
                      {name}
                    </span>
                    <span className="text-xs text-muted-foreground">{count} insights</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${colors[tone].solid}`}
                      style={{ width: `${(count / records.length) * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      {notice && (
        <p role="status" className="mb-4 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Your insight feed</h2>
          <p className="text-xs text-muted-foreground">
            {visible.length} of {records.length} insights - sample data, session-only changes
          </p>
        </div>
        <Button
          variant={savedOnly ? "default" : "outline"}
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly((v) => !v)}
        >
          <Bookmark className="size-4" />
          Saved ({saved.length})
        </Button>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-52">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search AI records"
            className="ps-9"
            placeholder="Search title, owner, or source..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {[
          {
            label: "Filter AI records",
            value: category,
            set: setCategory,
            options: ["All", "Revenue", "Customers", "Operations", "Marketing"],
          },
          {
            label: "Insight status",
            value: status,
            set: setStatus,
            options: ["All", "New", "Reviewed", "In progress"],
          },
        ].map((f) => (
          <select
            key={f.label}
            aria-label={f.label}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
          >
            {f.options.map((v) => (
              <option key={v} value={v}>
                {v === "All"
                  ? f.label === "Insight status"
                    ? "All statuses"
                    : "All categories"
                  : v}
              </option>
            ))}
          </select>
        ))}
        <select
          aria-label="Sort insights"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="priority">Highest impact</option>
          <option value="confidence">Highest confidence</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => {
          const tone = palette[item.category as keyof typeof palette];
          return (
            <Card key={item.id} bodyClassName="p-0">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span
                  className={`flex items-center gap-2 text-xs font-semibold ${colors[tone].text}`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${colors[tone].soft}`}
                  >
                    <Layers className="size-4" />
                  </span>
                  {item.category}
                </span>
                <button
                  aria-label={`Save ${item.id}`}
                  aria-pressed={saved.includes(item.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                  onClick={() =>
                    setSaved((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((id) => id !== item.id)
                        : [...prev, item.id],
                    )
                  }
                >
                  <Bookmark
                    className={`size-4 ${saved.includes(item.id) ? "fill-primary text-primary" : ""}`}
                  />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone={item.impact === "High" ? "warning" : "info"}>
                    {item.impact} impact
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{item.id}</span>
                </div>
                <h3 className="min-h-12 text-base font-semibold leading-6">{item.title}</h3>
                <p className="mt-3 min-h-16 text-xs leading-5 text-muted-foreground">
                  {item.evidence}
                </p>
                <div
                  className={`mt-4 flex items-end justify-between gap-3 rounded-xl ${colors[tone].light} p-4`}
                >
                  <div>
                    <p className="text-2xl font-semibold">{item.metric}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{item.label}</p>
                  </div>
                  <svg
                    viewBox="0 0 90 45"
                    className={`h-10 w-20 shrink-0 ${colors[tone].text}`}
                    role="img"
                    aria-label="Seven-point illustrative trend"
                  >
                    <polyline
                      points={item.trend.map((v, i) => `${i * 14},${45 - v * 0.5}`).join(" ")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sample confidence</span>
                  <span className="font-semibold">{item.confidence}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${colors[tone].solid}`}
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{item.owner}</span>
                  <Badge
                    tone={
                      statuses[item.id] === "Reviewed"
                        ? "success"
                        : statuses[item.id] === "In progress"
                          ? "info"
                          : "muted"
                    }
                  >
                    {statuses[item.id] ?? "New"}
                  </Badge>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setSelected(item)}>
                  Review insight
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      {!visible.length && (
        <Card bodyClassName="p-10 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No matching insights</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adjust your filters or show all insights.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setStatus("All");
              setSavedOnly(false);
            }}
          >
            <RotateCcw className="size-4" />
            Reset filters
          </Button>
        </Card>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.id} - Sample analysis, not a live AI output
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-4">
                {[
                  ["Impact", selected.impact],
                  ["Confidence", `${selected.confidence}%`],
                  ["Sample records", selected.sample.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold">What the data suggests</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.evidence}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Source: {selected.source} - Oct 3-9, 2026
                </p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="size-4 text-primary" />
                  Recommended next step
                </h3>
                <p className="mt-2 text-sm leading-6">{selected.action}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Suggested owner: {selected.owner}
                </p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Confidence scores and trends are illustrative. Validate the underlying data before
                acting. Changing review status does not assign work or notify a team.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => update("Reviewed")}>
                  <CheckCheck className="size-4" />
                  Mark reviewed
                </Button>
                <Button variant="outline" onClick={() => update("In progress")}>
                  Start review
                </Button>
                {statuses[selected.id] && (
                  <Button variant="ghost" onClick={() => update("New")}>
                    Reopen
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
