import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

function CodeCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      title={title}
      description={description}
      action={
        <Button size="sm" variant="ghost" onClick={() => setShow(!show)}>
          <Icons.Code2 className="me-1 size-4" />
          {show ? "Hide code" : "Show code"}
        </Button>
      }
    >
      {children}

      {show && (
        <pre className="mt-5 overflow-x-auto rounded-xl border bg-muted/45 p-4 text-xs leading-6 text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </Card>
  );
}

function Bar({
  value,
  tone = "bg-primary",
  label,
  showValue = true,
}: {
  value: number;
  tone?: string;
  label?: string;
  showValue?: boolean;
}) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span>{label}</span>
          {showValue && <b>{value}%</b>}
        </div>
      )}

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${tone}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressShowcase() {
  const [value, setValue] = useState(64);
  const [activeStep, setActiveStep] = useState(2);

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Communicate completion, capacity, loading and workflow status with clear visual feedback."
        breadcrumb={["Components", "UI Elements", "Progress"]}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button>
              <Icons.FilePlus2 className="me-2 size-4" />
              Create report
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <CodeCard
          title="Linear progress"
          description="A standard bar for measurable completion."
          code={"<Progress value={64} />"}
        >
          <div className="space-y-5">
            <Bar label="Project completion" value={64} />
            <Bar label="Profile setup" value={88} tone="bg-success" />
            <Bar label="Storage used" value={42} tone="bg-info" />
          </div>
        </CodeCard>

        <CodeCard
          title="Interactive value"
          description="Use component state to report an in-progress task."
          code={"const [value, setValue] = useState(64)\n<Progress value={value} />"}
        >
          <Bar label="Exporting data" value={value} tone="bg-gradient-to-r from-primary to-info" />

          <div className="mt-5 flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setValue(Math.max(0, value - 10))}>
              <Icons.Minus className="size-4" />
            </Button>

            <Button size="sm" onClick={() => setValue(Math.min(100, value + 10))}>
              <Icons.Plus className="me-1 size-4" />
              Increase
            </Button>

            <Button size="sm" variant="ghost" onClick={() => setValue(0)}>
              Reset
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="Status progress"
          description="Use color carefully to call attention to warning or risk."
          code={'<Progress value={92} tone="warning" />'}
        >
          <div className="space-y-5">
            <Bar label="Healthy delivery" value={76} tone="bg-success" />
            <Bar label="Review required" value={58} tone="bg-warning" />
            <Bar label="Storage almost full" value={92} tone="bg-destructive" />
          </div>
        </CodeCard>

        <CodeCard
          title="Circular progress"
          description="A compact percentage indicator for cards and summaries."
          code={'<CircularProgress value={72} size="lg" />'}
        >
          <div className="flex flex-wrap items-center gap-7">
            {[
              [38, "text-info"],
              [72, "text-primary"],
              [94, "text-success"],
            ].map(([amount, tone]: any) => (
              <div key={amount} className="text-center">
                <div
                  className={`grid size-20 place-items-center rounded-full ${tone}`}
                  style={{
                    background: `conic-gradient(currentColor ${amount}%, var(--muted) 0)`,
                  }}
                >
                  <span className="grid size-[60px] place-items-center rounded-full bg-card text-sm font-semibold text-foreground">
                    {amount}%
                  </span>
                </div>

                <small className="mt-2 block text-muted-foreground">
                  {amount === 38 ? "Draft" : amount === 72 ? "Active" : "Complete"}
                </small>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Stepped progress"
          description="Show users where they are in a short, ordered workflow."
          code={'<StepProgress activeStep={2} steps={["Details", "Review", "Publish"]} />'}
        >
          <div className="flex items-start">
            {["Details", "Review", "Publish"].map((label, index) => (
              <button
                key={label}
                onClick={() => setActiveStep(index + 1)}
                className="flex flex-1 flex-col items-center text-center"
              >
                <span
                  className={
                    index + 1 <= activeStep
                      ? "grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                      : "grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
                  }
                >
                  {index + 1}
                </span>

                {index < 2 && (
                  <span
                    className={
                      index + 1 < activeStep
                        ? "-mt-5 ms-[calc(50%+70px)] h-0.5 w-[calc(100%-36px)] bg-primary"
                        : "-mt-5 ms-[calc(50%+80px)] h-0.5 w-[calc(100%-36px)] bg-muted"
                    }
                  />
                )}

                <b className="mt-4 text-sm">{label}</b>

                <small className="mt-1 text-xs text-muted-foreground">
                  {index + 1 === activeStep
                    ? "Current step"
                    : index + 1 < activeStep
                      ? "Complete"
                      : "Next"}
                </small>
              </button>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Segmented capacity"
          description="Break capacity into categories while preserving the total at a glance."
          code={"<SegmentedProgress segments={[40, 24, 18]} />"}
        >
          <div>
            <div className="flex h-3 overflow-hidden rounded-full bg-muted">
              <span className="bg-primary" style={{ width: "40%" }} />
              <span className="bg-info" style={{ width: "24%" }} />
              <span className="bg-warning" style={{ width: "18%" }} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {[
                ["Design files", "40%", "bg-primary"],
                ["Documents", "24%", "bg-info"],
                ["Media", "18%", "bg-warning"],
              ].map(([label, amount, tone]) => (
                <span key={label}>
                  <i className={`me-2 inline-block size-2 rounded-full ${tone}`} />
                  <b>{amount}</b>
                  <small className="mt-1 block text-muted-foreground">{label}</small>
                </span>
              ))}
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Indeterminate loading"
          description="Use an active bar when the duration is unknown."
          code={'<Progress indeterminate aria-label="Loading reports" />'}
        >
          <div className="space-y-4">
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/5 animate-[pulse_1.3s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icons.LoaderCircle className="size-4 animate-spin text-primary" />
              Preparing analytics report
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="In context"
          description="Combine progress with a clear value and supporting status."
          code={"<Card><Progress value={82} /><Badge>On track</Badge></Card>"}
        >
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex items-start justify-between">
              <div>
                <b>Q3 product launch</b>
                <p className="mt-1 text-sm text-muted-foreground">34 of 42 tasks completed</p>
              </div>

              <Badge tone="success">On track</Badge>
            </div>

            <div className="mt-5">
              <Bar value={82} tone="bg-success" showValue={false} />
            </div>

            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Aug 8</span>
              <b className="text-foreground">82% complete</b>
              <span>Sep 10</span>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Striped and indeterminate"
          description="Use color to communicate active, successful, warning or blocked processes."
          code={
            '<Progress value={68} striped tone="primary" />\n<Progress indeterminate tone="success" />'
          }
        >
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                ["Uploading assets", 68, "bg-primary"],
                ["Publishing release", 82, "bg-success"],
                ["Reviewing import", 46, "bg-warning"],
                ["Retrying backup", 28, "bg-destructive"],
              ].map(([label, amount, tone]: any) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{label}</span>
                    <b>{amount}%</b>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${tone} bg-[linear-gradient(45deg,rgba(255,255,255,.24)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.24)_50%,rgba(255,255,255,.24)_75%,transparent_75%,transparent)] bg-[length:18px_18px] animate-[pulse_1.4s_ease-in-out_infinite]`}
                      style={{ width: `${amount}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Syncing project updates", "bg-primary", Icons.RefreshCw],
                ["Generating report", "bg-info", Icons.BarChart3],
                ["Checking deployment", "bg-success", Icons.CheckCircle2],
                ["Processing payment", "bg-warning", Icons.CreditCard],
              ].map(([label, tone, Icon]: any) => (
                <div key={label} className="rounded-xl border p-3">
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <Icon className="size-4 text-muted-foreground" />
                    {label}
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full w-2/5 animate-[pulse_1s_ease-in-out_infinite] rounded-full ${tone}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Skeleton loaders"
          description="Reserve layout space while the real content is loading."
          code={'<Skeleton className="h-4 w-32" />\n<Skeleton className="size-10 rounded-full" />'}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="size-11 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <span className="block h-3.5 w-32 animate-pulse rounded bg-muted" />
                <span className="block h-3 w-48 max-w-full animate-pulse rounded bg-muted/80" />
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <span className="h-4 w-28 animate-pulse rounded bg-muted" />
                <span className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              </div>

              <span className="mt-4 block h-3 w-full animate-pulse rounded bg-muted/80" />
              <span className="mt-2 block h-3 w-4/5 animate-pulse rounded bg-muted/80" />

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((item) => (
                  <span key={item} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <span key={item} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
