import { useState, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function CodeCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <Card
      title={title}
      description={description}
      action={
        <Button size="sm" variant="ghost" onClick={() => setShowCode(!showCode)}>
          <Icons.Code2 className="me-1 size-4" />
          {showCode ? "Hide code" : "Show code"}
        </Button>
      }
    >
      {children}

      {showCode && (
        <pre className="mt-5 overflow-x-auto rounded-xl border bg-muted/45 p-4 text-xs leading-6 text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </Card>
  );
}

export function DrawersShowcase() {
  const [drawer, setDrawer] = useState<string | null>(null);

  const close = () => setDrawer(null);
  const open = (name: string) => setDrawer(name);
  const onChange = (visible: boolean) => !visible && close();

  return (
    <>
      <PageHeader
        title="Drawers"
        subtitle="Off-canvas panels for contextual details, tasks and utility actions."
        breadcrumb={["Components", "UI Elements", "Drawers"]}
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
          title="Right drawer"
          description="The default detail panel for quick contextual information."
          code={`<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">...</SheetContent>
</Sheet>`}
        >
          <Button onClick={() => open("details")}>
            <Icons.PanelRight className="me-2 size-4" />
            Open details drawer
          </Button>
        </CodeCard>

        <CodeCard
          title="Drawer positions"
          description="Use right, left, top or bottom based on the task and available space."
          code={`<SheetContent side="left">...</SheetContent>
<SheetContent side="bottom">...</SheetContent>`}
        >
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => open("left")}>
              Left
            </Button>
            <Button size="sm" variant="outline" onClick={() => open("top")}>
              Top
            </Button>
            <Button size="sm" variant="outline" onClick={() => open("bottom")}>
              Bottom
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="Profile drawer"
          description="Show a user profile without interrupting the current workspace."
          code={`<SheetContent side="right">
  <ProfileSummary />
  <ProfileActions />
</SheetContent>`}
        >
          <Button variant="soft" onClick={() => open("profile")}>
            <Icons.UserRound className="me-2 size-4" />
            View profile
          </Button>
        </CodeCard>

        <CodeCard
          title="Filters"
          description="Keep collection filters nearby while results remain visible behind the panel."
          code={`<SheetContent side="right">
  <FilterControls />
  <SheetFooter>...</SheetFooter>
</SheetContent>`}
        >
          <Button variant="outline" onClick={() => open("filters")}>
            <Icons.SlidersHorizontal className="me-2 size-4" />
            Open filters
          </Button>
        </CodeCard>

        <CodeCard
          title="Activity drawer"
          description="Use a scrollable panel for recent updates and notifications."
          code={`<SheetContent side="right" className="overflow-y-auto">
  <ActivityList />
</SheetContent>`}
        >
          <Button variant="outline" onClick={() => open("activity")}>
            <Icons.BellRing className="me-2 size-4" />
            View activity
          </Button>
        </CodeCard>

        <CodeCard
          title="Wide work drawer"
          description="A larger panel for reviewing records and completing quick actions."
          code={`<SheetContent side="right" className="w-full sm:max-w-2xl">
  <TaskWorkspace />
</SheetContent>`}
        >
          <Button variant="gradient" onClick={() => open("workspace")}>
            <Icons.ListTodo className="me-2 size-4" />
            Open task workspace
          </Button>
        </CodeCard>
      </div>

      {/* Project Details */}
      <Sheet open={drawer === "details"} onOpenChange={onChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Project details</SheetTitle>
            <SheetDescription>Website Redesign - PRJ-1048</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <b>Website Redesign</b>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Design system and storefront update
                  </p>
                </div>

                <Badge tone="success">On track</Badge>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[82%] rounded-full bg-primary" />
              </div>

              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>82% complete</span>
                <span>Sep 10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Tasks", "48 / 62"],
                ["Budget", "$68K"],
                ["Owner", "Sophia"],
                ["Team", "8 members"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border p-3">
                  <small className="text-muted-foreground">{label}</small>
                  <b className="mt-1 block text-sm">{value}</b>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={close}>
              Close
            </Button>

            <Button
              onClick={() => {
                close();
                toast.success("Project opened");
              }}
            >
              Open project
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Left Navigation */}
      <Sheet open={drawer === "left"} onOpenChange={onChange}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Workspace navigation</SheetTitle>
            <SheetDescription>Quickly switch between areas.</SheetDescription>
          </SheetHeader>

          <nav className="mt-6 space-y-1">
            {[
              [Icons.LayoutDashboard, "Overview"],
              [Icons.FolderKanban, "Projects"],
              [Icons.Users, "Team"],
              [Icons.Settings, "Settings"],
            ].map(([Icon, label]: any) => (
              <button
                key={label}
                onClick={() => {
                  close();
                  toast.message(`${label} selected`);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start text-sm hover:bg-muted"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Top Search */}
      <Sheet open={drawer === "top"} onOpenChange={onChange}>
        <SheetContent side="top" className="pb-7">
          <SheetHeader>
            <SheetTitle>Quick search</SheetTitle>
            <SheetDescription>Jump to a project, teammate or report.</SheetDescription>
          </SheetHeader>

          <div className="mx-auto mt-5 flex max-w-3xl gap-2">
            <div className="relative flex-1">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search your workspace"
                className="h-11 w-full rounded-xl border bg-background ps-10 pe-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button
              onClick={() => {
                close();
                toast.message("Search ready");
              }}
            >
              Search
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Actions */}
      <Sheet open={drawer === "bottom"} onOpenChange={onChange}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

          <SheetHeader>
            <SheetTitle>Choose an action</SheetTitle>
            <SheetDescription>
              Bottom drawers work well for compact mobile actions.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              [Icons.Plus, "Create project"],
              [Icons.UserPlus, "Invite teammate"],
              [Icons.FileText, "New report"],
            ].map(([Icon, label]: any) => (
              <button
                key={label}
                onClick={() => {
                  close();
                  toast.success(`${label} selected`);
                }}
                className="flex items-center gap-3 rounded-xl border p-4 text-start hover:border-primary"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <b className="text-sm">{label}</b>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile */}
      <Sheet open={drawer === "profile"} onOpenChange={onChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Team member</SheetTitle>
            <SheetDescription>Profile and availability details.</SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                  EM
                </span>

                <div>
                  <b className="text-lg">Elena Marquez</b>
                  <p className="text-sm text-muted-foreground">Operations Lead</p>

                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-success">
                    <span className="size-2 rounded-full bg-success" />
                    Available now
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x rtl:divide-x-reverse rounded-xl border py-3 text-center">
              <div>
                <b className="block">42</b>
                <small className="text-muted-foreground">Projects</small>
              </div>
              <div>
                <b className="block">18</b>
                <small className="text-muted-foreground">Tasks</small>
              </div>
              <div>
                <b className="block">96%</b>
                <small className="text-muted-foreground">On time</small>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p>
                <b>Email</b>
                <span className="float-right text-muted-foreground">elena@vexui.com</span>
              </p>
              <p>
                <b>Timezone</b>
                <span className="float-right text-muted-foreground">GMT +5:30</span>
              </p>
            </div>
          </div>

          <SheetFooter className="mt-7">
            <Button variant="outline" onClick={close}>
              Close
            </Button>
            <Button onClick={() => toast.success("Message composer opened")}>Message Elena</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Filters */}
      <Sheet open={drawer === "filters"} onOpenChange={onChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter projects</SheetTitle>
            <SheetDescription>Refine the active project list.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <label className="grid gap-2 text-sm font-medium">
              Status
              <select className="h-10 rounded-xl border bg-background px-3 font-normal">
                <option>All statuses</option>
                <option>On track</option>
                <option>At risk</option>
                <option>Delayed</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Owner
              <select className="h-10 rounded-xl border bg-background px-3 font-normal">
                <option>All owners</option>
                <option>Sophia Carter</option>
                <option>Daniel Lee</option>
              </select>
            </label>

            <div>
              <b className="text-sm">Progress</b>

              <div className="mt-3 flex gap-2">
                {["Any", "0-25%", "26-75%", "76-100%"].map((value, index) => (
                  <button
                    key={value}
                    className={
                      index === 0
                        ? "rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground"
                        : "rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={close}>
              Reset
            </Button>
            <Button
              onClick={() => {
                close();
                toast.success("Filters applied");
              }}
            >
              Apply filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Activity */}
      <Sheet open={drawer === "activity"} onOpenChange={onChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Recent activity</SheetTitle>
            <SheetDescription>Updates from your workspace.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            {[
              ["Sophia completed Design review", "12 min ago", Icons.CheckCircle2, "text-success"],
              ["Daniel added a file", "45 min ago", Icons.FilePlus2, "text-primary"],
              ["Budget review is due", "2 hours ago", Icons.CircleAlert, "text-warning"],
              ["Mia invited a teammate", "Yesterday", Icons.UserPlus, "text-info"],
            ].map(([title, time, Icon, tone]: any) => (
              <article key={title} className="flex gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl bg-muted ${tone}`}
                >
                  <Icon className="size-4" />
                </span>

                <div className="min-w-0">
                  <b className="block text-sm">{title}</b>
                  <small className="text-muted-foreground">{time}</small>
                </div>
              </article>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Task Workspace */}
      <Sheet open={drawer === "workspace"} onOpenChange={onChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Finalize checkout flow</SheetTitle>
            <SheetDescription>
              Complete the remaining review work before QA handoff.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_190px]">
            <div className="space-y-4">
              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <b>Task progress</b>
                  <Badge tone="info">In progress</Badge>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[70%] rounded-full bg-primary" />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">7 of 10 subtasks complete</p>
              </div>

              <div className="rounded-2xl border p-4">
                <b className="text-sm">Checklist</b>

                {["Review desktop layout", "Validate payment errors", "Add mobile tests"].map(
                  (task, index) => (
                    <label key={task} className="mt-3 flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked={index < 2}
                        className="size-4 accent-primary"
                      />
                      {task}
                    </label>
                  ),
                )}
              </div>
            </div>

            <aside className="rounded-2xl border bg-muted/25 p-4">
              <small className="text-muted-foreground">Assignee</small>
              <b className="mt-1 block">Daniel Lee</b>

              <small className="mt-5 block text-muted-foreground">Due date</small>
              <b className="mt-1 block">Aug 27</b>

              <small className="mt-5 block text-muted-foreground">Priority</small>
              <Badge tone="warning" className="mt-2">
                High
              </Badge>
            </aside>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={close}>
              Close
            </Button>
            <Button
              onClick={() => {
                close();
                toast.success("Task marked complete");
              }}
            >
              Mark complete
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
