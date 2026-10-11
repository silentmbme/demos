import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

const rows = [
  ["INV-2048", "CloudAxis", "billing@cloudaxis.com", "$8,420", "Paid", "$0", "Aug 22", "Sep 05"],
  [
    "INV-2049",
    "Vertex Labs",
    "billing@vertexlabs.com",
    "$4,860",
    "Sent",
    "$4,860",
    "Aug 23",
    "Sep 06",
  ],
  [
    "INV-2050",
    "Vexui Systems",
    "billing@vexuisystems.com",
    "$12,640",
    "Partially Paid",
    "$5,000",
    "Aug 20",
    "Aug 27",
  ],
  [
    "INV-2051",
    "BrightWorks",
    "billing@brightworks.com",
    "$2,180",
    "Overdue",
    "$2,180",
    "Aug 15",
    "Aug 22",
  ],
  ["INV-2052", "Acme Inc.", "billing@acmeinc.com", "$6,920", "Draft", "$6,920", "Aug 24", "Sep 07"],
];

const tone: any = {
  Paid: "success",
  Sent: "info",
  "Partially Paid": "warning",
  Overdue: "danger",
  Draft: "muted",
};

export function InvoiceListApp() {
  const [q, setQ] = useState("");

  const f = rows.filter((x) => x.join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Track billing, payment status, due dates and outstanding balances."
        breadcrumb={["Invoices", "Invoice List"]}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Invoice export downloaded")}>
              <Icons.Download />
              Export
            </Button>

            <Button onClick={() => toast.success("Create Invoice is ready")}>Create Invoice</Button>
          </>
        }
      />

      <Card className="mb-4" bodyClassName="p-0">
        <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-y sm:grid-cols-4 xl:grid-cols-7 xl:divide-y-0">
          {[
            ["Total Invoices", "1,284"],
            ["Paid", "842"],
            ["Pending", "218"],
            ["Overdue", "96"],
            ["Draft", "128"],
            ["Outstanding", "$486K"],
            ["Paid This Month", "$284K"],
          ].map((x) => (
            <div key={x[0]} className="px-4 py-3">
              <small className="text-muted-foreground">{x[0]}</small>
              <b className="block text-lg">{x[1]}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="flex flex-wrap gap-2 border-b p-4">
          <label className="relative min-w-56 flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search invoice or client"
              className="h-10 w-full rounded border bg-background ps-9 pe-3"
            />
          </label>

          <select className="h-10 rounded border bg-background px-3">
            <option>All statuses</option>
            <option>Paid</option>
            <option>Sent</option>
            <option>Overdue</option>
          </select>

          <select className="h-10 rounded border bg-background px-3">
            <option>All clients</option>
            <option>CloudAxis</option>
            <option>Vertex Labs</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                {[
                  "Invoice",
                  "Client",
                  "Issue",
                  "Due",
                  "Amount",
                  "Balance",
                  "Status",
                  "Payment",
                  "",
                ].map((x) => (
                  <th key={x} className="px-4 py-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {f.map((x) => (
                <tr key={x[0]} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <b>{x[0]}</b>
                    <small className="block text-muted-foreground">PO-8821</small>
                  </td>

                  <td className="px-4 py-4">
                    <b>{x[1]}</b>
                    <small className="block text-muted-foreground">{x[2]}</small>
                  </td>

                  <td className="px-4 py-4">{x[6]}</td>
                  <td className="px-4 py-4">{x[7]}</td>
                  <td className="px-4 py-4 font-semibold">{x[3]}</td>
                  <td className="px-4 py-4">{x[5]}</td>

                  <td className="px-4 py-4">
                    <Badge tone={tone[x[4]]}>{x[4]}</Badge>
                  </td>

                  <td className="px-4 py-4">Credit Card</td>

                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Invoice ${x[0]} opened`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
