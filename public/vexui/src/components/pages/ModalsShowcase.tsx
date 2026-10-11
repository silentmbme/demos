import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

export function ModalsShowcase() {
  const [modal, setModal] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [command, setCommand] = useState("");

  const close = () => setModal(null);

  return (
    <>
      <PageHeader
        title="Modals"
        subtitle="Focused overlays for forms, confirmations, destructive actions and detailed content."
        breadcrumb={["Components", "UI Elements", "Modals"]}
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
          title="Basic modal"
          description="A simple focused dialog with primary and secondary actions."
          code={
            "<Dialog open={open} onOpenChange={setOpen}>\n  <DialogTrigger asChild><Button>Open modal</Button></DialogTrigger>\n  <DialogContent></DialogContent>\n</Dialog>"
          }
        >
          <Button onClick={() => setModal("basic")}>Open modal</Button>
        </CodeCard>

        <CodeCard
          title="Confirmation"
          description="Ask for confirmation before an important but reversible action."
          code={
            "<DialogContent>\n  <DialogTitle>Confirm action</DialogTitle>\n  <DialogFooter><Button>Confirm</Button></DialogFooter>\n</DialogContent>"
          }
        >
          <Button variant="outline" onClick={() => setModal("confirm")}>
            Confirm action
          </Button>
        </CodeCard>

        <CodeCard
          title="Form modal"
          description="Use a compact form for creating or editing focused records."
          code={"<DialogContent>\n  <label>Project name<input /></label>\n</DialogContent>"}
        >
          <Button onClick={() => setModal("form")}>
            <Icons.Plus className="me-2" />
            Add project
          </Button>
        </CodeCard>

        <CodeCard
          title="Destructive modal"
          description="Use a clear warning and destructive action for irreversible changes."
          code={
            '<DialogContent>\n  <DialogTitle>Delete item?</DialogTitle>\n  <Button variant="destructive">Delete</Button>\n</DialogContent>'
          }
        >
          <Button variant="destructive" onClick={() => setModal("delete")}>
            <Icons.Trash2 className="me-2" />
            Delete item
          </Button>
        </CodeCard>

        <CodeCard
          title="Large details modal"
          description="A wider dialog for reviewing complete record details without leaving the page."
          code={
            '<DialogContent className="sm:max-w-2xl">\n  <DialogTitle>Project details</DialogTitle>\n</DialogContent>'
          }
        >
          <Button variant="outline" onClick={() => setModal("details")}>
            <Icons.PanelTop className="me-2" />
            View details
          </Button>
        </CodeCard>

        <CodeCard
          title="Controlled state"
          description="External controls can open and close the same dialog state."
          code={
            "const [open, setOpen] = useState(false)\n<Button onClick={() => setOpen(true)}>Open</Button>\n<Dialog open={open} onOpenChange={setOpen}></Dialog>"
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="soft" onClick={() => setConfirm(true)}>
              Open controlled modal
            </Button>

            <span className="text-sm text-muted-foreground">
              State: {confirm ? "open" : "closed"}
            </span>
          </div>
        </CodeCard>

        <CodeCard
          title="Setup wizard"
          description="A multi-step modal for guided workspace configuration."
          code={
            "<Dialog open={open}>\n  <StepIndicator step={step} />\n  <WorkspaceStep />\n</Dialog>"
          }
        >
          <Button
            onClick={() => {
              setStep(1);
              setModal("wizard");
            }}
          >
            <Icons.Sparkles className="me-2" />
            Start setup
          </Button>
        </CodeCard>

        <CodeCard
          title="Command palette"
          description="A search-first modal for fast navigation and common actions."
          code={
            '<DialogContent>\n  <SearchInput placeholder="Type a command" />\n  <CommandList />\n</DialogContent>'
          }
        >
          <Button
            variant="soft"
            onClick={() => {
              setCommand("");
              setModal("command");
            }}
          >
            <Icons.Search className="me-2" />
            Open command menu
          </Button>
        </CodeCard>

        <CodeCard
          title="Task workspace"
          description="A detailed task modal with status, assignee and activity."
          code={
            '<DialogContent className="sm:max-w-2xl">\n  <TaskHeader />\n  <TaskDetails />\n  <TaskActivity />\n</DialogContent>'
          }
        >
          <Button variant="outline" onClick={() => setModal("task")}>
            <Icons.ListTodo className="me-2" />
            Open task details
          </Button>
        </CodeCard>

        <CodeCard
          title="Sizes"
          description="sm, md, lg and xl dialog sizes via the size prop."
          code={
            '<DialogContent size="sm"></DialogContent>\n<DialogContent size="xl"></DialogContent>'
          }
        >
          <div className="flex flex-wrap gap-2">
            {["sm", "md", "lg", "xl"].map((size) => (
              <Button
                key={size}
                size="sm"
                variant="outline"
                onClick={() => setModal(`size-${size}`)}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Confirm dialogs"
          description="Destructive and success confirmation layouts."
          code={
            '<ConfirmDialog tone="danger" title="Delete project" />\n<ConfirmDialog tone="success" title="Publish" />'
          }
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" onClick={() => setModal("confirm-delete")}>
              Delete project
            </Button>

            <Button variant="success" onClick={() => setModal("confirm-publish")}>
              Publish
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="Form modal"
          description="Fields and footer actions for focused data entry."
          code={
            '<DialogContent>\n  <Input type="email" />\n  <DialogFooter></DialogFooter>\n</DialogContent>'
          }
        >
          <Button onClick={() => setModal("invite-form")}>
            <Icons.UserPlus className="me-2" />
            Invite teammate
          </Button>
        </CodeCard>

        <CodeCard
          title="Scrollable"
          description="Long content scrolls inside the dialog body."
          code={
            '<DialogContent className="max-h-[85vh]">\n  <div className="overflow-y-auto"></div>\n</DialogContent>'
          }
        >
          <Button variant="outline" onClick={() => setModal("scroll")}>
            Open changelog
          </Button>
        </CodeCard>

        <CodeCard
          title="Fullscreen"
          description="size=full fills the viewport for focused work."
          code={'<DialogContent size="full"></DialogContent>'}
        >
          <Button variant="soft" onClick={() => setModal("full")}>
            Open workspace
          </Button>
        </CodeCard>

        <CodeCard
          title="Side sheet"
          description="Right drawer  page-local recipe for detailed context."
          code={
            '<Sheet open={open} onOpenChange={setOpen}><SheetContent side="right"></SheetContent></Sheet>'
          }
        >
          <Button variant="outline" onClick={() => setModal("sheet")}>
            Open details drawer
          </Button>

          <p className="mt-3 text-xs text-muted-foreground">
            On mobile, dialogs remain easy to dismiss and fit the viewport.
          </p>
        </CodeCard>

        <CodeCard
          title="Warp overlay"
          description="Full-screen surface revealed as a focused overlay."
          code={"<WarpOverlay open={open}><WorkspaceSurface /></WarpOverlay>"}
        >
          <Button variant="gradient" onClick={() => setModal("warp")}>
            <Icons.Sparkles className="me-2" />
            Open warp overlay
          </Button>
        </CodeCard>
      </div>

      <Dialog open={modal === "wizard"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set up your workspace</DialogTitle>
          </DialogHeader>

          <div className="mb-5 flex items-center gap-3">
            {[1, 2, 3].map((num) => (
              <span key={num} className="flex items-center gap-2">
                <span
                  className={
                    num <= step
                      ? "grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground"
                      : "grid size-6 place-items-center rounded-full bg-muted text-xs"
                  }
                >
                  {num}
                </span>

                {num < 3 && <span className="h-px w-6 bg-border" />}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className="grid gap-3">
              <label className="grid gap-1.5 text-sm font-medium">
                Workspace name
                <input
                  defaultValue="Vexui"
                  className="h-10 rounded-lg border bg-background px-3 font-normal"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium">
                Team size
                <select className="h-10 rounded-lg border bg-background px-3 font-normal">
                  <option>110 people</option>
                  <option>1150 people</option>
                  <option>51+ people</option>
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl border bg-muted/25 p-4 text-sm">
              <b>Invite your first teammate</b>

              <p className="mt-1 text-muted-foreground">You can always invite more people later.</p>

              <input
                placeholder="name@company.com"
                className="mt-3 h-10 w-full rounded-lg border bg-background px-3"
              />
            </div>
          )}

          {step === 3 && (
            <div className="rounded-xl border border-success/25 bg-success/5 p-4 text-sm">
              <Icons.CheckCircle2 className="size-5 text-success" />

              <b className="mt-2 block">You are ready to go</b>

              <p className="mt-1 text-muted-foreground">
                Your workspace is ready for projects and collaboration.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={step === 1 ? close : () => setStep(step - 1)}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={() =>
                step === 3
                  ? (close(), toast.success("Workspace setup complete"))
                  : setStep(step + 1)
              }
            >
              {step === 3 ? "Finish" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "command"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Command menu</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Icons.Search className="absolute start-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              autoFocus
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type a command or search"
              className="h-12 w-full border-b bg-background ps-11 pe-4 text-sm outline-none"
            />
          </div>

          <div className="p-2">
            {[
              ["Create project", Icons.Plus],
              ["Go to settings", Icons.Settings],
              ["Invite teammate", Icons.UserPlus],
              ["Open analytics", Icons.BarChart3],
            ]
              .filter(([label]) => String(label).toLowerCase().includes(command.toLowerCase()))
              .map(([label, Icon]: any) => (
                <button
                  key={label}
                  onClick={() => {
                    close();
                    toast.message(`${label} selected`);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm hover:bg-muted"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="flex-1">{label}</span>
                  <kbd className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground"></kbd>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "task"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finalize checkout flow</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Badge tone="warning">High priority</Badge>
            <Badge tone="info">In progress</Badge>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            Complete the responsive checkout review and document the remaining validation rules
            before QA handoff.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Assignee", "Daniel Lee"],
              ["Due date", "Aug 27"],
              ["Project", "Website Redesign"],
            ].map((item) => (
              <div key={item[0]} className="rounded-xl border p-3">
                <small className="text-muted-foreground">{item[0]}</small>
                <b className="mt-1 block text-sm">{item[1]}</b>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4">
            <b className="text-sm">Activity</b>

            <div className="mt-3 space-y-3 text-sm">
              <p>
                <b>Sophia Carter</b>
                <span className="text-muted-foreground"> added a review note 24 min ago</span>
              </p>

              <p>
                <b>Daniel Lee</b>
                <span className="text-muted-foreground"> moved task to In progress 1 hour ago</span>
              </p>
            </div>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {["sm", "md", "lg", "xl"].map((size) => (
        <Dialog
          key={size}
          open={modal === `size-${size}`}
          onOpenChange={(open) => !open && close()}
        >
          <DialogContent
            className={
              size === "sm"
                ? "sm:max-w-sm"
                : size === "md"
                  ? "sm:max-w-md"
                  : size === "lg"
                    ? "sm:max-w-lg"
                    : "sm:max-w-xl"
            }
          >
            <DialogHeader>
              <DialogTitle>{size.toUpperCase()} modal</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              This is the {size.toUpperCase()} size for content with the appropriate amount of
              space.
            </p>

            <DialogFooter>
              <Button onClick={close}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      <Dialog open={modal === "confirm-delete"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <div className="grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
            <Icons.Trash2 className="size-5" />
          </div>

          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Website Redesign and its local demo data will be removed. This cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                close();
                toast.success("Project deleted");
              }}
            >
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "confirm-publish"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <div className="grid size-11 place-items-center rounded-full bg-success/10 text-success">
            <Icons.CheckCircle2 className="size-5" />
          </div>

          <DialogHeader>
            <DialogTitle>Publish changes?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Your latest workspace changes will become visible to the team.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              variant="success"
              onClick={() => {
                close();
                toast.success("Changes published");
              }}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "invite-form"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite teammate</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm font-medium">
              Email address
              <input
                type="email"
                placeholder="teammate@company.com"
                className="h-10 rounded-lg border bg-background px-3 font-normal"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Role
              <select className="h-10 rounded-lg border bg-background px-3 font-normal">
                <option>Member</option>
                <option>Admin</option>
                <option>Viewer</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Personal message
              <textarea
                placeholder="Welcome to the team!"
                className="min-h-20 rounded-lg border bg-background p-3 font-normal"
              />
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                close();
                toast.success("Invitation sent");
              }}
            >
              Send invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "scroll"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Changelog</DialogTitle>
          </DialogHeader>

          <div className="max-h-[52vh] space-y-4 overflow-y-auto pe-2">
            {Array.from({ length: 10 }, (_, i) => ({
              version: `v2.${4 - i}.0`,
              title: [
                "Custom fields",
                "Improved filters",
                "Workspace settings",
                "New analytics",
                "Performance updates",
              ][i % 5],
            })).map((item) => (
              <article key={item.version} className="rounded-xl border p-4">
                <Badge tone="primary">{item.version}</Badge>

                <b className="mt-2 block">{item.title}</b>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  A concise summary of the improvements, fixes and refinements included in this
                  release.
                </p>
              </article>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={close}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "full"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="fixed inset-3 flex h-auto w-auto max-w-none translate-x-0 translate-y-0 flex-col rounded-2xl p-0 sm:inset-6">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <b>Workspace</b>
              <p className="text-sm text-muted-foreground">A full-screen focused work surface</p>
            </div>

            <Button variant="outline" onClick={close}>
              Exit workspace
            </Button>
          </div>

          <div className="grid flex-1 gap-4 overflow-auto bg-muted/25 p-6 md:grid-cols-[220px_1fr]">
            <aside className="rounded-xl border bg-card p-4">
              <b className="text-sm">Navigation</b>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Overview</p>
                <p className="font-medium text-primary">Tasks</p>
                <p>Files</p>
                <p>Settings</p>
              </div>
            </aside>

            <main className="rounded-xl border bg-card p-5">
              <h2 className="text-xl font-semibold">Workspace tasks</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Use a full surface when users need uninterrupted focus.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["In progress", "Ready for review", "Completed"].map((label, i) => (
                  <div key={label} className="rounded-xl border p-4">
                    <small className="text-muted-foreground">{label}</small>
                    <b className="mt-2 block text-2xl">{[8, 4, 19][i]}</b>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={modal === "sheet"} onOpenChange={(open) => !open && close()}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Project details</SheetTitle>
          </SheetHeader>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border bg-muted/25 p-4">
              <b>Website Redesign</b>
              <p className="mt-1 text-sm text-muted-foreground">PRJ-1048 Active Due Sep 10</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Progress", "82%"],
                ["Tasks", "48 / 62"],
                ["Owner", "Sophia"],
                ["Budget", "$68K"],
              ].map((item) => (
                <div key={item[0]} className="rounded-xl border p-3">
                  <small className="text-muted-foreground">{item[0]}</small>
                  <b className="mt-1 block text-sm">{item[1]}</b>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={() => toast.success("Project opened")}>
              Open project
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {modal === "warp" && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/20 p-5 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-info p-8 text-primary-foreground">
              <Button
                variant="secondary"
                size="sm"
                className="absolute end-5 top-5"
                onClick={close}
              >
                Close
              </Button>

              <Badge>Focus mode</Badge>

              <h2 className="mt-4 text-3xl font-semibold">Welcome to your workspace</h2>

              <p className="mt-2 text-sm text-primary-foreground/85">
                A full-screen surface for a focused, high-impact action.
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-3">
              {[
                ["Active projects", "12"],
                ["Team members", "28"],
                ["Tasks completed", "84%"],
              ].map((item) => (
                <div key={item[0]} className="rounded-xl border p-4">
                  <small className="text-muted-foreground">{item[0]}</small>
                  <b className="mt-2 block text-2xl">{item[1]}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={modal === "basic"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome back</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This is a normal modal with simple text and actions.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                close();
                toast.success("Action completed");
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "confirm"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to archive this project? You can restore it later.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                close();
                toast.success("Project archived");
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "form"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add project</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm font-medium">
              Project name
              <input
                placeholder="Website Redesign"
                className="h-10 rounded-lg border bg-background px-3 font-normal"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Owner
              <select className="h-10 rounded-lg border bg-background px-3 font-normal">
                <option>Sophia Carter</option>
                <option>Daniel Lee</option>
              </select>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                close();
                toast.success("Project created");
              }}
            >
              Create project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "delete"} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete item?</DialogTitle>
          </DialogHeader>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            This item will be removed permanently. This demo does not modify real data.
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                close();
                toast.success("Item deleted");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "details"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Website Redesign</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Status", "Active"],
              ["Owner", "Sophia Carter"],
              ["Due date", "Sep 10, 2026"],
            ].map((item) => (
              <div key={item[0]} className="rounded-xl border p-3">
                <small className="text-muted-foreground">{item[0]}</small>
                <b className="mt-1 block text-sm">{item[1]}</b>
              </div>
            ))}
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            A focused project detail modal for reviewing key information without leaving the current
            workspace.
          </p>

          <div className="flex gap-2">
            <Badge tone="success">Healthy</Badge>
            <Badge tone="info">48 tasks</Badge>
            <Badge>Design</Badge>
          </div>

          <DialogFooter>
            <Button onClick={close}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled modal</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This dialog is opened from external component state.
          </p>

          <DialogFooter>
            <Button onClick={() => setConfirm(false)}>Close modal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
