import { getUserImage } from "@/lib/user-images";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CustomerStatus = "Active" | "Inactive" | "Blocked" | "Archived";

type Segment = "New" | "Returning" | "VIP" | "High Value" | "At Risk" | "Inactive";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  initials: string;
  city: string;
  country: string;
  orders: number;
  spent: number;
  lastOrder: string;
  lastOrderDays: number | null;
  segment: Segment;
  status: CustomerStatus;
  joined: string;
  tags: string[];
  notes: string[];
};

type Modal =
  | "add"
  | "edit"
  | "note"
  | "block"
  | "archive"
  | "delete"
  | "bulkSegment"
  | "bulkStatus"
  | "bulkDelete"
  | null;

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Sophia Carter",
    email: "sophia@example.com",
    phone: "+1 212 555 0184",
    company: "Carter Studio",
    initials: "SC",
    city: "New York",
    country: "United States",
    orders: 12,
    spent: 4820,
    lastOrder: "Aug 22, 2026",
    lastOrderDays: 2,
    segment: "VIP",
    status: "Active",
    joined: "Mar 18, 2024",
    tags: ["VIP", "Repeat Buyer", "Electronics"],
    notes: ["High-value repeat customer.", "Prefers email communication."],
  },
  {
    id: 2,
    name: "Daniel Lee",
    email: "daniel@example.com",
    phone: "+44 20 7946 0215",
    company: "Northline Ltd",
    initials: "DL",
    city: "London",
    country: "United Kingdom",
    orders: 8,
    spent: 3420,
    lastOrder: "Aug 18, 2026",
    lastOrderDays: 6,
    segment: "Returning",
    status: "Active",
    joined: "Jul 02, 2024",
    tags: ["Repeat Buyer", "Wholesale"],
    notes: ["Requested invoice billing for enterprise orders."],
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 416 555 0142",
    company: "",
    initials: "EW",
    city: "Toronto",
    country: "Canada",
    orders: 4,
    spent: 1680,
    lastOrder: "Aug 12, 2026",
    lastOrderDays: 12,
    segment: "New",
    status: "Active",
    joined: "May 30, 2026",
    tags: ["High Intent"],
    notes: [],
  },
  {
    id: 4,
    name: "Olivia Smith",
    email: "olivia@example.com",
    phone: "+49 30 901820",
    company: "Smith & Co",
    initials: "OS",
    city: "Berlin",
    country: "Germany",
    orders: 15,
    spent: 6840,
    lastOrder: "Aug 21, 2026",
    lastOrderDays: 3,
    segment: "High Value",
    status: "Active",
    joined: "Nov 09, 2023",
    tags: ["VIP", "Support Priority"],
    notes: ["Likes early access to new lighting collections."],
  },
  {
    id: 5,
    name: "Noah Williams",
    email: "noah@example.com",
    phone: "+91 40 5550 2184",
    company: "",
    initials: "NW",
    city: "Hyderabad",
    country: "India",
    orders: 2,
    spent: 420,
    lastOrder: "May 10, 2026",
    lastOrderDays: 106,
    segment: "At Risk",
    status: "Inactive",
    joined: "Jan 08, 2026",
    tags: ["Support Follow-up"],
    notes: ["Follow up with a replenishment offer."],
  },
  {
    id: 6,
    name: "Mia Anderson",
    email: "mia.anderson@example.com",
    phone: "+61 2 5550 0106",
    company: "Axis Home",
    initials: "MA",
    city: "Sydney",
    country: "Australia",
    orders: 0,
    spent: 0,
    lastOrder: "Never",
    lastOrderDays: null,
    segment: "New",
    status: "Active",
    joined: "Aug 23, 2026",
    tags: ["New Lead"],
    notes: [],
  },
  {
    id: 7,
    name: "James Brown",
    email: "james.brown@example.com",
    phone: "+1 512 555 0199",
    company: "Brownworks",
    initials: "JB",
    city: "Austin",
    country: "United States",
    orders: 10,
    spent: 5410,
    lastOrder: "Jul 29, 2026",
    lastOrderDays: 26,
    segment: "VIP",
    status: "Blocked",
    joined: "Feb 14, 2024",
    tags: ["VIP"],
    notes: ["Account temporarily blocked after payment review."],
  },
];

