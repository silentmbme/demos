import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  Boxes,
  Check,
  ClipboardList,
  MapPin,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type LogisticsKind =
  "inventory" | "stock-transfer" | "purchase-orders" | "suppliers" | "shipments";

type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  quantity: number;
  reorderAt: number;
  unitCost: number;
};
type Transfer = {
  id: string;
  item: string;
  sku: string;
  quantity: number;
  from: string;
  to: string;
  date: string;
  status: "Requested" | "In transit" | "Received";
};
type PurchaseOrder = {
  id: string;
  supplier: string;
  lines: number;
  total: number;
  date: string;
  status: "Draft" | "Pending" | "Received";
};
type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  products: number;
  status: "Active" | "Inactive";
};
type Shipment = {
  id: string;
  order: string;
  customer: string;
  carrier: string;
  origin: string;
  destination: string;
  eta: string;
  progress: number;
  status: "Pending" | "In transit" | "Delayed" | "Delivered";
};

const initialInventory: InventoryItem[] = [
  {
    sku: "SKU-2048",
    name: "Wireless barcode scanner",
    category: "Electronics",
    warehouse: "Mumbai Central",
    quantity: 148,
    reorderAt: 50,
    unitCost: 42.5,
  },
  {
    sku: "SKU-2049",
    name: "Thermal label roll",
    category: "Packaging",
    warehouse: "Mumbai Central",
    quantity: 36,
    reorderAt: 60,
    unitCost: 8.25,
  },
  {
    sku: "SKU-2050",
    name: "Shipping carton · Large",
    category: "Packaging",
    warehouse: "Pune North",
    quantity: 420,
    reorderAt: 120,
    unitCost: 1.8,
  },
  {
    sku: "SKU-2051",
    name: "Handheld inventory terminal",
    category: "Electronics",
    warehouse: "Bengaluru East",
    quantity: 0,
    reorderAt: 20,
    unitCost: 189,
  },
  {
    sku: "SKU-2052",
    name: "Protective foam inserts",
    category: "Packing supplies",
    warehouse: "Pune North",
    quantity: 52,
    reorderAt: 40,
    unitCost: 3.4,
  },
  {
    sku: "SKU-2052",
    name: "Protective foam inserts",
    category: "Packing supplies",
    warehouse: "Mumbai Central",
    quantity: 40,
    reorderAt: 40,
    unitCost: 3.4,
  },
  {
    sku: "SKU-2053",
    name: "Pallet wrap · 500 mm",
    category: "Packing supplies",
    warehouse: "Delhi Hub",
    quantity: 74,
    reorderAt: 35,
    unitCost: 12.75,
  },
];
const initialTransfers: Transfer[] = [
  {
    id: "TRF-1001",
    item: "Thermal label roll",
    sku: "SKU-2049",
    quantity: 24,
    from: "Mumbai Central",
    to: "Pune North",
    date: "2026-10-10",
    status: "In transit",
  },
  {
    id: "TRF-1002",
    item: "Shipping carton · Large",
    sku: "SKU-2050",
    quantity: 80,
    from: "Pune North",
    to: "Delhi Hub",
    date: "2026-10-09",
    status: "Requested",
  },
  {
    id: "TRF-1003",
    item: "Protective foam inserts",
    sku: "SKU-2052",
    quantity: 40,
    from: "Pune North",
    to: "Mumbai Central",
    date: "2026-10-08",
    status: "Received",
  },
];
const initialOrders: PurchaseOrder[] = [
  {
    id: "PO-3001",
    supplier: "Acme Packaging Co.",
    lines: 4,
    total: 4820,
    date: "2026-10-08",
    status: "Pending",
  },
  {
    id: "PO-3002",
    supplier: "Northstar Technology",
    lines: 2,
    total: 12600,
    date: "2026-10-06",
    status: "Draft",
  },
  {
    id: "PO-3003",
    supplier: "Metro Supply Group",
    lines: 6,
    total: 2940,
    date: "2026-10-01",
    status: "Received",
  },
];
const initialSuppliers: Supplier[] = [
  {
    id: "SUP-101",
    name: "Acme Packaging Co.",
    contact: "Priya Shah",
    email: "priya@acmepack.example",
    phone: "+91 22 5550 1200",
    location: "Mumbai, India",
    products: 18,
    status: "Active",
  },
  {
    id: "SUP-102",
    name: "Northstar Technology",
    contact: "Arjun Mehta",
    email: "arjun@northstar.example",
    phone: "+91 80 5550 2410",
    location: "Bengaluru, India",
    products: 12,
    status: "Active",
  },
  {
    id: "SUP-103",
    name: "Metro Supply Group",
    contact: "Kavya Rao",
    email: "kavya@metrosupply.example",
    phone: "+91 11 5550 6310",
    location: "Delhi, India",
    products: 24,
    status: "Active",
  },
  {
    id: "SUP-104",
    name: "Evergreen Industrial",
    contact: "Rohan Das",
    email: "rohan@evergreen.example",
    phone: "+91 20 5550 0840",
    location: "Pune, India",
    products: 8,
    status: "Inactive",
  },
];
const initialShipments: Shipment[] = [
  {
    id: "SHP-1001",
    order: "ORD-8462",
    customer: "Northstar Retail",
    carrier: "Vex Freight",
    origin: "Mumbai",
    destination: "Pune",
    eta: "2026-10-10",
    progress: 65,
    status: "In transit",
  },
  {
    id: "SHP-1002",
    order: "ORD-8458",
    customer: "Greenfield Foods",
    carrier: "BlueDart",
    origin: "Bengaluru",
    destination: "Chennai",
    eta: "2026-10-09",
    progress: 100,
    status: "Delivered",
  },
  {
    id: "SHP-1003",
    order: "ORD-8471",
    customer: "Atlas Supplies",
    carrier: "Vex Freight",
    origin: "Delhi",
    destination: "Jaipur",
    eta: "2026-10-11",
    progress: 0,
    status: "Pending",
  },
  {
    id: "SHP-1004",
    order: "ORD-8469",
    customer: "Urban Living",
    carrier: "RapidRoute",
    origin: "Hyderabad",
    destination: "Vijayawada",
    eta: "2026-10-11",
    progress: 40,
    status: "Delayed",
  },
];

const pageConfig: Record<
  LogisticsKind,
  { title: string; description: string; icon: typeof Package; statuses: string[] }
