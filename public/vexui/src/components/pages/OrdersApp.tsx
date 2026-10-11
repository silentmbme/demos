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
import { cn } from "@/lib/utils";
import { getUserImage } from "@/lib/user-images";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed";

type FulfillmentStatus = "Fulfilled" | "Unfulfilled" | "Shipped" | "Returned";

type Order = {
  id: string;
  customer: string;
  email: string;
  initials: string;
  items: number;
  total: number;
  date: string;
  payment: PaymentStatus;
  fulfillment: FulfillmentStatus;
  status: OrderStatus;
  channel: string;
  tracking: string;
};

const initialOrders: Order[] = [
  {
    id: "#ORD-10482",
    customer: "Sophia Carter",
    email: "sophia.carter@example.com",
    initials: "SC",
    items: 2,
    total: 284,
    date: "Aug 24, 2026",
    payment: "Paid",
    fulfillment: "Fulfilled",
    status: "Delivered",
    channel: "Online Store",
    tracking: "NVA-729184",
  },
  {
    id: "#ORD-10483",
    customer: "Daniel Lee",
    email: "daniel.lee@example.com",
    initials: "DL",
    items: 1,
    total: 129,
    date: "Aug 24, 2026",
    payment: "Paid",
    fulfillment: "Unfulfilled",
    status: "Processing",
    channel: "Online Store",
    tracking: "",
  },
  {
    id: "#ORD-10484",
    customer: "Emma Wilson",
    email: "emma.wilson@example.com",
    initials: "EW",
    items: 4,
    total: 416,
    date: "Aug 23, 2026",
    payment: "Pending",
    fulfillment: "Unfulfilled",
    status: "Pending",
    channel: "Marketplace",
    tracking: "",
  },
  {
    id: "#ORD-10485",
    customer: "Olivia Smith",
    email: "olivia.smith@example.com",
    initials: "OS",
    items: 2,
    total: 196,
    date: "Aug 23, 2026",
    payment: "Refunded",
    fulfillment: "Returned",
    status: "Returned",
    channel: "Online Store",
    tracking: "RET-402818",
  },
  {
    id: "#ORD-10486",
    customer: "Noah Williams",
    email: "noah.williams@example.com",
    initials: "NW",
    items: 3,
    total: 328,
    date: "Aug 22, 2026",
    payment: "Paid",
    fulfillment: "Shipped",
    status: "Shipped",
    channel: "Wholesale",
    tracking: "NVA-729208",
  },
  {
    id: "#ORD-10487",
    customer: "Mia Anderson",
    email: "mia.anderson@example.com",
    initials: "MA",
    items: 1,
    total: 89,
    date: "Aug 22, 2026",
    payment: "Paid",
    fulfillment: "Fulfilled",
    status: "Delivered",
    channel: "Online Store",
    tracking: "NVA-729149",
  },
];

const orderTone: Record<OrderStatus, "warning" | "info" | "success" | "danger" | "muted"> = {
  Pending: "warning",
  Processing: "info",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "danger",
  Returned: "muted",
};

const paymentTone: Record<PaymentStatus, "warning" | "success" | "danger" | "muted"> = {
  Paid: "success",
  Pending: "warning",
  Refunded: "muted",
  Failed: "danger",
};

const fulfillmentTone: Record<FulfillmentStatus, "warning" | "info" | "success" | "muted"> = {
  Fulfilled: "success",
  Unfulfilled: "warning",
  Shipped: "info",
  Returned: "muted",
};

