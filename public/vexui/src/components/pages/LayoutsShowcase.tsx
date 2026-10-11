import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/dashboard/widgets";

function CodeCard({
  title,
  description,
  code,
  children,
  className = "",
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      className={className}
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

function Block({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`grid min-h-18 place-items-center rounded-xl border border-dashed border-primary/30 bg-primary/[.06] p-3 text-center text-xs font-medium text-primary ${className}`}
    >
      {label}
    </div>
  );
}

export function LayoutsShowcase() {
  const [dense, setDense] = useState(false);

  return (
    <>
      <PageHeader
        title="Layouts & Grid"
        subtitle="Responsive composition patterns for dashboards, pages, detail views and application workspaces."
        breadcrumb={["Components", "UI Elements", "Layouts & Grid"]}
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
          title="Responsive grid"
          description="Use a grid that grows from one column to multiple columns as space becomes available."
          code={'<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">...</div>'}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Block key={item} label={`Grid item ${item}`} />
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Asymmetric grid"
          description="Give important content more room while keeping supporting information visible."
          code={'<div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">...</div>'}
        >
          <div className="grid gap-3 sm:grid-cols-[1.7fr_1fr]">
            <Block label="Primary content" className="min-h-36" />

            <div className="grid gap-3">
              <Block label="Supporting card" />
              <Block label="Supporting card" />
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Dashboard layout"
          description="A familiar summary layout for metric cards, chart space and a focused side rail."
          code={'<div className="grid gap-4 xl:grid-cols-12">...</div>'}
          className="xl:col-span-2"
        >
          <div className="grid gap-3 xl:grid-cols-12">
            <div className="grid gap-3 sm:grid-cols-3 xl:col-span-9">
              {["Revenue", "Projects", "Team"].map((label) => (
                <Block key={label} label={label} />
              ))}

              <Block label="Primary chart area" className="min-h-36 sm:col-span-3" />
            </div>

            <div className="grid gap-3 xl:col-span-3">
              <Block label="Activity" className="min-h-28" />
              <Block label="Tasks" className="min-h-28" />
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Split view"
          description="Use two equal panels to compare details, configure settings or review a before-and-after state."
          code={'<div className="grid gap-4 lg:grid-cols-2">...</div>'}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <b className="text-sm">Current plan</b>

              <p className="mt-2 text-sm text-muted-foreground">
                Pro plan with 12 team members and 18 GB of storage.
              </p>

              <Button size="sm" className="mt-4" variant="outline">
                Manage plan
              </Button>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <b className="text-sm">Recommended upgrade</b>

              <p className="mt-2 text-sm text-muted-foreground">
                Scale plan for unlimited guests and priority support.
              </p>

              <Button size="sm" className="mt-4">
                Compare plans
              </Button>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Sidebar workspace"
          description="A fixed utility rail beside a flexible work area is ideal for editors and task spaces."
          code={'<div className="grid grid-cols-[180px_1fr] gap-4">...</div>'}
        >
          <div className="grid min-h-52 grid-cols-[140px_1fr] gap-3 rounded-xl border p-3">
            <aside className="rounded-lg bg-muted/55 p-3">
              <b className="text-xs">Workspace</b>

              {["Overview", "Tasks", "Files", "Settings"].map((label, index) => (
                <span
                  key={label}
                  className={
                    index === 1
                      ? "mt-3 block rounded-md bg-card px-2 py-2 text-xs font-medium text-primary shadow-sm"
                      : "mt-1 block px-2 py-2 text-xs text-muted-foreground"
                  }
                >
                  {label}
                </span>
              ))}
            </aside>

            <main className="rounded-lg border bg-card p-4">
              <b className="text-sm">Task workspace</b>

              <p className="mt-2 text-sm text-muted-foreground">
                Flexible content fills all remaining space.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Block label="Task card" />
                <Block label="Task card" />
              </div>
            </main>
          </div>
        </CodeCard>

        <CodeCard
          title="Form layout"
          description="Use responsive columns for related fields, then return to one column for long-form content."
          code={'<form className="grid gap-4 sm:grid-cols-2">...</form>'}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              First name
              <input
                placeholder="Elena"
                className="h-10 rounded-lg border bg-background px-3 font-normal"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Last name
              <input
                placeholder="Marquez"
                className="h-10 rounded-lg border bg-background px-3 font-normal"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
              Email address
              <input
                placeholder="elena@vexui.com"
                className="h-10 rounded-lg border bg-background px-3 font-normal"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
              Project notes
              <textarea className="min-h-20 rounded-lg border bg-background p-3 font-normal" />
            </label>
          </div>
        </CodeCard>

        <CodeCard
          title="Auto-fit card grid"
          description="Let card width respond naturally without hardcoding a specific number of columns."
          code={
            '<div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">...</div>'
          }
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
            {["Website Redesign", "Mobile App", "CRM Migration", "Marketing", "Support"].map(
              (label) => (
                <div key={label} className="rounded-xl border p-3">
                  <Icons.FolderKanban className="size-4 text-primary" />

                  <b className="mt-3 block text-sm">{label}</b>

                  <small className="mt-1 block text-muted-foreground">Updated today</small>
                </div>
              ),
            )}
          </div>
        </CodeCard>

        <CodeCard
          title="Density controls"
          description="Offer a comfortable and compact layout when users need more information on screen."
          code={'<div className={dense ? "gap-2" : "gap-4"}>...</div>'}
        >
          <div>
            <div className="mb-4 flex gap-2">
              <Button
                size="sm"
                variant={dense ? "outline" : "default"}
                onClick={() => setDense(false)}
              >
                Comfortable
              </Button>

              <Button
                size="sm"
                variant={dense ? "default" : "outline"}
                onClick={() => setDense(true)}
              >
                Compact
              </Button>
            </div>

            <div className={dense ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 gap-4"}>
              {["Revenue", "Orders", "Customers", "Reports", "Tasks", "Files"].map((label) => (
                <div
                  key={label}
                  className={
                    dense ? "rounded-lg border p-2 text-xs" : "rounded-xl border p-4 text-sm"
                  }
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </CodeCard>
      </div>

      <Card
        className="mt-5"
        title="Masonry-style content"
        description="Use CSS columns for independent cards with varied content height, such as notes, updates or resources."
      >
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {[
            ["Release notes", "New delivery signals and saved project views are now available."],
            ["Design review", "The updated homepage direction is ready for stakeholder feedback."],
            ["Workspace tip", "Pin your most-used reports to keep operations reviews focused."],
            ["Team update", "Mia joined the Product workspace as a member."],
            ["Planning", "The Q4 planning session starts Thursday at 10:00 AM."],
            ["Customer insight", "NPS improved by 8 points after the latest onboarding changes."],
          ].map(([title, copy], index) => (
            <article key={title} className="mb-4 break-inside-avoid rounded-2xl border p-4">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icons.Sparkles className="size-4" />
              </span>

              <b className="mt-3 block text-sm">{title}</b>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </Card>
    </>
  );
}