> = {
  inventory: {
    title: "Inventory",
    description: "Monitor stock levels, locations, and reorder needs across your warehouses.",
    icon: Boxes,
    statuses: ["In stock", "Low stock", "Out of stock"],
  },
  "stock-transfer": {
    title: "Stock Transfer",
    description: "Move inventory between warehouses and track each transfer request.",
    icon: ArrowLeftRight,
    statuses: ["Requested", "In transit", "Received"],
  },
  "purchase-orders": {
    title: "Purchase Orders",
    description: "Create supplier orders and follow them through receiving.",
    icon: ClipboardList,
    statuses: ["Draft", "Pending", "Received"],
  },
  suppliers: {
    title: "Suppliers",
    description: "Keep supplier contacts, product coverage, and account status up to date.",
    icon: Users,
    statuses: ["Active", "Inactive"],
  },
  shipments: {
    title: "Shipments",
    description: "Track delivery routes, carrier assignments, and shipment progress.",
    icon: Truck,
    statuses: ["Pending", "In transit", "Delayed", "Delivered"],
  },
};
const locations = ["Mumbai Central", "Pune North", "Bengaluru East", "Delhi Hub"];
const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
const inventoryStatus = (item: InventoryItem) =>
  item.quantity === 0 ? "Out of stock" : item.quantity <= item.reorderAt ? "Low stock" : "In stock";
const nextId = (
  prefix: string,
  items: { id?: string; sku?: string }[],
  field: "id" | "sku" = "id",
) => {
  const highest = items.reduce(
    (max, item) => Math.max(max, Number((item[field] ?? "").split("-").at(-1)) || 0),
    0,
  );
  return `${prefix}-${highest + 1}`;
};
const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function LogisticsPage({ kind }: { kind: LogisticsKind }) {
  return (
    <AppShell navigationPath={`/logistics/${kind}`}>
      <LogisticsWorkspace kind={kind} />
    </AppShell>
  );
}

