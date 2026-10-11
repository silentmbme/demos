import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { productImages } from "@/lib/local-images";
import { cn } from "@/lib/utils";
import { ChatApp } from "@/components/pages/ChatApp";
import { CalendarApp } from "@/components/pages/CalendarApp";
import { TasksApp } from "@/components/pages/TasksApp";
import { KanbanBoard } from "@/components/pages/KanbanBoard";
import { FileManagerApp } from "@/components/pages/FileManagerApp";
import { OrdersApp } from "@/components/pages/OrdersApp";
import { CustomersApp } from "@/components/pages/CustomersApp";
import { CrmContactsApp } from "@/components/pages/CrmContactsApp";
import { CrmCompaniesApp } from "@/components/pages/CrmCompaniesApp";
import { CrmLeadsApp } from "@/components/pages/CrmLeadsApp";
import { CrmDealsApp } from "@/components/pages/CrmDealsApp";
import { CrmPipelineApp } from "@/components/pages/CrmPipelineApp";
import { ProjectListApp } from "@/components/pages/ProjectListApp";
import { ProjectGridApp } from "@/components/pages/ProjectGridApp";
import { ProjectDetailsApp } from "@/components/pages/ProjectDetailsApp";
import { ProfileApp } from "@/components/pages/ProfileApp";
import { SettingsApp } from "@/components/pages/SettingsApp";
import { PricingApp } from "@/components/pages/PricingApp";
import { FaqApp } from "@/components/pages/FaqApp";
import * as Icons from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { Badge, Card, KpiCard, PageHeader, Avatar } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { mergeOptions, useChartTheme } from "@/lib/chart-config";

type Tone = "primary" | "success" | "warning" | "danger" | "info" | "muted";
const statusTone: Record<string, Tone> = {
  Active: "success",
  Paid: "success",
  Shipped: "info",
  Pending: "warning",
  Draft: "muted",
  Cancelled: "danger",
  Qualified: "primary",
  "In progress": "info",
  Review: "warning",
  New: "primary",
};
const people = [
  ["Olivia Chen", "OC"],
  ["Marcus Rivera", "MR"],
  ["Ava Patel", "AP"],
  ["Noah Williams", "NW"],
];
const products = [
  ["Aurora Wireless Headphones", "AUD-2408", "Audio", "$249.00", "184", "1,248", "Active"],
  ["Atlas Desk Lamp", "ATL-1182", "Lighting", "$89.00", "62", "846", "Active"],
  ["Morrow Carry Tote", "MOR-9001", "Accessories", "$129.00", "23", "591", "Low stock"],
  ["Solstice Monitor Stand", "SOL-7710", "Workspace", "$159.00", "0", "369", "Draft"],
];
const orders = [
  ["#NV-10482", "Olivia Chen", "Aug 22, 2026", "$548.00", "Visa  4242", "Shipped", "3"],
  ["#NV-10481", "Marcus Rivera", "Aug 22, 2026", "$249.00", "Mastercard  8901", "Paid", "1"],
  ["#NV-10480", "Ava Patel", "Aug 21, 2026", "$1,290.00", "Bank transfer", "Pending", "5"],
  ["#NV-10479", "Noah Williams", "Aug 21, 2026", "$179.00", "Visa  6321", "Cancelled", "2"],
];

function ActionMenu() {
  return (
    <Button variant="ghost" size="icon" aria-label="More actions">
      <Icons.MoreHorizontal />
    </Button>
  );
}
function FilterBar({ placeholder = "Search records..." }: { placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="h-9 w-full rounded-md border bg-background ps-9 pe-3 text-sm"
          placeholder={placeholder}
        />
      </label>
      <select className="h-9 rounded-md border bg-background px-3 text-sm">
        <option>All statuses</option>
        <option>Active</option>
        <option>Pending</option>
      </select>
      <Button variant="outline" size="sm" className="h-9">
        <Icons.SlidersHorizontal /> Filters
      </Button>
    </div>
  );
}
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="vexui-table min-w-[720px]">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
            <th className="w-12" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((v, j) => (
                <td key={j}>
                  {j === r.length - 1 && statusTone[v] ? (
                    <Badge tone={statusTone[v]}>{v}</Badge>
                  ) : (
                    <span
                      className={j === 0 ? "font-medium" : j === 1 ? "text-muted-foreground" : ""}
                    >
                      {v}
                    </span>
                  )}
                </td>
              ))}
              <td>
                <ActionMenu />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
      <span>Showing 14 of 24 results</span>
      <div className="flex gap-1">
        <Button size="sm" variant="outline">
          Previous
        </Button>
        <Button size="sm">1</Button>
        <Button size="sm" variant="outline">
          Next
        </Button>
      </div>
    </div>
  );
}
function Metrics({ items }: { items: [string, string, number, string][] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value, delta, icon]) => (
        <KpiCard
          key={label}
          label={label}
          value={value}
          delta={delta}
          caption="vs last month"
          icon={icon}
        />
      ))}
    </div>
  );
}