export function OrdersApp() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("All fulfillment");
  const [channelFilter, setChannelFilter] = useState("All channels");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [action, setAction] = useState<"status" | "payment" | "refund" | "cancel" | null>(null);
  const [nextValue, setNextValue] = useState("Processing");

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const term = query.trim().toLowerCase();

        const matchesText =
          !term ||
          [order.id, order.customer, order.email].some((value) =>
            value.toLowerCase().includes(term),
          );

        return (
          matchesText &&
          (statusFilter === "All statuses" || order.status === statusFilter) &&
          (paymentFilter === "All payments" || order.payment === paymentFilter) &&
          (fulfillmentFilter === "All fulfillment" || order.fulfillment === fulfillmentFilter) &&
          (channelFilter === "All channels" || order.channel === channelFilter)
        );
      }),
    [orders, query, statusFilter, paymentFilter, fulfillmentFilter, channelFilter],
  );

  const updateOrder = (id: string, patch: Partial<Order>, message: string) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, ...patch } : order)),
    );

    setActiveOrder((current) => (current?.id === id ? { ...current, ...patch } : current));

    toast.success(message);
  };

  const toggleSelect = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All statuses");
    setPaymentFilter("All payments");
    setFulfillmentFilter("All fulfillment");
    setChannelFilter("All channels");
  };

  const exportOrders = () => {
    const csv = [
      "Order,Customer,Items,Total,Payment,Fulfillment,Status,Channel",
      ...visibleOrders.map((o) =>
        [o.id, o.customer, o.items, o.total, o.payment, o.fulfillment, o.status, o.channel].join(
          ",",
        ),
      ),
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "orders-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Orders export downloaded");
  };

  const executeAction = () => {
    if (!activeOrder || !action) return;

    if (action === "status")
      updateOrder(
        activeOrder.id,
        { status: nextValue as OrderStatus },
        `Order ${activeOrder.id} status updated`,
      );

    if (action === "payment")
      updateOrder(
        activeOrder.id,
        { payment: nextValue as PaymentStatus },
        `Payment status updated for ${activeOrder.id}`,
      );

    if (action === "refund")
      updateOrder(
        activeOrder.id,
        {
          payment: "Refunded",
          status: "Returned",
          fulfillment: "Returned",
        },
        `Refund initiated for ${activeOrder.id}`,
      );

    if (action === "cancel")
      updateOrder(activeOrder.id, { status: "Cancelled" }, `Order ${activeOrder.id} cancelled`);

    setAction(null);
  };

  const openAction = (order: Order, type: NonNullable<typeof action>) => {
    setActiveOrder(order);
    setAction(type);
    setNextValue(type === "payment" ? order.payment : order.status);
  };

  const selectedAll =
    visibleOrders.length > 0 && visibleOrders.every((order) => selected.includes(order.id));

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Track, fulfill, and resolve every customer order."
        breadcrumb={["Vexui", "eCommerce", "Orders"]}
        actions={
          <>
            <Button variant="outline" onClick={exportOrders}>
              <Icons.Download />
              Export
            </Button>

            <Button onClick={() => toast.success("Create order flow is ready for checkout orders")}>
              <Icons.Plus />
              Create order
            </Button>
          </>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Orders today", "12", "3 awaiting fulfillment", Icons.ShoppingBag],
          ["Revenue today", "$1,442", "Paid and captured", Icons.CreditCard],
          ["To fulfill", "2", "Orders need shipping", Icons.PackageCheck],
          ["Returns & refunds", "1", "Needs review", Icons.RotateCcw],
        ].map(([label, value, detail, Icon]) => {
          const MetricIcon = Icon as typeof Icons.ShoppingBag;

          return (
            <Card key={label as string} bodyClassName="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{label as string}</p>
                  <p className="mt-1 text-2xl font-semibold">{value as string}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{detail as string}</p>
                </div>

                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MetricIcon className="size-4" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card bodyClassName="p-0">
        <div className="border-b p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 lg:max-w-md">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search order, customer, or email"
                className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option>All statuses</option>
                {Object.keys(orderTone).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option>All payments</option>
                {Object.keys(paymentTone).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>

              <select
                value={fulfillmentFilter}
                onChange={(event) => setFulfillmentFilter(event.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option>All fulfillment</option>
                {Object.keys(fulfillmentTone).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>

              <select
                value={channelFilter}
                onChange={(event) => setChannelFilter(event.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option>All channels</option>
                <option>Online Store</option>
                <option>Marketplace</option>
                <option>Wholesale</option>
              </select>

              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-primary/5 px-4 py-2.5 text-sm">
            <b>{selected.length} selected</b>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOrders((current) =>
                  current.map((order) =>
                    selected.includes(order.id) ? { ...order, status: "Processing" } : order,
                  ),
                );
                toast.success("Selected orders moved to processing");
              }}
            >
              Mark processing
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelected([]);
                toast.success("Selection cleared");
              }}
            >
              Clear selection
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    aria-label="Select all orders"
                    type="checkbox"
                    checked={selectedAll}
                    onChange={() =>
                      setSelected(selectedAll ? [] : visibleOrders.map((order) => order.id))
                    }
                  />
                </th>
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Fulfillment</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id} className="border-t transition-colors hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      aria-label={`Select ${order.id}`}
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      className="font-semibold text-primary hover:underline"
                      onClick={() => setActiveOrder(order)}
                    >
                      {order.id}
                    </button>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.items} item{order.items > 1 ? "s" : ""} {order.channel}
                    </p>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getUserImage(order.customer)}
                        alt={order.customer}
                        className="grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary object-cover"
                      />

                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-muted-foreground">{order.date}</td>

                  <td className="px-3 py-4 font-semibold">${order.total.toFixed(2)}</td>

                  <td className="px-3 py-4">
                    <Badge tone={paymentTone[order.payment]}>{order.payment}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={fulfillmentTone[order.fulfillment]}>{order.fulfillment}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={orderTone[order.status]}>{order.status}</Badge>
                  </td>

                  <td className="px-3 py-4 text-end">
                    <Button variant="outline" size="sm" onClick={() => setActiveOrder(order)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleOrders.length === 0 && (
          <div className="grid place-items-center gap-2 p-12 text-center">
            <Icons.SearchX className="size-8 text-muted-foreground" />
            <p className="font-medium">No orders found</p>

            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Showing {visibleOrders.length} of {orders.length} orders
          </span>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Sheet
        open={!!activeOrder && !action}
        onOpenChange={(open) => {
          if (!open) setActiveOrder(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="pe-8">{activeOrder?.id}</SheetTitle>
            <SheetDescription>
              {activeOrder?.date} {activeOrder?.channel}
            </SheetDescription>
          </SheetHeader>

          {activeOrder && (
            <div className="mt-6 space-y-5">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{activeOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">{activeOrder.email}</p>
                  </div>

                  <img
                    src={getUserImage(activeOrder.customer)}
                    alt={activeOrder.customer}
                    className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <div className="mt-1">
                    <Badge tone={paymentTone[activeOrder.payment]}>{activeOrder.payment}</Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Fulfillment</p>
                  <div className="mt-1">
                    <Badge tone={fulfillmentTone[activeOrder.fulfillment]}>
                      {activeOrder.fulfillment}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Order status</p>
                  <div className="mt-1">
                    <Badge tone={orderTone[activeOrder.status]}>{activeOrder.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <h3 className="font-semibold">Items</h3>

                  <span className="text-sm text-muted-foreground">
                    {activeOrder.items} item
                    {activeOrder.items > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="rounded-lg border">
                  <div className="flex items-center gap-3 border-b p-3">
                    <span className="grid size-10 place-items-center rounded-md bg-muted">
                      <Icons.Package className="size-4 text-muted-foreground" />
                    </span>

                    <div className="flex-1">
                      <p className="font-medium">Vexui collection item</p>
                      <p className="text-xs text-muted-foreground">
                        SKU NVA-{activeOrder.id.slice(-4)} Qty {activeOrder.items}
                      </p>
                    </div>

                    <b>${activeOrder.total.toFixed(2)}</b>
                  </div>

                  <div className="flex justify-between p-3 text-sm">
                    <span className="text-muted-foreground">Order total</span>
                    <b>${activeOrder.total.toFixed(2)}</b>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fulfillment
                </p>
                <p className="mt-1 font-medium">
                  {activeOrder.tracking || "Tracking number pending"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Shipping method: Standard delivery
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => openAction(activeOrder, "status")}>
                  Update status
                </Button>

                <Button variant="outline" onClick={() => openAction(activeOrder, "payment")}>
                  Update payment
                </Button>

                <Button
                  variant="outline"
                  onClick={() => openAction(activeOrder, "refund")}
                  disabled={activeOrder.payment === "Refunded"}
                >
                  Refund
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => openAction(activeOrder, "cancel")}
                  disabled={activeOrder.status === "Cancelled"}
                >
                  Cancel order
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "status"
                ? "Update order status"
                : action === "payment"
                  ? "Update payment status"
                  : action === "refund"
                    ? "Issue a refund"
                    : "Cancel order"}
            </DialogTitle>

            <DialogDescription>
              {action === "refund"
                ? `This will mark ${activeOrder?.id} as refunded and returned.`
                : action === "cancel"
                  ? `This will cancel ${activeOrder?.id}. This action is recorded in the order timeline.`
                  : `Choose the new value for ${activeOrder?.id}.`}
            </DialogDescription>
          </DialogHeader>

          {(action === "status" || action === "payment") && (
            <select
              value={nextValue}
              onChange={(event) => setNextValue(event.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {(action === "status" ? Object.keys(orderTone) : Object.keys(paymentTone)).map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>
              Back
            </Button>

            <Button
              variant={action === "cancel" ? "destructive" : "default"}
              onClick={executeAction}
            >
              {action === "refund"
                ? "Confirm refund"
                : action === "cancel"
                  ? "Cancel order"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
