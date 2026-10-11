import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";

type Mode = "basic" | "responsive" | "filter" | "data" | "advanced";

type Person = {
  id: number;
  name: string;
  company: string;
  email: string;
  country: string;
  status: string;
  orders: number;
  spent: number;
  date: string;
  role: string;
  department: string;
  amount: number;
  payment: string;
};

const names = [
  "Elena Marquez",
  "Noah Bennett",
  "Sophie Turner",
  "Liam Walker",
  "Emma Brooks",
  "Olivia Hayes",
  "Henry Whitlock",
  "Camila Rossi",
  "Priya Nair",
  "Mason Reed",
];

const countries = ["United States", "India", "United Kingdom", "Germany", "Canada"];

const statuses = ["Active", "Pending", "Inactive", "Blocked"];

export const tablePeople: Person[] = Array.from({ length: 48 }, (_, index) => ({
  id: 1001 + index,
  name: names[index % names.length],
  company: ["Northstar", "Acme Studio", "Vireo Labs", "Horizon Co."][index % 4],
  email: `${names[index % names.length].toLowerCase().replace(" ", ".")}@example.com`,
  country: countries[index % countries.length],
  status: statuses[index % statuses.length],
  orders: index % 13,
  spent: 120 + index * 175,
  date: `2026-08-${String((index % 28) + 1).padStart(2, "0")}`,
  role: ["Product Designer", "Operations Lead", "Engineer", "Analyst"][index % 4],
  department: ["Product", "Operations", "Engineering", "Finance"][index % 4],
  amount: 180 + index * 92,
  payment: index % 3 === 0 ? "Pending" : "Paid",
}));

const tone = (status: string) =>
  status === "Active" || status === "Paid"
    ? "success"
    : status === "Pending"
      ? "warning"
      : status === "Blocked"
        ? "danger"
        : "muted";

function Heading({ mode }: { mode: Mode }) {
  const config = {
    basic: [
      "Basic Tables",
      "Core table styles, states and layout patterns used across the application.",
    ],
    responsive: [
      "Responsive Tables",
      "Adaptive table layouts designed to stay usable across desktop, tablet and mobile screens.",
    ],
    filter: [
      "Filter Tables",
      "Search and refine large datasets using flexible filtering patterns.",
    ],
    data: [
      "Data Table",
      "Manage structured datasets with sorting, pagination, selection and row actions.",
    ],
    advanced: [
      "Advanced Table",
      "Enterprise-grade table controls for complex datasets and operational workflows.",
    ],
  }[mode];

  return (
    <PageHeader
      eyebrow="Tables"
      title={config[0]}
      subtitle={config[1]}
      actions={
        <>
          <Button variant="outline" onClick={() => window.print()}>
            <Icons.Download className="me-2 size-4" />
            Export
          </Button>

          <Button onClick={() => toast.success("Table report created")}>
            <Icons.FilePlus2 className="me-2 size-4" />
            Create report
          </Button>
        </>
      }
    />
  );
}

function Surface({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {children}
    </Card>
  );
}

function Action({ label = "View" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.message(`${label} action opened`)}
      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label={label}
    >
      <Icons.MoreHorizontal className="size-4" />
    </button>
  );
}

