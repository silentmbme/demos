import { useState } from "react";
import * as Icons from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

import { cn } from "@/lib/utils";
import { getUserImage } from "@/lib/user-images";

/* =====================================================
   People Data
===================================================== */

const people = [
  ["Sophie Turner", getUserImage("Sophie Turner"), "ST"],
  ["Liam Walker", getUserImage("Liam Walker"), "LW"],
  ["Noah Bennett", getUserImage("Noah Bennett"), "NB"],
  ["Emma Brooks", getUserImage("Emma Brooks"), "EB"],
];

/* =====================================================
   Person Avatar
===================================================== */

type PersonAvatarProps = {
  person: string[];
  size?: string;
  status?: string;
};

function PersonAvatar({ person, size = "size-10", status }: PersonAvatarProps) {
  return (
    <span className="relative inline-flex">
      <Avatar className={cn(size, "ring-2 ring-card")}>
        <AvatarImage src={person[1]} alt={person[0]} className="object-cover" />

        <AvatarFallback className="bg-primary/12 text-primary">{person[2]}</AvatarFallback>
      </Avatar>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 end-0 size-3 rounded-full border-2 border-card",
            status,
          )}
        />
      )}
    </span>
  );
}

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
   Avatars Showcase
===================================================== */

export function AvatarsShowcase() {
  const [online, setOnline] = useState(true);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Avatars"
        subtitle="Profile images, fallbacks, presence signals and team grouping patterns."
        breadcrumb={["Components", "UI Elements", "Avatars"]}
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

      {/* =================================================
          Showcase Grid
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ===============================================
            Image Avatars
        =============================================== */}

        <CodeCard
          title="Image avatars"
          description="Portrait images with fallback initials at five responsive sizes."
          code={`<Avatar className="size-10">
  <AvatarImage
    src={user.avatar}
    alt={user.name}
  />
  <AvatarFallback>
    ST
  </AvatarFallback>
</Avatar>`}
        >
          <div className="flex flex-wrap items-end gap-5">
            {["size-7", "size-9", "size-11", "size-14", "size-16"].map((size, index) => (
              <div key={size} className="text-center">
                <PersonAvatar person={people[index % people.length]} size={size} />

                <small className="mt-2 block text-xs text-muted-foreground">
                  {["XS", "SM", "MD", "LG", "XL"][index]}
                </small>
              </div>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Presence Status
        =============================================== */}

        <CodeCard
          title="Presence status"
          description="Online, away, busy and offline markers remain clear at a glance."
          code={`<PersonAvatar
  person={user}
  status="bg-success"
/>`}
        >
          <div className="flex flex-wrap gap-5">
            {[
              [people[0], "bg-success", "Online"],
              [people[1], "bg-warning", "Away"],
              [people[2], "bg-destructive", "Busy"],
              [people[3], "bg-muted-foreground", "Offline"],
            ].map(([person, status, label]: any) => (
              <div key={label} className="flex items-center gap-2">
                <PersonAvatar person={person} status={status} />

                <span>
                  <b className="block text-sm">{person[0]}</b>

                  <small className="text-muted-foreground">{label}</small>
                </span>
              </div>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Fallback Initials
        =============================================== */}

        <CodeCard
          title="Fallback initials"
          description="A reliable visual identity when an image is unavailable."
          code={`<Avatar>
  <AvatarFallback>
    JC
  </AvatarFallback>
</Avatar>`}
        >
          <div className="flex flex-wrap items-center gap-4">
            {[
              ["JC", "size-9"],
              ["OH", "size-11"],
              ["AM", "size-14"],
              ["+8", "size-16"],
            ].map(([initials, size]) => (
              <div key={initials} className="text-center">
                <Avatar className={cn(size, "bg-primary/12 text-primary")}>
                  <AvatarFallback className="bg-primary/12 text-primary">{initials}</AvatarFallback>
                </Avatar>

                <small className="mt-2 block text-xs text-muted-foreground">
                  {initials === "JC" ? "User fallback" : "Initials"}
                </small>
              </div>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Avatar Groups
        =============================================== */}

        <CodeCard
          title="Avatar groups"
          description="Stacked collaborators with a clear overflow count."
          code={`<div className="flex -space-x-2 rtl:space-x-reverse">
  {users.map((user) => (
    <PersonAvatar
      person={user}
    />
  ))}

  <span>
    +3
  </span>
</div>`}
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {people.map((person) => (
                <PersonAvatar key={person[0]} person={person} size="size-11" />
              ))}

              <span className="grid size-11 place-items-center rounded-full border-2 border-card bg-muted text-xs font-semibold">
                +3
              </span>
            </div>

            <p className="text-sm text-muted-foreground">4 visible collaborators, 3 more members</p>
          </div>
        </CodeCard>

        {/* ===============================================
            Avatars In Context
        =============================================== */}

        <CodeCard
          title="In context"
          description="Compact identity rows for members, owners and reviewers."
          code={`<div className="flex items-center gap-3">
  <PersonAvatar
    person={user}
    status="bg-success"
  />

  <span>
    {user.name}
  </span>
</div>`}
        >
          <div className="divide-y rounded-xl border px-4">
            {[
              [people[0], "Product Designer", "Online", "success"],
              [people[1], "Frontend Engineer", "In a meeting", "warning"],
              [people[2], "QA Engineer", "Reviewing a pull request", "info"],
            ].map(([person, role, status, tone]: any) => (
              <div key={person[0]} className="flex items-center justify-between gap-3 py-3">
                <span className="flex min-w-0 items-center gap-3">
                  <PersonAvatar
                    person={person}
                    status={
                      tone === "success"
                        ? "bg-success"
                        : tone === "warning"
                          ? "bg-warning"
                          : "bg-info"
                    }
                  />

                  <span>
                    <b className="block text-sm">{person[0]}</b>

                    <small className="block truncate text-muted-foreground">{role}</small>
                  </span>
                </span>

                <Badge variant="dot" tone={tone}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Avatar Actions
        =============================================== */}

        <CodeCard
          title="Avatar actions"
          description="Interactive profile affordances with a user image and accessible button."
          code={`<button
  aria-label="Open Sophie Turner profile"
>
  <PersonAvatar
    person={sophie}
  />
</button>`}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setOnline(!online)}
              aria-label="Toggle Sophie presence"
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <PersonAvatar
                person={people[0]}
                size="size-16"
                status={online ? "bg-success" : "bg-muted-foreground"}
              />
            </button>

            <div>
              <b className="block">Sophie Turner</b>

              <p className="mt-1 text-sm text-muted-foreground">
                Product Designer {online ? "Available" : "Offline"}
              </p>

              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setOnline(!online)}
              >
                {online ? "Set away" : "Set online"}
              </Button>
            </div>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
