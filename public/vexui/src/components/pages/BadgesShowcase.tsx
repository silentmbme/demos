import { useState } from "react";
import * as Icons from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, Badge, Card, PageHeader } from "@/components/dashboard/widgets";

import { cn } from "@/lib/utils";
import { getUserImage } from "@/lib/user-images";

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

/* =====================================================
   Badge Tones
===================================================== */

type BadgeTone = "muted" | "primary" | "success" | "warning" | "danger" | "info";

const tones: [BadgeTone, string][] = [
  ["muted", "neutral"],
  ["primary", "primary"],
  ["success", "success"],
  ["warning", "warning"],
  ["danger", "danger"],
  ["info", "info"],
];

/* =====================================================
   Badges Showcase
===================================================== */

export function BadgesShowcase() {
  const [tags, setTags] = useState(["Design", "Engineering", "Marketing", "Research"]);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Badges"
        subtitle="Status labels, chips, counts and identity patterns for the application."
        breadcrumb={["Components", "UI Elements", "Badges"]}
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

      <div className="grid gap-5">
        {/* ===============================================
            Soft Badges
        =============================================== */}

        <CodeCard
          title="Soft"
          description="Tinted pills  the default variant, six tones."
          code={`<Badge>
  neutral
</Badge>

<Badge tone="primary">
  primary
</Badge>

<Badge tone="success">
  success
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            {tones.map(([tone, label]) => (
              <Badge key={tone} tone={tone}>
                {label}
              </Badge>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Solid Badges
        =============================================== */}

        <CodeCard
          title="Solid"
          description="High-contrast fills via variant=solid."
          code={`<Badge
  variant="solid"
  tone="primary"
>
  primary
</Badge>

<Badge
  variant="solid"
  tone="danger"
>
  danger
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            {tones.map(([tone, label]) => (
              <Badge key={tone} tone={tone} variant="solid">
                {label}
              </Badge>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Outline Badges
        =============================================== */}

        <CodeCard
          title="Outline"
          description="Border-only chips via variant=outline."
          code={`<Badge
  variant="outline"
  tone="info"
>
  info
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            {tones.map(([tone, label]) => (
              <Badge key={tone} tone={tone} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Status Dot
        =============================================== */}

        <CodeCard
          title="Status dot"
          description="Surface chip, with tone applied to the status dot."
          code={`<Badge
  variant="dot"
  tone="success"
>
  Operational
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="dot" tone="success">
              Operational
            </Badge>

            <Badge variant="dot" tone="warning">
              Degraded
            </Badge>

            <Badge variant="dot" tone="danger">
              Outage
            </Badge>

            <Badge variant="dot" tone="info">
              Deploying
            </Badge>

            <Badge variant="dot">Offline</Badge>
          </div>
        </CodeCard>

        {/* ===============================================
            Sizes
        =============================================== */}

        <CodeCard
          title="Sizes"
          description="Small, medium and large across badge variants."
          code={`<Badge size="sm">
  Small
</Badge>

<Badge>
  Medium
</Badge>

<Badge size="lg">
  Large
</Badge>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm">Small</Badge>

            <Badge tone="primary">Medium</Badge>

            <Badge size="lg" tone="success">
              Large
            </Badge>

            <Badge size="lg" variant="outline">
              v2.4.0
            </Badge>

            <Badge size="lg" variant="dot" tone="success">
              All systems go
            </Badge>
          </div>
        </CodeCard>

        {/* ===============================================
            Removable Chips
        =============================================== */}

        <CodeCard
          title="Removable chips"
          description="Trailing  via the onRemove prop."
          code={`<Badge
  onRemove={() =>
    removeTag("Design")
  }
>
  Design
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={tag}
                tone={tones[(index + 1) % tones.length][0]}
                onRemove={() => setTags((items) => items.filter((item) => item !== tag))}
              >
                {tag}
              </Badge>
            ))}

            {!tags.length && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTags(["Design", "Engineering", "Marketing", "Research"])}
              >
                Restore tags
              </Button>
            )}
          </div>
        </CodeCard>

        {/* ===============================================
            Badges In Context
        =============================================== */}

        <CodeCard
          title="In context"
          description="Counts on icons and statuses inside useful list rows."
          code={`<Badge tone="primary">
  PRO
</Badge>

<Badge
  variant="dot"
  tone="success"
>
  Paid
</Badge>`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Icon Counters */}

            <div className="flex flex-wrap gap-5">
              <span className="relative grid size-10 place-items-center rounded-lg border">
                <Icons.Bell className="size-5" />

                <Badge tone="danger" size="sm" className="absolute">
                  6
                </Badge>
              </span>

              <span className="relative grid size-10 place-items-center rounded-lg border">
                <Icons.MessageSquare className="size-5" />

                <span className="absolute -end-2 -top-2">
                  <Badge tone="primary" size="sm">
                    24
                  </Badge>
                </span>
              </span>

              {/* User Identity */}

              <span className="flex items-center gap-2">
                <Avatar initials="LW" />

                <b className="text-sm">Liam Walker</b>

                <Badge tone="primary">PRO</Badge>
              </span>
            </div>

            {/* Status Rows */}

            <div className="divide-y rounded-xl border px-4">
              {[
                ["Order #3201", "Paid", "success"],
                ["Order #3202", "Pending", "warning"],
                ["Server", "Down", "danger"],
              ].map(([label, status, tone]) => (
                <div key={label} className="flex items-center justify-between py-3 text-sm">
                  <b>{label}</b>

                  <Badge variant="dot" tone={tone as BadgeTone}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CodeCard>

        {/* ===============================================
            Avatar Examples
        =============================================== */}

        <CodeCard
          title="Avatars"
          description="Sizes, presence, fallback and stacked group."
          code={`<Avatar initials="JC" />

<Badge
  variant="dot"
  tone="success"
>
  Online
</Badge>`}
        >
          <div className="flex flex-wrap items-center gap-5">
            {[
              ["Sophie Turner", getUserImage("Sophie Turner"), "size-7"],
              ["Liam Walker", getUserImage("Liam Walker"), "size-9"],
              ["Noah Bennett", getUserImage("Noah Bennett"), "size-11"],
              ["Emma Brooks", getUserImage("Emma Brooks"), "size-14"],
            ].map(([name, src, size]) => (
              <span key={name} className="flex items-center gap-2">
                <img
                  src={src}
                  alt={name}
                  className={cn("rounded-full border-2 border-card object-cover", size)}
                />

                <span className="text-sm">{name}</span>
              </span>
            ))}

            {/* Fallback Avatar */}

            <Avatar initials="JC" />

            {/* Stacked Avatar Group */}

            <span className="flex -space-x-2 rtl:space-x-reverse">
              {[
                getUserImage("Sophie Turner"),
                getUserImage("Liam Walker"),
                getUserImage("Noah Bennett"),
                getUserImage("Emma Brooks"),
              ].map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`User ${index + 1}`}
                  className="size-9 rounded-full border-2 border-card object-cover"
                />
              ))}

              <span className="grid size-9 place-items-center rounded-full border-2 border-card bg-muted text-xs">
                +3
              </span>
            </span>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
