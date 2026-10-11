import * as Icons from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

const lineItems = [
  {
    name: "Enterprise platform",
    description: "Annual workspace license",
    quantity: 1,
    rate: "$6,000.00",
    amount: "$6,000.00",
    icon: Icons.Layers3,
  },
  {
    name: "Implementation",
    description: "10 hours of onboarding and setup",
    quantity: 10,
    rate: "$180.00",
    amount: "$1,800.00",
    icon: Icons.Settings2,
  },
  {
    name: "Priority support",
    description: "Premium support coverage",
    quantity: 1,
    rate: "$620.00",
    amount: "$620.00",
    icon: Icons.Headphones,
  },
];

export function InvoiceDetailsApp() {
  return (
    <>
      <PageHeader
        title="Invoice INV-2048"
        subtitle="CloudAxis billing record - issued Aug 22, 2026"
        breadcrumb={["Invoices", "Invoice Details"]}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Printer className="size-4" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("Invoice sent to billing@cloudaxis.com")}
            >
              <Icons.Send className="size-4" />
              Send invoice
            </Button>
            <Button onClick={() => toast.success("Payment recording opened")}>
              <Icons.CircleDollarSign className="size-4" />
              Record payment
            </Button>
          </>
        }
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-info to-success" />
            <div className="absolute -end-20 -top-24 size-72 rounded-full bg-primary/[.08] blur-3xl" />
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icons.ReceiptText className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">Invoice document</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">INV-2048</h2>
                  </div>
                </div>
                <div className="text-start sm:text-end">
                  <Badge tone="success">Paid in full</Badge>
                  <p className="mt-2 text-xs text-muted-foreground">Paid on Aug 25, 2026</p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 border-y py-5 sm:mt-8 sm:grid-cols-2 sm:gap-7 sm:py-6">
                <section>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Bill to
                  </p>
                  <h3 className="mt-3 font-semibold">CloudAxis</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    billing@cloudaxis.com
                    <br />
                    127 Madison Avenue
                    <br />
                    New York, NY 10016, United States
                  </p>
                </section>
                <section className="sm:text-end">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Issued by
                  </p>
                  <BrandLogo className="mt-3 h-7 w-auto sm:ms-auto" />
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    billing@vexui.app
                    <br />
                    San Francisco, CA
                    <br />
                    United States
                  </p>
                </section>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-6 sm:grid-cols-4">
                {[
                  ["Issued", "Aug 22, 2026"],
                  ["Due date", "Sep 05, 2026"],
                  ["Payment terms", "Net 14"],
                  ["Purchase order", "PO-8821"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <b className="mt-1 block text-sm">{value}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Card
            title="Invoice items"
            subtitle="Services included in this billing cycle"
            bodyClassName="p-0"
          >
            <div className="table-scroll">
              <table className="w-full text-sm sm:min-w-[660px]">
                <thead className="border-y bg-muted/30 text-start text-xs text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="hidden px-4 py-3 text-center font-medium sm:table-cell">Qty</th>
                    <th className="hidden px-4 py-3 text-end font-medium sm:table-cell">Rate</th>
                    <th className="px-6 py-3 text-end font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.name} className="border-b last:border-0">
                      <td className="px-4 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                            <item.icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <b className="block">{item.name}</b>
                            <span className="block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-5 text-center sm:table-cell">{item.quantity}</td>
                      <td className="hidden px-4 py-5 text-end text-muted-foreground sm:table-cell">{item.rate}</td>
                      <td className="px-4 py-4 text-end font-semibold sm:px-6 sm:py-5">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ms-auto w-full max-w-sm space-y-3 p-4 text-sm sm:p-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <b className="text-foreground">$8,420.00</b>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <b className="text-foreground">$0.00</b>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <b className="text-foreground">$0.00</b>
              </div>
              <div className="flex justify-between border-t pt-4 text-base">
                <b>Total due</b>
                <b className="text-lg">$8,420.00</b>
              </div>
            </div>
          </Card>

          <Card title="Notes and payment terms">
            <div className="rounded-xl bg-muted/45 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Thank you for choosing Vexui. This invoice was paid in full by card. Please retain
                this record for your accounting files. Questions about this invoice can be sent to
                billing@vexui.app.
              </p>
            </div>
          </Card>
        </main>

        <aside className="min-w-0 space-y-5">
          <Card title="Payment summary">
            <div className="rounded-xl bg-success/10 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-success text-white">
                  <Icons.CheckCircle2 className="size-5" />
                </span>
                <div>
                  <b className="block text-sm text-success">Payment complete</b>
                  <span className="text-xs text-muted-foreground">Received Aug 25, 2026</span>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              {[
                ["Invoice total", "$8,420.00", ""],
                ["Paid", "$8,420.00", "text-success"],
                ["Balance", "$0.00", ""],
                ["Method", "Visa ending 4812", ""],
              ].map(([label, value, style]) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <b className={cn("text-end", style)}>{value}</b>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => toast.success("Payment receipt downloaded")}
            >
              <Icons.Download className="size-4" />
              Download receipt
            </Button>
          </Card>
          <Card title="Customer">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-info/10 font-semibold text-info">
                CA
              </span>
              <div className="min-w-0 flex-1">
                <b className="block">CloudAxis</b>
                <span className="text-xs text-muted-foreground">Enterprise customer</span>
              </div>
              <Icons.ExternalLink className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-5 space-y-3 border-t pt-4 text-sm">
              <p className="flex gap-3">
                <Icons.Mail className="mt-0.5 size-4 text-muted-foreground" />
                <span className="min-w-0 break-all">billing@cloudaxis.com</span>
              </p>
              <p className="flex gap-3">
                <Icons.MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <span>New York, United States</span>
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => toast.success("Customer profile opened")}
            >
              View customer
            </Button>
          </Card>
          <Card title="Invoice activity">
            <div className="space-y-4">
              {[
                [
                  Icons.FilePlus2,
                  "Invoice created",
                  "Aug 22, 9:40 AM",
                  "bg-primary/10 text-primary",
                ],
                [Icons.Send, "Invoice sent", "Aug 22, 10:15 AM", "bg-info/10 text-info"],
                [Icons.Eye, "Invoice viewed", "Aug 23, 2:24 PM", "bg-warning/10 text-warning"],
                [
                  Icons.CircleCheck,
                  "Payment received",
                  "Aug 25, 11:02 AM",
                  "bg-success/10 text-success",
                ],
              ].map(([Icon, title, time, style], index) => (
                <div key={String(title)} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn("grid size-8 place-items-center rounded-full", String(style))}
                    >
                      <Icon className="size-4" />
                    </span>
                    {index < 3 && <span className="mt-1 h-6 w-px bg-border" />}
                  </div>
                  <div>
                    <b className="block text-sm">{title}</b>
                    <span className="text-xs text-muted-foreground">{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