const segments: Segment[] = ["New", "Returning", "VIP", "High Value", "At Risk", "Inactive"];

const statuses: CustomerStatus[] = ["Active", "Inactive", "Blocked", "Archived"];

const statusTone: Record<CustomerStatus, "success" | "warning" | "danger" | "muted"> = {
  Active: "success",
  Inactive: "warning",
  Blocked: "danger",
  Archived: "muted",
};

const segmentTone: Record<Segment, "primary" | "success" | "warning" | "info" | "muted"> = {
  New: "primary",
  Returning: "info",
  VIP: "success",
  "High Value": "success",
  "At Risk": "warning",
  Inactive: "muted",
};

const emptyForm = {
  first: "",
  last: "",
  email: "",
  phone: "",
  company: "",
  country: "United States",
  city: "",
  segment: "New" as Segment,
  status: "Active" as CustomerStatus,
  tags: "",
  notes: "",
};

function CustomerForm({
  form,
  setForm,
}: {
  form: typeof emptyForm;
  setForm: (form: typeof emptyForm) => void;
}) {
  const field = (key: keyof typeof emptyForm, label: string, type = "text") => (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        required={key === "first" || key === "email"}
        type={type}
        value={form[key]}
        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
        className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {field("first", "First name")}
      {field("last", "Last name")}
      {field("email", "Email", "email")}
      {field("phone", "Phone")}
      {field("company", "Company")}

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Country</span>
        <select
          value={form.country}
          onChange={(event) => setForm({ ...form, country: event.target.value })}
          className="h-10 rounded-md border bg-background px-3"
        >
          {["United States", "United Kingdom", "Germany", "India", "Canada", "Australia"].map(
            (country) => (
              <option key={country}>{country}</option>
            ),
          )}
        </select>
      </label>

      {field("city", "City")}

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Segment</span>
        <select
          value={form.segment}
          onChange={(event) =>
            setForm({
              ...form,
              segment: event.target.value as Segment,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {segments.map((segment) => (
            <option key={segment}>{segment}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Status</span>
        <select
          value={form.status}
          onChange={(event) =>
            setForm({
              ...form,
              status: event.target.value as CustomerStatus,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>

      {field("tags", "Tags (comma separated)")}

      <label className="grid gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium">Internal notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          rows={3}
          className="rounded-md border bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </div>
  );
}

export function CustomersApp() {
  const [customers, setCustomers] = useState(initialCustomers);

  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All Customers");
  const [status, setStatus] = useState("All statuses");
  const [country, setCountry] = useState("All regions");
  const [spend, setSpend] = useState("All spend");
  const [ordersFilter, setOrdersFilter] = useState("All orders");
  const [lastOrder, setLastOrder] = useState("Any time");
  const [sort, setSort] = useState("Newest");

  const [selected, setSelected] = useState<number[]>([]);
  const [active, setActive] = useState<Customer | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState(emptyForm);
  const [note, setNote] = useState("");
  const [bulkValue, setBulkValue] = useState("VIP");
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    return customers
      .filter((customer) => {
        const search = query.toLowerCase();

        const matchesSearch =
          !search ||
          [
            customer.name,
            customer.email,
            customer.phone,
            customer.company,
            customer.city,
            customer.country,
            ...customer.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search);

        const matchesSegment = segment === "All Customers" || customer.segment === segment;

        const matchesStatus = status === "All statuses" || customer.status === status;

        const matchesCountry = country === "All regions" || customer.country === country;

        const matchesSpend =
          spend === "All spend" ||
          (spend === "Under $500" && customer.spent < 500) ||
          (spend === "$500-$1,000" && customer.spent >= 500 && customer.spent <= 1000) ||
          (spend === "$1,000-$5,000" && customer.spent > 1000 && customer.spent <= 5000) ||
          (spend === "$5,000+" && customer.spent > 5000);

        const matchesOrders =
          ordersFilter === "All orders" ||
          (ordersFilter === "0 Orders" && customer.orders === 0) ||
          (ordersFilter === "1-5" && customer.orders >= 1 && customer.orders <= 5) ||
          (ordersFilter === "6-10" && customer.orders >= 6 && customer.orders <= 10) ||
          (ordersFilter === "10+" && customer.orders > 10);

        const matchesLastOrder =
          lastOrder === "Any time" ||
          (lastOrder === "Never Ordered" && customer.lastOrderDays === null) ||
          (lastOrder === "Last 7 Days" && (customer.lastOrderDays ?? 999) <= 7) ||
          (lastOrder === "Last 30 Days" && (customer.lastOrderDays ?? 999) <= 30) ||
          (lastOrder === "Last 90 Days" && (customer.lastOrderDays ?? 999) <= 90) ||
          (lastOrder === "More Than 90 Days" && (customer.lastOrderDays ?? 0) > 90);

        return (
          matchesSearch &&
          matchesSegment &&
          matchesStatus &&
          matchesCountry &&
          matchesSpend &&
          matchesOrders &&
          matchesLastOrder
        );
      })
      .sort((a, b) => {
        if (sort === "Name A-Z") return a.name.localeCompare(b.name);

        if (sort === "Highest Spend" || sort === "Highest Customer Value") {
          return b.spent - a.spent;
        }

        if (sort === "Lowest Spend") return a.spent - b.spent;
        if (sort === "Most Orders") return b.orders - a.orders;

        if (sort === "Recent Purchase") {
          return (a.lastOrderDays ?? 999) - (b.lastOrderDays ?? 999);
        }

        if (sort === "Oldest") return a.id - b.id;

        return b.id - a.id;
      });
  }, [customers, query, segment, status, country, spend, ordersFilter, lastOrder, sort]);

  const visible = filtered.slice(0, pageSize);

  const allSelected =
    visible.length > 0 && visible.every((customer) => selected.includes(customer.id));

  const updateCustomer = (id: number, patch: Partial<Customer>, message: string) => {
    setCustomers((current) =>
      current.map((customer) => (customer.id === id ? { ...customer, ...patch } : customer)),
    );

    setActive((customer) => (customer?.id === id ? { ...customer, ...patch } : customer));

    toast.success(message);
  };

  const resetFilters = () => {
    setQuery("");
    setSegment("All Customers");
    setStatus("All statuses");
    setCountry("All regions");
    setSpend("All spend");
    setOrdersFilter("All orders");
    setLastOrder("Any time");
    setSort("Newest");
  };

  const exportCsv = (items = filtered) => {
    const csv = [
      "Name,Email,Location,Orders,Total spent,Segment,Status",
      ...items.map((customer) =>
        [
          customer.name,
          customer.email,
          `${customer.city} ${customer.country}`,
          customer.orders,
          customer.spent,
          customer.segment,
          customer.status,
        ].join(","),
      ),
    ].join("\n");

    const link = document.createElement("a");

    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "customers-export.csv";
    link.click();

    URL.revokeObjectURL(link.href);
    toast.success("Customer export downloaded");
  };

  const beginAdd = () => {
    setForm(emptyForm);
    setModal("add");
  };

  const beginEdit = (customer: Customer) => {
    setActive(customer);

    const names = customer.name.split(" ");

    setForm({
      first: names[0],
      last: names.slice(1).join(" "),
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      country: customer.country,
      city: customer.city,
      segment: customer.segment,
      status: customer.status,
      tags: customer.tags.join(", "),
      notes: customer.notes.join(" "),
    });

    setModal("edit");
  };

  const saveForm = () => {
    if (!form.first.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Enter a first name and valid email");
      return;
    }

    const patch = {
      name: `${form.first} ${form.last}`.trim(),
      email: form.email,
      phone: form.phone,
      company: form.company,
      initials: `${form.first[0] ?? ""}${form.last[0] ?? ""}`.toUpperCase(),
      country: form.country,
      city: form.city,
      segment: form.segment,
      status: form.status,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: form.notes ? [form.notes] : [],
    };

    if (modal === "add") {
      setCustomers((current) => [
        ...current,
        {
          ...patch,
          id: Date.now(),
          orders: 0,
          spent: 0,
          lastOrder: "Never",
          lastOrderDays: null,
          joined: "Aug 24, 2026",
        },
      ]);

      toast.success("Customer created");
    } else if (active) {
      updateCustomer(active.id, patch, "Customer updated");
    }

    setModal(null);
  };

  const confirmAction = () => {
    if (modal === "bulkSegment") {
      setCustomers((current) =>
        current.map((customer) =>
          selected.includes(customer.id)
            ? {
                ...customer,
                segment: bulkValue as Segment,
              }
            : customer,
        ),
      );

      toast.success("Segment updated for selected customers");
    } else if (modal === "bulkStatus") {
      setCustomers((current) =>
        current.map((customer) =>
          selected.includes(customer.id)
            ? {
                ...customer,
                status: bulkValue as CustomerStatus,
              }
            : customer,
        ),
      );

      toast.success("Status updated for selected customers");
    } else if (modal === "bulkDelete") {
      setCustomers((current) => current.filter((customer) => !selected.includes(customer.id)));

      setSelected([]);
      toast.success("Selected customers deleted from demo data");
    } else if (active && modal === "block") {
      updateCustomer(
        active.id,
        {
          status: active.status === "Blocked" ? "Active" : "Blocked",
        },
        active.status === "Blocked" ? "Customer unblocked" : "Customer blocked",
      );
    } else if (active && modal === "archive") {
      updateCustomer(active.id, { status: "Archived" }, "Customer archived");
    } else if (active && modal === "delete") {
      setCustomers((current) => current.filter((customer) => customer.id !== active.id));

      setActive(null);
      toast.success("Customer deleted from demo data");
    } else if (active && modal === "note" && note.trim()) {
      updateCustomer(
        active.id,
        {
          notes: [...active.notes, note.trim()],
        },
        "Note added",
      );
    }

    setModal(null);
    setNote("");
  };

  const filters = [
    [segment, setSegment, ["All Customers", ...segments]],
    [status, setStatus, ["All statuses", ...statuses]],
    [
      country,
      setCountry,
      ["All regions", "United States", "United Kingdom", "Germany", "India", "Canada", "Australia"],
    ],
    [spend, setSpend, ["All spend", "Under $500", "$500-$1,000", "$1,000-$5,000", "$5,000+"]],
    [ordersFilter, setOrdersFilter, ["All orders", "0 Orders", "1-5", "6-10", "10+"]],
    [
      lastOrder,
      setLastOrder,
      [
        "Any time",
        "Last 7 Days",
        "Last 30 Days",
        "Last 90 Days",
        "More Than 90 Days",
        "Never Ordered",
      ],
    ],
    [
      sort,
      setSort,
      [
        "Newest",
        "Oldest",
        "Name A-Z",
        "Highest Spend",
        "Lowest Spend",
        "Most Orders",
        "Recent Purchase",
        "Highest Customer Value",
      ],
    ],
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Manage customer profiles, order history, segments and lifetime value."
        breadcrumb={["Vexui", "eCommerce", "Customers"]}
        actions={
          <>
            <Button variant="outline" onClick={() => exportCsv()}>
              <Icons.Download />
              Export
            </Button>

            <Button onClick={beginAdd}>
              <Icons.UserPlus />
              Add customer
            </Button>
          </>
        }
      />

      <Card bodyClassName="p-0" className="mb-4">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Customers", "18,429"],
            ["Active", "15,862"],
            ["New This Month", "1,284"],
            ["VIP", "426"],
            ["At Risk", "318"],
            ["Avg. Customer Value", "$624"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[130px] flex-1 px-5 py-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="border-b p-4">
          <div className="relative mb-3 max-w-md">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              aria-label="Search customers"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customer, email, phone, tag or location"
              className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(([filterValue, setter, options], index) => (
              <select
                key={index}
                value={filterValue as string}
                onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                className="h-9 max-w-[160px] rounded-md border bg-background px-2 text-sm"
              >
                {(options as string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ))}

            <Button variant="goast" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-primary/5 px-4 py-2.5 text-sm">
            <b>{selected.length} selected</b>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulkValue("VIP");
                setModal("bulkSegment");
              }}
            >
              Change segment
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setBulkValue("Active");
                setModal("bulkStatus");
              }}
            >
              Change status
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCustomers((current) =>
                  current.map((customer) =>
                    selected.includes(customer.id)
                      ? {
                          ...customer,
                          segment: "VIP",
                        }
                      : customer,
                  ),
                );

                toast.success("Selected customers marked as VIP");
              }}
            >
              Mark VIP
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCustomers((current) =>
                  current.map((customer) =>
                    selected.includes(customer.id)
                      ? {
                          ...customer,
                          status: "Archived",
                        }
                      : customer,
                  ),
                );

                toast.success("Selected customers archived");
              }}
            >
              Archive
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportCsv(customers.filter((customer) => selected.includes(customer.id)))
              }
            >
              Export selected
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setModal("bulkDelete")}>
              Delete
            </Button>

            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    aria-label="Select all visible customers"
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      setSelected(allSelected ? [] : visible.map((customer) => customer.id))
                    }
                  />
                </th>

                {[
                  "Customer",
                  "Location",
                  "Orders",
                  "Total spent",
                  "Avg. order",
                  "Last order",
                  "Segment",
                  "Status",
                  "",
                ].map((heading) => (
                  <th key={heading} className="px-3 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visible.map((customer) => (
                <tr key={customer.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      aria-label={`Select ${customer.name}`}
                      type="checkbox"
                      checked={selected.includes(customer.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(customer.id)
                            ? current.filter((id) => id !== customer.id)
                            : [...current, customer.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(customer)}
                      className="flex items-center gap-2.5 text-start"
                    >
                      <img
                        src={getUserImage(customer.name)}
                        alt={customer.name}
                        className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary object-cover"
                      />

                      <span>
                        <b className="block hover:text-primary">{customer.name}</b>

                        <small className="text-muted-foreground">
                          {customer.email}
                          {customer.company ? `  ${customer.company}` : ""}
                        </small>
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-4">
                    <p>{customer.city}</p>
                    <small className="text-muted-foreground">{customer.country}</small>
                  </td>

                  <td className="px-3 py-4 font-medium">{customer.orders}</td>

                  <td className="px-3 py-4 font-semibold">${customer.spent.toLocaleString()}</td>

                  <td className="px-3 py-4">
                    ${customer.orders ? (customer.spent / customer.orders).toFixed(2) : "0.00"}
                  </td>

                  <td className="px-3 py-4">
                    <p>{customer.lastOrder}</p>

                    {customer.lastOrderDays !== null && (
                      <small className="text-muted-foreground">
                        {customer.lastOrderDays} days ago
                      </small>
                    )}
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={segmentTone[customer.segment]}>{customer.segment}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={statusTone[customer.status]}>{customer.status}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Button size="sm" variant="outline" onClick={() => setActive(customer)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Icons.UsersRound className="size-8 text-muted-foreground" />
            <b>No matching customers</b>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing 1-{visible.length} of 18,429 customers</span>

          <div className="flex items-center gap-2">
            <select
              aria-label="Page size"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>

            <Button size="sm" variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Sheet
        open={Boolean(active) && !modal}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{active?.name}</SheetTitle>
            <SheetDescription>Customer profile and commerce activity</SheetDescription>
          </SheetHeader>

          {active && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src={getUserImage(active.name)}
                  alt={active.name}
                  className="grid size-12 place-items-center rounded-full bg-primary/10 font-semibold text-primary object-cover"
                />

                <div>
                  <p className="font-semibold">{active.name}</p>
                  <p className="text-sm text-muted-foreground">{active.email}</p>

                  <div className="mt-1 flex gap-1">
                    <Badge tone={statusTone[active.status]}>{active.status}</Badge>

                    <Badge tone={segmentTone[active.segment]}>{active.segment}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Total spent", `$${active.spent.toLocaleString()}`],
                  ["Orders", String(active.orders)],
                  [
                    "Avg. order",
                    `$${active.orders ? (active.spent / active.orders).toFixed(2) : "0.00"}`,
                  ],
                  ["Lifetime value", `$${Math.round(active.spent * 1.3).toLocaleString()}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <b className="mt-1 block text-sm">{value}</b>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border p-4 text-sm">
                <p className="mb-2 font-semibold">Profile</p>

                <div className="grid gap-2 text-muted-foreground">
                  <p>
                    <span className="text-foreground">Phone:</span> {active.phone}
                  </p>

                  <p>
                    <span className="text-foreground">Company:</span>{" "}
                    {active.company || "Personal customer"}
                  </p>

                  <p>
                    <span className="text-foreground">Joined:</span> {active.joined}
                  </p>

                  <p>
                    <span className="text-foreground">Address:</span> {active.city},{" "}
                    {active.country}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Recent orders</h3>

                <div className="divide-y rounded-lg border">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center justify-between p-3 text-sm">
                      <span>
                        <b>#ORD-{10482 - index}</b>
                        <small className="ms-2 text-muted-foreground">{index * 8} days ago</small>
                      </span>

                      <span>
                        <b>
                          $
                          {Math.max(
                            89,
                            Math.round(active.spent / Math.max(1, active.orders || 1)),
                          ).toFixed(2)}
                        </b>{" "}
                        <Badge tone="success">Paid</Badge>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Tags</h3>

                <div className="flex flex-wrap gap-1.5">
                  {active.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">Internal notes</h3>

                  <Button size="sm" variant="ghost" onClick={() => setModal("note")}>
                    Add note
                  </Button>
                </div>

                <div className="space-y-2">
                  {active.notes.length ? (
                    active.notes.map((item, index) => (
                      <p key={`${item}-${index}`} className="rounded-lg border p-3 text-sm">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-2 font-semibold">Activity</p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Order #ORD-10482 placed 2 days ago</p>
                  <p>Profile updated Aug 10, 2026</p>
                  <p>Segment changed to {active.segment} Jul 14, 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => beginEdit(active)}>
                  Edit customer
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    updateCustomer(active.id, { segment: "VIP" }, "Customer marked as VIP")
                  }
                >
                  Mark VIP
                </Button>

                <Button variant="outline" onClick={() => setModal("block")}>
                  {active.status === "Blocked" ? "Unblock customer" : "Block customer"}
                </Button>

                <Button variant="outline" onClick={() => setModal("archive")}>
                  Archive
                </Button>

                <Button
                  variant="destructive"
                  className="col-span-2"
                  onClick={() => setModal("delete")}
                >
                  Delete customer
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(modal)}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add customer"
                : modal === "edit"
                  ? "Edit customer"
                  : modal === "note"
                    ? "Add Customer Note"
                    : modal === "block"
                      ? active?.status === "Blocked"
                        ? "Unblock customer?"
                        : "Block this customer?"
                      : modal === "archive"
                        ? "Archive customer?"
                        : modal === "delete"
                          ? "Delete customer?"
                          : modal === "bulkSegment"
                            ? "Change customer segment"
                            : modal === "bulkStatus"
                              ? "Change customer status"
                              : "Delete selected customers?"}
            </DialogTitle>

            <DialogDescription>
              {modal === "block"
                ? "The customer remains in records but is marked as blocked."
                : modal === "archive"
                  ? "Archived customers remain in records and can be restored later."
                  : modal === "delete" || modal === "bulkDelete"
                    ? "This is demo behavior. The selected record will be removed from local data."
                    : modal === "note"
                      ? "Internal notes are visible to your team only."
                      : "Complete the details below."}
            </DialogDescription>
          </DialogHeader>

          {(modal === "add" || modal === "edit") && <CustomerForm form={form} setForm={setForm} />}

          {modal === "note" && (
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Write an internal note"
              rows={4}
              className="w-full rounded-md border bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
            />
          )}

          {modal === "bulkSegment" && (
            <select
              value={bulkValue}
              onChange={(event) => setBulkValue(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {segments.map((segment) => (
                <option key={segment}>{segment}</option>
              ))}
            </select>
          )}

          {modal === "bulkStatus" && (
            <select
              value={bulkValue}
              onChange={(event) => setBulkValue(event.target.value)}
              className="h-10 rounded-md border bg-background px-3"
            >
              {statuses.slice(0, 3).map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>

            <Button
              variant={modal === "delete" || modal === "bulkDelete" ? "destructive" : "default"}
              onClick={modal === "add" || modal === "edit" ? saveForm : confirmAction}
            >
              {modal === "add"
                ? "Create customer"
                : modal === "edit"
                  ? "Save changes"
                  : modal === "note"
                    ? "Add note"
                    : modal === "block"
                      ? active?.status === "Blocked"
                        ? "Unblock customer"
                        : "Block customer"
                      : modal === "archive"
                        ? "Archive"
                        : modal === "delete" || modal === "bulkDelete"
                          ? "Delete"
                          : "Apply changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
