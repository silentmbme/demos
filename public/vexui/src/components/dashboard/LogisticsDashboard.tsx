import { useState } from "react";
import { Truck, Package, MapPin, CheckCheck, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, Badge, PageHeader } from "./widgets";
const initialShipments = [
  {
    id: "SHP-1001",
    customer: "Northstar Retail",
    origin: "Mumbai",
    destination: "Pune",
    status: "In transit",
    weight: 240,
    driver: "Daniel Lee",
    vehicle: "TRK-01",
    eta: "October 10, 2026",
    progress: 65,
  },
  {
    id: "SHP-1002",
    customer: "Greenfield Foods",
    origin: "Bengaluru",
    destination: "Chennai",
    status: "Delivered",
    weight: 180,
    driver: "Sophia Carter",
    vehicle: "TRK-02",
    eta: "October 9, 2026",
    progress: 100,
  },
  {
    id: "SHP-1003",
    customer: "Atlas Supplies",
    origin: "Delhi",
    destination: "Jaipur",
    status: "Pending",
    weight: 360,
    driver: "James Wilson",
    vehicle: "TRK-03",
    eta: "October 11, 2026",
    progress: 0,
  },
  {
    id: "SHP-1004",
    customer: "Urban Living",
    origin: "Hyderabad",
    destination: "Vijayawada",
    status: "Delayed",
    weight: 120,
    driver: "Maya Patel",
    vehicle: "TRK-04",
    eta: "October 11, 2026",
    progress: 40,
  },
  {
    id: "SHP-1005",
    customer: "Summit Electronics",
    origin: "Mumbai",
    destination: "Nashik",
    status: "In transit",
    weight: 210,
    driver: "Olivia Smith",
    vehicle: "TRK-05",
    eta: "October 10, 2026",
    progress: 80,
  },
  {
    id: "SHP-1006",
    customer: "Cedar Trading",
    origin: "Delhi",
    destination: "Agra",
    status: "Delivered",
    weight: 150,
    driver: "Noah Williams",
    vehicle: "TRK-06",
    eta: "October 9, 2026",
    progress: 100,
  },
];
type Shipment = (typeof initialShipments)[number];
export function LogisticsDashboardPage() {
  return (
    <AppShell navigationPath="/dashboards/logistics-dashboard">
      <LogisticsDashboard />
    </AppShell>
  );
}
export function LogisticsDashboard() {
  const [shipments, setShipments] = useState(initialShipments);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const visible = shipments.filter(
    (s) =>
      (status === "All" || s.status === status) &&
      `${s.id} ${s.customer} ${s.origin} ${s.destination}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const statuses = ["Pending", "In transit", "Delayed", "Delivered"];
  const { base } = useChartTheme();
  const distribution = mergeOptions(base, {
    labels: statuses,
    colors: [token("--chart-2"), token("--primary"), token("--chart-4"), token("--success")],
    stroke: { width: 2, colors: [token("--card")] },
    fill: { opacity: 0.8 },
    plotOptions: {
      polarArea: {
        rings: { strokeWidth: 1, strokeColor: token("--border") },
        spokes: { strokeWidth: 1, connectorColors: token("--border") },
      },
    },
    yaxis: { min: 0, labels: { show: false } },
    legend: { show: true, position: "bottom" },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (value: number) => value + " shipments" } },
  });
  const loadOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { width: [0, 3], curve: "smooth" },
    markers: { size: [0, 4] },
    plotOptions: { bar: { columnWidth: "30%", borderRadius: 5 } },
    xaxis: { categories: visible.map((s) => s.id.replace("SHP-", "")) },
    yaxis: [
      {
        seriesName: "Cargo weight",
        min: 0,
        labels: { formatter: (v: number) => Math.round(v) + " kg" },
      },
      {
        seriesName: "Route progress",
        opposite: true,
        min: 0,
        max: 100,
        labels: { formatter: (v: number) => Math.round(v) + "%" },
      },
    ],
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true, intersect: false },
  });
  function exportReport() {
    const rows = [
      ["Shipment", "Customer", "Origin", "Destination", "Status", "Weight kg", "Progress %"],
      ...visible.map((s) => [
        s.id,
        s.customer,
        s.origin,
        s.destination,
        s.status,
        s.weight,
        s.progress,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "logistics-shipments.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function deliver(id: string) {
    setShipments((current) =>
      current.map((s) => (s.id === id ? { ...s, status: "Delivered", progress: 100 } : s)),
    );
    setSelected(null);
    toast.success("Sample shipment marked delivered");
  }
  return (
    <>
      <PageHeader
        title="Logistics Dashboard"
        subtitle="Keep shipments, routes, and fleet operations moving."
        breadcrumb={["Dashboards", "Logistics"]}
        actions={
          <Button variant="outline" onClick={exportReport}>
            <Download className="size-4" />
            Export shipments
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <Truck className="size-8 text-primary" />
          <div>
            <p className="font-semibold">Every shipment. One clear view.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sample operations · October 9, 2026 · Session-only updates
            </p>
          </div>
        </div>
        <Badge tone="primary">Demo tracking</Badge>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Shipments in view",
            value: visible.length,
            icon: Package,
            color: "--primary",
            note: "Matching your current filters",
          },
          {
            label: "In transit",
            value: visible.filter((s) => s.status === "In transit").length,
            icon: Truck,
            color: "--info",
            note: "Shipments moving toward destination",
          },
          {
            label: "Delivered",
            value: visible.filter((s) => s.status === "Delivered").length,
            icon: CheckCheck,
            color: "--success",
            note: "Completed sample deliveries",
          },
          {
            label: "Needs attention",
            value: visible.filter((s) => s.status === "Delayed").length,
            icon: MapPin,
            color: "--warning",
            note: "Delayed shipments to review",
          },
        ].map((m) => (
          <section key={m.label} className="vexui-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-3 text-3xl font-semibold">{m.value}</p>
              </div>
              <span
                className="grid size-12 place-items-center rounded-xl"
                style={{
                  color: `var(${m.color})`,
                  background: `color-mix(in oklch,var(${m.color}) 12%,transparent)`,
                }}
              >
                <m.icon className="size-6" />
              </span>
            </div>
            <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
              {m.note}
            </p>
          </section>
        ))}
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Cargo & route progress"
          description="Weight in kilograms and progress percentage by shipment"
          className="xl:col-span-2"
        >
          {visible.length ? (
            <ApexChart
              type="bar"
              height={300}
              options={loadOptions}
              series={[
                { name: "Cargo weight", type: "column", data: visible.map((s) => s.weight) },
                { name: "Route progress", type: "area", data: visible.map((s) => s.progress) },
              ]}
            />
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No shipments match your filters.
            </p>
          )}
        </Card>
        <Card title="Shipment status" description="Current distribution in your filtered view">
          {visible.length ? (
            <ApexChart
              type="polarArea"
              height={300}
              options={distribution}
              series={statuses.map((status) => visible.filter((s) => s.status === status).length)}
            />
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">No shipments in view.</p>
          )}
        </Card>
      </div>
      <Card
        title="Shipment tracking"
        description={`${visible.length} shipments in view`}
        className="mb-6"
        bodyClassName="p-0"
        action={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search shipments"
                className="ps-9 sm:w-56"
                placeholder="Search ID, customer, or city…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              aria-label="Shipment status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 text-sm"
            >
              <option>All</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              {["Shipment", "Route", "Status", "Cargo", "ETA", ""].map((h, i) => (
                <TableHead key={i}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <p className="font-semibold">{s.id}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.customer}</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs">
                    {s.origin} → {s.destination}
                  </p>
                  <div className="mt-2 h-1.5 w-32 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: s.progress + "%" }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    tone={
                      s.status === "Delivered"
                        ? "success"
                        : s.status === "Delayed"
                          ? "warning"
                          : "primary"
                    }
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>{s.weight} kg</TableCell>
                <TableCell className="text-xs">{s.eta}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Track ${s.id}`}
                    onClick={() => setSelected(s)}
                  >
                    Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No matching shipments.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Fleet overview"
          description="Vehicles assigned to shipments in view"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((s) => (
              <div key={s.vehicle} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Truck className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{s.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{s.driver}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">
                    {s.origin} / {s.destination}
                  </span>
                  <span>{s.progress}%</span>
                </div>
              </div>
            ))}
          </div>
          {!visible.length && (
            <p className="text-sm text-muted-foreground">No assigned vehicles in view.</p>
          )}
        </Card>
        <Card title="Dispatch checklist" description="Sample daily operations" bodyClassName="p-5">
          <div className="space-y-4">
            {[
              "Review delayed shipments",
              "Confirm driver assignments",
              "Check cargo documentation",
              "Prepare next-day dispatch",
            ].map((item) => (
              <label key={item} className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="size-4 accent-primary" />
                {item}
              </label>
            ))}
          </div>
          <p className="mt-6 rounded-lg bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
            Tracking details are sample records. No live GPS or carrier connection is configured.
          </p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Delivery performance"
          description="Current filtered shipments"
          bodyClassName="p-5"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-success/10 text-success">
              <CheckCheck className="size-7" />
            </span>
            <div>
              <p className="text-3xl font-semibold">
                {visible.length
                  ? Math.round(
                      (visible.filter((s) => s.status === "Delivered").length / visible.length) *
                        100,
                    )
                  : 0}
                %
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Shipments completed</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success"
              style={{
                width:
                  (visible.length
                    ? (visible.filter((s) => s.status === "Delivered").length / visible.length) *
                      100
                    : 0) + "%",
              }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div>
              <p className="text-lg font-semibold">
                {visible.reduce((sum, s) => sum + s.weight, 0)} kg
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Total cargo in view</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {visible.length
                  ? Math.round(visible.reduce((sum, s) => sum + s.progress, 0) / visible.length)
                  : 0}
                %
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Average route progress</p>
            </div>
          </div>
        </Card>
        <Card
          title="Origin cargo load"
          description="Weight allocation across dispatch cities"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {[...new Set(visible.map((s) => s.origin))].map((origin) => {
              const weight = visible
                .filter((s) => s.origin === origin)
                .reduce((sum, s) => sum + s.weight, 0);
              const total = visible.reduce((sum, s) => sum + s.weight, 0);
              return (
                <div key={origin}>
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium">{origin}</span>
                    <span className="text-muted-foreground">{weight} kg</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: (weight / total) * 100 + "%" }}
                    />
                  </div>
                </div>
              );
            })}
            {!visible.length && (
              <p className="text-sm text-muted-foreground">No cargo in this view.</p>
            )}
          </div>
        </Card>
        <Card
          title="Dispatch attention"
          description="Pending and delayed shipments in view"
          bodyClassName="p-5"
        >
          <div className="space-y-3">
            {visible
              .filter((s) => s.status === "Delayed" || s.status === "Pending")
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="flex w-full items-start gap-3 rounded-xl border border-border p-3 text-start transition hover:bg-muted/30"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-warning/10 text-warning">
                    <Package className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold">{s.id}</p>
                      <Badge tone="warning" size="sm">
                        {s.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {s.origin} to {s.destination}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {s.status === "Pending" ? "Awaiting dispatch" : "Review arrival schedule"}
                    </p>
                  </div>
                </button>
              ))}
            {!visible.some((s) => s.status === "Delayed" || s.status === "Pending") && (
              <div className="py-6 text-center">
                <CheckCheck className="mx-auto mb-2 size-8 text-success" />
                <p className="text-sm font-medium">No shipments need attention</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track {selected?.id}</DialogTitle>
            <DialogDescription>
              Sample shipment details · No live location tracking
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="font-semibold">
                  {selected.origin} → {selected.destination}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{selected.customer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Driver / vehicle</p>
                  <p className="mt-1">
                    {selected.driver} / {selected.vehicle}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected arrival</p>
                  <p className="mt-1">{selected.eta}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cargo</p>
                  <p className="mt-1">{selected.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="mt-1">
                    {selected.progress}% · {selected.status}
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={selected.status === "Delivered" || selected.status === "Pending"}
                onClick={() => deliver(selected.id)}
              >
                Mark sample delivery complete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
