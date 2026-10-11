import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/dashboard/widgets";

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

function Spinner({ size = "size-6", tone = "border-primary" }: { size?: string; tone?: string }) {
  return (
    <span
      className={`${size} inline-block animate-spin rounded-full border-2 border-muted ${tone} border-t-current`}
    />
  );
}

export function LoadersShowcase() {
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);

  const startOverlay = () => {
    setOverlay(true);
    setTimeout(() => setOverlay(false), 1800);
  };

  return (
    <>
      <PageHeader
        title="Loaders"
        subtitle="Loading indicators and skeleton states for pending content, actions and background work."
        breadcrumb={["Components", "UI Elements", "Loaders"]}
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
          title="Spinner sizes"
          description="Use the smallest loader that remains clear in its surrounding context."
          code={'<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />'}
        >
          <div className="flex items-end gap-7">
            {[
              ["Small", "size-4"],
              ["Medium", "size-6"],
              ["Large", "size-10"],
              ["Extra large", "size-14"],
            ].map(([label, size]) => (
              <div key={label} className="text-center">
                <Spinner size={size} />
                <small className="mt-3 block text-muted-foreground">{label}</small>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Spinner colors"
          description="Match a loader to the status or context it represents."
          code={'<Spinner tone="primary" />\n<Spinner tone="success" />'}
        >
          <div className="flex flex-wrap gap-6">
            {[
              ["Primary", "border-primary text-primary"],
              ["Info", "border-info text-info"],
              ["Success", "border-success text-success"],
              ["Warning", "border-warning text-warning"],
              ["Danger", "border-destructive text-destructive"],
            ].map(([label, tone]) => (
              <div key={label} className="text-center">
                <Spinner tone={tone} />
                <small className="mt-3 block text-muted-foreground">{label}</small>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Dots and pulse"
          description="A softer alternative for inline waiting states and assistant-like activity."
          code={'<span className="animate-pulse">...</span>'}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((item) => (
                <span
                  key={item}
                  className="size-2.5 animate-bounce rounded-full bg-primary"
                  style={{
                    animationDelay: `${item * 120}ms`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
              <span className="size-2 animate-pulse rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Syncing changes</span>
            </div>

            <span className="size-10 animate-pulse rounded-full bg-primary/20" />
          </div>
        </CodeCard>

        <CodeCard
          title="Linear loader"
          description="A familiar bar for streaming or unknown-duration work."
          code={'<div className="animate-pulse bg-primary" />'}
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm">Loading analytics</p>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-primary" />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm">Syncing documents</p>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-info via-primary to-info" />
              </div>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Skeleton loaders"
          description="Mirror the expected layout while cards, lists and charts are still loading."
          code={'<Skeleton className="h-4 w-40" />'}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="size-11 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <span className="block h-3.5 w-32 animate-pulse rounded bg-muted" />
                <span className="block h-3 w-48 max-w-full animate-pulse rounded bg-muted/70" />
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <span className="block h-4 w-28 animate-pulse rounded bg-muted" />

              <span className="mt-4 block h-24 animate-pulse rounded-lg bg-muted/70" />

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((item) => (
                  <span key={item} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Button loading"
          description="Disable duplicate actions and show immediate feedback inside the action control."
          code={"<Button loading={saving}>Save changes</Button>"}
        >
          <Button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1400);
            }}
          >
            {loading && <Icons.LoaderCircle className="me-2 size-4 animate-spin" />}

            {loading ? "Saving changes" : "Save changes"}
          </Button>
        </CodeCard>

        <CodeCard
          title="Content overlay"
          description="Keep context visible while a focused section is loading or refreshing."
          code={
            '<div className="relative">\n  {loading && <LoadingOverlay />}\n  <DashboardCard />\n</div>'
          }
        >
          <div className="relative overflow-hidden rounded-2xl border p-5">
            <div className="flex items-start justify-between">
              <div>
                <b>Monthly performance</b>
                <p className="mt-1 text-sm text-muted-foreground">Updated moments ago</p>
              </div>

              <span className="text-2xl font-semibold">$84,240</span>
            </div>

            <div className="mt-5 flex h-20 items-end gap-2">
              {[38, 55, 43, 72, 60, 84, 76, 92].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t bg-primary/20"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {overlay && (
              <div className="absolute inset-0 grid place-items-center bg-background/65 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-lg">
                  <Spinner size="size-5" />
                  <span className="text-sm font-medium">Refreshing data</span>
                </div>
              </div>
            )}
          </div>

          <Button size="sm" variant="outline" className="mt-4" onClick={startOverlay}>
            <Icons.RefreshCw className="me-1 size-4" />
            Refresh preview
          </Button>
        </CodeCard>

        <CodeCard
          title="Empty loading state"
          description="Center a loader when there is no existing content to preserve."
          code={'<EmptyLoader label="Loading projects..." />'}
        >
          <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed bg-muted/15">
            <div className="text-center">
              <Spinner size="size-8" />

              <b className="mt-4 block text-sm">Loading projects</b>

              <p className="mt-1 text-sm text-muted-foreground">
                Gathering the latest workspace data
              </p>
            </div>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
