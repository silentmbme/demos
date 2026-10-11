import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
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

export function NavigationShowcase() {
  const [active, setActive] = useState("Overview");
  const [side, setSide] = useState("Dashboard");
  const [mobile, setMobile] = useState("Home");

  return (
    <>
      <PageHeader
        title="Navigation"
        subtitle="Patterns for moving between pages, views, collections and focused actions."
        breadcrumb={["Components", "UI Elements", "Navigation"]}
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
          title="Underline tabs"
          description="Use horizontal tabs to switch between related content views."
          code={"<nav><button data-active>Overview</button></nav>"}
        >
          <div>
            <nav className="flex overflow-x-auto border-b">
              {["Overview", "Activity", "Files", "Settings"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  className={
                    active === item
                      ? "border-b-2 border-primary px-4 py-3 text-sm font-medium text-primary"
                      : "border-b-2 border-transparent px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
                  }
                >
                  {item}
                </button>
              ))}
            </nav>

            <p className="pt-4 text-sm text-muted-foreground">
              <b className="text-foreground">{active}</b> content is selected.
            </p>
          </div>
        </CodeCard>

        <CodeCard
          title="Pill navigation"
          description="A compact visual choice for sections within a card or focused workflow."
          code={'<nav className="rounded-xl bg-muted p-1">...</nav>'}
        >
          <nav className="inline-flex flex-wrap rounded-xl bg-muted p-1">
            {["Overview", "Analytics", "Reports"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={
                  active === item
                    ? "rounded-lg bg-card px-3 py-2 text-sm font-medium shadow-sm"
                    : "rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {item}
              </button>
            ))}
          </nav>
        </CodeCard>

        <CodeCard
          title="Segmented control"
          description="Use a joined selection control for a small set of mutually exclusive modes."
          code={'<div role="tablist" className="inline-flex border">...</div>'}
        >
          <div className="inline-flex overflow-hidden rounded-xl border">
            {["Day", "Week", "Month"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={
                  active === item
                    ? "bg-primary px-4 py-2 text-sm text-primary-foreground"
                    : "border-e px-4 py-2 text-sm last:border-0 hover:bg-muted"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Sidebar navigation"
          description="Use icons, active state and counts for primary workspace areas."
          code={'<nav><a aria-current="page"><LayoutDashboard /> Dashboard</a></nav>'}
        >
          <nav className="max-w-sm space-y-1 rounded-2xl border p-2">
            {[
              [Icons.LayoutDashboard, "Dashboard", null],
              [Icons.FolderKanban, "Projects", "12"],
              [Icons.Users, "Team", null],
              [Icons.BarChart3, "Reports", null],
              [Icons.Settings, "Settings", null],
            ].map(([Icon, label, count]: any) => (
              <button
                key={label}
                onClick={() => setSide(label)}
                className={
                  side === label
                    ? "flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-2.5 text-start text-sm font-medium text-primary-foreground"
                    : "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              >
                <Icon className="size-4" />
                <span className="flex-1">{label}</span>

                {count && (
                  <Badge
                    className={
                      side === label ? "bg-primary-foreground/20 text-primary-foreground" : ""
                    }
                  >
                    {count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </CodeCard>

        <CodeCard
          title="Breadcrumb navigation"
          description="Show the current location in a deep hierarchy without taking much space."
          code={"<Breadcrumb><Home /> / Projects / Website Redesign</Breadcrumb>"}
        >
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <button onClick={() => toast.message("Home selected")}>
              <Icons.Home className="size-4" />
            </button>

            <Icons.ChevronRight className="size-4" />

            <button className="hover:text-primary">Projects</button>

            <Icons.ChevronRight className="size-4" />

            <button className="hover:text-primary">Website Redesign</button>

            <Icons.ChevronRight className="size-4" />

            <b className="text-foreground">Settings</b>
          </nav>
        </CodeCard>

        <CodeCard
          title="Command navigation"
          description="Offer fast paths to common destinations and actions from one control."
          code={"<Button><Command /> Search or jump to...</Button>"}
        >
          <div className="max-w-md rounded-xl border p-1">
            <button
              onClick={() => toast.message("Command palette opened")}
              className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-start text-sm text-muted-foreground hover:bg-muted"
            >
              <Icons.Search className="size-4" />
              <span className="flex-1">Search or jump to...</span>

              <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
            </button>

            <div className="mt-1 grid grid-cols-2 gap-1 border-t pt-1">
              {[
                [Icons.Plus, "New project"],
                [Icons.Users, "Invite team"],
                [Icons.FileText, "Create report"],
                [Icons.Settings, "Settings"],
              ].map(([Icon, label]: any) => (
                <button
                  key={label}
                  onClick={() => toast.success(`${label} selected`)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-start text-xs hover:bg-muted"
                >
                  <Icon className="size-3.5 text-primary" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Mobile bottom navigation"
          description="Keep the most important destinations within thumb reach on small screens."
          code={'<nav className="fixed bottom-0">...</nav>'}
        >
          <nav className="flex max-w-md items-center justify-between rounded-2xl border bg-card p-2 shadow-sm">
            {[
              [Icons.Home, "Home"],
              [Icons.FolderKanban, "Projects"],
              [Icons.Bell, "Updates"],
              [Icons.UserRound, "Profile"],
            ].map(([Icon, label]: any) => (
              <button
                key={label}
                onClick={() => setMobile(label)}
                className={
                  mobile === label
                    ? "flex min-w-15 flex-col items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary"
                    : "flex min-w-15 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs text-muted-foreground"
                }
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </CodeCard>

        <CodeCard
          title="Pagination navigation"
          description="Use page controls for long data sets and always make the active page clear."
          code={'<nav><Button>Previous</Button><button aria-current="page">2</button></nav>'}
        >
          <nav className="flex items-center gap-1">
            <Button size="iconSm" variant="outline">
              <Icons.ChevronLeft className="size-4" />
            </Button>

            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                className={
                  item === 2
                    ? "grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground"
                    : "grid size-8 place-items-center rounded-lg border text-sm hover:bg-muted"
                }
              >
                {item}
              </button>
            ))}

            <span className="px-1 text-muted-foreground">...</span>

            <button className="grid size-8 place-items-center rounded-lg border text-sm hover:bg-muted">
              12
            </button>

            <Button size="iconSm" variant="outline">
              <Icons.ChevronRight className="size-4" />
            </Button>
          </nav>
        </CodeCard>
      </div>
    </>
  );
}
