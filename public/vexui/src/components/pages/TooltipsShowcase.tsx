import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

function Tip({
  label,
  children,
  side = "top",
  contentClassName = "",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  contentClassName?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent side={side} className={contentClassName}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function TooltipsShowcase() {
  const [delay, setDelay] = useState(250);

  return (
    <TooltipProvider delayDuration={delay} skipDelayDuration={150}>
      <PageHeader
        title="Tooltips"
        subtitle="Compact contextual guidance for controls, data and unfamiliar actions."
        breadcrumb={["Components", "UI Elements", "Tooltips"]}
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
          title="Basic tooltip"
          description="Add a concise label to an icon-only action."
          code={
            '<Tooltip>\n  <TooltipTrigger asChild><Button size="icon">...</Button></TooltipTrigger>\n  <TooltipContent>Edit project</TooltipContent>\n</Tooltip>'
          }
        >
          <div className="flex flex-wrap gap-3">
            <Tip label="Edit project">
              <Button size="icon" variant="outline" aria-label="Edit project">
                <Icons.Pencil className="size-4" />
              </Button>
            </Tip>

            <Tip label="Duplicate project">
              <Button size="icon" variant="outline" aria-label="Duplicate project">
                <Icons.Copy className="size-4" />
              </Button>
            </Tip>

            <Tip label="Delete project">
              <Button size="icon" variant="outline" aria-label="Delete project">
                <Icons.Trash2 className="size-4" />
              </Button>
            </Tip>
          </div>
        </CodeCard>

        <CodeCard
          title="Positions"
          description="Place the tooltip where it has the most room around the trigger."
          code={
            '<TooltipContent side="top">Top</TooltipContent>\n<TooltipContent side="right">Right</TooltipContent>'
          }
        >
          <div className="grid max-w-xs grid-cols-3 place-items-center gap-4 py-2">
            <span />

            <Tip side="top" label="Top">
              <button className="grid size-10 place-items-center rounded-xl border hover:border-primary">
                <Icons.ArrowUp className="size-4" />
              </button>
            </Tip>

            <span />

            <Tip side="left" label="Left">
              <button className="grid size-10 place-items-center rounded-xl border hover:border-primary">
                <Icons.ArrowLeft className="size-4" />
              </button>
            </Tip>

            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icons.MousePointer2 className="size-4" />
            </span>

            <Tip side="right" label="Right">
              <button className="grid size-10 place-items-center rounded-xl border hover:border-primary">
                <Icons.ArrowRight className="size-4" />
              </button>
            </Tip>

            <span />

            <Tip side="bottom" label="Bottom">
              <button className="grid size-10 place-items-center rounded-xl border hover:border-primary">
                <Icons.ArrowDown className="size-4" />
              </button>
            </Tip>

            <span />
          </div>
        </CodeCard>

        <CodeCard
          title="Toolbar actions"
          description="Keep a familiar command label close to each compact toolbar action."
          code={"<TooltipContent>Archive project</TooltipContent>"}
        >
          <div className="inline-flex rounded-xl border bg-muted/20 p-1">
            <Tip label="Undo">
              <button className="grid size-9 place-items-center rounded-lg hover:bg-background">
                <Icons.Undo2 className="size-4" />
              </button>
            </Tip>

            <Tip label="Redo">
              <button className="grid size-9 place-items-center rounded-lg hover:bg-background">
                <Icons.Redo2 className="size-4" />
              </button>
            </Tip>

            <span className="my-1 w-px bg-border" />

            <Tip label="Download export">
              <button className="grid size-9 place-items-center rounded-lg hover:bg-background">
                <Icons.Download className="size-4" />
              </button>
            </Tip>

            <Tip label="Share">
              <button className="grid size-9 place-items-center rounded-lg hover:bg-background">
                <Icons.Share2 className="size-4" />
              </button>
            </Tip>

            <Tip label="More options">
              <button className="grid size-9 place-items-center rounded-lg hover:bg-background">
                <Icons.Ellipsis className="size-4" />
              </button>
            </Tip>
          </div>
        </CodeCard>

        <CodeCard
          title="Status explanation"
          description="Explain a badge or indicator without expanding the table layout."
          code={"<TooltipContent>Deployment is healthy and all checks passed.</TooltipContent>"}
        >
          <div className="space-y-3 rounded-xl border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Production API</span>

              <Tip label="Deployment is healthy and all checks passed.">
                <span
                  tabIndex={0}
                  className="inline-flex cursor-help items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                >
                  <span className="size-1.5 rounded-full bg-success" />
                  Operational
                </span>
              </Tip>
            </div>

            <div className="flex items-center justify-between">
              <span>Background jobs</span>

              <Tip label="Queue delay is above the target of 5 minutes.">
                <span
                  tabIndex={0}
                  className="inline-flex cursor-help items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning"
                >
                  <span className="size-1.5 rounded-full bg-warning" />
                  Delayed
                </span>
              </Tip>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Rich tooltip"
          description="Use a richer surface when users need helpful detail or a keyboard shortcut."
          code={
            '<TooltipContent className="w-56 p-3">\n  <b>Command palette</b>\n  <p>Search actions and pages.</p>\n</TooltipContent>'
          }
        >
          <Tip
            label={
              <div className="w-56 p-1">
                <b className="block text-sm">Command palette</b>

                <p className="mt-1 leading-5 text-primary-foreground/80">
                  Search pages, projects and actions from anywhere.
                </p>

                <kbd className="mt-3 inline-flex rounded border border-primary-foreground/25 px-1.5 py-0.5 text-[10px]">
                  Ctrl K
                </kbd>
              </div>
            }
            contentClassName="p-3"
          >
            <Button variant="soft">
              <Icons.Command className="me-2 size-4" />
              Open command palette
            </Button>
          </Tip>
        </CodeCard>

        <CodeCard
          title="Delay and focus"
          description="Tooltips work with keyboard focus and can use a configurable opening delay."
          code={
            "<TooltipProvider delayDuration={250}>\n  <Tooltip>...</Tooltip>\n</TooltipProvider>"
          }
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Delay</span>

              {[0, 250, 700].map((value) => (
                <button
                  key={value}
                  onClick={() => setDelay(value)}
                  className={
                    delay === value
                      ? "rounded-lg bg-primary px-2.5 py-1.5 text-xs text-primary-foreground"
                      : "rounded-lg border px-2.5 py-1.5 text-xs hover:bg-muted"
                  }
                >
                  {value}ms
                </button>
              ))}
            </div>

            <Tip label="Use Tab to focus this button.">
              <Button variant="outline">Keyboard focus</Button>
            </Tip>
          </div>
        </CodeCard>
      </div>
    </TooltipProvider>
  );
}
