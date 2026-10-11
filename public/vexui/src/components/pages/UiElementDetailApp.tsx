import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonsShowcase } from "@/components/pages/ButtonsShowcase";
import { BadgesShowcase } from "@/components/pages/BadgesShowcase";
import { AlertsShowcase } from "@/components/pages/AlertsShowcase";
import { AvatarsShowcase } from "@/components/pages/AvatarsShowcase";
import { DropdownsShowcase } from "@/components/pages/DropdownsShowcase";
import { TabsShowcase } from "@/components/pages/TabsShowcase";
import { AccordionsShowcase } from "@/components/pages/AccordionsShowcase";
import { ModalsShowcase } from "@/components/pages/ModalsShowcase";
import { DrawersShowcase } from "@/components/pages/DrawersShowcase";
import { TooltipsShowcase } from "@/components/pages/TooltipsShowcase";
import { ProgressShowcase } from "@/components/pages/ProgressShowcase";
import { PaginationShowcase } from "@/components/pages/PaginationShowcase";
import { BreadcrumbsShowcase } from "@/components/pages/BreadcrumbsShowcase";
import { ToastsShowcase } from "@/components/pages/ToastsShowcase";
import { LoadersShowcase } from "@/components/pages/LoadersShowcase";
import { CardsShowcase } from "@/components/pages/CardsShowcase";
import { ListsShowcase } from "@/components/pages/ListsShowcase";
import { TypographyShowcase } from "@/components/pages/TypographyShowcase";
import { NavigationShowcase } from "@/components/pages/NavigationShowcase";
import { ChipsShowcase } from "@/components/pages/ChipsShowcase";
import { DividersShowcase } from "@/components/pages/DividersShowcase";
import { EmptyStatesShowcase } from "@/components/pages/EmptyStatesShowcase";
import { TimelinesShowcase } from "@/components/pages/TimelinesShowcase";
import { LayoutsShowcase } from "@/components/pages/LayoutsShowcase";
import { SurfacesShowcase } from "@/components/pages/SurfacesShowcase";
import { TransitionsShowcase } from "@/components/pages/TransitionsShowcase";
import { IconsExplorer } from "@/components/pages/IconsExplorer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";

const meta: Record<string, [string, string]> = {
  buttons: ["Buttons", "Action controls, variants, sizes and loading states."],
  badges: ["Badges", "Status labels, counts, tags and compact state indicators."],
  alerts: ["Alerts", "Contextual feedback, status and actionable notifications."],
  avatars: ["Avatars", "Identity, presence and group display patterns."],
  dropdowns: ["Dropdowns", "Contextual actions and option menus."],
  tabs: ["Tabs", "Content navigation and segmented interface states."],
  accordions: ["Accordions", "Expandable, accessible information disclosure."],
  modals: ["Modals", "Dialog patterns for forms, confirmations and destructive actions."],
  drawers: ["Drawers", "Offcanvas detail and utility panels."],
  tooltips: ["Tooltips", "Concise hover guidance for compact controls."],
  progress: ["Progress", "Completion, capacity and status indicators."],
  pagination: ["Pagination", "Page navigation and result browsing controls."],
  breadcrumbs: ["Breadcrumbs", "Clear path and location context."],
  toasts: ["Toasts", "Transient feedback notifications."],
  loaders: ["Loaders", "Loading, skeleton and waiting-state patterns."],
  cards: ["Cards", "Reusable surfaces for information and actions."],
  lists: ["Lists", "Structured activity, people and action rows."],
};

