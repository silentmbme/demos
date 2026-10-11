import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

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

function Empty({
  icon: Icon,
  title,
  copy,
  action,
  secondary,
  tone = "bg-primary/10 text-primary",
}: {
  icon: any;
  title: string;
  copy: string;
  action?: React.ReactNode;
  secondary?: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed bg-muted/[.12] p-6 text-center">
      <div className="max-w-xs">
        <span className={`mx-auto grid size-12 place-items-center rounded-2xl ${tone}`}>
          <Icon className="size-6" />
        </span>

        <h3 className="mt-4 text-base font-semibold">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>

        {action && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {action}
            {secondary}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyStatesShowcase() {
  const [created, setCreated] = useState(false);

  return (
    <>
      <PageHeader
        title="Empty States"
        subtitle="Helpful first-run, no-results and recovery states that explain what happened and what to do next."
        breadcrumb={["Components", "UI Elements", "Empty States"]}
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
          title="No search results"
          description="Explain why results are missing and provide a low-effort recovery action."
          code={'<EmptyState icon={SearchX} title="No results found" action="Clear filters" />'}
        >
          <Empty
            icon={Icons.SearchX}
            title="No results found"
            copy="We could not find anything matching annual roadmap. Try another search or clear active filters."
            action={
              <Button size="sm" onClick={() => toast.message("Filters cleared")}>
                Clear filters
              </Button>
            }
            secondary={
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Search help opened")}
              >
                Search tips
              </Button>
            }
          />
        </CodeCard>

        <CodeCard
          title="First project"
          description="Make the primary first action obvious, then offer a secondary path for unsure users."
          code={'<EmptyState icon={FolderPlus} title="Create your first project" />'}
        >
          <Empty
            icon={Icons.FolderPlus}
            title="Create your first project"
            copy="Projects keep tasks, people and delivery signals in one shared workspace."
            action={
              <Button size="sm" onClick={() => setCreated(true)}>
                <Icons.Plus className="me-1 size-4" />
                Create project
              </Button>
            }
            secondary={
              <Button size="sm" variant="outline" onClick={() => toast.message("Templates opened")}>
                Browse templates
              </Button>
            }
          />
        </CodeCard>

        <CodeCard
          title="No notifications"
          description="A quiet state should reassure people that nothing needs attention."
          code={'<EmptyState icon={BellOff} title="You are all caught up" />'}
        >
          <Empty
            icon={Icons.BellOff}
            title="You are all caught up"
            copy="New workspace activity, mentions and reminders will appear here."
            tone="bg-success/10 text-success"
          />
        </CodeCard>

        <CodeCard
          title="Upload empty state"
          description="Use a large target with clear guidance for files and media."
          code={"<UploadDropzone onUpload={upload} />"}
        >
          <div className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-primary/25 bg-primary/[.03] p-6 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icons.UploadCloud className="size-6" />
              </span>

              <b className="mt-4 block">Drop files here</b>

              <p className="mt-2 text-sm text-muted-foreground">
                Drag files here, or choose files from your computer.
              </p>

              <Button
                size="sm"
                className="mt-5"
                onClick={() => toast.success("File picker opened")}
              >
                Choose files
              </Button>

              <p className="mt-3 text-xs text-muted-foreground">PDF, PNG and JPG up to 10 MB</p>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Permission state"
          description="Explain access limitations and point people toward the person or setting that can help."
          code={'<EmptyState icon={LockKeyhole} title="You do not have access" />'}
        >
          <Empty
            icon={Icons.LockKeyhole}
            title="You do not have access"
            copy="Only workspace admins can view billing information and invoices."
            tone="bg-warning/10 text-warning"
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Admin request sent")}
              >
                Request access
              </Button>
            }
          />
        </CodeCard>

        <CodeCard
          title="Error state"
          description="A recovery state should name the problem and provide a retry action."
          code={
            '<EmptyState icon={ServerCrash} title="Unable to load reports" action="Try again" />'
          }
        >
          <Empty
            icon={Icons.ServerCrash}
            title="Unable to load reports"
            copy="Something interrupted the request. Your saved reports are safe and have not been changed."
            tone="bg-destructive/10 text-destructive"
            action={
              <Button
                size="sm"
                variant="destructive"
                onClick={() => toast.success("Reports reloaded")}
              >
                Try again
              </Button>
            }
          />
        </CodeCard>

        <CodeCard
          title="Offline state"
          description="Let people know they can continue working and when their changes will sync."
          code={'<EmptyState icon={CloudOff} title="You are offline" />'}
        >
          <Empty
            icon={Icons.CloudOff}
            title="You are offline"
            copy="Changes are saved on this device and will sync automatically when you reconnect."
            tone="bg-info/10 text-info"
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Sync queue opened")}
              >
                View queued changes
              </Button>
            }
          />
        </CodeCard>

        <CodeCard
          title="Compact inline state"
          description="Use a compact empty state inside a card, row or smaller page region."
          code={'<CompactEmpty icon={FileX} title="No files attached" />'}
        >
          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Icons.FileX className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <b className="block text-sm">No files attached</b>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a file to help the team review this task.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Attachment picker opened")}
              >
                Attach file
              </Button>
            </div>
          </div>
        </CodeCard>
      </div>

      {created && (
        <Card
          className="mt-5"
          title="Project created"
          description="A success state can replace the empty state when the first action completes."
        >
          <div className="flex items-center gap-4 rounded-2xl border border-success/20 bg-success/5 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-success/10 text-success">
              <Icons.CheckCircle2 className="size-6" />
            </span>

            <div className="flex-1">
              <b>Website Redesign is ready</b>
              <p className="mt-1 text-sm text-muted-foreground">
                Invite teammates or start adding tasks to get underway.
              </p>
            </div>

            <Button size="sm" onClick={() => toast.success("Project opened")}>
              Open project
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
