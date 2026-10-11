import { useState, type ReactNode } from "react";
import * as Icons from "lucide-react";

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
  children: ReactNode;
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

export function DividersShowcase() {
  return (
    <>
      <PageHeader
        title="Dividers"
        subtitle="Subtle separators for grouping content, signaling transitions and improving scanability."
        breadcrumb={["Components", "UI Elements", "Dividers"]}
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
          title="Horizontal divider"
          description="The default separator for stacked content and list groups."
          code={'<div className="border-t" />'}
        >
          <div className="space-y-4 text-sm">
            <p>Workspace settings</p>
            <div className="border-t" />
            <p className="text-muted-foreground">Manage the preferences for this workspace.</p>
          </div>
        </CodeCard>

        <CodeCard
          title="Vertical divider"
          description="Separate inline actions or related metadata without adding visual weight."
          code={'<span className="h-5 border-s" />'}
        >
          <div className="flex h-10 items-center gap-4 text-sm">
            <button className="hover:text-primary">Edit</button>
            <span className="h-5 border-s" />
            <button className="hover:text-primary">Duplicate</button>
            <span className="h-5 border-s" />
            <button className="text-destructive">Delete</button>
          </div>
        </CodeCard>

        <CodeCard
          title="Text divider"
          description="Label a transition between two alternative flows or content groups."
          code={
            '<div className="flex items-center gap-3"><span className="flex-1 border-t" />OR<span className="flex-1 border-t" /></div>'
          }
        >
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="flex-1 border-t" />
            or continue with
            <span className="flex-1 border-t" />
          </div>
        </CodeCard>

        <CodeCard
          title="Icon divider"
          description="Use a meaningful icon when moving between two distinct content areas."
          code={"<Divider><Sparkles /></Divider>"}
        >
          <div className="flex items-center gap-3">
            <span className="flex-1 border-t" />

            <span className="grid size-8 place-items-center rounded-full border bg-card text-primary">
              <Icons.Sparkles className="size-4" />
            </span>

            <span className="flex-1 border-t" />
          </div>
        </CodeCard>

        <CodeCard
          title="Gradient divider"
          description="Use a restrained gradient divider for a highlighted transition or feature area."
          code={
            '<div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />'
          }
        >
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">New workspace capabilities</p>

            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <p className="text-sm font-medium">AI-assisted delivery summaries</p>
          </div>
        </CodeCard>

        <CodeCard
          title="Dashed divider"
          description="A dashed treatment works well for optional content and upload or drop zones."
          code={'<div className="border-t border-dashed" />'}
        >
          <div className="space-y-4 text-sm">
            <p>Optional project notes</p>
            <div className="border-t border-dashed" />
            <p className="text-muted-foreground">Add context that will help the delivery team.</p>
          </div>
        </CodeCard>

        <CodeCard
          title="Section divider"
          description="Combine title, supporting context and an action in one section boundary."
          code={'<SectionDivider title="Team members" action={<Button>Invite</Button>} />'}
        >
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <b className="text-sm">Team members</b>
                <p className="mt-1 text-xs text-muted-foreground">
                  People with access to this project
                </p>
              </div>

              <Button size="sm" variant="outline">
                Invite
              </Button>
            </div>

            <div className="my-4 border-t" />

            <div className="flex items-center gap-3 text-sm">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                SC
              </span>
              <span>Sophia Carter</span>
              <span className="text-muted-foreground">Project manager</span>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Inset divider"
          description="Align a separator with the text column instead of the full row width."
          code={'<div className="ms-12 border-t" />'}
        >
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-muted text-xs">
                DL
              </span>

              <span>
                <b className="block text-sm">Daniel Lee</b>
                <small className="text-muted-foreground">Added a review comment</small>
              </span>
            </div>

            <div className="ms-12 border-t" />

            <div className="flex gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-muted text-xs">
                EW
              </span>

              <span>
                <b className="block text-sm">Emma Wilson</b>
                <small className="text-muted-foreground">Updated design handoff</small>
              </span>
            </div>
          </div>
        </CodeCard>
      </div>

      <Card
        className="mt-5"
        title="In context"
        description="Use dividers to turn a dense detail card into a clear sequence of sections."
      >
        <div className="max-w-2xl rounded-2xl border">
          <div className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icons.FolderKanban className="size-5" />
              </span>

              <div>
                <b>Website Redesign</b>
                <p className="text-sm text-muted-foreground">Project overview</p>
              </div>
            </div>
          </div>

          <div className="border-t" />

          <div className="grid grid-cols-3 divide-x rtl:divide-x-reverse text-center text-sm">
            <div className="p-4">
              <b className="block text-lg">82%</b>
              <small className="text-muted-foreground">Complete</small>
            </div>

            <div className="p-4">
              <b className="block text-lg">48</b>
              <small className="text-muted-foreground">Tasks</small>
            </div>

            <div className="p-4">
              <b className="block text-lg">Sep 10</b>
              <small className="text-muted-foreground">Due date</small>
            </div>
          </div>

          <div className="border-t" />

          <div className="p-5">
            <b className="text-sm">Next action</b>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete the responsive checkout review before QA handoff.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
