import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { localImages } from "@/lib/local-images";

import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

/* =====================================================
   Code Card
===================================================== */

type CodeCardProps = {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
};

function CodeCard({ title, description, code, children }: CodeCardProps) {
  const [show, setShow] = useState(false);

  return (
    <Card
      title={title}
      description={description}
      action={
        <Button size="sm" variant="ghost" onClick={() => setShow((current) => !current)}>
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

/* =====================================================
   Chips Showcase
===================================================== */

export function ChipsShowcase() {
  const [tags, setTags] = useState(["Design", "Frontend", "Priority"]);

  const [input, setInput] = useState("");

  const [filters, setFilters] = useState(["Active"]);

  /* ===================================================
     Remove Tag
  =================================================== */

  const remove = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  /* ===================================================
     Add Tag
  =================================================== */

  const addTag = () => {
    const value = input.trim();

    if (value && !tags.includes(value)) {
      setTags((current) => [...current, value]);

      setInput("");
    }
  };

  /* ===================================================
     Toggle Filter
  =================================================== */

  const toggle = (filter: string) => {
    setFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
  };

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Chips & Tags"
        subtitle="Compact labels for filters, people, status, input values and selected options."
        breadcrumb={["Components", "UI Elements", "Chips & Tags"]}
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
        {/* =================================================
            Basic Chips
        ================================================= */}

        <CodeCard
          title="Basic chips"
          description="Use compact rounded labels for simple categories and context."
          code={`<Chip>Design</Chip>
<Chip tone="primary">Frontend</Chip>`}
        >
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1.5 text-sm">Neutral</span>

            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
              Primary
            </span>

            <span className="rounded-full bg-success/10 px-3 py-1.5 text-sm text-success">
              Success
            </span>

            <span className="rounded-full bg-warning/10 px-3 py-1.5 text-sm text-warning">
              Warning
            </span>

            <span className="rounded-full bg-destructive/10 px-3 py-1.5 text-sm text-destructive">
              Danger
            </span>
          </div>
        </CodeCard>

        {/* =================================================
            Removable Tags
        ================================================= */}

        <CodeCard
          title="Removable tags"
          description="Let users remove selected values without reopening a full filter menu."
          code={`<Chip onRemove={() => remove(tag)}>
  {tag}
</Chip>`}
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => remove(tag)}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary"
              >
                <span>{tag}</span>

                <Icons.X className="size-3.5 text-muted-foreground" />
              </button>
            ))}

            {!tags.length && (
              <Button size="sm" onClick={() => setTags(["Design", "Frontend", "Priority"])}>
                Restore tags
              </Button>
            )}
          </div>
        </CodeCard>

        {/* =================================================
            Input Tags
        ================================================= */}

        <CodeCard
          title="Input tags"
          description="Turn text input into tokenized values for labels, recipients and attributes."
          code={`<input onKeyDown={addOnEnter} />

{tags.map((tag) => (
  <Chip>{tag}</Chip>
))}`}
        >
          <div className="rounded-xl border p-2">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary"
                >
                  {tag}

                  <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
                    <Icons.X className="size-3" />
                  </button>
                </span>
              ))}

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type and press Enter"
                className="h-7 min-w-32 flex-1 bg-transparent px-1 text-sm outline-none"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Press Enter to add a tag.</p>
        </CodeCard>

        {/* =================================================
            Filter Chips
        ================================================= */}

        <CodeCard
          title="Filter chips"
          description="Use toggleable chips for multi-select filtering without a large control bar."
          code={`<FilterChip
  selected={selected}
  onClick={toggle}
>
  Active
</FilterChip>`}
        >
          <div className="flex flex-wrap gap-2">
            {["Active", "Planning", "At risk", "Completed"].map((filter) => {
              const selected = filters.includes(filter);

              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => toggle(filter)}
                  className={
                    selected
                      ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                      : "rounded-full border px-3 py-1.5 text-sm hover:bg-muted"
                  }
                >
                  {selected && <Icons.Check className="size-3.5" />}

                  {filter}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {filters.length
              ? `${filters.join(", ")} filter${filters.length > 1 ? "s" : ""} active`
              : "No filters selected"}
          </p>
        </CodeCard>

        {/* =================================================
            Status Chips
        ================================================= */}

        <CodeCard
          title="Status chips"
          description="Pair a surface, icon or dot with a concise operational state."
          code={`<StatusChip tone="success" dot>
  Operational
</StatusChip>`}
        >
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              <span className="size-2 rounded-full bg-success" />
              Operational
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              <span className="size-2 rounded-full bg-warning" />
              Degraded
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              <span className="size-2 rounded-full bg-destructive" />
              Outage
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              <Icons.LoaderCircle className="size-3 animate-spin text-info" />
              Deploying
            </span>
          </div>
        </CodeCard>

        {/* =================================================
            Avatar Chips
        ================================================= */}

        <CodeCard
          title="Avatar chips"
          description="Include people or teams without losing the compact tag footprint."
          code={`<Chip>
  <Avatar />
  Sophia Carter
</Chip>`}
        >
          <div className="flex flex-wrap gap-2">
            {[
              ["Sophia Carter", localImages.sophiaCarter],
              ["Daniel Lee", localImages.user2],
              ["Emma Wilson", localImages.user3],
            ].map(([name, image]) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border bg-card py-1 ps-1 pe-3 text-sm"
              >
                <img src={image} alt={name} className="size-6 rounded-full object-cover" />

                {name}
              </span>
            ))}
          </div>
        </CodeCard>

        {/* =================================================
            Icon Chips
        ================================================= */}

        <CodeCard
          title="Icon chips"
          description="Use an icon to improve recognition for common types and locations."
          code={`<Chip icon={<Folder />}>
  Design files
</Chip>`}
        >
          <div className="flex flex-wrap gap-2">
            {[
              [Icons.Folder, "Design files", "text-primary bg-primary/10"],
              [Icons.Calendar, "Due this week", "text-warning bg-warning/10"],
              [Icons.Users, "Product team", "text-info bg-info/10"],
              [Icons.MapPin, "San Francisco", "text-success bg-success/10"],
            ].map(([Icon, label, tone]: any) => (
              <button
                type="button"
                key={label}
                onClick={() => toast.message(`${label} selected`)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${tone}`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        </CodeCard>

        {/* =================================================
            Counts and Overflow
        ================================================= */}

        <CodeCard
          title="Counts and overflow"
          description="Use count chips to summarize selections and collapse long tag sets."
          code={`<Chip>
  Design
  <span>6</span>
</Chip>`}
        >
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              Design
              <b className="grid size-5 place-items-center rounded-full bg-muted text-[10px]">6</b>
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              Comments
              <b className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                24
              </b>
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
              +8 more
            </span>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
