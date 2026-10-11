import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, PageHeader } from "@/components/dashboard/widgets";

function PluginCard({
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

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const allTags = ["Design", "Development", "Marketing", "Product", "Research", "Customer success"];

export function FormPluginsApp() {
  const [tags, setTags] = useState(["Design", "Product"]);
  const [tagSearch, setTagSearch] = useState("");
  const [rating, setRating] = useState(4);
  const [range, setRange] = useState([48]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagSearch("");
  };

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Form plugins"
        subtitle="Enhanced controls for richer, faster data entry."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Plugin configuration saved")}>
              <Icons.Sparkles className="me-2 size-4" />
              Create configuration
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.CalendarDays className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Date & time</h2>
            <p className="text-sm text-muted-foreground">
              Schedule events with clear date and time controls.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <PluginCard title="Date range" description="Select a start and end date">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date">
                <Input type="date" defaultValue="2026-08-25" />
              </Field>

              <Field label="End date">
                <Input type="date" defaultValue="2026-08-30" />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs text-primary">
              <Icons.CalendarCheck className="size-4" /> 5-day project sprint
            </div>
          </PluginCard>

          <PluginCard title="Date & time picker" description="Choose a specific moment">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input type="date" defaultValue="2026-09-02" />
              </Field>

              <Field label="Time">
                <Input type="time" defaultValue="10:30" />
              </Field>
            </div>

            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success("Meeting scheduled")}>
                Schedule meeting
              </Button>
            </div>
          </PluginCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.Tags className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Selection controls</h2>
            <p className="text-sm text-muted-foreground">
              Searchable tags, rating, and range inputs.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <PluginCard
            title="Tag selector"
            description="Add labels to organize this project"
            className="xl:col-span-2"
          >
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
                  >
                    {tag}

                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
                      onClick={() => setTags(tags.filter((item) => item !== tag))}
                    >
                      <Icons.X className="size-3" />
                    </button>
                  </span>
                ))}

                <input
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagSearch.trim()) {
                      e.preventDefault();
                      addTag(tagSearch.trim());
                    }
                  }}
                  className="min-w-28 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Add a tag..."
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {allTags
                .filter(
                  (tag) =>
                    !tags.includes(tag) && tag.toLowerCase().includes(tagSearch.toLowerCase()),
                )
                .slice(0, 4)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </PluginCard>

          <PluginCard title="Star rating" description="Capture product feedback">
            <div className="flex gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setRating(star)}>
                  <Icons.Star
                    className={`size-7 transition ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm font-medium">{rating}.0 out of 5</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click a star to change your rating.
            </p>
          </PluginCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <PluginCard title="Range slider" description="Set a monthly spending limit">
            <div className="px-1 pt-4">
              <Slider value={range} onValueChange={setRange} max={100} step={1} />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">$0</span>

                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  ${range[0]}k
                </span>

                <span className="text-xs text-muted-foreground">$100k</span>
              </div>
            </div>
          </PluginCard>

          <PluginCard title="Input mask" description="Formatted card number field">
            <Field label="Card number">
              <div className="relative">
                <Icons.CreditCard className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  className="ps-9"
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 16);

                    event.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                  }}
                />
              </div>
            </Field>

            <p className="mt-3 text-xs text-muted-foreground">
              Spaces are added automatically as you type.
            </p>
          </PluginCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Icons.CloudUpload className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Files & rich input</h2>
            <p className="text-sm text-muted-foreground">
              Upload assets and capture detailed notes.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <PluginCard title="File upload" description="Drop files or browse from your computer">
            <input
              ref={fileInput}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setFiles(Array.from(event.dataTransfer.files));
              }}
              className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-5 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icons.UploadCloud className="size-5" />
              </span>

              <p className="mt-3 text-sm font-medium">Drop files here or click to browse</p>

              <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, PDF up to 10 MB</p>
            </button>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icons.FileText className="size-4 text-primary" />
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((item) => item !== file))}
                    >
                      <Icons.X className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </PluginCard>

          <PluginCard
            title="Rich text composer"
            description="A simple formatting toolbar for long-form input"
          >
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center gap-1 border-b border-border bg-muted/30 p-2">
                {[Icons.Bold, Icons.Italic, Icons.Underline, Icons.Link, Icons.List].map(
                  (Icon, index) => (
                    <button
                      type="button"
                      key={index}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
                    >
                      <Icon className="size-3.5" />
                    </button>
                  ),
                )}
              </div>

              <Textarea
                className="min-h-32 resize-none border-0 focus-visible:ring-0"
                placeholder="Write a project update..."
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => toast.success("Draft saved")}>
                Save draft
              </Button>
            </div>
          </PluginCard>
        </div>
      </section>
    </div>
  );
}
