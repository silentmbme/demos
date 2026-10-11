import { useMemo } from "react";
import { CalendarDays, Plus, Landmark, ReceiptText } from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";
import { Button } from "@/components/ui/button";
function P({ v, t = "bg-primary" }: { v: number; t?: string }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
      <i className={`block h-full rounded-full ${t}`} style={{ width: `${v}%` }} />
    </div>
  );
}
export function FinanceDashboard() {
  const { base } = useChartTheme();
  const chart = useMemo(
    () =>
      mergeOptions(base, {
        chart: { type: "bar" },
        colors: [token("--primary"), token("--destructive"), token("--chart-3")],
        xaxis: { categories: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"] },
        plotOptions: { bar: { columnWidth: "44%", borderRadius: 5 } },
        stroke: { curve: "smooth", width: [0, 0, 3] },
        legend: { position: "top", horizontalAlign: "left" },
      }),
    [base],
  );
  return (
    <>
      <PageHeader
        title="Finance"
        subtitle="Cash, profitability and control signals across the business."
        breadcrumb={["Vexui", "Dashboards", "Finance"]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays />
              August
            </Button>
            <Button size="sm">
              <Plus />
              New transaction
            </Button>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8 overflow-hidden border-primary/25"
          title="Cash position"
          description="Last reconciled today, 09:30 AM"
          action={<Badge tone="success">+8.6%</Badge>}
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-4xl font-semibold tracking-tight">$482,640</p>
              <p className="mt-1 text-sm text-success">Available cash healthy liquidity</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-end text-xs">
              <span>
                Bank balance<b className="mt-1 block text-base">$314,800</b>
              </span>
              <span>
                Equivalents<b className="mt-1 block text-base">$112,400</b>
              </span>
              <span>
                Credit<b className="mt-1 block text-base">$55,440</b>
              </span>
            </div>
          </div>
          <svg viewBox="0 0 600 80" className="mt-6 h-16 w-full text-primary">
            <path
              d="M0 68 C70 55 90 70 150 48 S250 45 310 30 S430 48 500 17 S570 23 600 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </Card>
        <Card className="xl:col-span-4" title="Profitability" description="This month">
          <div className="space-y-4">
            {[
              ["Revenue", "$186,420", "bg-primary"],
              ["Gross profit", "$92,640", "bg-success"],
              ["Net profit", "$48,280", "bg-chart-2"],
            ].map(([n, a, c]) => (
              <div key={n as string}>
                <div className="flex justify-between text-sm">
                  <span>{n}</span>
                  <b>{a}</b>
                </div>
                <P v={n === "Revenue" ? 100 : n === "Gross profit" ? 50 : 26} t={c as string} />
              </div>
            ))}
          </div>
          <p className="mt-5 border-t pt-4 text-sm">
            <span className="text-muted-foreground">Net margin</span>
            <b className="float-right text-success">25.9%</b>
          </p>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Card title="Cash flow" description="Inflow vs outflow">
          <div className="flex items-end justify-between">
            <span>
              <small className="text-muted-foreground">Cash in</small>
              <b className="block text-xl text-success">$124,800</b>
            </span>
            <span>
              <small className="text-muted-foreground">Cash out</small>
              <b className="block text-xl text-destructive">$86,400</b>
            </span>
          </div>
          <div className="mt-5 rounded-lg bg-success/10 p-3 text-sm font-semibold text-success">
            +$38,400 net cash flow
          </div>
        </Card>
        <Card title="Operating runway" description="Based on current monthly burn">
          <p className="text-3xl font-semibold">6.0 months</p>
          <p className="text-xs text-muted-foreground">$255,600 operating cash $42,600 burn</p>
          <div className="mt-5 grid grid-cols-6 gap-1">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className="h-3 rounded bg-primary" style={{ opacity: 1 - i * 0.1 }} />
            ))}
          </div>
        </Card>
        <Card title="Margin trend" description="Profitability quality">
          <div className="space-y-4">
            {[
              ["Gross margin", 49.7],
              ["Operating margin", 32.1],
              ["Net margin", 25.9],
            ].map(([n, v]) => (
              <div key={n as string}>
                <div className="flex justify-between text-xs">
                  <span>{n}</span>
                  <b>{v}%</b>
                </div>
                <P v={v as number} t="bg-success" />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8"
          title="Income vs expenses"
          description="Revenue, operating expenses and net income"
        >
          <ApexChart
            type="bar"
            height={300}
            options={chart}
            series={[
              { name: "Revenue", type: "column", data: [142, 158, 166, 171, 179, 186] },
              { name: "Operating expenses", type: "column", data: [88, 94, 102, 108, 112, 116] },
              { name: "Net income", type: "line", data: [32, 38, 42, 44, 46, 48] },
            ]}
          />
        </Card>
        <Card
          className="xl:col-span-4"
          title="Expense breakdown"
          description="$86,400 total operating spend"
        >
          <div className="space-y-3">
            {[
              ["Payroll", "$34,800", 40],
              ["Operations", "$17,500", 20],
              ["Marketing", "$12,600", 15],
              ["Software", "$8,900", 10],
              ["Facilities", "$6,200", 7],
            ].map(([n, a, v]) => (
              <div key={n as string}>
                <div className="flex justify-between text-xs">
                  <span>{n}</span>
                  <b>
                    {a} {v}%
                  </b>
                </div>
                <P v={v as number} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <Card title="Accounts" description="Available balances">
          <div className="space-y-3">
            {[
              ["Operating", " 4582", "$184,600"],
              ["Reserve", " 8174", "$128,240"],
              ["Payroll", " 2951", "$68,400"],
              ["Petty cash", "", "$1,400"],
            ].map(([n, id, a]) => (
              <div className="flex items-center gap-3" key={n}>
                <Landmark className="size-4 text-primary" />
                <span className="flex-1 text-sm">
                  {n}
                  <small className="block text-xs text-muted-foreground">{id}</small>
                </span>
                <b>{a}</b>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Receivables" description="$96,420 outstanding">
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            {[
              ["030", "$51K"],
              ["3160", "$24K"],
              ["6190", "$13K"],
              ["90+", "$8K"],
            ].map(([n, a]) => (
              <span className="rounded-lg bg-muted p-3" key={n}>
                <b className="block text-base">{a}</b>
                {n} days
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-destructive">$18,260 overdue</p>
        </Card>
        <Card title="Payables" description="$72,840 total payable">
          <div className="space-y-3">
            {[
              ["Cloud hosting", "$8,400", "Aug 26"],
              ["Office lease", "$6,800", "Aug 28"],
              ["Software licenses", "$5,200", "Sep 01"],
            ].map(([n, a, d]) => (
              <div className="flex justify-between text-sm" key={n}>
                <span>
                  {n}
                  <small className="block text-xs text-muted-foreground">{d}</small>
                </span>
                <b>{a}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card
        className="mt-5"
        title="Recent transactions"
        description="Latest reconciled account activity"
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="vexui-table min-w-[680px]">
            <thead>
              <tr>
                {["Transaction", "Account", "Category", "Date", "Amount", "Status"].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Stripe settlement", "Operating", "Sales", "Aug 22", "+$12,840", "Completed"],
                ["AWS cloud services", "Operating", "Infrastructure", "Aug 22", "-$4,280", "Paid"],
                ["Payroll batch", "Payroll", "People", "Aug 21", "-$28,600", "Paid"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((x, i) => (
                    <td key={x}>
                      {i === 4 ? (
                        <b className={x.startsWith("+") ? "text-success" : "text-destructive"}>
                          {x}
                        </b>
                      ) : i === 5 ? (
                        <Badge tone="success">{x}</Badge>
                      ) : (
                        x
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Card title="Revenue sources">
          <div className="space-y-3">
            {[
              ["Subscriptions", 48, "$89.4K"],
              ["Services", 24, "$44.7K"],
              ["Marketplace", 17, "$31.7K"],
              ["Other", 11, "$20.6K"],
            ].map(([n, v, a]) => (
              <div key={n as string}>
                <div className="flex justify-between text-xs">
                  <span>{n}</span>
                  <b>{a}</b>
                </div>
                <P v={v as number} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Financial goals">
          <div className="space-y-3">
            {[
              ["Annual revenue", 71],
              ["Expense reduction", 68],
              ["Cash reserve", 64],
              ["Net margin", 86],
            ].map(([n, v]) => (
              <div key={n as string}>
                <div className="flex justify-between text-xs">
                  <span>{n}</span>
                  <b>{v}%</b>
                </div>
                <P v={v as number} t="bg-success" />
              </div>
            ))}
          </div>
        </Card>
        <Card title="P&L summary">
          <div className="space-y-2 text-sm">
            {[
              ["Revenue", "$186,420"],
              ["Cost of revenue", "-$93,780"],
              ["Gross profit", "$92,640"],
              ["Operating expenses", "-$44,360"],
              ["Net income", "$39,860"],
            ].map(([n, a], i) => (
              <p className={i === 2 || i === 4 ? "border-t pt-2 font-semibold" : ""} key={n}>
                <span>{n}</span>
                <b className="float-right">{a}</b>
              </p>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
