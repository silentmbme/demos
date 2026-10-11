import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Card, PageHeader } from "@/components/dashboard/widgets";

import { cn } from "@/lib/utils";

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
   Buttons Showcase
===================================================== */

export function ButtonsShowcase() {
  const [busy, setBusy] = useState(false);

  const [period, setPeriod] = useState("Week");

  const [open, setOpen] = useState(false);

  /* ===================================================
     Save Handler
  =================================================== */

  const save = () => {
    setBusy(true);

    setTimeout(() => {
      setBusy(false);

      toast.success("Changes saved");
    }, 900);
  };

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Buttons"
        subtitle="Core variants, sizes, states and action patterns for the application."
        breadcrumb={["Components", "UI Elements", "Buttons"]}
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
            Core Variants
        =============================================== */}

        <CodeCard
          title="Core variants"
          description="Seven built-in styles via the variant prop."
          code={`<Button>
  Primary
</Button>

<Button variant="soft">
  Soft
</Button>

<Button variant="gradient">
  Gradient
</Button>

<Button variant="destructive">
  Danger
</Button>`}
        >
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>

            <Button variant="secondary">Secondary</Button>

            <Button variant="outline">Outline</Button>

            <Button variant="ghost">Ghost</Button>

            <Button variant="soft">Soft</Button>

            <Button variant="gradient">Gradient</Button>

            <Button variant="destructive">Danger</Button>
          </div>
        </CodeCard>

        {/* ===============================================
            Sizes & Icon Buttons
        =============================================== */}

        <CodeCard
          title="Sizes & icon-only"
          description="Small, medium and large text buttons with icon-square controls."
          code={`<Button size="sm">
  Small
</Button>

<Button size="lg">
  Large
</Button>

<Button
  size="icon"
  aria-label="Add"
>
  <Plus />
</Button>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>

            <Button>Medium</Button>

            <Button size="lg">Large</Button>

            <Button size="iconSm" variant="outline" aria-label="Settings">
              <Icons.Settings />
            </Button>

            <Button size="icon" variant="soft" aria-label="Add">
              <Icons.Plus />
            </Button>

            <Button size="iconLg" variant="ghost" aria-label="More">
              <Icons.MoreHorizontal />
            </Button>
          </div>
        </CodeCard>

        {/* ===============================================
            Pill Shape
        =============================================== */}

        <CodeCard
          title="Pill shape"
          description="Capsule buttons via the pill prop  available for every variant."
          code={`<Button pill>
  Get started
</Button>

<Button
  pill
  variant="outline"
>
  Learn more
</Button>`}
        >
          <div className="flex flex-wrap gap-2">
            <Button pill>Get started</Button>

            <Button pill variant="outline">
              Learn more
            </Button>

            <Button pill variant="soft">
              <Icons.UserPlus />
              Follow
            </Button>

            <Button pill variant="gradient">
              Upgrade to Pro
            </Button>
          </div>
        </CodeCard>

        {/* ===============================================
            With Icons
        =============================================== */}

        <CodeCard
          title="With icons"
          description="Leading and trailing glyphs at any size."
          code={`<Button>
  <Plus />
  New item
</Button>

<Button variant="outline">
  <Download />
  Export
</Button>

<Button variant="soft">
  Continue
  <ArrowRight />
</Button>`}
        >
          <div className="flex flex-wrap gap-2">
            <Button>
              <Icons.Plus />
              New item
            </Button>

            <Button variant="outline">
              <Icons.Download />
              Export
            </Button>

            <Button variant="soft">
              Continue
              <Icons.ArrowRight />
            </Button>

            <Button variant="destructive">
              <Icons.Trash2 />
              Delete
            </Button>
          </div>
        </CodeCard>

        {/* ===============================================
            Loading & States
        =============================================== */}

        <CodeCard
          title="Loading & states"
          description="Loading, disabled, focus ring and full-width behavior."
          code={`<Button loading={isSaving}>
  Saving
</Button>

<Button disabled>
  Disabled
</Button>

<Button className="w-full">
  Send message
</Button>`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={save}>Send message</Button>

              <Button variant="outline" loading={busy} onClick={save}>
                {busy ? "Saving" : "Save changes"}
              </Button>

              <Button disabled>Disabled</Button>

              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>

            <div>
              <p className="mb-2 text-xs text-muted-foreground">Full width</p>

              <Button className="w-full" onClick={() => toast.success("Message sent")}>
                Send message
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Tab onto any button to inspect the token-driven focus ring.
          </p>
        </CodeCard>

        {/* ===============================================
            Status Buttons
        =============================================== */}

        <CodeCard
          title="Status buttons"
          description="Solid and soft success, warning, danger and info recipes."
          code={`<Button variant="success">
  Approve
</Button>

<Button variant="warning">
  Review
</Button>

<Button variant="info">
  Details
</Button>`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="success">
                <Icons.Check />
                Approve
              </Button>

              <Button variant="warning">
                <Icons.Eye />
                Review
              </Button>

              <Button variant="destructive">
                <Icons.X />
                Reject
              </Button>

              <Button variant="info">
                <Icons.Info />
                Details
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="soft" className="text-success">
                Success
              </Button>

              <Button variant="soft" className="text-warning">
                Warning
              </Button>

              <Button variant="soft" className="text-destructive">
                Danger
              </Button>

              <Button variant="soft" className="text-info">
                Info
              </Button>
            </div>
          </div>
        </CodeCard>

        {/* ===============================================
            Button Groups
        =============================================== */}

        <CodeCard
          title="Button groups"
          description="Joined segmented control and a split action button."
          code={`<div className="inline-flex rounded-lg border">
  ...
</div>

<Button>
  Save changes
</Button>

<Button aria-label="More save actions">
  <ChevronDown />
</Button>`}
        >
          <div className="flex flex-wrap items-center gap-5">
            {/* Segmented Control */}

            <div className="inline-flex overflow-hidden rounded-lg border">
              {["Day", "Week", "Month"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={cn(
                    "px-4 py-2 text-sm",
                    item === "Week" && "border-x",
                    period === item && "bg-primary text-primary-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Split Button */}

            <div className="relative inline-flex">
              <Button onClick={() => toast.success("Changes saved")}>Save changes</Button>

              <Button
                aria-label="More save actions"
                onClick={() => setOpen(!open)}
                className="rounded-s-none border-s border-primary-foreground/25 px-2"
              >
                <Icons.ChevronDown />
              </Button>

              {open && (
                <div className="absolute end-0 top-11 z-10 w-44 rounded-lg border bg-card p-1 shadow-lg">
                  <button
                    type="button"
                    className="block w-full rounded px-3 py-2 text-start text-sm hover:bg-muted"
                    onClick={() => {
                      setOpen(false);

                      toast.message("Saved as draft");
                    }}
                  >
                    Save as draft
                  </button>

                  <button
                    type="button"
                    className="block w-full rounded px-3 py-2 text-start text-sm hover:bg-muted"
                    onClick={() => {
                      setOpen(false);

                      toast.success("Saved and published");
                    }}
                  >
                    Save & publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
