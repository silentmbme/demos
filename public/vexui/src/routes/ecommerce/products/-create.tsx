import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { productImages } from "@/lib/local-images";

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "text-sm font-medium text-foreground";

export function CreateProduct() {
  const [status, setStatus] = useState("Draft");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("129.00");
  const [cost, setCost] = useState("64.00");
  const [trackInventory, setTrackInventory] = useState(true);
  const [media, setMedia] = useState<string[]>([productImages.wirelessHeadphonesPro]);

  const margin = useMemo(() => {
    const selling = Number(price) || 0;
    const itemCost = Number(cost) || 0;
    return selling > 0 ? Math.max(0, ((selling - itemCost) / selling) * 100).toFixed(1) : "0.0";
  }, [price, cost]);

  const save = (nextStatus: "Draft" | "Active") => {
    if (!name.trim()) {
      toast.error("Add a product name before saving");
      return;
    }
    setStatus(nextStatus);
    toast.success(nextStatus === "Active" ? "Product published" : "Draft saved");
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
            aria-label="Back to products"
          >
            <Icons.ArrowLeft className="size-4" />
          </Button>
          <div className="me-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>eCommerce</span>
              <Icons.ChevronRight className="size-3" />
              <span>Products</span>
              <Icons.ChevronRight className="size-3" />
              <span className="text-foreground">Add product</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Create a new product
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build a complete catalog entry, prepare inventory, and publish when ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => save("Draft")}>
              <Icons.Save className="size-4" />
              Save draft
            </Button>
            <Button onClick={() => save("Active")}>
              <Icons.Send className="size-4" />
              Publish product
            </Button>
          </div>
        </div>

        <div className="mb-6 grid overflow-hidden rounded-2xl border bg-card sm:grid-cols-3">
          {[
            {
              icon: Icons.PackageCheck,
              label: "Catalog setup",
              detail: "Product details and media",
              active: true,
            },
            {
              icon: Icons.Warehouse,
              label: "Inventory ready",
              detail: "Stock and fulfillment",
              active: trackInventory,
            },
            {
              icon: Icons.Store,
              label: "Sales channel",
              detail: status === "Active" ? "Live on storefront" : "Draft not published",
              active: status === "Active",
            },
          ].map(({ icon: Icon, label, detail, active }, index) => (
            <div
              key={label}
              className="flex items-center gap-3 border-b p-4 last:border-b-0 sm:border-b-0 sm:border-e sm:last:border-e-0"
            >
              <div
                className={`grid size-9 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {index + 1}. {label}
                </p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            save("Active");
          }}
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Product information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start with the details customers will see first.
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Required
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className={labelClass}>
                    Product name <span className="text-destructive">*</span>
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                    placeholder="e.g. Wireless Headphones Pro"
                  />
                </label>
                <label>
                  <span className={labelClass}>SKU</span>
                  <input className={inputClass} defaultValue="WHP-1048" />
                </label>
                <label>
                  <span className={labelClass}>Brand</span>
                  <input className={inputClass} defaultValue="Vexui" />
                </label>
                <label>
                  <span className={labelClass}>Category</span>
                  <select className={inputClass} defaultValue="Electronics">
                    <option>Electronics</option>
                    <option>Accessories</option>
                    <option>Sports</option>
                    <option>Home & Living</option>
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Product type</span>
                  <select className={inputClass} defaultValue="Physical product">
                    <option>Physical product</option>
                    <option>Digital product</option>
                    <option>Service</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Description</span>
                  <textarea
                    className="mt-1.5 min-h-32 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    defaultValue="Premium wireless headphones with noise cancellation, all-day comfort, and 40-hour battery life."
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Media gallery</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use high-quality images to make the product stand out.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                <label className="group relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/35 bg-primary/[0.035] p-4 text-center transition hover:bg-primary/[0.07]">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files?.length) {
                        setMedia((items) => [...items, productImages.smartWatchSeriesX]);
                        toast.success(
                          `${event.target.files.length} image${event.target.files.length > 1 ? "s" : ""} added`,
                        );
                      }
                    }}
                  />
                  {media[0] ? (
                    <img
                      src={media[0]}
                      alt="Product preview"
                      className="absolute inset-0 size-full object-cover opacity-90 transition group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-sm">
                    <Icons.UploadCloud className="size-5" />
                  </span>
                  <span className="relative mt-3 text-sm font-semibold">
                    Drop images here or browse
                  </span>
                  <span className="relative mt-1 text-xs text-muted-foreground">
                    PNG, JPG or WEBP up to 10 MB
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(productImages)
                    .slice(1, 5)
                    .map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() =>
                          setMedia((items) => [image, ...items.filter((item) => item !== image)])
                        }
                        className="relative overflow-hidden rounded-xl border bg-muted transition hover:border-primary"
                      >
                        <img
                          src={image}
                          alt={`Product image ${index + 2}`}
                          className="size-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute inset-x-2 bottom-2 rounded-md bg-background/90 px-2 py-1 text-[10px] font-semibold">
                            Set as cover
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold">Pricing</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set the selling price and margin target.
                </p>
                <div className="mt-5 grid gap-4">
                  <label>
                    <span className={labelClass}>Selling price</span>
                    <div className="relative">
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${inputClass} ps-7`}
                      />
                    </div>
                  </label>
                  <label>
                    <span className={labelClass}>Compare-at price</span>
                    <div className="relative">
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        defaultValue="159.00"
                        min="0"
                        step="0.01"
                        className={`${inputClass} ps-7`}
                      />
                    </div>
                  </label>
                  <label>
                    <span className={labelClass}>Cost per item</span>
                    <div className="relative">
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        value={cost}
                        onChange={(event) => setCost(event.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${inputClass} ps-7`}
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className="rounded-xl bg-muted/45 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Margin preview</p>
                  <Icons.ChartNoAxesCombined className="size-4 text-primary" />
                </div>
                <p className="mt-5 text-3xl font-semibold text-primary">{margin}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimated gross margin per sale
                </p>
                <div className="mt-5 space-y-3 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selling price</span>
                    <b>${Number(price || 0).toFixed(2)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item cost</span>
                    <b>${Number(cost || 0).toFixed(2)}</b>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">Estimated profit</span>
                    <b className="text-success">
                      ${Math.max(0, Number(price || 0) - Number(cost || 0)).toFixed(2)}
                    </b>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Inventory & shipping</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Keep stock and fulfillment details accurate.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackInventory((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${trackInventory ? "bg-success/12 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  <span
                    className={`size-2 rounded-full ${trackInventory ? "bg-success" : "bg-muted-foreground"}`}
                  />
                  {trackInventory ? "Inventory tracking on" : "Inventory tracking off"}
                </button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <label>
                  <span className={labelClass}>Available stock</span>
                  <input
                    type="number"
                    disabled={!trackInventory}
                    defaultValue="24"
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>Reorder level</span>
                  <input
                    type="number"
                    disabled={!trackInventory}
                    defaultValue="10"
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>Weight</span>
                  <div className="flex">
                    <input defaultValue="0.42" className={`${inputClass} rounded-e-none`} />
                    <span className="mt-1.5 flex h-10 items-center rounded-e-lg border border-s-0 bg-muted px-3 text-sm text-muted-foreground">
                      kg
                    </span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Publishing</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === "Active" ? "bg-success/12 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {status}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <label className="block rounded-xl border p-3 transition has-[:checked]:border-primary has-[:checked]:bg-primary/[0.04]">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Draft"}
                    onChange={() => setStatus("Draft")}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted">
                      <Icons.FileEdit className="size-4" />
                    </span>
                    <span>
                      <b className="block text-sm">Save as draft</b>
                      <small className="text-xs text-muted-foreground">
                        Keep it private while you prepare.
                      </small>
                    </span>
                  </span>
                </label>
                <label className="block rounded-xl border p-3 transition has-[:checked]:border-success has-[:checked]:bg-success/[0.04]">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Active"}
                    onChange={() => setStatus("Active")}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-success/12 text-success">
                      <Icons.Store className="size-4" />
                    </span>
                    <span>
                      <b className="block text-sm">Active</b>
                      <small className="text-xs text-muted-foreground">
                        Available on the storefront.
                      </small>
                    </span>
                  </span>
                </label>
              </div>
            </section>
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="font-semibold">Product organization</h2>
              <div className="mt-4 space-y-4">
                <label>
                  <span className={labelClass}>Collections</span>
                  <input className={inputClass} placeholder="e.g. New arrivals" />
                </label>
                <label>
                  <span className={labelClass}>Tags</span>
                  <input className={inputClass} defaultValue="audio, wireless, premium" />
                </label>
                <label>
                  <span className={labelClass}>Sales channel</span>
                  <select className={inputClass}>
                    <option>Online store</option>
                    <option>POS</option>
                    <option>Wholesale</option>
                  </select>
                </label>
              </div>
            </section>
            <section className="rounded-2xl border bg-gradient-to-br from-primary/[0.1] via-card to-info/[0.08] p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Icons.Sparkles className="size-4 text-primary" />
                <h2 className="font-semibold">Ready to publish?</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Add a name, cover image, price, and inventory to complete your listing.
              </p>
              <Button className="mt-4 w-full" onClick={() => save("Active")}>
                <Icons.Send className="size-4" />
                Publish product
              </Button>
            </section>
          </aside>
        </form>
      </main>
    </AppShell>
  );
}