function PeopleTable({
  rows,
  striped = false,
  compact = false,
  selectable,
  selected = new Set<number>(),
  toggle,
  sort,
  onSort,
  visible,
}: {
  rows: Person[];
  striped?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selected?: Set<number>;
  toggle?: (id: number) => void;
  sort?: string;
  onSort?: (key: string) => void;
  visible?: string[];
}) {
  const show = (key: string) => !visible || visible.includes(key);

  const head = (label: string, key?: string) => (
    <TableHead key={label}>
      <button
        type="button"
        onClick={() => key && onSort?.(key)}
        className="inline-flex items-center gap-1 font-medium"
      >
        {label}
        {key && <Icons.ArrowUpDown className={`size-3 ${sort === key ? "text-primary" : ""}`} />}
      </button>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader className="bg-muted/35">
        <TableRow>
          {selectable && (
            <TableHead>
              <Checkbox
                checked={rows.length > 0 && rows.every((row) => selected.has(row.id))}
                onCheckedChange={(value) =>
                  rows.forEach((row) =>
                    value
                      ? !selected.has(row.id) && toggle?.(row.id)
                      : selected.has(row.id) && toggle?.(row.id),
                  )
                }
              />
            </TableHead>
          )}

          {show("name") && head("Customer", "name")}
          {show("company") && head("Company", "company")}
          {show("country") && head("Country", "country")}
          {show("orders") && head("Orders", "orders")}

          {show("amount") && <TableHead className="text-end">Amount</TableHead>}

          {show("status") && head("Status", "status")}
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={row.id}
            data-state={selected.has(row.id) ? "selected" : undefined}
            className={`${striped && index % 2 ? "bg-muted/25" : ""} ${
              compact ? "[&>td]:py-1" : ""
            }`}
          >
            {selectable && (
              <TableCell>
                <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggle?.(row.id)} />
              </TableCell>
            )}

            {show("name") && (
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {row.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>

                  <span>
                    <span className="block font-medium">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">{row.email}</span>
                  </span>
                </div>
              </TableCell>
            )}

            {show("company") && <TableCell>{row.company}</TableCell>}
            {show("country") && <TableCell>{row.country}</TableCell>}
            {show("orders") && <TableCell>{row.orders}</TableCell>}

            {show("amount") && (
              <TableCell className="text-end font-medium">
                ${row.amount.toLocaleString()}
              </TableCell>
            )}

            {show("status") && (
              <TableCell>
                <Badge tone={tone(row.status) as any}>{row.status}</Badge>
              </TableCell>
            )}

            <TableCell>
              <Action />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Basic() {
  return (
    <div className="space-y-5">
      <Surface title="Basic table" description="Core customer information">
        <PeopleTable rows={tablePeople.slice(0, 6)} />
      </Surface>

      <div className="grid gap-5 xl:grid-cols-2">
        <Surface title="Striped table" description="Subtle alternating row treatment">
          <PeopleTable rows={tablePeople.slice(6, 11)} striped />
        </Surface>

        <Surface title="Compact table" description="Reduced vertical density">
          <PeopleTable rows={tablePeople.slice(12, 17)} compact />
        </Surface>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Surface title="Empty state" description="Use a clear message when there is no data">
          <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
            <Icons.Inbox className="size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No records found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or create a new record.
            </p>
          </div>
        </Surface>

        <Surface title="Loading state" description="Skeleton rows preserve table structure">
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function Responsive() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <Surface
        title="Horizontal scroll"
        description="Wide order data stays inside a local scroll container"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="bg-muted/35 text-start text-muted-foreground">
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Email",
                  "Country",
                  "Items",
                  "Date",
                  "Amount",
                  "Payment",
                  "Status",
                ].map((x) => (
                  <th className="px-4 py-3 font-medium" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tablePeople.slice(0, 8).map((row) => (
                <tr className="border-t hover:bg-muted/30" key={row.id}>
                  <td className="px-4 py-3 font-medium">#{row.id}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.country}</td>
                  <td className="px-4 py-3">{row.orders}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">${row.amount}</td>
                  <td className="px-4 py-3">{row.payment}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(row.payment) as any}>{row.payment}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-2">
        <Surface title="Priority columns" description="Secondary data hides on smaller screens">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-nowrap">
              <thead className="bg-muted/35">
                <tr>
                  <th className="p-3 text-start">Product</th>
                  <th className="hidden p-3 text-start md:table-cell">SKU</th>
                  <th className="hidden p-3 text-start lg:table-cell">Category</th>
                  <th className="p-3 text-end">Price</th>
                  <th className="p-3 text-end">Stock</th>
                  <th className="p-3 text-start">Status</th>
                </tr>
              </thead>

              <tbody>
                {tablePeople.slice(0, 5).map((r) => (
                  <tr className="border-t" key={r.id}>
                    <td className="p-3 font-medium">Workspace kit</td>
                    <td className="hidden p-3 md:table-cell">SKU-{r.id}</td>
                    <td className="hidden p-3 lg:table-cell">Office</td>
                    <td className="p-3 text-end">${r.amount}</td>
                    <td className="p-3 text-end">{r.orders + 4}</td>
                    <td className="p-3">
                      <Badge tone="success">In stock</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface title="Expandable details" description="Keep the primary row concise">
          <div className="divide-y">
            {tablePeople.slice(0, 5).map((r) => (
              <div key={r.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="flex w-full items-center gap-3 p-4 text-start hover:bg-muted/30"
                >
                  <Icons.ChevronRight
                    className={`size-4 transition ${expanded === r.id ? "rotate-90" : ""}`}
                  />
                  <span className="flex-1 font-medium">{r.name}</span>
                  <strong>${r.amount}</strong>
                  <Badge tone={tone(r.status) as any}>{r.status}</Badge>
                </button>

                {expanded === r.id && (
                  <div className="grid gap-2 bg-muted/30 px-11 py-4 text-sm sm:grid-cols-2">
                    <span>Email: {r.email}</span>
                    <span>Location: {r.country}</span>
                    <span>Last order: {r.date}</span>
                    <span>Payment: {r.payment}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function Filter() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [country, setCountry] = useState("All");

  const rows = useMemo(
    () =>
      tablePeople.filter(
        (r) =>
          `${r.name} ${r.company} ${r.email} ${r.country}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (status === "All" || r.status === status) &&
          (country === "All" || r.country === country),
      ),
    [search, status, country],
  );

  return (
    <div className="space-y-5">
      <Surface
        title="Customer filters"
        description={`Showing ${rows.length} of ${tablePeople.length} records`}
      >
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row">
          <div className="relative flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
              placeholder="Search customers, company, email or country..."
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All countries</SelectItem>
              {countries.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatus("All");
              setCountry("All");
            }}
          >
            Reset filters
          </Button>
        </div>

        {(status !== "All" || country !== "All") && (
          <div className="flex gap-2 px-4 pt-3">
            {status !== "All" && (
              <button
                onClick={() => setStatus("All")}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                Status: {status}
              </button>
            )}

            {country !== "All" && (
              <button
                onClick={() => setCountry("All")}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                Country: {country}
              </button>
            )}
          </div>
        )}

        {rows.length ? (
          <PeopleTable rows={rows} />
        ) : (
          <div className="p-12 text-center">
            <Icons.SearchX className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No matching records</p>
            <p className="mt-1 text-sm text-muted-foreground">Try removing some filters.</p>
          </div>
        )}
      </Surface>
    </div>
  );
}

function Data({ advanced = false }: { advanced?: boolean }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [density, setDensity] = useState(false);
  const [visible, setVisible] = useState([
    "name",
    "company",
    "country",
    "orders",
    "amount",
    "status",
  ]);

  const rows = useMemo(
    () =>
      tablePeople
        .filter((r) =>
          `${r.name} ${r.company} ${r.country}`.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => ((a as any)[sort] > (b as any)[sort] ? 1 : -1) * (asc ? 1 : -1)),
    [search, sort, asc],
  );

  const count = Number(size);
  const displayed = rows.slice((page - 1) * count, page * count);

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const onSort = (key: string) => {
    if (sort === key) {
      setAsc(!asc);
    } else {
      setSort(key);
      setAsc(true);
    }
  };

  const exportRows = () => {
    const content = [
      "ID,Customer,Amount,Status",
      ...rows.map((r) => `${r.id},${r.name},${r.amount},${r.status}`),
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    link.download = "table-export.csv";
    link.click();

    toast.success("CSV export downloaded");
  };

  return (
    <div className="space-y-5">
      <Surface
        title={advanced ? "Orders operations" : "Employee directory"}
        description={`${rows.length} records available`}
      >
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row">
          <div className="relative flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="ps-9"
              placeholder="Search records..."
            />
          </div>

          {advanced && (
            <>
              <Select
                value={density ? "compact" : "comfortable"}
                onValueChange={(v) => setDensity(v === "compact")}
              >
                <SelectTrigger className="w-full lg:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setVisible(
                    visible.length === 6
                      ? ["name", "amount", "status"]
                      : ["name", "company", "country", "orders", "amount", "status"],
                  )
                }
              >
                Columns
              </Button>

              <Button variant="outline" onClick={exportRows}>
                <Icons.Download className="me-2 size-4" />
                Export
              </Button>
            </>
          )}

          <Select
            value={size}
            onValueChange={(v) => {
              setSize(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["10", "20", "50"].map((v) => (
                <SelectItem value={v} key={v}>
                  {v} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-primary/5 px-4 py-3 text-sm">
            <strong>{selected.size} selected</strong>

            <Button size="sm" onClick={() => toast.success("Selected records activated")}>
              Activate
            </Button>

            <Button size="sm" variant="outline" onClick={exportRows}>
              Export selected
            </Button>

            <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}

        <PeopleTable
          rows={displayed}
          selectable
          selected={selected}
          toggle={toggle}
          sort={sort}
          onSort={onSort}
          compact={density}
          visible={advanced ? visible : undefined}
        />

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 text-sm sm:flex-row">
          <span className="text-muted-foreground">
            Showing {(page - 1) * count + 1}
            {Math.min(page * count, rows.length)} of {rows.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              {page}
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={page * count >= rows.length}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Surface>
    </div>
  );
}

export function TablesModuleApp({ mode }: { mode: Mode }) {
  return (
    <div className="space-y-6 pb-8">
      <Heading mode={mode} />

      {mode === "basic" ? (
        <Basic />
      ) : mode === "responsive" ? (
        <Responsive />
      ) : mode === "filter" ? (
        <Filter />
      ) : (
        <Data advanced={mode === "advanced"} />
      )}
    </div>
  );
}