function Products({ detail = false }: { detail?: boolean }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const catalog = [
    [
      "Wireless Headphones Pro",
      "WHP-1048",
      "Electronics",
      "$129.00",
      "24",
      "842",
      "4.8",
      "Active",
      "Vexui",
      productImages.wirelessHeadphonesPro,
    ],
    [
      "Smart Watch Series X",
      "SWX-2042",
      "Electronics",
      "$219.00",
      "8",
      "718",
      "4.7",
      "Active",
      "Vertex",
      productImages.smartWatchSeriesX,
    ],
    [
      "Leather Backpack",
      "LBP-3921",
      "Accessories",
      "$84.00",
      "42",
      "624",
      "4.6",
      "Active",
      "Orbit",
      productImages.leatherBackpack,
    ],
    [
      "Running Shoes X2",
      "RSX-4184",
      "Sports",
      "$112.00",
      "5",
      "541",
      "4.5",
      "Active",
      "Apex",
      productImages.runningShoesX2,
    ],
    [
      "Portable Speaker Mini",
      "PSM-5148",
      "Electronics",
      "$69.00",
      "0",
      "486",
      "4.4",
      "Draft",
      "Lumina",
      productImages.portableSpeakerMini,
    ],
    [
      "Aurora Desk Lamp",
      "ADL-6208",
      "Home & Living",
      "$89.00",
      "17",
      "368",
      "4.7",
      "Active",
      "Vexui",
      productImages.auroraDeskLamp,
    ],
  ];
  const visible = catalog.filter((product) =>
    product.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  if (detail) return <ProductDetails />;
  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage your catalog, inventory, pricing and product availability."
        breadcrumb={["Vexui", "eCommerce", "Products"]}
        actions={
          <Button onClick={() => void navigate({ to: "/ecommerce/add-product" })}>
            <Icons.Plus />
            Add product
          </Button>
        }
      />
      <div className="mb-4 grid overflow-hidden rounded-xl border bg-card sm:grid-cols-5">
        {[
          ["Total products", "1,248"],
          ["Active", "986"],
          ["Low stock", "42"],
          ["Out of stock", "18"],
          ["Draft", "54"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border-b p-4 last:border-b-0 sm:border-b-0 sm:border-e sm:last:border-e-0"
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <b className="mt-1 block text-xl">{value}</b>
          </div>
        ))}
      </div>
      <section className="rounded-xl border bg-card">
        <div className="flex flex-wrap gap-2 border-b p-3">
          <label className="relative min-w-48 flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, SKU, category..."
              className="h-9 w-full rounded-md border bg-background ps-9 pe-3 text-sm"
            />
          </label>
          <select className="h-9 rounded-md border bg-background px-2 text-xs">
            <option>All categories</option>
            <option>Electronics</option>
            <option>Sports</option>
            <option>Accessories</option>
          </select>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Icons.Grid2X2 className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <Icons.List className="size-4" />
          </Button>
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2 border-b bg-primary/10 px-4 py-2 text-sm">
            <b>{selected.length} selected</b>
            <Button size="sm">Publish</Button>
            <Button size="sm" variant="outline">
              Archive
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        )}
        <div
          className={
            view === "grid"
              ? "grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "divide-y"
          }
        >
          {visible.map((p) => {
            const low = Number(p[4]) <= 5;
            return (
              <article
                key={p[1]}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setSelected((x) =>
                    x.includes(p[1]) ? x.filter((id) => id !== p[1]) : [...x, p[1]],
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected((x) =>
                      x.includes(p[1]) ? x.filter((id) => id !== p[1]) : [...x, p[1]],
                    );
                  }
                }}
                className={cn(
                  view === "grid"
                    ? "group relative cursor-pointer rounded-xl border p-4 hover:border-primary/35 hover:shadow-sm"
                    : "flex cursor-pointer items-center gap-4 p-4 hover:bg-muted/30",
                  selected.includes(p[1]) &&
                    "border-primary bg-primary/[0.03] ring-2 ring-primary/15",
                )}
              >
                <div className={view === "grid" ? "group/image relative mb-3" : "shrink-0"}>
                  <img
                    src={p[9]}
                    alt={p[0]}
                    className={
                      view === "grid"
                        ? "h-44 w-full rounded-xl border bg-muted object-cover"
                        : "size-14 rounded-xl border bg-muted object-cover"
                    }
                  />
                  {view === "grid" && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setCart((items) => (items.includes(p[1]) ? items : [...items, p[1]]));
                      }}
                      className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground opacity-0 transition duration-200 group-hover/image:translate-y-0 group-hover/image:opacity-100"
                    >
                      <Icons.ShoppingCart className="size-3.5" />
                      {cart.includes(p[1]) ? "Added to cart" : "Add to cart"}
                    </button>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{p[0]}</b>
                  <small className="text-muted-foreground">
                    {p[1]} - {p[8]}
                  </small>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{p[2]}</span>
                    <span className="rounded bg-success/14 px-1.5 py-0.5 text-[10px] text-success">
                      {p[7]}
                    </span>
                    {low && (
                      <span className="rounded bg-warning/16 px-1.5 py-0.5 text-[10px] text-warning">
                        Low stock: {p[4]}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <b>{p[3]}</b>
                    <span className="text-muted-foreground">
                      {p[6]} star - {p[5]} sold
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
          {!visible.length && (
            <div className="col-span-full py-20 text-center text-sm text-muted-foreground">
              No products found. Try adjusting your search.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function ProductDetails() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [finish, setFinish] = useState("Graphite");
  const [activeImage, setActiveImage] = useState(productImages.wirelessHeadphonesPro);
  const gallery = [
    productImages.wirelessHeadphonesPro,
    productImages.smartWatchSeriesX,
    productImages.portableSpeakerMini,
    productImages.auroraDeskLamp,
  ];

  return (
    <>
      <PageHeader
        title="Wireless Headphones Pro"
        subtitle="SKU WHP-1048 - Electronics - Updated today"
        breadcrumb={["Vexui", "eCommerce", "Products", "Product details"]}
        actions={
          <>
            <Button variant="outline" onClick={() => void navigate({ to: "/ecommerce/products" })}>
              <Icons.ArrowLeft className="size-4" />
              Back to products
            </Button>
            <Button>
              <Icons.Pencil className="size-4" />
              Edit product
            </Button>
          </>
        }
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
        <section className="min-w-0 rounded-2xl border bg-card p-3 shadow-sm sm:p-5">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.08] via-muted/40 to-info/[0.1]">
            <span className="absolute start-4 top-4 z-10 rounded-full bg-destructive px-2.5 py-1 text-xs font-bold text-destructive-foreground">
              -19%
            </span>
            <button
              type="button"
              className="absolute end-4 top-4 z-10 grid size-9 place-items-center rounded-xl border bg-card/90 text-muted-foreground hover:text-foreground"
              aria-label="Expand product image"
            >
              <Icons.Maximize2 className="size-4" />
            </button>
            <img
              src={activeImage}
              alt="Wireless Headphones Pro"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 bg-muted transition",
                  activeImage === image
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-transparent hover:border-primary/35",
                )}
              >
                <img
                  src={image}
                  alt={`Wireless Headphones view ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/[0.35] px-3 py-3 text-sm sm:mt-5 sm:px-4">
            <span className="flex items-center gap-2">
              <Icons.Image className="size-4 text-primary" />4 product images
            </span>
            <button type="button" className="font-medium text-primary hover:underline">
              Manage media
            </button>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">Active</Badge>
                <Badge>Electronics</Badge>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Best seller
                </span>
              </div>
              <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                Wireless Headphones Pro
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="flex items-center gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Icons.Star
                      key={index}
                      className={cn("size-4", index < 4 ? "fill-current" : "")}
                    />
                  ))}
                </span>
                <b>4.8</b>
                <span className="text-muted-foreground">286 verified reviews</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Add to wishlist"
              onClick={() => setWishlisted((value) => !value)}
            >
              <Icons.Heart className={wishlisted ? "size-5 fill-primary text-primary" : "size-5"} />
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-semibold">$129.00</p>
            <p className="pb-1 text-lg text-muted-foreground line-through">$159.00</p>
            <span className="mb-1 rounded bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
              Save $30.00
            </span>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Premium noise-cancelling headphones engineered for focused listening, comfortable
            all-day wear, and effortless multi-device pairing.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm text-success">
            <Icons.CircleCheck className="size-4" />
            <span className="font-semibold">In stock</span>
            <span className="text-success/80">- 24 available for immediate dispatch</span>
          </div>
          <div className="mt-6 border-y py-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Finish</p>
              <span className="text-sm text-muted-foreground">{finish}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Graphite", "Silver", "Midnight"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFinish(option)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition",
                    finish === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary/40",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex h-11 items-center rounded-xl border bg-background">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid h-full w-10 place-items-center rounded-s-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Icons.Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(24, value + 1))}
                className="grid h-full w-10 place-items-center rounded-e-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Icons.Plus className="size-4" />
              </button>
            </div>
            <Button
              className="h-11 min-w-48 flex-1"
              onClick={() => {
                setInCart(true);
                toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart`);
              }}
            >
              <Icons.ShoppingCart className="size-4" />
              {inCart ? `${quantity} item${quantity > 1 ? "s" : ""} in cart` : "Add to cart"}
            </Button>
          </div>
          <Button
            variant="outline"
            className="mt-3 h-11 w-full"
            onClick={() => toast.success("Checkout started")}
          >
            Buy it now
          </Button>
          <div className="mt-6 grid grid-cols-2 gap-y-4 border-t pt-5 text-sm">
            <div>
              <span className="block text-xs text-muted-foreground">SKU</span>
              <b className="mt-1 block">WHP-1048</b>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Brand</span>
              <b className="mt-1 block">Vexui</b>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Category</span>
              <b className="mt-1 block">Electronics</b>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Warranty</span>
              <b className="mt-1 block">2 years</b>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="flex gap-1 flex-wrap overflow-x-auto border-b px-3 pt-3">
            {["Overview", "Specifications", "Reviews"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition",
                  tab === item
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item}
                {item === "Reviews" && (
                  <span className="ms-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">286</span>
                )}
              </button>
            ))}
          </div>
          <div className="p-5 sm:p-6">
            {tab === "Overview" ? (
              <div className="grid gap-6 2xl:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold">Made for long listening sessions</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Adaptive noise cancellation and soft memory-foam ear cushions help you stay
                    immersed. A 40-hour battery and USB-C fast charging keep the soundtrack moving.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    [Icons.Volume2, "Adaptive audio", "Balanced sound in every environment"],
                    [Icons.BatteryCharging, "40-hour battery", "Fast USB-C charging"],
                    [Icons.Bluetooth, "Multipoint", "Move between devices"],
                    [Icons.ShieldCheck, "2-year warranty", "Coverage included"],
                  ].map(([Icon, title, description]: any) => (
                    <div key={title} className="rounded-xl bg-muted/[0.45] p-3">
                      <Icon className="size-5 text-primary" />
                      <b className="mt-3 block text-sm">{title}</b>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "Specifications" ? (
              <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {[
                  ["Driver", "40 mm dynamic"],
                  ["Connection", "Bluetooth 5.3, USB-C"],
                  ["Battery", "Up to 40 hours"],
                  ["Weight", "0.42 kg"],
                  ["Charge time", "2.5 hours"],
                  ["In the box", "Case, cable, quick guide"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 border-b py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-muted-foreground">{label}</span>
                    <b className="break-words sm:text-end">{value}</b>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-6 rounded-xl bg-muted/[0.45] p-4">
                  <div className="text-center">
                    <p className="text-4xl font-semibold">4.8</p>
                    <div className="mt-1 flex text-warning">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Icons.Star key={index} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">286 reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      [5, 72],
                      [4, 20],
                      [3, 5],
                      [2, 2],
                      [1, 1],
                    ].map(([rating, width]) => (
                      <div key={rating} className="flex items-center gap-2 text-xs">
                        <span>{rating}</span>
                        <Icons.Star className="size-3 text-warning" />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                          <div
                            className="h-full rounded-full bg-warning"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="w-6 text-end text-muted-foreground">{width}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  [
                    "Camila Rossi",
                    "Beautifully built, comfortable for a full day, and the noise cancellation is excellent.",
                  ],
                  ["Henry Whitlock", "Easy to pair and the battery life is exactly as advertised."],
                ].map(([author, review]) => (
                  <article key={author} className="border-t pt-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <b className="text-sm">{author}</b>
                        <p className="mt-0.5 text-xs text-muted-foreground">Verified purchase</p>
                      </div>
                      <span className="flex text-warning">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Icons.Star key={index} className="size-3.5 fill-current" />
                        ))}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{review}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Shipping & returns</h2>
            <div className="mt-5 space-y-4">
              {[
                [Icons.Truck, "Free shipping over $75", "Arrives in 2-4 business days"],
                [Icons.RotateCcw, "30-day returns", "No-questions-asked returns"],
                [Icons.ShieldCheck, "2-year warranty", "Covers parts and performance"],
              ].map(([Icon, title, detail]: any) => (
                <div key={title} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-sm">{title}</b>
                    <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">You may also like</h2>
              <button type="button" className="text-xs font-semibold text-primary">
                View all
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Portable Speaker Mini", "$69.00", productImages.portableSpeakerMini],
                ["Smart Watch Series X", "$219.00", productImages.smartWatchSeriesX],
                ["Aurora Desk Lamp", "$89.00", productImages.auroraDeskLamp],
              ].map(([name, price, image]: any) => (
                <button
                  type="button"
                  key={name}
                  className="flex w-full items-center gap-3 rounded-xl p-1 text-start transition hover:bg-muted/60"
                >
                  <img src={image} alt="" className="size-12 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{name}</b>
                    <small className="text-xs text-muted-foreground">Recommended for you</small>
                  </span>
                  <b className="text-sm">{price}</b>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
function ProductReferencePanels() {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      <Card
        className="xl:col-span-2"
        title="Customer reviews"
        description="4.8 average rating from 286 verified reviews"
      >
        <div className="space-y-4 text-sm">
          <p>
            <b>Camila Rossi</b> <span className="text-warning"></span>
          </p>
          <p className="text-muted-foreground">
            Beautifully built and the sound profile is balanced for focused work.
          </p>
          <p>
            <b>Henry Whitlock</b> <span className="text-warning"></span>
          </p>
          <p className="text-muted-foreground">
            Great battery life and very comfortable for all-day listening.
          </p>
        </div>
      </Card>
      <div className="space-y-4">
        <Card title="Shipping & returns">
          <div className="space-y-3 text-sm">
            <p>
              <b>Free shipping over $75</b>
              <br />
              <span className="text-muted-foreground">Arrives in 2-4 business days</span>
            </p>
            <p>
              <b>30-day returns</b>
              <br />
              <span className="text-muted-foreground">No-questions-asked refund</span>
            </p>
            <p>
              <b>2-year warranty</b>
            </p>
          </div>
        </Card>
        <Card title="You might also like">
          <div className="space-y-3 text-sm">
            {[
              ["Portable Speaker Mini", "$69.00"],
              ["Wireless Earbuds X", "$99.00"],
              ["Studio Headphones", "$182.00"],
            ].map((x) => (
              <div className="flex justify-between" key={x[0]}>
                <span>{x[0]}</span>
                <b>{x[1]}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
function Orders({ customers = false }: { customers?: boolean }) {
  const rows = customers
    ? people.map((p, i) => [
        p[0],
        ["Active since 2022", "Joined 2024", "Joined 2023", "Joined 2025"][i],
        ["14", "9", "22", "6"][i],
        ["$4,870", "$2,190", "$7,320", "$1,049"][i],
        ["Aug 22", "Aug 18", "Aug 21", "Aug 12"][i],
        "Active",
      ])
    : orders;
  const title = customers ? "Customers" : "Orders";
  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          customers
            ? "Build lasting relationships with your highest-value customers."
            : "Track fulfillment, payments and customer delivery status."
        }
        breadcrumb={["Vexui", "eCommerce", title]}
        actions={
          <>
            <Button variant="outline">
              <Icons.Download /> Export
            </Button>
            <Button>
              <Icons.Plus /> {customers ? "Add customer" : "Create order"}
            </Button>
          </>
        }
      />
      {customers && (
        <Metrics
          items={[
            ["Total customers", "12,840", 12, "Users"],
            ["New customers", "624", 18, "UserPlus"],
            ["Active customers", "8,260", 5, "HeartPulse"],
            ["Customer value", "$624", 9, "CircleDollarSign"],
          ]}
        />
      )}
      <Card
        className="mt-4"
        title={customers ? "Customer directory" : "Order management"}
        description="Updated in real time"
        bodyClassName="p-0"
      >
        <FilterBar placeholder={`Search ${title.toLowerCase()}...`} />
        <DataTable
          headers={
            customers
              ? ["Customer", "Joined", "Orders", "Lifetime value", "Last order", "Status"]
              : ["Order ID", "Customer", "Date", "Amount", "Payment", "Status", "Items"]
          }
          rows={rows}
        />
        <Pagination />
      </Card>
    </>
  );
}
function Kanban({
  title = "Project board",
  columns = ["Backlog", "Todo", "In progress", "Review", "Done"],
}: {
  title?: string;
  columns?: string[];
}) {
  return (
    <>
      <PageHeader
        title={title}
        subtitle="Keep work visible, balanced and moving forward."
        breadcrumb={["Vexui", title]}
        actions={
          <Button>
            <Icons.Plus /> Add card
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((column, i) => (
          <section key={column} className="min-w-0 rounded-xl bg-muted/55 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">{column}</h2>
              <Badge>{i + 1}</Badge>
            </div>
            {[0, 1].map((j) => (
              <article key={j} className="mb-3 rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex gap-1">
                  <Badge tone={j ? "warning" : "primary"}>{j ? "Medium" : "High"}</Badge>
                  <Badge>Design</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold">
                  {["Prepare Q3 customer launch", "Refine workspace onboarding"][j]}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Northstar initiative Aug {24 + j}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Avatar initials={people[(i + j) % 4][1]} className="size-7 text-[10px]" />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icons.MessageSquare className="size-3.5" /> {j + 2}
                  </span>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
function Crm({ type }: { type: string }) {
  const pipeline = type === "pipeline";
  const deals = type === "deals";
  const title = pipeline
    ? "Sales pipeline"
    : deals
      ? "Deals"
      : type === "companies"
        ? "Companies"
        : type === "leads"
          ? "Leads"
          : "Contacts";
  if (pipeline)
    return (
      <Kanban
        title="Sales pipeline"
        columns={["New", "Qualified", "Proposal", "Negotiation", "Won"]}
      />
    );
  const rows = deals
    ? [
        ["Northstar renewal", "Northstar Labs", "$48,000", "Negotiation", "80%", "Sep 04"],
        ["Atlas expansion", "Atlas Mobility", "$31,500", "Proposal", "60%", "Sep 14"],
        ["Luma workspace", "Luma Studio", "$18,800", "Qualified", "40%", "Oct 03"],
      ]
    : [
        ["Northstar Labs", "Technology  240 employees", "Olivia Chen", "San Francisco", "Active"],
        ["Atlas Mobility", "Transportation  84 employees", "Marcus Rivera", "Austin", "Qualified"],
        ["Luma Studio", "Design  32 employees", "Ava Patel", "London", "New"],
      ];
  return (
    <>
      <PageHeader
        title={title}
        subtitle={
          deals
            ? "Prioritize high-value opportunities and keep revenue moving."
            : "Build an informed, connected view of every relationship."
        }
        breadcrumb={["Vexui", "CRM", title]}
        actions={
          <Button>
            <Icons.Plus /> Add {deals ? "deal" : title.slice(0, -1).toLowerCase()}
          </Button>
        }
      />
      <Metrics
        items={
          deals
            ? [
                ["Open pipeline", "$428k", 16, "CircleDollarSign"],
                ["Weighted value", "$242k", 8, "Target"],
                ["Win rate", "42%", 4, "Trophy"],
                ["Avg. deal", "$18.4k", 12, "ChartNoAxesCombined"],
              ]
            : [
                ["Total records", "2,840", 8, "Users"],
                ["New this month", "142", 21, "UserPlus"],
                ["Qualified", "684", 12, "BadgeCheck"],
                ["Conversion", "28.4%", 3, "TrendingUp"],
              ]
        }
      />
      <Card
        className="mt-4"
        title={`${title} directory`}
        description="Ownership, activity and relationship health at a glance"
        bodyClassName="p-0"
      >
        <FilterBar />
        <DataTable
          headers={
            deals
              ? ["Deal", "Company", "Value", "Stage", "Probability", "Close date"]
              : [title.slice(0, -1), "Company / profile", "Owner", "Location", "Status"]
          }
          rows={rows}
        />
        <Pagination />
      </Card>
    </>
  );
}
function Projects({ grid = false }: { grid?: boolean }) {
  if (grid)
    return (
      <>
        <PageHeader
          title="Projects"
          subtitle="A shared workspace for every client engagement."
          breadcrumb={["Vexui", "Projects"]}
          actions={
            <Button>
              <Icons.Plus /> New project
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {["Northstar redesign", "Orion mobile app", "Aster brand system", "Luma commerce"].map(
            (p, i) => (
              <Card
                key={p}
                title={p}
                description={["Northstar Labs", "Orion Health", "Aster Studio", "Luma Co."][i]}
              >
                <div className="my-5 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${[78, 45, 92, 26][i]}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{[78, 45, 92, 26][i]}% complete</span>
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {people.slice(0, 3).map((p) => (
                      <Avatar
                        key={p[1]}
                        initials={p[1]}
                        className="size-7 border-2 border-card text-[9px]"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Plan, deliver and monitor work across your organization."
        breadcrumb={["Vexui", "Projects"]}
        actions={
          <Button>
            <Icons.Plus /> New project
          </Button>
        }
      />
      <Card title="All projects" bodyClassName="p-0">
        <FilterBar />
        <DataTable
          headers={["Project", "Client", "Members", "Progress", "Budget", "Due date", "Status"]}
          rows={[
            [
              "Northstar redesign",
              "Northstar Labs",
              "6",
              "78%",
              "$84,000",
              "Sep 30",
              "In progress",
            ],
            ["Orion mobile app", "Orion Health", "8", "45%", "$126,000", "Oct 18", "In progress"],
            ["Aster brand system", "Aster Studio", "4", "92%", "$32,000", "Aug 28", "Review"],
          ]}
        />
        <Pagination />
      </Card>
    </>
  );
}
function EmailApp() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [starred, setStarred] = useState(false);
  const [quickReply, setQuickReply] = useState("");
  const [activeLabel, setActiveLabel] = useState("Work");
  const messages = [
    [
      "Sophia Carter",
      "Q3 Design Review",
      "I have attached the revised prototype and notes for review.",
      "2 min ago",
      "SC",
    ],
    [
      "Billing Team",
      "Your August invoice is ready",
      "Invoice INV-20482 is now available in your billing portal.",
      "10:42 AM",
      "BT",
    ],
    [
      "Daniel Lee",
      "Updated project timeline",
      "The revised delivery plan is ready for your feedback.",
      "Yesterday",
      "DL",
    ],
    [
      "Support Desk",
      "Your support request has been resolved",
      "We have completed the requested account update.",
      "Yesterday",
      "SD",
    ],
  ];
  const visible = messages.filter((m) =>
    m.slice(0, 3).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const selected = messages[active] ?? messages[0];
  return (
    <>
      <PageHeader
        title="Mail"
        subtitle="Inbox, conversations and follow-ups."
        breadcrumb={["Vexui", "Apps", "Mail"]}
        actions={
          <Button onClick={() => setComposeOpen(true)}>
            <Icons.PenLine />
            Compose
          </Button>
        }
      />
      <div className="grid min-w-0 overflow-hidden rounded-xl border bg-card lg:min-h-[680px] lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b p-3 lg:border-b-0 lg:border-e">
          <Button className="mb-3 w-full lg:mb-5" onClick={() => setComposeOpen(true)}>
            <Icons.PenLine />
            Compose
          </Button>
          <nav className="flex gap-1 overflow-x-auto pb-1 text-sm lg:block lg:space-y-1 lg:pb-0">
            {[
              ["Inbox", 24, Icons.Inbox],
              ["Starred", 0, Icons.Star],
              ["Sent", 0, Icons.Send],
              ["Drafts", 5, Icons.FilePenLine],
              ["Important", 0, Icons.BadgeAlert],
              ["Spam", 3, Icons.OctagonAlert],
              ["Trash", 0, Icons.Trash2],
            ].map(([name, count, Icon], i) => {
              const I = Icon as typeof Icons.Inbox;
              return (
                <button
                  key={name as string}
                  className={
                    i === 0
                      ? "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-2 text-primary lg:w-full"
                      : "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted lg:w-full"
                  }
                >
                  <span className="flex items-center gap-2">
                    <I className="size-4" />
                    {name}
                  </span>
                  {Boolean(count) && <span>{count}</span>}
                </button>
              );
            })}
          </nav>
          <div className="mt-7 hidden px-1 lg:block">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">
                LABELS
              </p>
              <button className="text-xs font-medium text-primary hover:underline" type="button">
                Manage
              </button>
            </div>
            <div className="space-y-1">
              {[
                { name: "Work", count: 8, color: "bg-blue-500" },
                { name: "Finance", count: 3, color: "bg-amber-500" },
                { name: "Support", count: 6, color: "bg-emerald-500" },
                { name: "Social", count: 2, color: "bg-violet-500" },
              ].map((label) => {
                const selectedLabel = activeLabel === label.name;
                return (
                  <button
                    key={label.name}
                    type="button"
                    onClick={() => setActiveLabel(label.name)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start text-sm transition-colors ${selectedLabel ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <span className={`size-2 rounded-full ${label.color}`} aria-hidden="true" />
                    <span className="flex-1">{label.name}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[11px] ${selectedLabel ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {label.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="border-b p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mail"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          {visible.map((m) => {
            const original = messages.indexOf(m);
            return (
              <button
                onClick={() => {
                  setActive(original);
                  setPreviewOpen(true);
                }}
                key={m[1]}
                className="flex min-w-0 w-full gap-3 border-b p-4 text-start hover:bg-muted/60"
              >
                <Avatar initials={m[4]} />
                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{m[0]}</b>
                  <span className="block truncate text-sm">{m[1]}</span>
                  <small className="block truncate text-muted-foreground">{m[2]}</small>
                </span>
                <small className="shrink-0">{m[3]}</small>
              </button>
            );
          })}
        </section>
      </div>
      {previewOpen && (
        <>
          <button
            onClick={() => setPreviewOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
            aria-label="Close email details"
          />
          <article
            role="dialog"
            aria-modal="true"
            aria-label="Email details"
            className="fixed inset-y-0 end-0 z-50 flex w-full max-w-[680px] flex-col border-s bg-card shadow-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Mail details
                </p>
                <p className="truncate text-sm font-semibold">{selected[1]}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStarred((value) => !value)}
                  aria-label={starred ? "Remove star" : "Star email"}
                  title={starred ? "Remove star" : "Star email"}
                >
                  <Icons.Star
                    className={starred ? "size-4 fill-amber-400 text-amber-500" : "size-4"}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More email actions"
                  title="More actions"
                >
                  <Icons.MoreHorizontal className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(false)}
                  aria-label="Close email details"
                  title="Close"
                >
                  <Icons.X className="size-4" />
                </Button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <Avatar initials={selected[4]} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <b className="text-sm">{selected[0]}</b>
                      <Badge tone="success">Verified sender</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selected[0].toLowerCase().replace(" ", ".")}@vexui.example
                    </p>
                    <button className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      to avery@vexui.example <Icons.ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/35 px-3 py-2 text-end">
                  <p className="text-xs font-medium">{selected[3]}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Inbox</p>
                </div>
              </div>

              <div className="mt-7 border-b pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="primary">Inbox</Badge>
                  <Badge tone="muted">Unread</Badge>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{selected[1]}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{selected[2]}</p>
              </div>

              <div className="space-y-4 py-6 text-sm leading-7">
                <p>Hi Avery,</p>
                <p>
                  I wanted to share the latest update and make sure you have the context needed for
                  the next step. The details are ready for review, and the team is available if you
                  would like to discuss them.
                </p>
                <p>
                  Please let us know if there are any questions or if another follow-up would be
                  helpful.
                </p>
                <p>
                  Thanks,
                  <br />
                  <span className="font-medium">{selected[0]}</span>
                </p>
              </div>

              {active === 0 && (
                <section
                  className="rounded-xl border bg-muted/25 p-3"
                  aria-label="Email attachment"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icons.FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">q3-design-review.pdf</p>
                      <p className="text-xs text-muted-foreground">PDF document - 2.4 MB</p>
                    </div>
                    <Button variant="outline" size="sm" aria-label="Download attachment">
                      <Icons.Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </section>
              )}

              <section className="mt-6 rounded-xl border bg-muted/20 p-4" aria-label="Quick reply">
                <div className="mb-3 flex items-center gap-2">
                  <Icons.Reply className="size-4 text-primary" />
                  <p className="text-sm font-semibold">Quick reply</p>
                </div>
                <textarea
                  value={quickReply}
                  onChange={(event) => setQuickReply(event.target.value)}
                  className="min-h-28 w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={`Reply to ${selected[0]}...`}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <Button variant="ghost" size="sm" aria-label="Add attachment">
                    <Icons.Paperclip className="size-4" />
                    Attach
                  </Button>
                  <Button size="sm" onClick={() => setQuickReply("")} disabled={!quickReply.trim()}>
                    <Icons.Send className="size-4" />
                    Send reply
                  </Button>
                </div>
              </section>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t bg-card px-4 py-3 sm:px-6">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" title="Archive email">
                  <Icons.Archive className="size-4" />
                  Archive
                </Button>
                <Button variant="ghost" size="sm" title="Delete email">
                  <Icons.Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setComposeOpen(true)}>
                  <Icons.Forward className="size-4" />
                  Forward
                </Button>
                <Button size="sm" onClick={() => setComposeOpen(true)}>
                  <Icons.Reply className="size-4" />
                  Reply
                </Button>
              </div>
            </footer>
          </article>
        </>
      )}{" "}
      {composeOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/25 p-0 sm:items-center sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Compose email"
            className="flex max-h-[calc(100dvh-0.5rem)] w-full max-w-xl flex-col overflow-y-auto rounded-t-xl border bg-card shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">New message</h2>
              <Button variant="ghost" size="sm" onClick={() => setComposeOpen(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              <input
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="To"
                type="email"
              />
              <input
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Subject"
              />
              <textarea
                className="min-h-44 w-full resize-y rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Write your message..."
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => setComposeOpen(false)}>
                  Save draft
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setComposeOpen(false)}>
                    Discard
                  </Button>
                  <Button onClick={() => setComposeOpen(false)}>
                    <Icons.Send />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}{" "}
    </>
  );
}
function Apps({ type }: { type: string }) {
  const name = type === "files" ? "File manager" : type[0].toUpperCase() + type.slice(1);
  if (type === "kanban") return <KanbanBoard />;
  if (type === "email") return <EmailApp />;
  if (type === "chat") return <ChatApp />;
  if (type === "calendar") return <CalendarApp />;
  if (type === "tasks") return <TasksApp />;
  if (type === "files") return <FileManagerApp />;
  return (
    <>
      <PageHeader
        title={name}
        subtitle={
          type === "email"
            ? "Stay on top of conversations that matter."
            : type === "chat"
              ? "Collaborate with your team in real time."
              : "Organize your teams work and resources."
        }
        breadcrumb={["Vexui", "Apps", name]}
        actions={
          <Button>
            <Icons.Plus /> {type === "email" ? "Compose" : type === "files" ? "Upload" : "Create"}
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-4">
        <Card
          className="xl:col-span-1"
          title={type === "email" ? "Mailboxes" : type === "chat" ? "Messages" : "Overview"}
        >
          <div className="space-y-2 text-sm">
            {["Inbox", "Starred", "Sent", "Drafts", "Archive"].map((x, i) => (
              <div
                className={
                  i === 0
                    ? "rounded-lg bg-primary/10 px-3 py-2 font-medium text-primary"
                    : "px-3 py-2 text-muted-foreground"
                }
                key={x}
              >
                {x}
              </div>
            ))}
          </div>
        </Card>
        <Card
          className="xl:col-span-3"
          title={
            type === "email"
              ? "Product updates & customer stories"
              : type === "chat"
                ? "Olivia Chen"
                : "Recent activity"
          }
          description="Today, 10:32 AM"
        >
          <div className="space-y-5 text-sm">
            <p>Hi team,</p>
            <p>
              Here is the latest update from the workspace. The rollout is on track, and the
              remaining decisions are ready for review.
            </p>
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="font-semibold">Next review</p>
              <p className="mt-1 text-muted-foreground">Thursday, August 27 2:00 PM</p>
            </div>
            <p>
              Thanks,
              <br />
              Vexui operations
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
function ProfileSettings({ settings = false }: { settings?: boolean }) {
  const [settingsTab, setSettingsTab] = useState("Profile");
  if (settings)
    return (
      <>
        <PageHeader
          title="Settings"
          subtitle="Manage your workspace, security and preferences."
          breadcrumb={["Vexui", "Settings"]}
        />
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="lg:col-span-1" bodyClassName="p-3">
            <nav className="space-y-1 text-sm">
              {[
                "Profile",
                "Account",
                "Security",
                "Notifications",
                "Appearance",
                "Connected Apps",
              ].map((x, i) => (
                <button
                  key={x}
                  className={
                    i === 0
                      ? "w-full rounded-lg bg-primary/10 px-3 py-2 text-start font-medium text-primary"
                      : "w-full rounded-lg px-3 py-2 text-start text-muted-foreground hover:bg-muted"
                  }
                >
                  {x}
                </button>
              ))}
            </nav>
          </Card>
          <Card
            className="lg:col-span-3"
            title={settingsTab === "Profile" ? "Profile settings" : `${settingsTab} settings`}
            description={
              settingsTab === "Profile"
                ? "Control your public workspace identity and contact information."
                : `Manage ${settingsTab.toLowerCase()} preferences for your account. The active settings section is ready for configuration.`
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {["First name", "Last name", "Email address", "Role"].map((x, i) => (
                <label key={x} className={i === 2 ? "sm:col-span-2" : ""}>
                  <span className="mb-1.5 block text-sm font-medium">{x}</span>
                  <input
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    defaultValue={["Avery", "Morgan", "avery@vexuiadmin.com", "Operations lead"][i]}
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
              Profile changes appear across your workspace after you save.
            </div>
            <div className="mt-5 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </Card>
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title="Avery Morgan"
        subtitle="Operations Lead  Vexui  San Francisco, CA"
        breadcrumb={["Vexui", "Profile"]}
        actions={
          <>
            <Button variant="outline">Message</Button>
            <Button>Edit profile</Button>
          </>
        }
      />
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar initials="AM" className="size-20 text-xl" />
          <div className="flex-1">
            <p className="text-lg font-semibold">Avery Morgan</p>
            <p className="text-sm text-muted-foreground">avery@vexuiadmin.com San Francisco, CA</p>
          </div>
          <div className="grid grid-cols-3 gap-5 text-center text-sm">
            {[
              ["18", "Projects"],
              ["142", "Tasks"],
              ["1.2k", "Followers"],
            ].map((x) => (
              <div key={x[1]}>
                <p className="text-lg font-semibold">{x[0]}</p>
                <p className="text-muted-foreground">{x[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Recent activity">
          <div className="space-y-5">
            {[
              "Published Q3 operations report",
              "Completed Northstar design review",
              "Added 3 teammates to Orion project",
            ].map((x, i) => (
              <div className="flex gap-3" key={x}>
                <span className="mt-1.5 size-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">{x}</p>
                  <p className="text-xs text-muted-foreground">{i + 1} hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Current projects">
          <div className="space-y-4">
            {["Northstar redesign", "Orion mobile app", "Aster brand system"].map((x, i) => (
              <div key={x}>
                <div className="flex justify-between text-sm">
                  <span>{x}</span>
                  <span>{[78, 45, 92][i]}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${[78, 45, 92][i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
function GenericPage({ path }: { path: string }) {
  const label = path.split("/").filter(Boolean).pop()?.replaceAll("-", " ") ?? "Workspace";
  const title = label.replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <>
      <PageHeader
        title={title}
        subtitle={`A polished ${title.toLowerCase()} workspace built for your operations team.`}
        breadcrumb={["Vexui", title]}
        actions={
          <Button>
            <Icons.Plus /> Create
          </Button>
        }
      />
      <Card title={`${title} overview`} description="A focused view of your most important work.">
        <div className="grid gap-4 sm:grid-cols-3">
          {["Open items", "Completed this month", "Team activity"].map((x, i) => (
            <div key={x} className="rounded-xl border bg-muted/35 p-4">
              <p className="text-sm text-muted-foreground">{x}</p>
              <p className="mt-2 text-2xl font-semibold">{["248", "84%", "1,482"][i]}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
          <Icons.Sparkles className="mx-auto size-6 text-primary" />
          <p className="mt-3 text-sm font-medium">Your {title.toLowerCase()} workspace is ready</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the action above to start organizing your work.
          </p>
        </div>
      </Card>
    </>
  );
}
export function WorkspacePage({ path }: { path: string }) {
  const part = path.split("/");
  if (path === "/ecommerce/products") return <Products />;
  if (path.includes("products/detail") || path.includes("product-details"))
    return <Products detail />;
  if (path === "/ecommerce/orders") return <OrdersApp />;
  if (path === "/ecommerce/customers") return <CustomersApp />;
  if (path === "/crm/contacts") return <CrmContactsApp />;
  if (path === "/crm/companies") return <CrmCompaniesApp />;
  if (path === "/crm/leads") return <CrmLeadsApp />;
  if (path === "/crm/deals") return <CrmDealsApp />;
  if (path === "/crm/pipeline") return <CrmPipelineApp />;
  if (path.startsWith("/crm/")) return <Crm type={part[2]} />;
  if (path === "/projects/list") return <ProjectListApp />;
  if (path === "/projects/grid") return <ProjectGridApp />;
  if (path === "/projects/detail") return <ProjectDetailsApp />;
  if (path.startsWith("/apps/")) return <Apps type={part[2]} />;
  if (path === "/pages/profile") return <ProfileApp />;
  if (path === "/pages/settings") return <SettingsApp />;
  if (path === "/pages/pricing") return <PricingApp />;
  if (path === "/pages/faq") return <FaqApp />;
  return <GenericPage path={path} />;
}
