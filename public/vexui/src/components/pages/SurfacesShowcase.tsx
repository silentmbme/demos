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

function Surface({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <b className="block text-sm">{title}</b>
      {children || <p className="mt-2 text-sm text-muted-foreground">Example surface treatment</p>}
    </div>
  );
}

export function SurfacesShowcase() {
  const [selected, setSelected] = useState("Standard");

  return (
    <>
      <PageHeader
        title="Borders & Shadows"
        subtitle="Surface treatments for hierarchy, affordance, emphasis and focused interactive content."
        breadcrumb={["Components", "UI Elements", "Borders & Shadows"]}
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
          title="Border treatments"
          description="Use borders as the default low-elevation boundary between content surfaces."
          code={'<div className="rounded-xl border">...</div>'}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Surface title="Standard border" className="border bg-card" />
            <Surface title="Dashed boundary" className="border border-dashed bg-card" />
            <Surface title="Accent border" className="border border-primary/40 bg-primary/[.03]" />
            <Surface title="Soft boundary" className="border border-border/60 bg-muted/20" />
          </div>
        </CodeCard>

        <CodeCard
          title="Elevation scale"
          description="Raise only the surfaces that need visual priority or interaction feedback."
          code={'<div className="shadow-sm">...</div>\n<div className="shadow-xl">...</div>'}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Surface title="Level 0" className="border bg-card" />
            <Surface title="Level 1" className="border bg-card shadow-sm" />
            <Surface title="Level 2" className="border bg-card shadow-lg" />
          </div>
        </CodeCard>

        <CodeCard
          title="Radius scale"
          description="Use consistent corner radii to create a cohesive product language."
          code={'<div className="rounded-lg" />\n<div className="rounded-2xl" />'}
        >
          <div className="flex items-end gap-4">
            <div className="grid size-18 place-items-center rounded-md border bg-card text-xs">
              md
            </div>
            <div className="grid size-20 place-items-center rounded-xl border bg-card text-xs">
              xl
            </div>
            <div className="grid size-24 place-items-center rounded-2xl border bg-card text-xs">
              2xl
            </div>
            <div className="grid size-28 place-items-center rounded-3xl border bg-card text-xs">
              3xl
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Focus ring"
          description="Every interactive surface needs a visible, token-driven keyboard focus state."
          code={'<button className="focus:ring-2 focus:ring-primary/30">...</button>'}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-xl border p-4 text-start transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2">
              <Icons.MousePointer2 className="size-5 text-primary" />
              <b className="mt-3 block text-sm">Focusable surface</b>
              <p className="mt-1 text-sm text-muted-foreground">
                Tab to this card to see its focus ring.
              </p>
            </button>

            <button className="rounded-xl border bg-primary/[.03] p-4 text-start transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2">
              <Icons.Command className="size-5 text-primary" />
              <b className="mt-3 block text-sm">Command action</b>
              <p className="mt-1 text-sm text-muted-foreground">Keyboard-friendly action target.</p>
            </button>
          </div>
        </CodeCard>

        <CodeCard
          title="Interactive surfaces"
          description="Hover elevation and selection states make cards feel deliberately actionable."
          code={
            '<button data-selected className="hover:-translate-y-0.5 hover:shadow-md">...</button>'
          }
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {["Standard", "Selected", "Recommended"].map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={
                  selected === item
                    ? "rounded-2xl border-2 border-primary bg-primary/[.05] p-4 text-start shadow-sm"
                    : "rounded-2xl border p-4 text-start transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                }
              >
                <div className="flex justify-between gap-2">
                  <b className="text-sm">{item}</b>
                  {selected === item && <Icons.CheckCircle2 className="size-4 text-primary" />}
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Select this surface to show its active elevation.
                </p>
              </button>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Glass surface"
          description="Use translucency sparingly for overlays, featured panels and layered media."
          code={'<div className="border bg-card/75 backdrop-blur-xl">...</div>'}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-info to-primary p-5">
            <span className="absolute -end-6 -top-8 size-32 rounded-full bg-white/20 blur-xl" />
            <span className="absolute -bottom-10 start-4 size-28 rounded-full bg-white/15 blur-xl" />

            <div className="relative rounded-xl border border-white/30 bg-card/75 p-4 backdrop-blur-xl">
              <b className="text-sm">Glass workspace card</b>
              <p className="mt-2 text-sm text-muted-foreground">
                A translucent surface layered on a colored background.
              </p>
              <Button size="sm" className="mt-4">
                Open workspace
              </Button>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Inset and outline"
          description="Inset surfaces clarify nested information without using strong elevation."
          code={'<div className="rounded-xl bg-muted p-1"><div className="bg-card">...</div></div>'}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-muted p-2">
              <div className="rounded-xl bg-card p-4 shadow-inner">
                <b className="text-sm">Inset content</b>
                <p className="mt-2 text-sm text-muted-foreground">Nested inside a muted track.</p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/20 p-4">
              <b className="text-sm">Outlined feature</b>
              <p className="mt-2 text-sm text-muted-foreground">
                A focused surface with a colored boundary.
              </p>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Status surfaces"
          description="Tinted surfaces can give status information more room than a compact badge."
          code={'<div className="border border-success/20 bg-success/5">...</div>'}
        >
          <div className="space-y-3">
            <Surface title="All checks passed" className="border border-success/20 bg-success/5">
              <p className="mt-1 text-sm text-muted-foreground">
                12 of 12 integration checks completed successfully.
              </p>
            </Surface>

            <Surface title="Review needed" className="border border-warning/20 bg-warning/5">
              <p className="mt-1 text-sm text-muted-foreground">
                Two projects need an owner before this week ends.
              </p>
            </Surface>

            <Surface
              title="Action required"
              className="border border-destructive/20 bg-destructive/5"
            >
              <p className="mt-1 text-sm text-muted-foreground">
                Your billing method could not be verified.
              </p>
            </Surface>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
