import { useMemo, useState } from "react";

import {
  Archive,
  ArrowRight,
  ChevronRight,
  CircleCheck,
  Clock3,
  Copy,
  Gift,
  PackageOpen,
  Play,
  ReceiptText,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Truck,
  Undo2,
} from "lucide-react";

import { toast } from "sonner";

import { ApexChart } from "@/components/charts/ApexChart";

import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

import { Badge, Card, PageHeader } from "./widgets";

import { Button } from "@/components/ui/button";

/* =====================================================
   Live Orders
===================================================== */

const liveOrders = [
  ["2m", "#NV-10482", "Olivia Chen", "$548.00", "3 items", "New"],
  ["7m", "#NV-10481", "Marcus Rivera", "$249.00", "1 item", "Paid"],
  ["12m", "#NV-10480", "Ava Patel", "$1,290.00", "4 items", "Packed"],
  ["18m", "#NV-10479", "Ryan Cooper", "$326.00", "2 items", "Paid"],
];

/* =====================================================
   Fulfillment Lanes
===================================================== */

const lanes = [
  ["Pack now", "8", "Aurora Headphones  4", "Atlas Desk Lamp  2", "bg-amber-400"],
  ["Carrier pickup", "14", "Express collection  13:30", "Standard collection  16:00", "bg-primary"],
  ["Exception desk", "3", "Address validation  2", "Payment review  1", "bg-rose-500"],
];

/* =====================================================
   Ecommerce Dashboard
===================================================== */

