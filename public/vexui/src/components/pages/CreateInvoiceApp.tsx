import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

type InvoiceItem = { id: number; name: string; description: string; qty: number; rate: number };
const initialItems: InvoiceItem[] = [
  {
    id: 1,
    name: "Enterprise Platform",
    description: "Annual workspace license",
    qty: 1,
    rate: 6000,
  },
  {
    id: 2,
    name: "Implementation",
    description: "Onboarding and configuration hours",
    qty: 10,
    rate: 180,
  },
];
const inputClass =
  "mt-1.5 h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary transition placeholder:text-muted-foreground focus:ring-2";

export function CreateInvoiceApp() {
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState(
    "Thank you for your business. Payment is due within 14 days of the issue date.",
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.rate, 0),
    [items],
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  const addItem = () =>
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: "New service",
        description: "Describe this service",
        qty: 1,
        rate: 0,
      },
    ]);
  const removeItem = (id: number) =>
    setItems((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current,
    );

  return (
    <>
      <PageHeader
        title="Create invoice"
        subtitle="Prepare a customer-ready invoice with line items, terms, and secure payment details."
        breadcrumb={["Invoices", "Create Invoice"]}
        actions={
          <Button variant="outline" onClick={() => history.back()}>
            <Icons.ArrowLeft className="size-4" />
            Cancel
          </Button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-5">
          <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm lg:p-7">
            <div className="absolute -end-16 -top-20 size-60 rounded-full bg-primary/[.08] blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icons.FilePlus2 className="size-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Draft invoice</p>
                    <Badge tone="muted">Not sent</Badge>
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">INV-2053</h2>
                </div>
              </div>
              <BrandLogo className="h-7 w-auto" />
            </div>
            <div className="relative mt-7 grid gap-5 border-t pt-6 sm:grid-cols-3">
              {[
                ["Client", "CloudAxis"],
                ["Currency", "USD - US Dollar"],
                ["Payment terms", "Net 14"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <b className="mt-1 block text-sm">{value}</b>
                </div>
              ))}
            </div>
          </section>

          <Card
            title="Recipient and billing details"
            subtitle="Select who will receive this invoice and configure its schedule."
          >
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/[.3] p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-info/10 font-semibold text-info">
                CA
              </span>
              <div className="min-w-[180px] flex-1">
                <b className="block text-sm">CloudAxis</b>
                <p className="mt-1 text-xs text-muted-foreground">
                  billing@cloudaxis.com - New York, United States
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Customer selector opened")}
              >
                Change client
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-medium">Invoice number</span>
                <input defaultValue="INV-2053" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Purchase order</span>
                <input defaultValue="PO-8822" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Issue date</span>
                <input type="date" defaultValue="2026-08-24" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Due date</span>
                <input type="date" defaultValue="2026-09-07" className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Currency</span>
                <select defaultValue="USD" className={inputClass}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - Pound sterling</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-medium">Payment terms</span>
                <select defaultValue="Net 14" className={inputClass}>
                  <option>Due on receipt</option>
                  <option>Net 14</option>
                  <option>Net 30</option>
                </select>
              </label>
            </div>
          </Card>

          <Card
            title="Line items"
            subtitle="Amounts are calculated from quantity and unit rate."
            action={
              <Button size="sm" onClick={addItem}>
                <Icons.Plus className="size-4" />
                Add item
              </Button>
            }
            bodyClassName="p-0"
          >
            <div className="hidden grid-cols-[minmax(0,1fr)_72px_120px_132px_40px] gap-3 border-b bg-muted/30 px-6 py-3 text-xs font-medium text-muted-foreground md:grid">
              <span>Item and description</span>
              <span>Qty</span>
              <span>Rate</span>
              <span className="text-end">Amount</span>
              <span />
            </div>
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_72px_120px_132px_40px] md:items-center md:px-6"
                >
                  <div>
                    <input
                      value={item.name}
                      onChange={(event) => updateItem(item.id, "name", event.target.value)}
                      aria-label="Item name"
                      className="h-10 w-full border-0 bg-transparent px-0 text-sm font-semibold outline-none"
                    />
                    <input
                      value={item.description}
                      onChange={(event) => updateItem(item.id, "description", event.target.value)}
                      aria-label="Item description"
                      className="mt-1 w-full border-0 bg-transparent px-0 text-xs text-muted-foreground outline-none"
                    />
                  </div>
                  <label className="md:hidden">
                    <span className="text-xs text-muted-foreground">Quantity</span>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(event) =>
                        updateItem(item.id, "qty", Math.max(1, Number(event.target.value)))
                      }
                      className={inputClass}
                    />
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(event) =>
                      updateItem(item.id, "qty", Math.max(1, Number(event.target.value)))
                    }
                    aria-label="Quantity"
                    className="hidden h-10 rounded-lg border bg-background px-2 text-sm md:block"
                  />
                  <label className="md:hidden">
                    <span className="text-xs text-muted-foreground">Rate</span>
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(event) =>
                        updateItem(item.id, "rate", Math.max(0, Number(event.target.value)))
                      }
                      className={inputClass}
                    />
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(event) =>
                      updateItem(item.id, "rate", Math.max(0, Number(event.target.value)))
                    }
                    aria-label="Rate"
                    className="hidden h-10 rounded-lg border bg-background px-2 text-sm md:block"
                  />
                  <div className="flex items-center justify-between md:block md:text-end">
                    <span className="text-xs text-muted-foreground md:hidden">Amount</span>
                    <b>
                      $
                      {(item.qty * item.rate).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </b>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Icons.Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="m-5 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              onClick={addItem}
            >
              <Icons.Plus className="size-4" />
              Add another line item
            </button>
          </Card>

          <Card
            title="Message to customer"
            subtitle="This appears on the invoice sent to your customer."
          >
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full rounded-xl border bg-background p-3 text-sm leading-6 outline-none ring-primary focus:ring-2"
            />
          </Card>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
          <Card title="Invoice summary" subtitle="Review totals before sending.">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <b>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Tax rate</span>
                <label className="flex w-24 items-center rounded-lg border bg-background">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(event) =>
                      setTaxRate(Math.min(100, Math.max(0, Number(event.target.value))))
                    }
                    className="h-8 min-w-0 w-full bg-transparent px-2 text-end text-sm outline-none"
                  />
                  <span className="pe-2 text-muted-foreground">%</span>
                </label>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax amount</span>
                <b>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
              </div>
              <div className="flex justify-between border-t pt-4 text-base">
                <b>Total due</b>
                <b className="text-xl">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </b>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-primary/8 p-4">
              <div className="flex gap-3">
                <Icons.ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-xs leading-5 text-muted-foreground">
                  A secure payment link will be included when this invoice is sent to the customer.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              <Button onClick={() => toast.success("Invoice INV-2053 saved as draft")}>
                <Icons.Save className="size-4" />
                Save draft
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Invoice INV-2053 sent to CloudAxis")}
              >
                <Icons.Send className="size-4" />
                Save and send
              </Button>
            </div>
          </Card>
          <Card title="Payment options">
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between rounded-xl border p-3">
                <span className="flex items-center gap-3">
                  <Icons.CreditCard className="size-4 text-primary" />
                  Card payment
                </span>
                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              </label>
              <label className="flex items-center justify-between rounded-xl border p-3">
                <span className="flex items-center gap-3">
                  <Icons.Landmark className="size-4 text-primary" />
                  Bank transfer
                </span>
                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              </label>
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
