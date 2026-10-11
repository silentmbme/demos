import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
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

export function TypographyShowcase() {
  return (
    <>
      <PageHeader
        title="Typography"
        subtitle="A clear, consistent text system for hierarchy, reading, metadata and interactive content."
        breadcrumb={["Components", "UI Elements", "Typography"]}
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
          title="Display and headings"
          description="Use display text sparingly, then create hierarchy with semantic headings."
          code={
            '<h1 className="text-4xl font-semibold tracking-tight">Display heading</h1>\n<h2 className="text-2xl font-semibold">Section heading</h2>'
          }
        >
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight">Make work visible</h1>

            <h2 className="text-2xl font-semibold tracking-tight">Project performance</h2>

            <h3 className="text-xl font-semibold">This weeks priorities</h3>

            <h4 className="text-base font-semibold">Delivery checklist</h4>
          </div>
        </CodeCard>

        <CodeCard
          title="Text scale"
          description="A practical scale for supporting copy, metadata and dense tables."
          code={
            '<p className="text-base">Base text</p>\n<p className="text-sm">Supporting text</p>\n<p className="text-xs">Metadata</p>'
          }
        >
          <div className="space-y-4">
            <p className="text-lg">Large supporting message for key summaries.</p>

            <p className="text-base">
              Base text for regular interface content and readable descriptions.
            </p>

            <p className="text-sm text-muted-foreground">
              Small text works well for helper copy, rows and secondary information.
            </p>

            <p className="text-xs text-muted-foreground">
              Extra-small text is reserved for compact timestamps and metadata.
            </p>
          </div>
        </CodeCard>

        <CodeCard
          title="Body and lead"
          description="Use a lead paragraph to introduce a page, followed by comfortable body copy."
          code={
            '<p className="text-lg leading-7 text-muted-foreground">Lead paragraph</p>\n<p className="leading-7">Body paragraph</p>'
          }
        >
          <div className="max-w-2xl">
            <p className="text-lg leading-7 text-muted-foreground">
              Create a shared view of work so every team can make decisions with confidence.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              Good interface copy is direct and useful. It gives people enough context to take the
              next action without interrupting their flow.
            </p>
          </div>
        </CodeCard>

        <CodeCard
          title="Text emphasis"
          description="Use weight and tone to guide scanning before people read every word."
          code={"<strong>Strong</strong>\n<em>Emphasized</em>\n<mark>Highlighted</mark>"}
        >
          <div className="space-y-3 text-sm">
            <p>
              <strong>Strong text</strong> highlights an important value or action.
            </p>

            <p>
              <em>Emphasized text</em> adds a subtle change in tone.
            </p>

            <p>
              <mark className="rounded bg-warning/20 px-1.5 py-0.5 text-foreground">
                Highlighted text
              </mark>{" "}
              draws attention to a key phrase.
            </p>

            <p>
              <span className="line-through text-muted-foreground">Completed task</span>{" "}
              <span className="ms-2 underline underline-offset-4">Linked reference</span>
            </p>
          </div>
        </CodeCard>

        <CodeCard
          title="Links and actions"
          description="Links should stay recognizable and show a clear hover and focus state."
          code={
            '<a className="text-primary underline-offset-4 hover:underline">View documentation</a>'
          }
        >
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a
              href="#typography-link"
              onClick={(event) => {
                event.preventDefault();
                toast.success("Documentation opened");
              }}
              className="font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              View documentation
            </a>

            <a
              href="#typography-external"
              onClick={(event) => {
                event.preventDefault();
                toast.message("External link selected");
              }}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Open reference
              <Icons.ArrowUpRight className="size-3.5" />
            </a>

            <button
              onClick={() => toast.message("Inline action selected")}
              className="font-medium text-primary hover:underline"
            >
              Inline action
            </button>
          </div>
        </CodeCard>

        <CodeCard
          title="Labels and metadata"
          description="Pair a compact label with a stronger value to create easy-to-scan details."
          code={"<dl><dt>Status</dt><dd>On track</dd></dl>"}
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border p-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Project
              </dt>
              <dd className="mt-1 font-semibold">Website Redesign</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 font-semibold text-success">On track</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Owner
              </dt>
              <dd className="mt-1 font-semibold">Sophia Carter</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Updated
              </dt>
              <dd className="mt-1 font-semibold">12 minutes ago</dd>
            </div>
          </dl>
        </CodeCard>

        <CodeCard
          title="Quotes and callouts"
          description="Use quotation and indented supporting text for notes, reviews and editorial content."
          code={"<blockquote>Clear writing gives people confidence.</blockquote>"}
        >
          <div className="space-y-4">
            <blockquote className="border-s-4 border-primary ps-4 text-lg font-medium leading-7">
              A calm interface starts with calm, clear language.
            </blockquote>

            <div className="rounded-xl bg-muted/45 p-4 text-sm text-muted-foreground">
              <b className="text-foreground">Note:</b> Keep supporting messages short and close to
              the decision they support.
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Lists"
          description="Use bullets for related details and numbered lists for an ordered sequence."
          code={
            '<ul className="list-disc ps-5">...</ul>\n<ol className="list-decimal ps-5">...</ol>'
          }
        >
          <div className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <b>Included in this release</b>

              <ul className="mt-3 list-disc space-y-2 ps-5 text-muted-foreground">
                <li>Improved dashboard filtering</li>
                <li>Saved workspace views</li>
                <li>New project health signals</li>
              </ul>
            </div>

            <div>
              <b>Publish checklist</b>

              <ol className="mt-3 list-decimal space-y-2 ps-5 text-muted-foreground">
                <li>Review changes</li>
                <li>Confirm settings</li>
                <li>Publish to workspace</li>
              </ol>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Inline code and keyboard"
          description="Use monospace text for short identifiers, commands and familiar keyboard shortcuts."
          code={"<code>npm run build</code>\n<kbd>Ctrl K</kbd>"}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
              PRJ-1048
            </code>

            <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
              npm run build
            </code>

            <span className="text-muted-foreground">Open command menu</span>

            <kbd className="rounded-md border bg-muted/35 px-2 py-1 font-mono text-xs shadow-sm">
              Ctrl K
            </kbd>
          </div>
        </CodeCard>
      </div>

      <Card
        className="mt-5"
        title="Article composition"
        description="A complete reading composition for help content, release notes and detail pages."
      >
        <article className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
            Product update
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            A clearer way to run delivery reviews
          </h1>

          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            The updated project view turns progress, risk and next actions into one concise team
            conversation.
          </p>

          <div className="my-6 border-t" />

          <h2 className="text-xl font-semibold">What changed</h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            We simplified the review flow, added ownership context, and made it easier to spot
            projects that need attention before they become delayed.
          </p>

          <div className="mt-5 rounded-xl border bg-muted/20 p-4">
            <b className="text-sm">Tip</b>

            <p className="mt-1 text-sm text-muted-foreground">
              Start each review with the delivery signal, then discuss the next action and owner.
            </p>
          </div>
        </article>
      </Card>
    </>
  );
}