export function EcommerceDashboard() {
  const { base } = useChartTheme();

  const [promoLive, setPromoLive] = useState(true);

  const [copied, setCopied] = useState(false);

  const [orders, setOrders] = useState(liveOrders);

  /* =====================================================
     Margin Chart Options
  ===================================================== */

  const marginOptions = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
        },

        colors: [token("--primary"), token("--chart-3")],

        stroke: {
          curve: "smooth",
          width: [3, 3],
          dashArray: [0, 6],
        },

        fill: {
          type: ["gradient", "solid"],

          gradient: {
            opacityFrom: 0.34,
            opacityTo: 0.03,
          },
        },

        dataLabels: {
          enabled: false,
        },

        xaxis: {
          categories: ["Aug 1", "5", "9", "13", "17", "21", "25", "Today"],
        },

        yaxis: {
          min: 30,
          max: 70,

          labels: {
            formatter: (value: number) => `${value}%`,
          },
        },

        grid: {
          borderColor: token("--border"),

          strokeDashArray: 4,
        },

        legend: {
          position: "top",
          horizontalAlign: "right",
          fontSize: "12px",
        },

        tooltip: {
          y: {
            formatter: (value: number) => `${value.toFixed(1)}%`,
          },
        },
      }),

    [base],
  );

  /* =====================================================
     Basket Chart Options
  ===================================================== */

  const basketOptions = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "donut",
        },

        labels: ["Single item", "2 items", "3 items", "4+ items"],

        colors: [token("--primary"), token("--chart-2"), token("--chart-3"), token("--chart-4")],

        legend: {
          show: false,
        },

        dataLabels: {
          enabled: false,
        },

        stroke: {
          width: 0,
        },

        plotOptions: {
          pie: {
            donut: {
              size: "72%",

              labels: {
                show: true,

                total: {
                  show: true,
                  label: "Items / order",

                  formatter: () => "2.6",
                },
              },
            },
          },
        },
      }),

    [base],
  );

  /* =====================================================
     Copy Promotion Code
  ===================================================== */

  const copyCode = () => {
    setCopied(true);

    navigator.clipboard?.writeText("AURORA20");

    toast.success("Promo code copied");
  };

  /* =====================================================
     Complete Order
  ===================================================== */

  const completeOrder = (id: string) => {
    setOrders((items) => items.filter((item) => item[1] !== id));

    toast.success(`${id} sent to fulfillment`);
  };

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Commerce"
        subtitle="A hands-on workspace for merchandising, order operations and customer purchase behavior."
        breadcrumb={["Vexui", "Dashboards", "eCommerce"]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Store settings opened")}>
              <SlidersHorizontal />
              Store controls
            </Button>

            <Button size="sm" onClick={() => toast.success("New collection draft created")}>
              <Gift />
              Create collection
            </Button>
          </>
        }
      />

      {/* =================================================
          Hero + Live Orders
      ================================================= */}

      <div className="grid gap-4 xl:grid-cols-12">
        {/* Merchandising Spotlight */}

        <section className="relative min-h-[290px] overflow-hidden rounded-2xl bg-primary/10 p-6 shadow-card sm:p-8 xl:col-span-7">
          <div className="absolute -end-20 -top-14 size-72 rounded-full border-[30px] border-primary/5" />

          <div className="absolute bottom-[-90px] end-24 size-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                <Sparkles className="size-3.5" />
                Merchandising spotlight
              </span>

              <p className="mt-5 text-sm">This weeks featured collection</p>

              <h2 className="mt-1 max-w-md text-3xl font-semibold tracking-tight">
                Desk setups that work harder.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6">
                The Workspace Edit is outperforming the homepage average with a 6.8% conversion rate
                and a $182 basket value.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="bg-success text-white hover:bg-slate-100"
                size="sm"
                onClick={() => toast.info("Collection editor opened")}
              >
                Edit collection
                <ArrowRight />
              </Button>

              <span className="text-xs">+28% conversion since feature</span>
            </div>
          </div>
        </section>

        {/* Order Tape */}

        <Card
          className="xl:col-span-5"
          title="The order tape"
          description="Every paid order entering the store now"
          action={
            <Badge tone="success" variant="dot">
              Live
            </Badge>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y">
            {orders.length ? (
              orders.map(([time, id, customer, value, items, status]) => (
                <div key={id} className="group flex items-center gap-3 px-5 py-3.5">
                  <time className="w-7 text-xs font-semibold text-primary">{time}</time>

                  <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ReceiptText className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block text-sm">{customer}</b>

                    <small className="block text-xs text-muted-foreground">
                      {id} {items}
                    </small>
                  </span>

                  <span className="text-end">
                    <b className="block text-sm">{value}</b>

                    <small className="text-xs text-muted-foreground">{status}</small>
                  </span>

                  <button
                    type="button"
                    onClick={() => completeOrder(id)}
                    className="hidden rounded-md p-1.5 text-success hover:bg-success/10 group-hover:block"
                    aria-label={`Complete ${id}`}
                  >
                    <CircleCheck className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="grid min-h-48 place-items-center text-sm text-muted-foreground">
                Order tape is clear
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* =================================================
          Margin + Basket
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* Margin Momentum */}

        <Card
          className="xl:col-span-7"
          title="Margin momentum"
          description="Gross margin performance against the store target"
          action={<Badge tone="success">$96.4K gross profit</Badge>}
        >
          <ApexChart
            type="line"
            height={280}
            options={marginOptions}
            series={[
              {
                name: "Gross margin",

                type: "area",

                data: [44, 47, 45, 51, 49, 55, 53, 58],
              },
              {
                name: "Margin target",

                type: "line",

                data: [50, 50, 50, 50, 50, 50, 50, 50],
              },
            ]}
          />

          <p className="mt-3 text-xs text-muted-foreground">
            <b className="text-foreground">Merchandising cue:</b> gross margin is now 8 points above
            target, led by bundle sales and accessory attach rate.
          </p>
        </Card>

        {/* Basket Composer */}

        <Card
          className="xl:col-span-5"
          title="Basket composer"
          description="What customers are adding together"
        >
          <div className="flex items-center justify-center">
            <ApexChart
              type="donut"
              height={220}
              options={basketOptions}
              series={[32, 38, 19, 11]}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["Single item", "32%"],
              ["2 items", "38%"],
              ["3 items", "19%"],
              ["4+ items", "11%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-muted/55 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{label}</span>

                <b className="float-right">{value}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Fulfillment Control Tower
      ================================================= */}

      <section className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-card">
        {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Truck className="size-4" />
            </span>

            <div>
              <h2 className="text-[15px] font-semibold">Fulfillment control tower</h2>

              <p className="text-[12.5px] text-muted-foreground">
                Todays order handoff, warehouse pace and carrier capacity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-warning/12 px-3 py-1.5 text-xs font-semibold text-warning">
            <Clock3 className="size-3.5" />
            Next carrier cutoff in 41 min
          </div>
        </div>

        <div className="grid xl:grid-cols-[1.2fr_.8fr]">
          {/* Warehouse Progress */}

          <div className="p-5">
            <div className="relative grid gap-3 md:grid-cols-3">
              {[
                ["Scan queue", "18", "Orders awaiting pick", "bg-primary", "42% complete"],
                ["Pack bench", "12", "Orders being packed", "bg-info", "68% complete"],
                ["Carrier handoff", "14", "Ready for collection", "bg-success", "86% complete"],
              ].map(([stage, count, note, color, progress], index) => (
                <div key={stage} className="relative rounded-xl border bg-background/50 p-4">
                  {index < 2 && (
                    <span className="absolute -end-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 rounded-full border bg-card md:block" />
                  )}

                  <span className={`block size-2.5 rounded-full ${color}`} />

                  <b className="mt-4 block text-3xl">{count}</b>

                  <h3 className="mt-1 text-sm font-semibold">{stage}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">{note}</p>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{progress}</span>

                    <button
                      type="button"
                      onClick={() => toast.info(`${stage} opened`)}
                      className="font-semibold text-primary"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SLA */}

            <div className="mt-5 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  <b className="block text-sm">SLA forecast: 96% on time</b>

                  <small className="text-xs text-muted-foreground">
                    Two express orders need a scan before the 13:30 pickup.
                  </small>
                </span>

                <Button size="sm" onClick={() => toast.success("Priority pick list created")}>
                  <PackageOpen />
                  Create pick list
                </Button>
              </div>
            </div>
          </div>

          {/* Carrier Capacity */}

          <aside className="border-t bg-muted/30 p-5 xl:border-s xl:border-t-0">
            <h3 className="text-sm font-semibold">Carrier capacity</h3>

            <div className="mt-4 space-y-4">
              {[
                ["Express collection", "13:30", "84%", "bg-primary"],
                ["Standard collection", "16:00", "52%", "bg-info"],
                ["Same-day courier", "17:30", "36%", "bg-success"],
              ].map(([carrier, time, capacity, color]) => (
                <div key={carrier}>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      <b className="block">{carrier}</b>

                      <small className="text-xs text-muted-foreground">Pickup {time}</small>
                    </span>

                    <b>{capacity}</b>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{
                        width: capacity,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => toast.warning("3 fulfillment exceptions need review")}
              className="mt-5 flex w-full items-center justify-between rounded-xl border border-warning/30 bg-warning/8 p-3 text-start"
            >
              <span>
                <b className="block text-sm text-warning">3 exceptions</b>

                <small className="text-xs text-muted-foreground">Address and payment reviews</small>
              </span>

              <ChevronRight className="size-4 text-warning rtl:rotate-180" />
            </button>
          </aside>
        </div>
      </section>

      {/* =================================================
          Promotion + Commerce Signals
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* Promotion */}

        <Card
          className="xl:col-span-5"
          title="Promotion test bench"
          description="A single promotion with its actual trading impact"
        >
          <div className="rounded-xl bg-amber-400/12 p-4">
            <div className="flex items-start justify-between">
              <span>
                <p className="text-xs font-medium text-amber-700">Active code</p>

                <h3 className="mt-1 text-xl font-semibold">AURORA20</h3>
              </span>

              <button
                type="button"
                onClick={copyCode}
                className="rounded-md bg-card p-2 text-amber-700 shadow-sm"
                aria-label="Copy promotion code"
              >
                <Copy className="size-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              20% off selected audio. Ends Sunday at 23:59.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <b className="block text-lg">184</b>
              Uses
            </div>

            <div>
              <b className="block text-lg">$8.4K</b>
              Revenue
            </div>

            <div>
              <b className="block text-lg text-success">3.9</b>
              Return
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => setPromoLive(!promoLive)}>
              {promoLive ? (
                <>
                  <Undo2 />
                  Pause code
                </>
              ) : (
                <>
                  <Play />
                  Resume code
                </>
              )}
            </Button>

            <Button size="sm" variant="outline" onClick={copyCode}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </Card>

        {/* Commerce Signals */}

        <Card
          className="xl:col-span-7"
          title="Commerce signals"
          description="A short list of decisions worth making today"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {[
              [
                "Returns are falling",
                "Lighting returns dropped to 1.1% after the new sizing guide.",
                "Positive",
                "bg-success/12 text-success",
                RotateCcw,
              ],
              [
                "Pickup capacity",
                "The 13:30 carrier collection is 86% full. Add one more cage.",
                "Action needed",
                "bg-warning/16 text-warning",
                Truck,
              ],
              [
                "New customer lift",
                "First-time buyers are adding 0.4 more items per order this week.",
                "Opportunity",
                "bg-primary/12 text-primary",
                Archive,
              ],
            ].map(([title, detail, tag, color, Icon]) => (
              <article key={title as string} className="rounded-xl border p-4">
                <span className={`grid size-9 place-items-center rounded-lg ${color as string}`}>
                  <Icon className="size-4" />
                </span>

                <h3 className="mt-4 text-sm font-semibold">{title as string}</h3>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail as string}</p>

                <Badge
                  tone={
                    tag === "Positive" ? "success" : tag === "Action needed" ? "warning" : "primary"
                  }
                  className="mt-4"
                >
                  {tag as string}
                </Badge>
              </article>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Cart Recovery / Returns / Customer Loop
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* Cart Recovery */}

        <Card
          className="xl:col-span-5"
          title="Cart recovery workbench"
          description="The current abandoned-cart sequence and its payoff"
        >
          <div className="relative ms-2 border-s border-primary/25 ps-5">
            {[
              ["After 30 min", "Reminder email", "684 shoppers in sequence", "42% open rate"],
              [
                "After 4 hrs",
                "Dynamic product message",
                "402 eligible shoppers",
                "18% recovery rate",
              ],
              ["After 24 hrs", "Limited stock nudge", "186 eligible shoppers", "9% recovery rate"],
            ].map(([when, title, detail, result]) => (
              <div key={when} className="relative pb-5 last:pb-0">
                <span className="absolute -start-[25px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />

                <small className="font-semibold text-primary">{when}</small>

                <div className="mt-1 flex items-start justify-between gap-3">
                  <span>
                    <b className="block text-sm">{title}</b>

                    <small className="block text-xs text-muted-foreground">{detail}</small>
                  </span>

                  <Badge tone="success">{result}</Badge>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-5 w-full"
            size="sm"
            onClick={() => toast.success("Recovery sequence opened for editing")}
          >
            <Play />
            Edit recovery sequence
          </Button>
        </Card>

        {/* Returns Intelligence */}

        <Card
          className="xl:col-span-4"
          title="Returns intelligence"
          description="Why customers are sending items back"
        >
          <div className="space-y-3">
            {[
              ["Changed mind", "38%", "Most common for accessories", "bg-muted-foreground"],
              ["Fit or size", "26%", "Lighting and furniture", "bg-warning"],
              ["Damaged in transit", "14%", "Down 3.2 pts this month", "bg-destructive"],
              ["Not as expected", "12%", "Improve product detail pages", "bg-info"],
            ].map(([reason, share, note, color]) => (
              <div key={reason} className="flex items-center gap-3">
                <span className={`size-2.5 rounded-full ${color}`} />

                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{reason}</b>

                  <small className="block truncate text-xs text-muted-foreground">{note}</small>
                </span>

                <b className="text-sm">{share}</b>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => toast.info("Returns report opened")}
            className="mt-5 inline-flex items-center text-xs font-semibold text-primary"
          >
            Open return report
            <ChevronRight className="size-3.5 rtl:rotate-180" />
          </button>
        </Card>

        {/* Customer Loop */}

        <Card
          className="xl:col-span-3"
          title="Customer loop"
          description="From first order to loyal buyer"
        >
          <div className="space-y-3">
            {[
              ["First purchase", "1,284", "100%"],
              ["Second order", "486", "38%"],
              ["Loyal customer", "212", "16%"],
              ["Advocate", "84", "7%"],
            ].map(([label, customers, rate], index) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {index + 1}
                </span>

                <span className="flex-1">
                  <b className="block text-sm">{label}</b>

                  <small className="text-xs text-muted-foreground">{customers} customers</small>
                </span>

                <span className="text-xs font-semibold">{rate}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-success/8 p-3 text-xs text-muted-foreground">
            <b className="text-success">Retention win:</b> loyalty members reorder 21 days sooner.
          </div>
        </Card>
      </div>
    </>
  );
}