export function UiElementDetailApp({ element }: { element: string }) {
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [title, subtitle] = meta[element] ?? [
    "UI Element",
    "Reusable interface component showcase.",
  ];

  const loadingAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  if (element === "buttons") return <ButtonsShowcase />;
  if (element === "badges") return <BadgesShowcase />;
  if (element === "alerts") return <AlertsShowcase />;
  if (element === "avatars") return <AvatarsShowcase />;
  if (element === "dropdowns") return <DropdownsShowcase />;
  if (element === "tabs") return <TabsShowcase />;
  if (element === "accordions") return <AccordionsShowcase />;
  if (element === "modals") return <ModalsShowcase />;
  if (element === "drawers") return <DrawersShowcase />;
  if (element === "tooltips") return <TooltipsShowcase />;
  if (element === "progress") return <ProgressShowcase />;
  if (element === "pagination") return <PaginationShowcase />;
  if (element === "breadcrumbs") return <BreadcrumbsShowcase />;
  if (element === "toasts") return <ToastsShowcase />;
  if (element === "loaders") return <LoadersShowcase />;
  if (element === "cards") return <CardsShowcase />;
  if (element === "lists") return <ListsShowcase />;
  if (element === "typography") return <TypographyShowcase />;
  if (element === "navigation") return <NavigationShowcase />;
  if (element === "chips") return <ChipsShowcase />;
  if (element === "dividers") return <DividersShowcase />;
  if (element === "empty-states") return <EmptyStatesShowcase />;
  if (element === "timelines") return <TimelinesShowcase />;
  if (element === "layouts") return <LayoutsShowcase />;
  if (element === "surfaces") return <SurfacesShowcase />;
  if (element === "transitions") return <TransitionsShowcase />;
  if (element === "icons") return <IconsExplorer />;

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={["Components", "UI Elements", title]}
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

      <Card
        title={`${title} examples`}
        description="Interactive examples using the existing design system."
      >
        {element === "buttons" && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
              <Button disabled>Disabled</Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>

              <Button onClick={loadingAction} disabled={loading}>
                {loading && <Icons.LoaderCircle className="me-2 size-4 animate-spin" />}

                {loading ? "Saving..." : "Loading action"}
              </Button>
            </div>
          </div>
        )}

        {element === "badges" && (
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="primary">New</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger">Overdue</Badge>
            <Badge tone="info">In review</Badge>
            <Badge>Neutral</Badge>

            <span className="relative grid size-9 place-items-center rounded-full bg-muted text-sm">
              AM
              <span className="absolute -end-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] text-white">
                4
              </span>
            </span>
          </div>
        )}

        {element === "alerts" && (
          <div className="grid gap-3 md:grid-cols-2">
            {[
              [
                Icons.CheckCircle2,
                "Profile updated successfully",
                "Your workspace details are up to date.",
                "success",
              ],
              [
                Icons.CircleAlert,
                "Payment method requires attention",
                "Update billing details before renewal.",
                "warning",
              ],
              [Icons.Info, "Workspace maintenance", "Maintenance is scheduled for Sunday.", "info"],
              [
                Icons.TriangleAlert,
                "Invoice is overdue",
                "Review payment status or send a reminder.",
                "danger",
              ],
            ].map(([Icon, h, t, tone]: any) => (
              <div
                key={h}
                className={cn(
                  "flex gap-3 rounded-xl border p-4 text-sm",
                  tone === "danger" ? "border-destructive/20 bg-destructive/5" : "bg-muted/30",
                )}
              >
                <Icon className="size-5 text-primary" />

                <span>
                  <b className="block">{h}</b>
                  <span className="mt-1 block text-muted-foreground">{t}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {element === "avatars" && (
          <div className="flex flex-wrap items-end gap-4">
            {["XS", "SM", "MD", "LG", "XL"].map((x, i) => (
              <div key={x} className="text-center">
                <span
                  className={cn(
                    "relative grid place-items-center rounded-full bg-primary/12 font-semibold text-primary",
                    [
                      "size-7 text-[9px]",
                      "size-9 text-xs",
                      "size-11 text-sm",
                      "size-14 text-base",
                      "size-16 text-lg",
                    ][i],
                  )}
                >
                  {x}

                  <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-card bg-success" />
                </span>

                <small className="mt-2 block text-muted-foreground">{x}</small>
              </div>
            ))}

            <div className="flex -space-x-2 rtl:space-x-reverse">
              {["SC", "DL", "EW", "NW"].map((x) => (
                <span
                  key={x}
                  className="grid size-10 place-items-center rounded-full border-2 border-card bg-primary/10 text-xs text-primary"
                >
                  {x}
                </span>
              ))}

              <span className="grid size-10 place-items-center rounded-full border-2 border-card bg-muted text-xs">
                +3
              </span>
            </div>
          </div>
        )}

        {element === "dropdowns" && (
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => setMenu(!menu)}>
              Project actions
              <Icons.ChevronDown className="ms-2 size-4" />
            </Button>

            {menu && (
              <div className="absolute start-0 z-20 mt-2 w-48 rounded-xl border bg-card p-1 shadow-lg">
                {["Edit project", "Duplicate project", "Archive project", "Delete project"].map(
                  (action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setMenu(false);
                        toast.message(`${action} selected`);
                      }}
                      className={cn(
                        "block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-muted",
                        action.startsWith("Delete") && "text-destructive",
                      )}
                    >
                      {action}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {element === "tabs" && (
          <>
            <div className="flex overflow-x-auto border-b">
              {["Overview", "Activity", "Files", "Settings"].map((x) => (
                <button
                  key={x}
                  onClick={() => setTab(x)}
                  className={cn(
                    "border-b-2 px-4 py-3 text-sm",
                    tab === x
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  {x}
                </button>
              ))}
            </div>

            <p className="pt-5 text-sm text-muted-foreground">
              <b className="text-foreground">{tab}</b> is selected.
            </p>
          </>
        )}

        {element === "accordions" && (
          <div className="divide-y rounded-xl border px-4">
            {[
              "How do I add teammates?",
              "Can I change my plan?",
              "Where are security settings?",
            ].map((q, i) => (
              <div key={q}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between py-3 text-start text-sm font-medium"
                >
                  {q}

                  <Icons.ChevronDown
                    className={cn("size-4 transition", open === i && "rotate-180")}
                  />
                </button>

                {open === i && (
                  <p className="pb-3 text-sm text-muted-foreground">
                    Open the relevant workspace section and follow the available action. This
                    accordion uses local state.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {element === "modals" && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setDialog(true)}>Open form modal</Button>

            <Button variant="destructive" onClick={() => setDialog(true)}>
              Delete confirmation
            </Button>
          </div>
        )}

        {element === "drawers" && (
          <Button onClick={() => setDrawer(true)}>Open user details drawer</Button>
        )}

        {element === "tooltips" && (
          <div className="flex gap-3">
            {[
              [Icons.Pencil, "Edit"],
              [Icons.Trash2, "Delete"],
              [Icons.Info, "Information"],
            ].map(([Icon, label]: any) => (
              <button
                key={label}
                title={label}
                aria-label={label}
                onClick={() => toast.message(`${label} control activated`)}
                className="grid size-10 place-items-center rounded-lg border transition hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        )}

        {element === "progress" && (
          <div className="space-y-4">
            {[
              ["Profile completion", 88],
              ["Project progress", 72],
              ["Storage capacity", 64],
              ["Budget used", 91],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <b>{value}%</b>
                </div>

                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {element === "pagination" && (
          <div className="flex flex-wrap gap-1">
            {["Previous", 1, 2, 3, 4, 5, "Next"].map((x) => (
              <button
                key={x}
                disabled={x === "Previous"}
                onClick={() => typeof x === "number" && setPage(x)}
                className={cn(
                  "h-9 min-w-9 rounded-md border px-3 text-sm disabled:opacity-45",
                  x === page && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {x}
              </button>
            ))}

            <span className="ms-3 self-center text-sm text-muted-foreground">Page {page}</span>
          </div>
        )}

        {element === "breadcrumbs" && (
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Icons.Home className="size-4" />
            <span>Dashboard</span>
            <Icons.ChevronRight className="size-4" />
            <span>Projects</span>
            <Icons.ChevronRight className="size-4" />
            <b className="text-foreground">Project Details</b>
          </div>
        )}

        {element === "toasts" && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success("Success toast shown")}>Success</Button>

            <Button variant="outline" onClick={() => toast.warning("Warning toast shown")}>
              Warning
            </Button>

            <Button variant="destructive" onClick={() => toast.error("Error toast shown")}>
              Error
            </Button>

            <Button variant="ghost" onClick={() => toast.info("Information toast shown")}>
              Info
            </Button>
          </div>
        )}

        {element === "loaders" && (
          <div className="flex flex-wrap items-center gap-5">
            <span className="size-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <span className="size-4 animate-spin rounded-full border-2 border-muted border-t-primary" />

            <div className="w-48 space-y-2">
              <div className="h-4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}

        {element === "cards" && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Monthly activity</p>
              <p className="mt-2 text-3xl font-semibold">84%</p>
              <p className="mt-1 text-xs text-success">On track</p>
            </div>

            <div className="rounded-xl border p-4">
              <Icons.FolderOpen className="size-5 text-primary" />
              <b className="mt-4 block">Project files</b>
              <p className="mt-1 text-sm text-muted-foreground">12 updated this week</p>
            </div>

            <button className="rounded-xl border p-4 text-start transition hover:border-primary">
              <b>Interactive surface</b>
              <p className="mt-1 text-sm text-muted-foreground">
                Hover to reveal the action affordance.
              </p>
            </button>
          </div>
        )}

        {element === "lists" && (
          <div className="rounded-xl border">
            {[
              ["Design review ready", "Sophia Carter  12 min ago"],
              ["Deployment completed", "Production  2 hours ago"],
              ["Invoice paid", "Billing  Yesterday"],
            ].map((x) => (
              <div key={x[0]} className="flex items-center gap-3 border-b p-3 last:border-0">
                <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icons.Bell className="size-4" />
                </span>

                <span>
                  <b className="block text-sm">{x[0]}</b>
                  <small className="text-muted-foreground">{x[1]}</small>
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit information</DialogTitle>
          </DialogHeader>

          <label className="grid gap-1.5 text-sm">
            Project name
            <input
              defaultValue="Website Redesign"
              className="h-10 rounded-lg border bg-background px-3"
            />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                setDialog(false);
                toast.success("Changes saved");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>

          <div className="mt-5 rounded-xl border p-4">
            <b>Elena Mrquez</b>

            <p className="mt-1 text-sm text-muted-foreground">Operations Lead Online</p>

            <Button className="mt-4 w-full" onClick={() => toast.success("Profile action ready")}>
              Manage profile
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