function LogisticsWorkspace({ kind }: { kind: LogisticsKind }) {
  const config = pageConfig[kind];
  const [inventory, setInventory] = useState(initialInventory);
  const [transfers, setTransfers] = useState(initialTransfers);
  const [orders, setOrders] = useState(initialOrders);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [shipments, setShipments] = useState(initialShipments);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [inventoryWarehouse, setInventoryWarehouse] = useState("All");
  const [inventoryCategory, setInventoryCategory] = useState("All");
  const [inventorySort, setInventorySort] = useState("name");
  const [transferFromFilter, setTransferFromFilter] = useState("All");
  const [transferToFilter, setTransferToFilter] = useState("All");
  const [dialog, setDialog] = useState<"create" | "adjust" | "edit" | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustment, setAdjustment] = useState("0");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

  const reservedStock = (sku: string, warehouse: string) =>
    transfers.reduce(
      (total, transfer) =>
        transfer.sku === sku && transfer.from === warehouse && transfer.status !== "Received"
          ? total + transfer.quantity
          : total,
      0,
    );
  const availableStock = (item: InventoryItem) =>
    Math.max(0, item.quantity - reservedStock(item.sku, item.warehouse));

  const filteredInventory = useMemo(
    () =>
      inventory
        .filter(
          (item) =>
            (filter === "All" || inventoryStatus(item) === filter) &&
            (inventoryWarehouse === "All" || item.warehouse === inventoryWarehouse) &&
            (inventoryCategory === "All" || item.category === inventoryCategory) &&
            `${item.sku} ${item.name} ${item.category} ${item.warehouse}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
        )
        .sort((a, b) => {
          if (inventorySort === "quantity-low") return a.quantity - b.quantity;
          if (inventorySort === "quantity-high") return b.quantity - a.quantity;
          if (inventorySort === "value") return b.quantity * b.unitCost - a.quantity * a.unitCost;
          return a.name.localeCompare(b.name);
        }),
    [inventory, filter, inventoryWarehouse, inventoryCategory, inventorySort, query],
  );
  const filteredTransfers = transfers.filter(
    (item) =>
      (filter === "All" || item.status === filter) &&
      (transferFromFilter === "All" || item.from === transferFromFilter) &&
      (transferToFilter === "All" || item.to === transferToFilter) &&
      `${item.id} ${item.item} ${item.sku} ${item.from} ${item.to}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const filteredOrders = orders.filter(
    (item) =>
      (filter === "All" || item.status === filter) &&
      `${item.id} ${item.supplier}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const filteredSuppliers = suppliers.filter(
    (item) =>
      (filter === "All" || item.status === filter) &&
      `${item.id} ${item.name} ${item.contact} ${item.email} ${item.location}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const filteredShipments = shipments.filter(
    (item) =>
      (filter === "All" || item.status === filter) &&
      `${item.id} ${item.order} ${item.customer} ${item.carrier} ${item.origin} ${item.destination}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  const openCreate = () => {
    const defaults: Record<LogisticsKind, Record<string, string>> = {
      inventory: {
        name: "",
        category: "Packaging",
        warehouse: locations[0]!,
        quantity: "0",
        reorderAt: "10",
        unitCost: "0",
      },
      "stock-transfer": {
        sku: inventory.find((item) => availableStock(item) > 0)?.sku ?? "",
        quantity: "1",
        from: inventory.find((item) => availableStock(item) > 0)?.warehouse ?? locations[0]!,
        to:
          locations.find(
            (location) =>
              location !==
              (inventory.find((item) => availableStock(item) > 0)?.warehouse ?? locations[0]),
          ) ?? locations[1]!,
        date: new Date().toISOString().slice(0, 10),
      },
      "purchase-orders": {
        supplier: suppliers[0]?.name ?? "",
        lines: "1",
        total: "0",
        date: new Date().toISOString().slice(0, 10),
      },
      suppliers: { name: "", contact: "", email: "", phone: "", location: "", products: "1" },
      shipments: {
        order: "",
        customer: "",
        carrier: "",
        origin: "",
        destination: "",
        eta: new Date().toISOString().slice(0, 10),
      },
    };
    setForm(defaults[kind]);
    setDialog("create");
  };
  const setField = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const editInventoryItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setForm({
      name: item.name,
      category: item.category,
      reorderAt: String(item.reorderAt),
      unitCost: String(item.unitCost),
    });
    setDialog("edit");
  };
  const announce = (message: string) => {
    setNotice(message);
    toast.success(message);
  };
  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (kind === "inventory") {
      if (dialog === "edit" && selectedItem) {
        setInventory((current) =>
          current.map((item) =>
            item.sku === selectedItem.sku && item.warehouse === selectedItem.warehouse
              ? {
                  ...item,
                  name: form["name"]!.trim(),
                  category: form["category"]!.trim(),
                  reorderAt: Number(form["reorderAt"]),
                  unitCost: Number(form["unitCost"]),
                }
              : item,
          ),
        );
        announce(`${selectedItem.sku} inventory details updated.`);
        setDialog(null);
        return;
      }
      const sku = nextId("SKU", inventory, "sku");
      setInventory((current) => [
        ...current,
        {
          sku,
          name: form["name"]!.trim(),
          category: form["category"]!,
          warehouse: form["warehouse"]!,
          quantity: Number(form["quantity"]),
          reorderAt: Number(form["reorderAt"]),
          unitCost: Number(form["unitCost"]),
        },
      ]);
      announce(`${sku} added to inventory.`);
    } else if (kind === "stock-transfer") {
      if (form["from"] === form["to"]) {
        toast.error("Choose two different warehouses.");
        return;
      }
      const quantity = Number(form["quantity"]);
      const item = inventory.find(
        (entry) => entry.sku === form["sku"] && entry.warehouse === form["from"],
      );
      if (!Number.isInteger(quantity) || quantity < 1 || !item || quantity > availableStock(item)) {
        toast.error("Transfer quantity exceeds stock available after existing reservations.");
        return;
      }
      setTransfers((current) => [
        ...current,
        {
          id: nextId("TRF", current),
          item: item.name,
          sku: item.sku,
          quantity,
          from: form["from"]!,
          to: form["to"]!,
          date: form["date"]!,
          status: "Requested",
        },
      ]);
      announce("Stock transfer request created.");
    } else if (kind === "purchase-orders") {
      setOrders((current) => [
        ...current,
        {
          id: nextId("PO", current),
          supplier: form["supplier"]!,
          lines: Number(form["lines"]),
          total: Number(form["total"]),
          date: form["date"]!,
          status: "Draft",
        },
      ]);
      announce("Purchase order saved as a draft.");
    } else if (kind === "suppliers") {
      setSuppliers((current) => [
        ...current,
        {
          id: nextId("SUP", current),
          name: form["name"]!.trim(),
          contact: form["contact"]!.trim(),
          email: form["email"]!.trim(),
          phone: form["phone"]!.trim(),
          location: form["location"]!.trim(),
          products: Number(form["products"]),
          status: "Active",
        },
      ]);
      announce("Supplier added to your directory.");
    } else {
      setShipments((current) => [
        ...current,
        {
          id: nextId("SHP", current),
          order: form["order"]!.trim(),
          customer: form["customer"]!.trim(),
          carrier: form["carrier"]!.trim(),
          origin: form["origin"]!.trim(),
          destination: form["destination"]!.trim(),
          eta: form["eta"]!,
          progress: 0,
          status: "Pending",
        },
      ]);
      announce("Shipment added to tracking.");
    }
    setDialog(null);
  };
  const updateTransfer = (item: Transfer) => {
    const status =
      item.status === "Requested"
        ? "In transit"
        : item.status === "In transit"
          ? "Received"
          : "Received";
    if (status === "Received") {
      const source = inventory.find((row) => row.sku === item.sku && row.warehouse === item.from);
      if (!source || source.quantity < item.quantity) {
        toast.error("The source warehouse no longer has enough stock for this transfer.");
        return;
      }
      setInventory((current) => {
        const destination = current.find(
          (row) => row.sku === item.sku && row.warehouse === item.to,
        );
        const sourceRemaining = source.quantity - item.quantity;
        const updated = current.map((row) => {
          if (row.sku === item.sku && row.warehouse === item.from)
            return { ...row, quantity: sourceRemaining };
          if (destination && row.sku === item.sku && row.warehouse === item.to)
            return { ...row, quantity: row.quantity + item.quantity };
          return row;
        });
        return destination
          ? updated
          : [...updated, { ...source, warehouse: item.to, quantity: item.quantity }];
      });
    }
    setTransfers((current) =>
      current.map((row) => (row.id === item.id ? { ...row, status } : row)),
    );
    announce(`${item.id} marked ${status.toLowerCase()}.`);
  };
  const advanceOrder = (item: PurchaseOrder) => {
    const status = item.status === "Draft" ? "Pending" : "Received";
    setOrders((current) => current.map((row) => (row.id === item.id ? { ...row, status } : row)));
    announce(`${item.id} marked ${status.toLowerCase()}.`);
  };
  const advanceShipment = (item: Shipment) => {
    const updated =
      item.status === "Pending"
        ? { ...item, status: "In transit" as const, progress: 25 }
        : item.status === "In transit" || item.status === "Delayed"
          ? { ...item, status: "Delivered" as const, progress: 100 }
          : item;
    setShipments((current) => current.map((row) => (row.id === item.id ? updated : row)));
    announce(`${item.id} updated to ${updated.status.toLowerCase()}.`);
  };
  const exportRows = () => {
    let rows: (string | number)[][];
    if (kind === "inventory")
      rows = [
        ["SKU", "Item", "Category", "Warehouse", "Quantity", "Reorder point", "Unit cost"],
        ...filteredInventory.map((item) => [
          item.sku,
          item.name,
          item.category,
          item.warehouse,
          item.quantity,
          item.reorderAt,
          item.unitCost,
        ]),
      ];
    else if (kind === "stock-transfer")
      rows = [
        ["Transfer", "Item", "Quantity", "From", "To", "Date", "Status"],
        ...filteredTransfers.map((item) => [
          item.id,
          item.item,
          item.quantity,
          item.from,
          item.to,
          item.date,
          item.status,
        ]),
      ];
    else if (kind === "purchase-orders")
      rows = [
        ["Order", "Supplier", "Lines", "Total", "Date", "Status"],
        ...filteredOrders.map((item) => [
          item.id,
          item.supplier,
          item.lines,
          item.total,
          item.date,
          item.status,
        ]),
      ];
    else if (kind === "suppliers")
      rows = [
        ["Supplier", "Contact", "Email", "Phone", "Location", "Products", "Status"],
        ...filteredSuppliers.map((item) => [
          item.name,
          item.contact,
          item.email,
          item.phone,
          item.location,
          item.products,
          item.status,
        ]),
      ];
    else
      rows = [
        ["Shipment", "Order", "Customer", "Carrier", "Origin", "Destination", "ETA", "Status"],
        ...filteredShipments.map((item) => [
          item.id,
          item.order,
          item.customer,
          item.carrier,
          item.origin,
          item.destination,
          item.eta,
          item.status,
        ]),
      ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${kind}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(`Exported ${rows.length - 1} ${config.title.toLowerCase()} records.`);
  };

  const count =
    kind === "inventory"
      ? filteredInventory.length
      : kind === "stock-transfer"
        ? filteredTransfers.length
        : kind === "purchase-orders"
          ? filteredOrders.length
          : kind === "suppliers"
            ? filteredSuppliers.length
            : filteredShipments.length;
  const openCount =
    kind === "inventory"
      ? inventory.length
      : kind === "stock-transfer"
        ? transfers.length
        : kind === "purchase-orders"
          ? orders.length
          : kind === "suppliers"
            ? suppliers.length
            : shipments.length;
  const titleAction =
    kind === "inventory"
      ? "Add item"
      : kind === "stock-transfer"
        ? "New transfer"
        : kind === "purchase-orders"
          ? "Create order"
          : kind === "suppliers"
            ? "Add supplier"
            : "Create shipment";
  const selectedTransferItem = inventory.find(
    (item) => item.sku === form["sku"] && item.warehouse === form["from"],
  );
  const selectedTransferAvailable = selectedTransferItem ? availableStock(selectedTransferItem) : 0;

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.description}
        breadcrumb={["Management", "Logistics", config.title]}
        actions={
          <>
            <Button variant="outline" onClick={exportRows}>
              <ArrowDownToLine className="size-4" />
              Export CSV
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              {titleAction}
            </Button>
          </>
        }
      />
      <div className="mb-6">
        {kind === "inventory" ? (
          <InventoryOverview inventory={inventory} />
        ) : kind === "stock-transfer" ? (
          <TransferOverview transfers={transfers} />
        ) : kind === "purchase-orders" ? (
          <PurchaseOverview orders={orders} />
        ) : kind === "suppliers" ? (
          <SupplierOverview suppliers={suppliers} />
        ) : (
          <ShipmentOverview shipments={shipments} />
        )}
      </div>
      {notice && (
        <p role="status" className="mb-4 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <Card
        title={`${config.title} directory`}
        description={`${count} of ${openCount} records shown`}
        action={<Badge tone="muted">Sample workspace</Badge>}
        bodyClassName="p-0"
      >
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label={`Search ${config.title.toLowerCase()}`}
                className="ps-9"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select
              aria-label={`${config.title} status`}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option>All</option>
              {config.statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          {kind === "inventory" && (
            <div className="flex flex-wrap gap-3">
              <select
                aria-label="Filter by warehouse"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={inventoryWarehouse}
                onChange={(event) => setInventoryWarehouse(event.target.value)}
              >
                <option value="All">All warehouses</option>
                {locations.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
              <select
                aria-label="Filter by category"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={inventoryCategory}
                onChange={(event) => setInventoryCategory(event.target.value)}
              >
                <option value="All">All categories</option>
                {[...new Set(inventory.map((item) => item.category))].sort().map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select
                aria-label="Sort inventory"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={inventorySort}
                onChange={(event) => setInventorySort(event.target.value)}
              >
                <option value="name">Sort: Item name</option>
                <option value="quantity-low">Sort: Lowest stock</option>
                <option value="quantity-high">Sort: Highest stock</option>
                <option value="value">Sort: Highest value</option>
              </select>
              {(inventoryWarehouse !== "All" ||
                inventoryCategory !== "All" ||
                filter !== "All" ||
                inventorySort !== "name" ||
                query) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setInventoryWarehouse("All");
                    setInventoryCategory("All");
                    setInventorySort("name");
                    setFilter("All");
                    setQuery("");
                  }}
                >
                  <RotateCcw className="size-4" />
                  Reset filters
                </Button>
              )}
            </div>
          )}
          {kind === "stock-transfer" && (
            <div className="flex flex-wrap items-center gap-3">
              <select
                aria-label="Filter by source warehouse"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={transferFromFilter}
                onChange={(event) => setTransferFromFilter(event.target.value)}
              >
                <option value="All">All source warehouses</option>
                {locations.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
              <select
                aria-label="Filter by destination warehouse"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                value={transferToFilter}
                onChange={(event) => setTransferToFilter(event.target.value)}
              >
                <option value="All">All destination warehouses</option>
                {locations.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
              {(transferFromFilter !== "All" ||
                transferToFilter !== "All" ||
                filter !== "All" ||
                query) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setTransferFromFilter("All");
                    setTransferToFilter("All");
                    setFilter("All");
                    setQuery("");
                  }}
                >
                  <RotateCcw className="size-4" />
                  Reset filters
                </Button>
              )}
            </div>
          )}
        </div>
        {kind === "inventory" ? (
          <InventoryTable
            rows={filteredInventory}
            onAdjust={(item) => {
              setSelectedItem(item);
              setAdjustment("0");
              setDialog("adjust");
            }}
            onEdit={editInventoryItem}
          />
        ) : kind === "stock-transfer" ? (
          <TransferTable rows={filteredTransfers} onAdvance={updateTransfer} />
        ) : kind === "purchase-orders" ? (
          <OrderTable rows={filteredOrders} onAdvance={advanceOrder} />
        ) : kind === "suppliers" ? (
          <SupplierTable
            rows={filteredSuppliers}
            onToggle={(item) => {
              const status = item.status === "Active" ? "Inactive" : "Active";
              setSuppliers((current) =>
                current.map((row) => (row.id === item.id ? { ...row, status } : row)),
              );
              announce(`${item.name} marked ${status.toLowerCase()}.`);
            }}
          />
        ) : (
          <ShipmentTable rows={filteredShipments} onAdvance={advanceShipment} />
        )}
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        Sample data only. Changes stay in this page session and are not sent to suppliers, carriers,
        or warehouse systems.
      </p>

      <Dialog
        open={dialog === "create" || dialog === "edit"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialog === "edit" ? "Edit inventory item" : titleAction}</DialogTitle>
            <DialogDescription>
              {dialog === "edit"
                ? `${selectedItem?.sku} · ${selectedItem?.warehouse}`
                : "Enter sample details to update this logistics workspace."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitCreate}>
            {kind === "inventory" && dialog === "edit" && (
              <>
                <Field label="Item name" required>
                  <Input
                    required
                    value={form["name"] ?? ""}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category" required>
                    <Input
                      required
                      value={form["category"] ?? ""}
                      onChange={(event) => setField("category", event.target.value)}
                    />
                  </Field>
                  <Field label="Reorder point" required>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={form["reorderAt"] ?? "0"}
                      onChange={(event) => setField("reorderAt", event.target.value)}
                    />
                  </Field>
                  <Field label="Unit cost (INR)" required>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form["unitCost"] ?? "0"}
                      onChange={(event) => setField("unitCost", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
            {kind === "inventory" && dialog === "create" && (
              <>
                <Field label="Item name" required>
                  <Input
                    required
                    value={form["name"] ?? ""}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category" required>
                    <Input
                      required
                      value={form["category"] ?? ""}
                      onChange={(event) => setField("category", event.target.value)}
                    />
                  </Field>
                  <Field label="Warehouse" required>
                    <select
                      required
                      className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                      value={form["warehouse"] ?? ""}
                      onChange={(event) => setField("warehouse", event.target.value)}
                    >
                      {locations.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Quantity" required>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={form["quantity"] ?? "0"}
                      onChange={(event) => setField("quantity", event.target.value)}
                    />
                  </Field>
                  <Field label="Reorder point" required>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={form["reorderAt"] ?? "0"}
                      onChange={(event) => setField("reorderAt", event.target.value)}
                    />
                  </Field>
                  <Field label="Unit cost (INR)" required>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form["unitCost"] ?? "0"}
                      onChange={(event) => setField("unitCost", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
            {kind === "stock-transfer" && dialog === "create" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="From warehouse" required>
                    <select
                      required
                      className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                      value={form["from"] ?? ""}
                      onChange={(event) => {
                        const from = event.target.value;
                        const firstItem = inventory.find(
                          (item) => item.warehouse === from && availableStock(item) > 0,
                        );
                        setForm((current) => ({
                          ...current,
                          from,
                          sku: firstItem?.sku ?? "",
                          to:
                            current["to"] === from
                              ? (locations.find((location) => location !== from) ?? "")
                              : (current["to"] ?? ""),
                          quantity: "1",
                        }));
                      }}
                    >
                      {locations.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="To warehouse" required>
                    <select
                      required
                      className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                      value={form["to"] ?? ""}
                      onChange={(event) => setField("to", event.target.value)}
                    >
                      {locations.map((value) => (
                        <option key={value} disabled={value === form["from"]}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Transfer date" required>
                    <Input
                      type="date"
                      required
                      value={form["date"] ?? ""}
                      onChange={(event) => setField("date", event.target.value)}
                    />
                  </Field>
                  <Field label="Inventory item" required>
                    <select
                      required
                      className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                      value={form["sku"] ?? ""}
                      onChange={(event) => {
                        const sku = event.target.value;
                        const item = inventory.find(
                          (row) => row.sku === sku && row.warehouse === form["from"],
                        );
                        const maxQuantity = item ? availableStock(item) : 1;
                        setForm((current) => ({
                          ...current,
                          sku,
                          quantity: String(Math.min(Number(current["quantity"]) || 1, maxQuantity)),
                        }));
                      }}
                    >
                      {inventory
                        .filter(
                          (item) => item.warehouse === form["from"] && availableStock(item) > 0,
                        )
                        .map((item) => (
                          <option key={`${item.sku}-${item.warehouse}`} value={item.sku}>
                            {item.name} · {availableStock(item)} available
                          </option>
                        ))}
                    </select>
                  </Field>
                  <Field label="Quantity to transfer" required>
                    <Input
                      type="number"
                      min="1"
                      max={Math.max(selectedTransferAvailable, 1)}
                      required
                      value={form["quantity"] ?? "1"}
                      onChange={(event) => setField("quantity", event.target.value)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selectedTransferItem
                        ? `${selectedTransferAvailable} units available after pending reservations`
                        : "No available stock at this source warehouse."}
                    </span>
                  </Field>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Transfer route
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-lg bg-card px-3 py-2 font-medium">{form["from"]}</span>
                    <ArrowLeftRight className="size-4 text-primary" aria-hidden />
                    <span className="rounded-lg bg-card px-3 py-2 font-medium">{form["to"]}</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedTransferItem?.name ?? "Select an item"}
                      {form["quantity"] ? ` · ${form["quantity"]} units` : ""}
                    </span>
                  </div>
                </div>
              </>
            )}
            {kind === "purchase-orders" && dialog === "create" && (
              <>
                <Field label="Supplier" required>
                  <select
                    required
                    className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                    value={form["supplier"] ?? ""}
                    onChange={(event) => setField("supplier", event.target.value)}
                  >
                    {suppliers
                      .filter((supplier) => supplier.status === "Active")
                      .map((supplier) => (
                        <option key={supplier.id}>{supplier.name}</option>
                      ))}
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Line items" required>
                    <Input
                      type="number"
                      min="1"
                      required
                      value={form["lines"] ?? "1"}
                      onChange={(event) => setField("lines", event.target.value)}
                    />
                  </Field>
                  <Field label="Order total (INR)" required>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form["total"] ?? "0"}
                      onChange={(event) => setField("total", event.target.value)}
                    />
                  </Field>
                  <Field label="Order date" required>
                    <Input
                      type="date"
                      required
                      value={form["date"] ?? ""}
                      onChange={(event) => setField("date", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
            {kind === "suppliers" && dialog === "create" && (
              <>
                <Field label="Supplier name" required>
                  <Input
                    required
                    value={form["name"] ?? ""}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Contact person" required>
                    <Input
                      required
                      value={form["contact"] ?? ""}
                      onChange={(event) => setField("contact", event.target.value)}
                    />
                  </Field>
                  <Field label="Email" required>
                    <Input
                      type="email"
                      required
                      value={form["email"] ?? ""}
                      onChange={(event) => setField("email", event.target.value)}
                    />
                  </Field>
                  <Field label="Phone" required>
                    <Input
                      required
                      value={form["phone"] ?? ""}
                      onChange={(event) => setField("phone", event.target.value)}
                    />
                  </Field>
                  <Field label="Location" required>
                    <Input
                      required
                      value={form["location"] ?? ""}
                      onChange={(event) => setField("location", event.target.value)}
                    />
                  </Field>
                  <Field label="Product lines" required>
                    <Input
                      type="number"
                      min="0"
                      required
                      value={form["products"] ?? "0"}
                      onChange={(event) => setField("products", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
            {kind === "shipments" && dialog === "create" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Order number" required>
                    <Input
                      required
                      value={form["order"] ?? ""}
                      onChange={(event) => setField("order", event.target.value)}
                    />
                  </Field>
                  <Field label="Customer" required>
                    <Input
                      required
                      value={form["customer"] ?? ""}
                      onChange={(event) => setField("customer", event.target.value)}
                    />
                  </Field>
                  <Field label="Carrier" required>
                    <Input
                      required
                      value={form["carrier"] ?? ""}
                      onChange={(event) => setField("carrier", event.target.value)}
                    />
                  </Field>
                  <Field label="Estimated delivery" required>
                    <Input
                      type="date"
                      required
                      value={form["eta"] ?? ""}
                      onChange={(event) => setField("eta", event.target.value)}
                    />
                  </Field>
                  <Field label="Origin" required>
                    <Input
                      required
                      value={form["origin"] ?? ""}
                      onChange={(event) => setField("origin", event.target.value)}
                    />
                  </Field>
                  <Field label="Destination" required>
                    <Input
                      required
                      value={form["destination"] ?? ""}
                      onChange={(event) => setField("destination", event.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button type="submit">
                {dialog === "edit" ? "Save changes" : "Save "}
                {dialog !== "edit" &&
                  (kind === "stock-transfer"
                    ? "transfer"
                    : kind === "purchase-orders"
                      ? "order"
                      : kind === "shipments"
                        ? "shipment"
                        : kind === "suppliers"
                          ? "supplier"
                          : "item")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={dialog === "adjust"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              {selectedItem?.name} · {selectedItem?.sku} · {selectedItem?.warehouse}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedItem) return;
              const delta = Number(adjustment);
              setInventory((current) =>
                current.map((item) =>
                  item.sku === selectedItem.sku
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item,
                ),
              );
              announce(`${selectedItem.name} quantity adjusted.`);
              setDialog(null);
            }}
          >
            <Field label="Change quantity" required>
              <Input
                type="number"
                required
                value={adjustment}
                onChange={(event) => setAdjustment(event.target.value)}
              />
              <span className="text-xs text-muted-foreground">
                Use a positive number to add stock or a negative number to remove it.
              </span>
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button type="submit">Update stock</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InventoryOverview({ inventory }: { inventory: InventoryItem[] }) {
  const health = [
    {
      label: "In stock",
      tone: "success",
      count: inventory.filter((item) => inventoryStatus(item) === "In stock").length,
    },
    {
      label: "Low stock",
      tone: "warning",
      count: inventory.filter((item) => inventoryStatus(item) === "Low stock").length,
    },
    {
      label: "Out of stock",
      tone: "destructive",
      count: inventory.filter((item) => inventoryStatus(item) === "Out of stock").length,
    },
  ];
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const warehouses = locations.map((location) => {
    const items = inventory.filter((item) => item.warehouse === location);
    return {
      location,
      units: items.reduce((sum, item) => sum + item.quantity, 0),
      skus: new Set(items.map((item) => item.sku)).size,
    };
  });
  const maxUnits = Math.max(...warehouses.map((item) => item.units), 1);
  const reorder = [...inventory]
    .filter((item) => inventoryStatus(item) !== "In stock")
    .sort((a, b) => a.quantity / Math.max(a.reorderAt, 1) - b.quantity / Math.max(b.reorderAt, 1))
    .slice(0, 4);
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card
        title="Stock health"
        description="On hand across all warehouse locations"
        bodyClassName="p-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight">{totalUnits.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              units across {new Set(inventory.map((item) => item.sku)).size} SKUs
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-muted-foreground">Estimated value</p>
            <p className="mt-1 text-lg font-semibold">{currency(totalValue)}</p>
          </div>
        </div>
        <div
          className="mt-5 flex h-3 overflow-hidden rounded-full bg-muted"
          aria-label="Inventory health distribution"
        >
          {health.map((item) => (
            <span
              key={item.label}
              className={
                item.tone === "success"
                  ? "bg-success"
                  : item.tone === "warning"
                    ? "bg-warning"
                    : "bg-destructive"
              }
              style={{ width: `${inventory.length ? (item.count / inventory.length) * 100 : 0}%` }}
              title={`${item.label}: ${item.count}`}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {health.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${item.tone === "success" ? "bg-success" : item.tone === "warning" ? "bg-warning" : "bg-destructive"}`}
              />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold">{item.count} items</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Warehouse distribution
          </p>
          <div className="space-y-3">
            {warehouses.map((item) => (
              <div key={item.location}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-medium">{item.location}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {item.units.toLocaleString()} units · {item.skus} SKUs
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.units / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card
        title="Reorder watch"
        description="Items at or below their reorder point"
        action={
          <Badge tone={reorder.length ? "warning" : "success"}>{reorder.length} to review</Badge>
        }
        bodyClassName="p-5"
      >
        {reorder.length ? (
          <div className="space-y-4">
            {reorder.map((item) => (
              <div
                key={`${item.sku}-${item.warehouse}`}
                className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.sku} · {item.warehouse}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-sm font-semibold">
                    {item.quantity}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {item.reorderAt}
                    </span>
                  </p>
                  <StatusBadge status={inventoryStatus(item)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-48 place-content-center text-center">
            <Check className="mx-auto size-8 text-success" />
            <p className="mt-3 text-sm font-medium">Stock levels look healthy</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No items are below their reorder point.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function TransferOverview({ transfers }: { transfers: Transfer[] }) {
  const stages: Transfer["status"][] = ["Requested", "In transit", "Received"];
  const routeMap = new Map<string, { from: string; to: string; count: number; units: number }>();
  transfers.forEach((item) => {
    const key = `${item.from} → ${item.to}`;
    const route = routeMap.get(key) ?? { from: item.from, to: item.to, count: 0, units: 0 };
    route.count += 1;
    route.units += item.quantity;
    routeMap.set(key, route);
  });
  const routes = [...routeMap.values()].sort((a, b) => b.units - a.units).slice(0, 4);
  const maxUnits = Math.max(...routes.map((item) => item.units), 1);
  const reserved = transfers
    .filter((item) => item.status !== "Received")
    .reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
      <Card
        title="Transfer pipeline"
        description="Requests move through dispatch, transit, and receipt"
        bodyClassName="p-5"
      >
        <div className="relative grid grid-cols-3 gap-2 before:absolute before:start-[16%] before:end-[16%] before:top-5 before:h-px before:bg-border">
          {stages.map((stage, index) => {
            const count = transfers.filter((item) => item.status === stage).length;
            const StageIcon = index === 0 ? ClipboardList : index === 1 ? Truck : Check;
            return (
              <div key={stage} className="relative flex flex-col items-center text-center">
                <span
                  className={`grid size-10 place-items-center rounded-full border bg-card ${count ? "border-primary/30 text-primary" : "border-border text-muted-foreground"}`}
                >
                  <StageIcon className="size-4" aria-hidden />
                </span>
                <p className="mt-3 text-xl font-semibold">{count}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stage}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Stock committed to open transfers</p>
              <p className="mt-1 text-2xl font-semibold">
                {reserved.toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">units</span>
              </p>
            </div>
            <ArrowLeftRight className="size-5 text-primary" aria-hidden />
          </div>
        </div>
      </Card>
      <Card
        title="Warehouse handoffs"
        description="Routes carrying the most units"
        bodyClassName="p-5"
      >
        {routes.length ? (
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={`${route.from}-${route.to}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2 text-xs">
                    <span className="truncate font-medium">{route.from}</span>
                    <ArrowLeftRight className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate font-medium">{route.to}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {route.units} units · {route.count} transfers
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(route.units / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No warehouse movements yet.
          </p>
        )}
      </Card>
    </div>
  );
}

function PurchaseOverview({ orders }: { orders: PurchaseOrder[] }) {
  const statuses: PurchaseOrder["status"][] = ["Draft", "Pending", "Received"];
  const openValue = orders
    .filter((item) => item.status !== "Received")
    .reduce((sum, item) => sum + item.total, 0);
  const allValue = orders.reduce((sum, item) => sum + item.total, 0);
  const spend = [
    ...orders.reduce(
      (map, item) => map.set(item.supplier, (map.get(item.supplier) ?? 0) + item.total),
      new Map<string, number>(),
    ),
  ]
    .map(([supplier, total]) => ({ supplier, total }))
    .sort((a, b) => b.total - a.total);
  const maxSpend = Math.max(...spend.map((item) => item.total), 1);
  return (
    <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <Card
        title="Order lifecycle"
        description="Purchasing value by current stage"
        bodyClassName="p-5"
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Open commitments</p>
            <p className="mt-1 text-3xl font-semibold">{currency(openValue)}</p>
          </div>
          <p className="text-xs text-muted-foreground">{orders.length} orders</p>
        </div>
        <div
          className="mt-5 flex h-3 overflow-hidden rounded-full bg-muted"
          aria-label="Purchase order values by status"
        >
          {statuses.map((status) => {
            const value = orders
              .filter((item) => item.status === status)
              .reduce((sum, item) => sum + item.total, 0);
            const color =
              status === "Draft"
                ? "bg-muted-foreground/40"
                : status === "Pending"
                  ? "bg-warning"
                  : "bg-success";
            return (
              <span
                key={status}
                className={color}
                style={{ width: `${allValue ? (value / allValue) * 100 : 0}%` }}
                title={`${status}: ${currency(value)}`}
              />
            );
          })}
        </div>
        <div className="mt-4 space-y-3">
          {statuses.map((status) => {
            const matching = orders.filter((item) => item.status === status);
            const value = matching.reduce((sum, item) => sum + item.total, 0);
            return (
              <div key={status} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${status === "Draft" ? "bg-muted-foreground/50" : status === "Pending" ? "bg-warning" : "bg-success"}`}
                  />
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
                <div className="text-end">
                  <span className="text-xs font-semibold">{currency(value)}</span>
                  <span className="ms-2 text-[10px] text-muted-foreground">
                    {matching.length} orders
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card
        title="Supplier spend"
        description="Order value grouped by supplier"
        bodyClassName="p-5"
      >
        {spend.length ? (
          <div className="space-y-4">
            {spend.map((item) => (
              <div key={item.supplier}>
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-medium">{item.supplier}</span>
                  <span className="shrink-0 text-xs font-semibold">{currency(item.total)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.total / maxSpend) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">No purchase orders yet.</p>
        )}
      </Card>
    </div>
  );
}

function SupplierOverview({ suppliers }: { suppliers: Supplier[] }) {
  const active = suppliers.filter((supplier) => supplier.status === "Active");
  const inactive = suppliers.length - active.length;
  const activeRatio = suppliers.length ? (active.length / suppliers.length) * 100 : 0;
  const locationsSummary = [
    ...suppliers.reduce((map, supplier) => {
      const city = supplier.location.split(",")[0]?.trim() || "Other";
      map.set(city, (map.get(city) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ].sort((a, b) => b[1] - a[1]);
  const coverage = [...suppliers].sort((a, b) => b.products - a.products).slice(0, 4);
  const maxProducts = Math.max(...coverage.map((supplier) => supplier.products), 1);
  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <Card
        title="Partner coverage"
        description="Supplier availability and catalogue reach"
        bodyClassName="p-5"
      >
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="grid size-32 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--success) ${activeRatio}%, var(--muted) ${activeRatio}% 100%)`,
            }}
          >
            <div className="grid size-24 place-content-center rounded-full bg-card text-center">
              <span className="text-2xl font-semibold">{active.length}</span>
              <span className="text-[10px] text-muted-foreground">
                of {suppliers.length} active
              </span>
            </div>
          </div>
          <div className="min-w-40 flex-1 space-y-3">
            {[
              { label: "Active partners", count: active.length, dot: "bg-success" },
              { label: "Inactive", count: inactive, dot: "bg-muted-foreground/40" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={`size-2 rounded-full ${item.dot}`} />
                  {item.label}
                </span>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">Product lines represented</p>
              <p className="mt-1 text-xl font-semibold">
                {suppliers.reduce((sum, supplier) => sum + supplier.products, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Supplier locations
          </p>
          <div className="flex flex-wrap gap-2">
            {locationsSummary.map(([city, count]) => (
              <span key={city} className="rounded-full border border-border px-3 py-1.5 text-xs">
                <MapPin className="me-1 inline size-3 text-primary" />
                {city}
                <span className="ms-1.5 font-semibold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </Card>
      <Card
        title="Catalogue coverage"
        description="Suppliers with the broadest product range"
        bodyClassName="p-5"
      >
        {coverage.length ? (
          <div className="space-y-4">
            {coverage.map((supplier, index) => (
              <div key={supplier.id} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium">{supplier.name}</p>
                    <span className="shrink-0 text-xs font-semibold">
                      {supplier.products} lines
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(supplier.products / maxProducts) * 100}%` }}
                    />
                  </div>
                </div>
                <StatusBadge status={supplier.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No suppliers in the directory yet.
          </p>
        )}
      </Card>
    </div>
  );
}

function ShipmentOverview({ shipments }: { shipments: Shipment[] }) {
  const active = shipments.filter(
    (item) => item.status === "In transit" || item.status === "Delayed",
  );
  const delayed = shipments.filter((item) => item.status === "Delayed");
  const delivered = shipments.filter((item) => item.status === "Delivered");
  const upcoming = [...shipments]
    .filter((item) => item.status !== "Delivered")
    .sort((a, b) => a.eta.localeCompare(b.eta))
    .slice(0, 4);
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <Card
        title="Delivery control tower"
        description="Active routes and estimated delivery progress"
        action={
          <Badge tone={delayed.length ? "warning" : "success"}>
            {delayed.length ? `${delayed.length} delayed` : "On schedule"}
          </Badge>
        }
        bodyClassName="p-5"
      >
        {active.length ? (
          <div className="space-y-4">
            {active.map((shipment) => (
              <div
                key={shipment.id}
                className={`rounded-xl border p-4 ${shipment.status === "Delayed" ? "border-warning/30 bg-warning/5" : "border-border bg-card"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{shipment.customer}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {shipment.id} · {shipment.carrier}
                    </p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="max-w-[40%] truncate font-medium">{shipment.origin}</span>
                  <div className="relative h-px flex-1 bg-border">
                    <Truck
                      className="absolute -top-2.5 size-4 text-primary"
                      style={{ left: `${Math.min(shipment.progress, 90)}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="max-w-[40%] truncate font-medium">{shipment.destination}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${shipment.status === "Delayed" ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold">{shipment.progress}%</span>
                  <span className="text-xs text-muted-foreground">
                    ETA {formatDate(shipment.eta)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-48 place-content-center text-center">
            <Check className="mx-auto size-8 text-success" />
            <p className="mt-3 text-sm font-medium">No active deliveries</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New and dispatched shipments will appear here.
            </p>
          </div>
        )}
      </Card>
      <Card
        title="Arrival schedule"
        description="Upcoming shipments by estimated date"
        bodyClassName="p-5"
      >
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Active routes</p>
            <p className="mt-1 text-xl font-semibold">{active.length}</p>
          </div>
          <div className="rounded-lg bg-success/10 p-3">
            <p className="text-xs text-muted-foreground">Delivered</p>
            <p className="mt-1 text-xl font-semibold text-success">{delivered.length}</p>
          </div>
        </div>
        {upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map((shipment) => {
              const eta = new Date(`${shipment.eta}T00:00:00`);
              return (
                <div
                  key={shipment.id}
                  className="flex items-center gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
                >
                  <div
                    className={`grid size-10 shrink-0 place-content-center rounded-lg text-center ${shipment.status === "Delayed" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}
                  >
                    <span className="text-[9px] uppercase">
                      {eta.toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold leading-none">{eta.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{shipment.customer}</p>
                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">No upcoming arrivals.</p>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      {label}
      {required && <span className="text-destructive"> *</span>}
      {children}
    </label>
  );
}
function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "In stock" || status === "Received" || status === "Active" || status === "Delivered"
      ? "success"
      : status === "Low stock" ||
          status === "Requested" ||
          status === "Draft" ||
          status === "Pending" ||
          status === "Delayed" ||
          status === "Inactive"
        ? "warning"
        : "info";
  return <Badge tone={tone}>{status}</Badge>;
}
function EmptyRow({ columns, title }: { columns: number; title: string }) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="py-14 text-center">
        <Package className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">No matching {title.toLowerCase()}</p>
        <p className="mt-1 text-sm text-muted-foreground">Try another search or status filter.</p>
      </TableCell>
    </TableRow>
  );
}
function InventoryTable({
  rows,
  onAdjust,
  onEdit,
}: {
  rows: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "SKU",
              "Item",
              "Warehouse",
              "Stock level",
              "Reorder at",
              "Unit cost",
              "Status",
              "Actions",
            ].map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={`${item.sku}-${item.warehouse}`}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </TableCell>
                <TableCell>{item.warehouse}</TableCell>
                <TableCell>
                  <div className="min-w-28">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{item.quantity}</span>
                      <span className="text-[10px] text-muted-foreground">units</span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                      role="meter"
                      aria-label={`${item.name} stock level`}
                      aria-valuemin={0}
                      aria-valuenow={item.quantity}
                      aria-valuemax={Math.max(item.reorderAt * 2, item.quantity, 1)}
                    >
                      <div
                        className={`h-full rounded-full ${item.quantity === 0 ? "bg-destructive" : item.quantity <= item.reorderAt ? "bg-warning" : "bg-success"}`}
                        style={{
                          width: `${Math.min(100, (item.quantity / Math.max(item.reorderAt * 2, item.quantity, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.reorderAt} units</TableCell>
                <TableCell>{currency(item.unitCost)}</TableCell>
                <TableCell>
                  <StatusBadge status={inventoryStatus(item)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onAdjust(item)}>
                      Adjust stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={8} title="inventory items" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
function TransferTable({
  rows,
  onAdvance,
}: {
  rows: Transfer[];
  onAdvance: (item: Transfer) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {["Transfer", "Item", "Quantity", "Route", "Date", "Status", "Actions"].map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.id}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.quantity} units</TableCell>
                <TableCell>
                  <p>{item.from}</p>
                  <p className="text-xs text-muted-foreground">to {item.to}</p>
                </TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>
                  <TransferProgress status={item.status} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={item.status === "Received"}
                    onClick={() => onAdvance(item)}
                  >
                    {item.status === "Requested" ? "Dispatch transfer" : "Confirm receipt"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={7} title="transfers" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
function TransferProgress({ status }: { status: Transfer["status"] }) {
  const stages: Transfer["status"][] = ["Requested", "In transit", "Received"];
  const activeIndex = stages.indexOf(status);
  return (
    <div className="min-w-32 space-y-2">
      <StatusBadge status={status} />
      <div className="flex gap-1" aria-label={`Transfer progress: ${status}`}>
        {stages.map((stage, index) => (
          <span
            key={stage}
            className={`h-1.5 flex-1 rounded-full ${index <= activeIndex ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        {status === "Requested"
          ? "Awaiting dispatch"
          : status === "In transit"
            ? "On the way to destination"
            : "Received at destination"}
      </p>
    </div>
  );
}
function OrderTable({
  rows,
  onAdvance,
}: {
  rows: PurchaseOrder[];
  onAdvance: (item: PurchaseOrder) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {["Order", "Supplier", "Line items", "Order total", "Date", "Status", "Actions"].map(
              (label) => (
                <TableHead key={label}>{label}</TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.lines} items</TableCell>
                <TableCell>{currency(item.total)}</TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={item.status === "Received"}
                    onClick={() => onAdvance(item)}
                  >
                    {item.status === "Draft" ? "Send order" : "Mark received"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={7} title="purchase orders" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
function SupplierTable({
  rows,
  onToggle,
}: {
  rows: Supplier[];
  onToggle: (item: Supplier) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Supplier",
              "Contact",
              "Email",
              "Phone",
              "Location",
              "Products",
              "Status",
              "Actions",
            ].map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.id}</p>
                </TableCell>
                <TableCell>{item.contact}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.products}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => onToggle(item)}>
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={8} title="suppliers" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
function ShipmentTable({
  rows,
  onAdvance,
}: {
  rows: Shipment[];
  onAdvance: (item: Shipment) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Tracking",
              "Customer / order",
              "Route",
              "Carrier",
              "ETA",
              "Progress",
              "Status",
              "Actions",
            ].map((label) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <p className="font-medium">{item.customer}</p>
                  <p className="text-xs text-muted-foreground">{item.order}</p>
                </TableCell>
                <TableCell>
                  <p>{item.origin}</p>
                  <p className="text-xs text-muted-foreground">to {item.destination}</p>
                </TableCell>
                <TableCell>{item.carrier}</TableCell>
                <TableCell>{formatDate(item.eta)}</TableCell>
                <TableCell>
                  <div className="min-w-24">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={item.status === "Delivered"}
                    onClick={() => onAdvance(item)}
                  >
                    {item.status === "Pending" ? "Dispatch" : "Mark delivered"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow columns={8} title="shipments" />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
