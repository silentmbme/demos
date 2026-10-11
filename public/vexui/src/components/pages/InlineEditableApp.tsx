import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, PageHeader } from "@/components/dashboard/widgets";

function DemoCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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

      <div className="p-5">{children}</div>
    </Card>
  );
}

function EditableText({
  value,
  onSave,
  multiline = false,
  className = "",
}: {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onSave(draft);
    setEditing(false);
    toast.success("Saved");
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <div className="relative">
          {multiline ? (
            <Textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-24 pe-9"
            />
          ) : (
            <Input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="pe-9"
            />
          )}

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="absolute end-2 top-2 text-muted-foreground"
          >
            <Icons.X className="size-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={commit}>
            <Icons.Check className="me-1.5 size-3.5" />
            Save
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`group flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-transparent px-2 py-1.5 text-start transition hover:border-primary/30 hover:bg-primary/5 ${className}`}
    >
      <span>{value}</span>
      <Icons.Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}

export function InlineEditableApp() {
  const [name, setName] = useState("Elena Marquez");
  const [role, setRole] = useState("Operations Lead");
  const [bio, setBio] = useState(
    "Leading operations, customer experience, and scalable internal systems.",
  );
  const [status, setStatus] = useState("In progress");
  const [tags, setTags] = useState(["Design", "Product"]);
  const [tagDraft, setTagDraft] = useState("");

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Inline editable"
        subtitle="Edit values directly where they appear, without leaving the page."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("All changes synced")}>
              <Icons.CloudCheck className="me-2 size-4" />
              Sync changes
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.MousePointerClick className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Click to edit</h2>
            <p className="text-sm text-muted-foreground">
              Hover over a value, then click to edit it inline.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <DemoCard title="Simple text" description="Enter saves, Escape cancels">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Project name</p>

              <EditableText
                value="Website redesign"
                onSave={() => {}}
                className="text-lg font-semibold"
              />

              <p className="pt-2 text-xs text-muted-foreground">Try clicking the value above.</p>
            </div>
          </DemoCard>

          <DemoCard title="Inline select" description="Change a record status">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Current status</p>

              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  toast.success("Status updated");
                }}
                className={`h-10 w-full rounded-lg border px-3 text-sm font-medium ${
                  status === "Complete"
                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-700"
                    : status === "Blocked"
                      ? "border-destructive bg-destructive/5 text-destructive"
                      : "border-amber-500 bg-amber-500/5 text-amber-700"
                }`}
              >
                <option>In progress</option>
                <option>Complete</option>
                <option>Blocked</option>
              </select>

              <p className="text-xs text-muted-foreground">
                Select a new option to save immediately.
              </p>
            </div>
          </DemoCard>

          <DemoCard title="Editable date" description="Use a native date editor">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Launch date</p>

              <Input
                type="date"
                defaultValue="2026-09-15"
                onChange={() => toast.success("Launch date updated")}
              />

              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <Icons.CalendarDays className="size-4 text-primary" />
                Expected launch: Sep 15, 2026
              </div>
            </div>
          </DemoCard>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <DemoCard
          title="Editable profile"
          description="A polished profile card with in-place editing"
        >
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-primary text-xl font-bold text-white">
              EM
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Full name</p>
                <EditableText value={name} onSave={setName} className="text-xl font-semibold" />
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Role</p>
                <EditableText value={role} onSave={setRole} className="text-sm font-medium" />
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">About</p>
                <EditableText
                  value={bio}
                  onSave={setBio}
                  multiline
                  className="text-sm leading-6 text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </DemoCard>

        <DemoCard title="Details table" description="Table cells can be edited too">
          <div className="divide-y divide-border text-sm">
            {[
              ["Account owner", "Elena Marquez"],
              ["Department", "Operations"],
              ["Cost centre", "OPS-404"],
              ["Budget", "$48,000"],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[110px_1fr] items-center gap-3 py-3">
                <span className="text-xs text-muted-foreground">{label}</span>

                <EditableText value={value} onSave={() => {}} className="font-medium" />
              </div>
            ))}
          </div>
        </DemoCard>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.Tags className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Rich inline controls</h2>
            <p className="text-sm text-muted-foreground">
              Use inline editing for tags, amounts, and record details.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <DemoCard title="Editable tags" description="Add and remove tags without opening a modal">
            <div className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() => {
                        setTags(tags.filter((item) => item !== tag));
                        toast.success("Tag removed");
                      }}
                    >
                      <Icons.X className="size-3" />
                    </button>
                  </span>
                ))}

                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagDraft.trim()) {
                      e.preventDefault();
                      setTags([...tags, tagDraft.trim()]);
                      setTagDraft("");
                      toast.success("Tag added");
                    }
                  }}
                  className="min-w-28 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Add a tag..."
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">Press Enter to add the typed tag.</p>
          </DemoCard>

          <DemoCard title="Quick edit row" description="Edit an item directly from a list">
            <div className="divide-y divide-border">
              <div className="flex items-center gap-3 py-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Icons.FileText className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <EditableText
                    value="Q3 operations plan"
                    onSave={() => {}}
                    className="text-sm font-medium"
                  />
                  <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
                </div>

                <button type="button" onClick={() => toast.success("Item starred")}>
                  <Icons.Star className="size-4 text-muted-foreground hover:text-amber-500" />
                </button>
              </div>

              <div className="flex items-center gap-3 py-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Icons.FileSpreadsheet className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <EditableText
                    value="Budget forecast"
                    onSave={() => {}}
                    className="text-sm font-medium"
                  />
                  <p className="text-xs text-muted-foreground">Updated yesterday</p>
                </div>

                <button type="button" onClick={() => toast.success("Item starred")}>
                  <Icons.Star className="size-4 text-muted-foreground hover:text-amber-500" />
                </button>
              </div>
            </div>
          </DemoCard>
        </div>
      </section>
    </div>
  );
}
