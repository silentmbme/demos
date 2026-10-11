import food0 from "@/assets/images/restaurant/margherita-pizza.jpg";
import food1 from "@/assets/images/restaurant/vegetable-pizza.jpg";
import food2 from "@/assets/images/restaurant/garden-salad.jpg";
import food3 from "@/assets/images/restaurant/greek-salad.jpg";
import food4 from "@/assets/images/restaurant/mushroom-pasta.jpg";
import food5 from "@/assets/images/restaurant/grilled-chicken.jpg";
import food6 from "@/assets/images/restaurant/iced-latte.jpg";
import food7 from "@/assets/images/restaurant/lemonade.jpg";
import { useState } from "react";
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  ReceiptText,
  ShoppingBag,
  Coffee,
  Pizza,
  Salad,
  Check,
} from "lucide-react";
import { toast } from "sonner";
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
import { PageHeader, Badge } from "./widgets";
const menu = [
  {
    id: "M1",
    image: food0,
    name: "Margherita pizza",
    category: "Pizza",
    price: 14,
    description: "Tomato, mozzarella, fresh basil",
    icon: Pizza,
    color: "--primary",
  },
  {
    id: "M2",
    image: food1,
    name: "Roasted vegetable pizza",
    category: "Pizza",
    price: 17,
    description: "Peppers, mushrooms, olives",
    icon: Pizza,
    color: "--warning",
  },
  {
    id: "M3",
    image: food2,
    name: "Garden salad",
    category: "Salads",
    price: 9,
    description: "Mixed greens, cucumber, lemon dressing",
    icon: Salad,
    color: "--success",
  },
  {
    id: "M4",
    image: food3,
    name: "Greek salad",
    category: "Salads",
    price: 11,
    description: "Feta, olives, tomato, cucumber",
    icon: Salad,
    color: "--info",
  },
  {
    id: "M5",
    image: food4,
    name: "Creamy mushroom pasta",
    category: "Mains",
    price: 16,
    description: "Penne, mushrooms, parmesan",
    icon: UtensilsCrossed,
    color: "--primary",
  },
  {
    id: "M6",
    image: food5,
    name: "Grilled chicken plate",
    category: "Mains",
    price: 19,
    description: "Herb chicken, potatoes, seasonal greens",
    icon: UtensilsCrossed,
    color: "--warning",
  },
  {
    id: "M7",
    image: food6,
    name: "Iced latte",
    category: "Drinks",
    price: 5,
    description: "Espresso, milk, ice",
    icon: Coffee,
    color: "--info",
  },
  {
    id: "M8",
    image: food7,
    name: "Fresh lemonade",
    category: "Drinks",
    price: 4,
    description: "Lemon, sparkling water, mint",
    icon: Coffee,
    color: "--success",
  },
];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
type Order = {
  notes: string;
  id: string;
  table: string;
  items: string;
  total: number;
  status: string;
};
export function RestaurantPosPage() {
  return (
    <AppShell navigationPath="/dashboards/restaurant-pos">
      <RestaurantPos />
    </AppShell>
  );
}
export function RestaurantPos() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [table, setTable] = useState("Table 01");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState("Dine in");
  const [discount, setDiscount] = useState("0");
  const [orders, setOrders] = useState<Order[]>([]);
  const [receipt, setReceipt] = useState<Order | null>(null);
  const items = menu.filter((item) => (cart[item.id] ?? 0) > 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  const discountAmount = Math.round(subtotal * Number(discount)) / 100;
  const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = Math.round((subtotal - discountAmount + tax) * 100) / 100;
  const visible = menu.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  function quantity(id: string, delta: number) {
    setCart((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(99, (current[id] ?? 0) + delta)),
    }));
  }
  function placeOrder() {
    if (!items.length) return;
    const order = {
      id: `ORD-${1001 + orders.length}`,
      table: orderType === "Dine in" ? table : orderType,
      items: items.map((item) => `${cart[item.id]} × ${item.name}`).join(", "),
      total,
      status: "Preparing",
      notes: notes.trim(),
    };
    setOrders((current) => [order, ...current]);
    setReceipt(order);
    setCart({});
    setNotes("");
    toast.success("Sample order sent to kitchen");
  }
  function downloadReceipt() {
    if (!receipt) return;
    const blob = new Blob(
      [
        `Vexui Restaurant — SAMPLE RECEIPT\n${receipt.id}\n${receipt.table}\n${receipt.items}\nTotal (includes sample 8% tax): ${money(receipt.total)}\nNo payment processed.`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${receipt.id}-receipt.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="Restaurant POS"
        subtitle="Take orders, manage tables, and keep your kitchen moving."
        breadcrumb={["Dashboards", "Restaurant POS"]}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="size-6 text-primary" />
          <div>
            <p className="text-sm font-semibold">The Green Table</p>
            <p className="text-xs text-muted-foreground">
              Sample menu · USD · Orders stay in this page session
            </p>
          </div>
        </div>
        <Badge tone="primary">Demo POS · No payment processed</Badge>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Orders placed",
            value: orders.length.toString(),
            icon: ReceiptText,
            color: "--info",
            note: "Orders created this session",
          },
          {
            label: "Kitchen queue",
            value: orders.filter((o) => o.status === "Preparing").length.toString(),
            icon: UtensilsCrossed,
            color: "--warning",
            note: "Waiting for kitchen preparation",
          },
          {
            label: "Sample order value",
            value: money(orders.reduce((sum, o) => sum + o.total, 0)),
            icon: ShoppingBag,
            color: "--success",
            note: "Combined sample order totals",
          },
        ].map((metric) => (
          <section
            key={metric.label}
            className="vexui-card relative overflow-hidden p-5"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklch, var(${metric.color}) 6%, var(--card)), var(--card))`,
            }}
          >
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                  {metric.value}
                </p>
              </div>
              <span
                className="grid size-12 place-items-center rounded-2xl"
                style={{
                  color: `var(${metric.color})`,
                  background: `color-mix(in oklch,var(${metric.color}) 12%,transparent)`,
                }}
              >
                <metric.icon className="size-6" />
              </span>
            </div>
            <p className="relative mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
              {metric.note}
            </p>
          </section>
        ))}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Explore menu</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search menu"
                className="ps-9"
                placeholder="Search dishes…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {["All", "Pizza", "Salads", "Mains", "Drinks"].map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                size="sm"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            {visible.map((item) => (
              <article
                key={item.id}
                className="vexui-card overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="group relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute start-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-semibold shadow-sm"
                    style={{ color: `var(${item.color})` }}
                  >
                    {item.category}
                  </span>
                  {(cart[item.id] ?? 0) > 0 && (
                    <span className="absolute end-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-sm">
                      {cart[item.id]} in order
                    </span>
                  )}
                </div>
                <div
                  className="p-4"
                  style={{
                    borderTop: `3px solid color-mix(in oklch,var(${item.color}) 40%,transparent)`,
                  }}
                >
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="mt-1 min-h-8 text-xs text-muted-foreground">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <span className="text-lg font-semibold">{money(item.price)}</span>
                      <p className="text-[10px] text-muted-foreground">Per serving</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{
                        color: `var(${item.color})`,
                        borderColor: `color-mix(in oklch,var(${item.color}) 25%,var(--border))`,
                        background: `color-mix(in oklch,var(${item.color}) 8%,var(--card))`,
                      }}
                      aria-label={`Add ${item.name}`}
                      onClick={() => quantity(item.id, 1)}
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No dishes match your search.
            </p>
          )}
        </div>
        <aside className="vexui-card overflow-hidden xl:sticky xl:top-24">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold">Current order</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {items.reduce((sum, item) => sum + (cart[item.id] ?? 0), 0)} items
              </p>
            </div>
            <Button variant="ghost" size="sm" disabled={!items.length} onClick={() => setCart({})}>
              Clear
            </Button>
          </div>
          <div className="p-5">
            <div className="mb-4 grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {["Dine in", "Takeaway", "Delivery"].map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={orderType === type}
                  className={
                    "rounded-md px-2 py-2 text-xs font-medium transition " +
                    (orderType === type
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground")
                  }
                  onClick={() => setOrderType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <label htmlFor="pos-table" className="text-xs font-medium">
              Table / order type
            </label>
            <select
              id="pos-table"
              disabled={orderType !== "Dine in"}
              className="mb-5 mt-2 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              {["Table 01", "Table 02", "Table 03", "Table 04", "Takeaway"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border-b border-border pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <img
                      src={item.image}
                      alt=""
                      className="size-11 shrink-0 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{money(item.price)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => setCart((current) => ({ ...current, [item.id]: 0 }))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label={`Decrease ${item.name}`}
                        onClick={() => quantity(item.id, -1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="text-sm font-semibold tabular-nums">{cart[item.id]}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        disabled={cart[item.id] === 99}
                        aria-label={`Increase ${item.name}`}
                        onClick={() => quantity(item.id, 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold">
                      {money(item.price * (cart[item.id] ?? 0))}
                    </span>
                  </div>
                </div>
              ))}
              {!items.length && (
                <div className="py-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 size-9 text-muted-foreground/40" />
                  <p className="text-sm font-medium">Your order is empty</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a dish from the menu to begin.
                  </p>
                </div>
              )}
            </div>
            <label htmlFor="pos-notes" className="mt-5 block text-xs font-medium">
              Kitchen notes
            </label>
            <Input
              id="pos-notes"
              className="mt-2"
              maxLength={200}
              placeholder="Special requests…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <label htmlFor="pos-discount" className="text-xs font-medium">
                Sample discount
              </label>
              <select
                id="pos-discount"
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              >
                {["0", "5", "10", "15"].map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sample tax (8%)</span>
                <span>{money(tax)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({discount}%)</span>
                  <span>-{money(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <Button className="mt-5 w-full" disabled={!items.length} onClick={placeOrder}>
              <ReceiptText className="size-4" />
              Place sample order
            </Button>
          </div>
        </aside>
      </div>
      <section className="vexui-card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Kitchen orders</h2>
          <Badge tone="primary" size="sm">
            {orders.length} orders
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{order.id}</p>
                <Badge tone={order.status === "Ready" ? "success" : "primary"} size="sm">
                  {order.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs font-medium">{order.table}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{order.items}</p>
              {order.notes && (
                <p className="mt-2 rounded-lg bg-primary/5 p-2 text-xs">
                  Kitchen note: {order.notes}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">{money(order.total)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={order.status === "Ready"}
                  onClick={() =>
                    setOrders((current) =>
                      current.map((o) => (o.id === order.id ? { ...o, status: "Ready" } : o)),
                    )
                  }
                >
                  <Check className="size-3.5" />
                  Mark ready
                </Button>
              </div>
            </article>
          ))}
        </div>
        {!orders.length && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Orders will appear here after checkout.
          </p>
        )}
      </section>
      <Dialog
        open={!!receipt}
        onOpenChange={(open) => {
          if (!open) setReceipt(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sample order confirmed</DialogTitle>
            <DialogDescription>
              No payment was processed. Your sample order is in the kitchen queue.
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{receipt.id}</span>
                <span>{receipt.table}</span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{receipt.items}</p>
              <p className="border-t border-border pt-4 text-xl font-semibold">
                Total {money(receipt.total)}
              </p>
              <Button onClick={downloadReceipt} className="w-full">
                Download sample receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
