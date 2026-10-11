import { useMemo, useState, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EditorCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {children}
    </Card>
  );
}

const toolGroups = [
  [Icons.Undo2, Icons.Redo2],
  [Icons.Bold, Icons.Italic, Icons.Underline, Icons.Strikethrough],
  [Icons.Heading1, Icons.List, Icons.ListOrdered, Icons.Quote],
  [Icons.Link, Icons.Image, Icons.Code2],
];

export function EditorsApp() {
  const [documentTitle, setDocumentTitle] = useState("Q3 operations planning");

  const [markdown, setMarkdown] = useState(
    `# Weekly product update

## Highlights
- New dashboard experience is ready for review
- Performance improved by **28%** this month
- Mobile navigation is now available

> Keep the update short and easy to scan.

[Open the workspace](#)`,
  );

  const [recipient, setRecipient] = useState("team@vexuiadmin.com");

  const preview = useMemo(
    () =>
      markdown.split("\n").map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 className="text-xl font-bold" key={index}>
              {line.slice(2)}
            </h1>
          );
        }

        if (line.startsWith("## ")) {
          return (
            <h2 className="mt-4 text-base font-semibold" key={index}>
              {line.slice(3)}
            </h2>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <div className="flex gap-2 text-sm" key={index}>
              <span className="text-primary"></span>
              <span>{line.slice(2).replace(/\*\*/g, "")}</span>
            </div>
          );
        }

        if (line.startsWith("> ")) {
          return (
            <blockquote
              className="my-3 border-s-2 border-primary ps-3 text-sm italic text-muted-foreground"
              key={index}
            >
              {line.slice(2)}
            </blockquote>
          );
        }

        if (line.startsWith("[")) {
          return (
            <a
              className="text-sm text-primary underline"
              href="#"
              onClick={(event) => event.preventDefault()}
              key={index}
            >
              Open the workspace
            </a>
          );
        }

        return line ? (
          <p className="text-sm leading-6 text-muted-foreground" key={index}>
            {line}
          </p>
        ) : (
          <div className="h-2" key={index} />
        );
      }),
    [markdown],
  );

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Editors"
        subtitle="Create polished updates, documentation, and customer messages."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("All editor drafts saved")}>
              <Icons.CloudCheck className="me-2 size-4" />
              Save all
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.PenTool className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Rich text editor</h2>
            <p className="text-sm text-muted-foreground">
              A full writing surface with familiar formatting controls.
            </p>
          </div>
        </div>

        <EditorCard title="Project brief" description="Autosaves changes as you work">
          <div className="border-b border-border px-5 py-4">
            <Input
              value={documentTitle}
              onChange={(event) => setDocumentTitle(event.target.value)}
              className="h-auto border-0 px-0 text-2xl font-bold shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 px-4 py-2">
            {toolGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex items-center gap-0.5 border-e border-border pe-2 last:border-e-0"
              >
                {group.map((Icon, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toast.message("Formatting tool selected")}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-background hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="min-h-64 p-6">
            <p className="text-sm leading-7 text-foreground">
              This quarter, we are focusing on faster customer operations and clearer team
              workflows.
            </p>

            <h3 className="mt-5 text-lg font-semibold">Objectives</h3>

            <ul className="mt-3 list-disc space-y-1 ps-5 text-sm leading-6 text-muted-foreground">
              <li>Reduce the support response time by 20%</li>
              <li>Make weekly planning visible to every team</li>
              <li>Ship the mobile navigation experience</li>
            </ul>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Use the toolbar above to style content. This area is designed as a clean long-form
              editing surface.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3">
            <span className="text-xs text-muted-foreground">Last saved just now</span>

            <Button size="sm" onClick={() => toast.success("Project brief published")}>
              Publish brief
            </Button>
          </div>
        </EditorCard>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.CodeXml className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Markdown editor</h2>
            <p className="text-sm text-muted-foreground">
              Write Markdown on the left and inspect the output on the right.
            </p>
          </div>
        </div>

        <EditorCard title="Release notes" description="Live Markdown preview">
          <div className="grid min-h-80 lg:grid-cols-2">
            <div className="border-b border-border lg:border-b-0 lg:border-e">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">MARKDOWN</span>
                <Icons.Code2 className="size-4 text-muted-foreground" />
              </div>

              <Textarea
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                spellCheck={false}
                className="min-h-72 resize-none rounded-none border-0 font-mono text-xs leading-6 focus-visible:ring-0"
              />
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">PREVIEW</span>
                <Icons.Eye className="size-4 text-muted-foreground" />
              </div>

              <div className="min-h-72 space-y-2 p-5">{preview}</div>
            </div>
          </div>

          <div className="flex justify-end border-t border-border px-5 py-3">
            <Button size="sm" onClick={() => toast.success("Release notes saved")}>
              Save notes
            </Button>
          </div>
        </EditorCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <EditorCard
          title="Email composer"
          description="A focused layout for customer communication"
        >
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <div>
                <Label className="text-xs">To</Label>
                <Input
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs">Template</Label>
                <select className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                  <option>Product update</option>
                  <option>Meeting follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Subject</Label>
              <Input className="mt-1.5" defaultValue="Your weekly workspace update" />
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex gap-1 border-b border-border bg-muted/30 p-2">
                {[Icons.Bold, Icons.Italic, Icons.Link, Icons.Smile, Icons.Paperclip].map(
                  (Icon, index) => (
                    <button
                      type="button"
                      onClick={() => toast.message("Editor action selected")}
                      key={index}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background"
                    >
                      <Icon className="size-3.5" />
                    </button>
                  ),
                )}
              </div>

              <Textarea
                className="min-h-40 resize-none border-0 focus-visible:ring-0"
                defaultValue={`Hi team,

Here is a quick overview of what changed in your workspace this week.

Best,
Elena`}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => toast.success("Draft saved")}>
                Save draft
              </Button>

              <Button size="sm" onClick={() => toast.success(`Email sent to ${recipient}`)}>
                <Icons.Send className="me-2 size-3.5" />
                Send email
              </Button>
            </div>
          </div>
        </EditorCard>

        <EditorCard title="Writing tools" description="Helpful actions beside the editor">
          <div className="space-y-2 p-5">
            {[
              [Icons.Sparkles, "Improve writing", "Make this clearer and more concise"],
              [Icons.SpellCheck2, "Check spelling", "Review grammar and spelling"],
              [Icons.Languages, "Translate", "Translate into another language"],
              [Icons.FileText, "Summarize", "Create a short summary"],
            ].map(([Icon, title, detail]) => {
              const ToolIcon = Icon as Icons.LucideIcon;

              return (
                <button
                  type="button"
                  key={title as string}
                  onClick={() => toast.success(`${title} complete`)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-start transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ToolIcon className="size-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </EditorCard>
      </section>
    </div>
  );
}
