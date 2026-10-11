import { useState } from "react";
import { Download, Plus, Wallet, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { AppShell } from "@/components/layout/AppShell";
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
import { PageHeader, Card, Badge } from "@/components/dashboard/widgets";
type Kind = "transactions" | "invoices" | "expenses" | "budgets";
type RecordItem = {
  id: string;
  name: string;
  category: string;
  amount: number;
  used: number;
  status: string;
  date: string;
};
const titles = {
  transactions: "Transactions",
  invoices: "Finance Invoices",
  expenses: "Expenses",
  budgets: "Budgets",
};
const seeds: Record<Kind, RecordItem[]> = {
  transactions: [
    {
      id: "TX-1001",
      name: "Northstar payment",
      category: "Income",
      amount: 8400,
      used: 0,
      status: "Completed",
      date: "2026-10-09",
    },
    {
      id: "TX-1002",
      name: "Office rent",
      category: "Expense",
      amount: 2200,
      used: 0,
      status: "Completed",
      date: "2026-10-08",
    },
    {
      id: "TX-1003",
      name: "Software subscriptions",
      category: "Expense",
      amount: 450,
      used: 0,
      status: "Pending",
      date: "2026-10-08",
    },
    ...[
      {
        name: "Atlas consulting payment",
        category: "Income",
        amount: 5200,
        status: "Completed",
        date: "2026-10-07",
      },
      {
        name: "Team travel",
        category: "Expense",
        amount: 620,
        status: "Completed",
        date: "2026-10-07",
      },
      {
        name: "Cedar design deposit",
        category: "Income",
        amount: 2100,
        status: "Pending",
        date: "2026-10-06",
      },
      {
        name: "Equipment purchase",
        category: "Expense",
        amount: 1800,
        status: "Completed",
        date: "2026-10-05",
      },
      {
        name: "Summit subscription renewal",
        category: "Income",
        amount: 3400,
        status: "Completed",
        date: "2026-10-04",
      },
      {
        name: "Marketing campaign",
        category: "Expense",
        amount: 1250,
        status: "Pending",
        date: "2026-10-03",
      },
      {
        name: "Greenfield service payment",
        category: "Income",
        amount: 4600,
        status: "Completed",
        date: "2026-10-02",
      },
      {
        name: "Internet and utilities",
        category: "Expense",
        amount: 380,
        status: "Completed",
        date: "2026-10-01",
      },
      {
        name: "Office maintenance",
        category: "Expense",
        amount: 720,
        status: "Completed",
        date: "2026-09-30",
      },
    ].map((record, index) => ({ ...record, id: "TX-" + (1004 + index), used: 0 })),
  ],
  invoices: [
    {
      id: "INV-1001",
      name: "Northstar Retail",
      category: "Services",
      amount: 8400,
      used: 0,
      status: "Paid",
      date: "2026-10-20",
    },
    {
      id: "INV-1002",
      name: "Atlas Supplies",
      category: "Consulting",
      amount: 3600,
      used: 0,
      status: "Unpaid",
      date: "2026-10-22",
    },
    {
      id: "INV-1003",
      name: "Cedar Trading",
      category: "Design",
      amount: 2100,
      used: 0,
      status: "Unpaid",
      date: "2026-10-25",
    },
    ...[
      {
        name: "Summit Electronics",
        category: "Development",
        amount: 6200,
        status: "Unpaid",
        date: "2026-10-05",
      },
      {
        name: "Greenfield Foods",
        category: "Consulting",
        amount: 2800,
        status: "Paid",
        date: "2026-10-02",
      },
      {
        name: "Urban Living",
        category: "Design",
        amount: 4500,
        status: "Unpaid",
        date: "2026-10-15",
      },
      {
        name: "Bluebird Studio",
        category: "Services",
        amount: 1800,
        status: "Unpaid",
        date: "2026-10-07",
      },
      {
        name: "Westbridge Partners",
        category: "Consulting",
        amount: 7200,
        status: "Paid",
        date: "2026-10-01",
      },
    ].map((record, index) => ({ ...record, id: "INV-" + (1004 + index), used: 0 })),
  ],
  expenses: [
    {
      id: "EXP-1001",
      name: "Team travel",
      category: "Travel",
      amount: 620,
      used: 0,
      status: "Pending",
      date: "2026-10-09",
    },
    {
      id: "EXP-1002",
      name: "Office supplies",
      category: "Office",
      amount: 280,
      used: 0,
      status: "Approved",
      date: "2026-10-08",
    },
    {
      id: "EXP-1003",
      name: "Cloud hosting",
      category: "Software",
      amount: 450,
      used: 0,
      status: "Pending",
      date: "2026-10-07",
    },
    {
      id: "EXP-1004",
      name: "Client lunch",
      category: "Meals",
      amount: 145,
      used: 0,
      status: "Pending",
      date: "2026-10-09",
    },
    {
      id: "EXP-1005",
      name: "Design workshop",
      category: "Training",
      amount: 850,
      used: 0,
      status: "Approved",
      date: "2026-10-09",
    },
    {
      id: "EXP-1006",
      name: "Security software",
      category: "Software",
      amount: 360,
      used: 0,
      status: "Pending",
      date: "2026-10-09",
    },
    {
      id: "EXP-1007",
      name: "Conference tickets",
      category: "Travel",
      amount: 1200,
      used: 0,
      status: "Rejected",
      date: "2026-10-09",
    },
  ],
  budgets: [
    {
      id: "BDG-1001",
      name: "Marketing budget",
      category: "Marketing",
      amount: 10000,
      used: 6200,
      status: "Active",
      date: "2026-10-31",
    },
    {
      id: "BDG-1002",
      name: "Engineering budget",
      category: "Engineering",
      amount: 18000,
      used: 12400,
      status: "Active",
      date: "2026-10-31",
    },
    {
      id: "BDG-1003",
      name: "Operations budget",
      category: "Operations",
      amount: 8000,
      used: 5300,
      status: "Active",
      date: "2026-10-31",
    },
    {
      id: "BDG-1004",
      name: "Customer support budget",
      category: "Support",
      amount: 6000,
      used: 4900,
      status: "Active",
      date: "2026-10-31",
    },
    {
      id: "BDG-1005",
      name: "Training budget",
      category: "Training",
      amount: 4500,
      used: 4100,
      status: "Active",
      date: "2026-10-31",
    },
    {
      id: "BDG-1006",
      name: "Office budget",
      category: "Office",
      amount: 9000,
      used: 2800,
      status: "Active",
      date: "2026-10-31",
    },
  ],
};
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export function FinancePage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      <FinanceWorkspace key={kind} kind={kind} />
    </AppShell>
  );
}
function FinanceWorkspace({ kind }: { kind: Kind }) {
  const [records, setRecords] = useState(seeds[kind]);
  const { base } = useChartTheme();
  const [direction, setDirection] = useState("All");
  const [invoiceView, setInvoiceView] = useState("All invoices");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(kind === "transactions" ? "Income" : "General");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-10-09");
  const [error, setError] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetSpent, setBudgetSpent] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("All");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const visible = records.filter(
    (r) =>
      (filter === "All" || r.status === filter) &&
      (kind !== "expenses" || expenseCategory === "All" || r.category === expenseCategory) &&
      (kind !== "invoices" ||
        invoiceView !== "Overdue" ||
        (r.status === "Unpaid" && r.date < "2026-10-09")) &&
      (kind !== "transactions" || direction === "All" || r.category === direction) &&
      `${r.id} ${r.name} ${r.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  visible.sort((a, b) => (sort === "largest" ? b.amount - a.amount : b.date.localeCompare(a.date)));
  const chartDates = [...new Set(visible.map((r) => r.date))].sort();
  const cashOptions = mergeOptions(base, {
    colors: [token("--success"), token("--chart-4")],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.03 } },
    xaxis: { categories: chartDates.map((date) => date.slice(5)), labels: { rotate: -30 } },
    yaxis: { labels: { formatter: (value: number) => "$" + (value / 1000).toFixed(1) + "k" } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { shared: true, intersect: false, y: { formatter: (value: number) => money(value) } },
  });
  const total = visible.reduce((sum, r) => sum + r.amount, 0);
  const used = visible.reduce((sum, r) => sum + r.used, 0);
  const pending = visible.filter((r) => r.status === "Pending" || r.status === "Unpaid");
  function add() {
    const value = Number(amount);
    if (
      name.trim().length < 2 ||
      !Number.isFinite(value) ||
      value <= 0 ||
      value > 100000000 ||
      !date
    ) {
      setError("Enter a name, date, and amount between $0.01 and $100,000,000.");
      return;
    }
    setRecords((current) => [
      {
        id: `${kind === "transactions" ? "TX" : kind === "invoices" ? "INV" : kind === "expenses" ? "EXP" : "BDG"}-${1001 + current.length}`,
        name: name.trim(),
        category: category.trim() || "General",
        amount: value,
        used: 0,
        status: kind === "invoices" ? "Unpaid" : kind === "budgets" ? "Active" : "Pending",
        date,
      },
      ...current,
    ]);
    setFilter("All");
    setDirection("All");
    setExpenseCategory("All");
    setInvoiceView("All invoices");
    setQuery("");
    setOpen(false);
    toast.success("Sample record created");
  }
  function update(record: RecordItem) {
    setRecords((current) =>
      current.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status: kind === "invoices" ? "Paid" : kind === "expenses" ? "Approved" : "Completed",
            }
          : r,
      ),
    );
    setSelected(null);
    toast.success("Sample status updated");
  }
  function exportRecords() {
    const rows = [
      ["ID", "Name", "Category", "Amount USD", "Spent USD", "Status", "Date"],
      ...visible.map((r) => [r.id, r.name, r.category, r.amount, r.used, r.status, r.date]),
    ];
    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `finance-${kind}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title={titles[kind]}
        subtitle="Manage financial records with a clear view of every detail."
        breadcrumb={["Management", "Finance", titles[kind]]}
        actions={
          <>
            <Button variant="outline" onClick={exportRecords}>
              <Download className="size-4" />
              Export
            </Button>
            <Button
              onClick={() => {
                setName("");
                setAmount("");
                setError("");
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add{" "}
              {kind === "budgets"
                ? "budget"
                : kind === "invoices"
                  ? "invoice"
                  : kind === "expenses"
                    ? "expense"
                    : "transaction"}
            </Button>
          </>
        }
      />
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
        Sample financial records · USD · Changes stay in this page session. Status updates do not
        process payments.
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Records in view",
            value: visible.length.toString(),
            icon: FileText,
            color: "--primary",
          },
          {
            label: kind === "budgets" ? "Allocated budget" : "Total value",
            value: money(total),
            icon: Wallet,
            color: "--info",
          },
          {
            label:
              kind === "budgets"
                ? "Available budget"
                : kind === "transactions"
                  ? "Net completed cash flow"
                  : "Awaiting action",
            value: money(
              kind === "budgets"
                ? total - used
                : kind === "transactions"
                  ? visible
                      .filter((r) => r.status === "Completed")
                      .reduce((sum, r) => sum + (r.category === "Income" ? r.amount : -r.amount), 0)
                  : pending.reduce((sum, r) => sum + r.amount, 0),
            ),
            icon: ArrowUpRight,
            color: "--success",
          },
        ].map((m) => (
          <section key={m.label} className="vexui-card flex items-center gap-4 p-5">
            <span
              className="grid size-12 place-items-center rounded-xl"
              style={{
                color: `var(${m.color})`,
                background: `color-mix(in oklch,var(${m.color}) 12%,transparent)`,
              }}
            >
              <m.icon className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-2xl font-semibold">{m.value}</p>
            </div>
          </section>
        ))}
      </div>
      {kind === "transactions" && (
        <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card
            title="Cash flow activity"
            description="Completed income and expenses by record date ? USD"
          >
            {visible.length ? (
              <ApexChart
                type="area"
                height={265}
                options={cashOptions}
                series={["Income", "Expense"].map((category) => ({
                  name: category,
                  data: chartDates.map((date) =>
                    visible
                      .filter(
                        (r) =>
                          r.date === date && r.category === category && r.status === "Completed",
                      )
                      .reduce((sum, r) => sum + r.amount, 0),
                  ),
                }))}
              />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No records in this view.
              </p>
            )}
          </Card>
          <Card
            title="Transaction breakdown"
            description="Current filtered records"
            bodyClassName="p-5"
          >
            <div className="space-y-5">
              {["Income", "Expense"].map((category) => (
                <div key={category}>
                  <p className="text-xs text-muted-foreground">
                    Completed {category.toLowerCase()}
                  </p>
                  <p
                    className={
                      "mt-1 text-2xl font-semibold " +
                      (category === "Income" ? "text-success" : "text-warning")
                    }
                  >
                    {money(
                      visible
                        .filter((r) => r.category === category && r.status === "Completed")
                        .reduce((sum, r) => sum + r.amount, 0),
                    )}
                  </p>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Pending transactions</p>
                <p className="mt-1 text-lg font-semibold">
                  {pending.length} / {money(pending.reduce((sum, r) => sum + r.amount, 0))}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
      {kind === "invoices" && (
        <div className="mb-6 grid gap-6 xl:grid-cols-3">
          <Card
            title="Receivables overview"
            description="Sample balances ? As of October 9, 2026"
            className="xl:col-span-2"
            bodyClassName="p-5"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Paid invoices",
                  amount: visible
                    .filter((r) => r.status === "Paid")
                    .reduce((sum, r) => sum + r.amount, 0),
                  color: "text-success",
                },
                {
                  label: "Open receivables",
                  amount: visible
                    .filter((r) => r.status === "Unpaid")
                    .reduce((sum, r) => sum + r.amount, 0),
                  color: "text-primary",
                },
                {
                  label: "Overdue balance",
                  amount: visible
                    .filter((r) => r.status === "Unpaid" && r.date < "2026-10-09")
                    .reduce((sum, r) => sum + r.amount, 0),
                  color: "text-warning",
                },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className={"mt-3 text-2xl font-semibold " + metric.color}>
                    {money(metric.amount)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Overdue balances are part of open receivables. Marking paid updates the sample record
              only.
            </p>
          </Card>
          <Card
            title="Collection progress"
            description="Paid value as a share of invoice value"
            bodyClassName="p-5"
          >
            <p className="text-4xl font-semibold">
              {total
                ? Math.round(
                    (visible
                      .filter((r) => r.status === "Paid")
                      .reduce((sum, r) => sum + r.amount, 0) /
                      total) *
                      100,
                  )
                : 0}
              %
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success"
                style={{
                  width:
                    (total
                      ? (visible
                          .filter((r) => r.status === "Paid")
                          .reduce((sum, r) => sum + r.amount, 0) /
                          total) *
                        100
                      : 0) + "%",
                }}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {visible.filter((r) => r.status === "Paid").length} paid / {visible.length} invoices
              in view
            </p>
          </Card>
        </div>
      )}
      {(kind === "expenses" || kind === "budgets") && (
        <div className="mb-6 grid gap-6 xl:grid-cols-2">
          <Card
            title={kind === "expenses" ? "Expense categories" : "Budget utilization"}
            description="Current filtered sample records"
            bodyClassName="p-5"
          >
            <div className="space-y-4">
              {[...new Set(visible.map((r) => r.category))].map((category) => {
                const group = visible.filter((r) => r.category === category);
                const value = group.reduce(
                  (sum, r) => sum + (kind === "budgets" ? r.used : r.amount),
                  0,
                );
                const allocation =
                  kind === "budgets" ? group.reduce((sum, r) => sum + r.amount, 0) : total;
                return (
                  <div key={category}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {money(value)}
                        {kind === "budgets" ? " / " + money(allocation) : ""}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: Math.min(100, allocation ? (value / allocation) * 100 : 0) + "%",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {!visible.length && (
                <p className="text-sm text-muted-foreground">No records in this view.</p>
              )}
            </div>
          </Card>
          <Card
            title={kind === "expenses" ? "Approval overview" : "Budget watch"}
            description={
              kind === "expenses"
                ? "Expense amounts by review status"
                : "Allocations with 80% or more spent"
            }
            bodyClassName="p-5"
          >
            {kind === "expenses" ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {["Pending", "Approved", "Rejected"].map((status) => (
                  <div key={status} className="rounded-xl bg-muted/30 p-4">
                    <Badge tone={status === "Approved" ? "success" : "warning"}>{status}</Badge>
                    <p className="mt-3 text-xl font-semibold">
                      {money(
                        visible
                          .filter((r) => r.status === status)
                          .reduce((sum, r) => sum + r.amount, 0),
                      )}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {visible.filter((r) => r.status === status).length} records
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {visible
                  .filter((r) => r.used / r.amount >= 0.8)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {money(r.amount - r.used)} remaining
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-warning">
                        {Math.round((r.used / r.amount) * 100)}%
                      </span>
                    </div>
                  ))}
                {!visible.some((r) => r.used / r.amount >= 0.8) && (
                  <p className="text-sm text-muted-foreground">
                    All budgets are below the watch threshold.
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
      <Card
        title={
          kind === "budgets"
            ? "Budget allocation"
            : kind === "transactions"
              ? "Transaction ledger"
              : kind === "invoices"
                ? "Invoice register"
                : "Financial records"
        }
        description={`${visible.length} records in view`}
        bodyClassName="p-5"
        action={
          <div className="flex flex-wrap gap-2">
            {kind === "transactions" && (
              <>
                <select
                  aria-label="Transaction direction"
                  className="rounded-lg border border-border bg-card px-3 text-sm"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                >
                  {["All", "Income", "Expense"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <select
                  aria-label="Sort transactions"
                  className="rounded-lg border border-border bg-card px-3 text-sm"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="largest">Largest amount</option>
                </select>
              </>
            )}
            {kind === "invoices" && (
              <select
                aria-label="Invoice view"
                className="rounded-lg border border-border bg-card px-3 text-sm"
                value={invoiceView}
                onChange={(e) => setInvoiceView(e.target.value)}
              >
                <option>All invoices</option>
                <option>Overdue</option>
              </select>
            )}
            {kind === "expenses" && (
              <select
                aria-label="Expense category"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 text-sm"
              >
                <option>All</option>
                {[...new Set(records.map((r) => r.category))].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
            <Input
              aria-label="Search financial records"
              placeholder="Search records…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:w-56"
            />
            <select
              aria-label="Finance status"
              className="rounded-lg border border-border bg-card px-3 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              {[...new Set(records.map((r) => r.status))].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        }
      >
        {kind === "budgets" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-card p-5"
              >
                <Badge tone="primary">{r.category}</Badge>
                <h2 className="mt-3 font-semibold">{r.name}</h2>
                <p className="mt-3 text-2xl font-semibold">{money(r.amount)}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className={
                      "h-full rounded-full " +
                      (r.used / r.amount >= 0.8 ? "bg-warning" : "bg-primary")
                    }
                    style={{ width: Math.min(100, (r.used / r.amount) * 100) + "%" }}
                  />
                </div>
                <div className="mt-2 flex justify-between gap-2 text-xs text-muted-foreground">
                  <span>{money(r.used)} spent</span>
                  <span>{Math.round((r.used / r.amount) * 100)}%</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSelected(r);
                    setBudgetLimit(String(r.amount));
                    setBudgetSpent(String(r.used));
                    setBudgetError("");
                  }}
                >
                  View budget
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Record",
                  "Category",
                  "Amount",
                  kind === "invoices" ? "Due date" : "Date",
                  "Status",
                  "",
                ].map((h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.id}</p>
                  </TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {kind === "transactions" &&
                        (r.category === "Income" ? (
                          <ArrowDownLeft className="size-4 text-success" />
                        ) : (
                          <ArrowUpRight className="size-4 text-warning" />
                        ))}
                      {money(r.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    <Badge
                      tone={r.status === "Pending" || r.status === "Unpaid" ? "warning" : "success"}
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`View ${r.id}`}
                      onClick={() => setSelected(r)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!visible.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">No matching records.</p>
        )}
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden sm:max-w-xl">
          <DialogHeader
            className={
              kind === "transactions" ? "-mx-6 -mt-6 border-b border-border bg-primary/5 p-6" : ""
            }
          >
            {kind === "transactions" && (
              <span className="mb-2 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Wallet className="size-5" />
              </span>
            )}
            <DialogTitle>
              {kind === "transactions"
                ? "New transaction"
                : kind === "invoices"
                  ? "Create invoice"
                  : "Add financial record"}
            </DialogTitle>
            <DialogDescription>Create a sample record for this session.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
          >
            <label className="block text-xs font-medium">
              {kind === "invoices" ? "Client / company" : "Name"}
              <Input
                aria-label="Record name"
                className="mt-2"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-xs font-medium">
              {kind === "transactions" ? "Direction" : "Category"}
              {kind === "transactions" ? (
                <select
                  className="mt-2 h-10 w-full rounded-lg border border-border bg-card px-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              ) : (
                <Input
                  className="mt-2"
                  maxLength={50}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              )}
            </label>
            <label className="block text-xs font-medium">
              Amount (USD)
              <Input
                aria-label="Record amount"
                className="mt-2"
                type="number"
                min="0.01"
                max={100000000}
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <label className="block text-xs font-medium">
              {kind === "invoices" ? "Due date" : kind === "budgets" ? "Period end" : "Date"}
              <Input
                className="mt-2"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {kind === "transactions" && (
              <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
                <span className="text-xs text-muted-foreground">{category} ? Pending</span>
                <span className="text-lg font-semibold">{money(Number(amount) || 0)}</span>
              </div>
            )}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {kind === "transactions"
                  ? "Create transaction"
                  : kind === "invoices"
                    ? "Create invoice"
                    : "Save record"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.id} · Sample financial record</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-primary/5 p-5">
                <p className="mb-2 text-xs text-muted-foreground">
                  {kind === "invoices" ? "Invoice total" : selected.category + " amount"} ? USD
                </p>
                <p className="text-3xl font-semibold">{money(selected.amount)}</p>
                <div className="mt-3">
                  <Badge
                    tone={
                      selected.status === "Pending" || selected.status === "Unpaid"
                        ? "warning"
                        : "success"
                    }
                  >
                    {selected.status}
                  </Badge>
                </div>
              </div>
              {kind === "invoices" && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="flex justify-between bg-muted/40 px-4 py-3 text-xs font-semibold">
                    <span>Service description</span>
                    <span>Amount</span>
                  </div>
                  <div className="flex justify-between gap-3 px-4 py-4 text-sm">
                    <span>{selected.category} services</span>
                    <span className="font-semibold">{money(selected.amount)}</span>
                  </div>
                  <p className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
                    Sample invoice total. No tax calculation or payment processing.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border p-4 text-sm">
                <p>Category: {selected.category}</p>
                <p>Status: {selected.status}</p>
                <p>Date: {selected.date}</p>
                {kind === "budgets" && <p>Available: {money(selected.amount - selected.used)}</p>}
              </div>
              {kind === "budgets" && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const limit = Number(budgetLimit),
                      spent = Number(budgetSpent);
                    if (
                      !Number.isFinite(limit) ||
                      limit <= 0 ||
                      limit > 100000000 ||
                      !Number.isFinite(spent) ||
                      spent < 0 ||
                      spent > limit
                    ) {
                      setBudgetError(
                        "Enter a positive allocation and spending between zero and the allocation.",
                      );
                      return;
                    }
                    setRecords((current) =>
                      current.map((r) =>
                        r.id === selected.id ? { ...r, amount: limit, used: spent } : r,
                      ),
                    );
                    setSelected(null);
                    toast.success("Sample budget updated");
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium">
                      Allocation (USD)
                      <Input
                        className="mt-2"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Spent (USD)
                      <Input
                        className="mt-2"
                        type="number"
                        min={0}
                        step="0.01"
                        required
                        value={budgetSpent}
                        onChange={(e) => setBudgetSpent(e.target.value)}
                      />
                    </label>
                  </div>
                  {budgetError && (
                    <p role="alert" className="text-sm text-destructive">
                      {budgetError}
                    </p>
                  )}
                  <Button type="submit" className="w-full">
                    Update budget
                  </Button>
                </form>
              )}
              {kind === "expenses" && selected.status === "Pending" && (
                <Button
                  variant="outline"
                  className="w-full text-destructive"
                  onClick={() => {
                    setRecords((current) =>
                      current.map((r) => (r.id === selected.id ? { ...r, status: "Rejected" } : r)),
                    );
                    setSelected(null);
                    toast.success("Sample expense rejected");
                  }}
                >
                  Reject expense
                </Button>
              )}
              {kind !== "budgets" &&
                (selected.status === "Pending" || selected.status === "Unpaid") && (
                  <Button className="w-full" onClick={() => update(selected)}>
                    {kind === "invoices"
                      ? "Mark paid"
                      : kind === "expenses"
                        ? "Approve expense"
                        : "Mark completed"}
                  </Button>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
