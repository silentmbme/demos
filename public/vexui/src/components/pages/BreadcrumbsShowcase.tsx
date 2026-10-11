import { useState } from "react";
import * as Icons from "lucide-react";

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
   Breadcrumb Item
===================================================== */

type CrumbProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

function Crumb({ children, active = false, onClick }: CrumbProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "max-w-44 truncate font-medium text-foreground"
          : "max-w-36 truncate text-muted-foreground hover:text-primary"
      }
    >
      {children}
    </button>
  );
}

/* =====================================================
   Breadcrumb Separator
===================================================== */

function Separator() {
  return <Icons.ChevronRight className="size-4 shrink-0 text-muted-foreground/70" />;
}

/* =====================================================
   Breadcrumbs Showcase
===================================================== */

export function BreadcrumbsShowcase() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [current, setCurrent] = useState("Product details");

  const [shortPath, setShortPath] = useState(false);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Breadcrumbs"
        subtitle="Show hierarchy and location while preserving clear navigation context."
        breadcrumb={["Components", "UI Elements", "Breadcrumbs"]}
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
          Breadcrumb Examples
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ===============================================
            Basic Breadcrumbs
        =============================================== */}

        <CodeCard
          title="Basic breadcrumbs"
          description="Use a familiar path for nested pages."
          code={`<Breadcrumb>
  <BreadcrumbLink>
    Projects
  </BreadcrumbLink>

  <BreadcrumbPage>
    Website Redesign
  </BreadcrumbPage>
</Breadcrumb>`}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Crumb>Home</Crumb>

            <Separator />

            <Crumb>Projects</Crumb>

            <Separator />

            <Crumb active>Website Redesign</Crumb>
          </nav>
        </CodeCard>

        {/* ===============================================
            Home Icon
        =============================================== */}

        <CodeCard
          title="With home icon"
          description="An icon can make the path start compact and recognizable."
          code={`<BreadcrumbLink>
  <Home />
  <span>Home</span>
</BreadcrumbLink>`}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Crumb>
              <Icons.Home className="size-4" />
              <span className="sr-only">Home</span>
            </Crumb>

            <Separator />

            <Crumb>eCommerce</Crumb>

            <Separator />

            <Crumb>Products</Crumb>

            <Separator />

            <Crumb active>Aperture Desk Lamp</Crumb>
          </nav>
        </CodeCard>

        {/* ===============================================
            Custom Separators
        =============================================== */}

        <CodeCard
          title="Custom separators"
          description="Use a subtle slash when it better matches the surrounding product language."
          code={`<Breadcrumb separator="/">
  ...
</Breadcrumb>`}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Crumb>Workspace</Crumb>

            <span className="text-muted-foreground">/</span>

            <Crumb>Settings</Crumb>

            <span className="text-muted-foreground">/</span>

            <Crumb active>Security</Crumb>
          </nav>
        </CodeCard>

        {/* ===============================================
            Collapsed Path
        =============================================== */}

        <CodeCard
          title="Collapsed path"
          description="Collapse long hierarchies while keeping the current location visible."
          code={`<Breadcrumb>
  <BreadcrumbLink>
    Home
  </BreadcrumbLink>

  <BreadcrumbEllipsis />

  <BreadcrumbPage>
    Current page
  </BreadcrumbPage>
</Breadcrumb>`}
        >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Crumb>Home</Crumb>

            <Separator />

            <button
              type="button"
              className="grid size-7 place-items-center rounded-md border text-muted-foreground hover:bg-muted"
              aria-label="Show hidden breadcrumb items"
            >
              <Icons.Ellipsis className="size-4" />
            </button>

            <Separator />

            <Crumb>Design system</Crumb>

            <Separator />

            <Crumb active>Buttons</Crumb>
          </nav>
        </CodeCard>

        {/* ===============================================
            Dropdown Breadcrumb
        =============================================== */}

        <CodeCard
          title="Dropdown crumb"
          description="Expose sibling routes from an intermediate breadcrumb item."
          code={`<BreadcrumbItem>
  <DropdownMenu>
    Projects
    <ChevronDown />
  </DropdownMenu>
</BreadcrumbItem>`}
        >
          <nav
            aria-label="Breadcrumb"
            className="relative flex flex-wrap items-center gap-2 text-sm"
          >
            <Crumb>Home</Crumb>

            <Separator />

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              aria-expanded={menuOpen}
            >
              Projects
              <Icons.ChevronDown className="size-3.5" />
            </button>

            <Separator />

            <Crumb active>Website Redesign</Crumb>

            {menuOpen && (
              <div className="absolute start-16 top-8 z-20 w-48 rounded-xl border bg-card p-1 shadow-lg">
                {["All projects", "Active projects", "Archived projects"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-muted"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </nav>
        </CodeCard>

        {/* ===============================================
            Responsive Breadcrumb
        =============================================== */}

        <CodeCard
          title="Responsive pattern"
          description="Hide intermediate crumbs on small layouts without hiding users current context."
          code={`<Breadcrumb className="...">
  <BreadcrumbItem className="hidden sm:block">
    ...
  </BreadcrumbItem>
</Breadcrumb>`}
        >
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setShortPath(!shortPath)}
              className="grid size-8 place-items-center rounded-lg border hover:bg-muted"
              aria-label="Back"
            >
              <Icons.ChevronLeft className="size-4" />
            </button>

            {shortPath ? (
              <>
                <Crumb>Products</Crumb>

                <Separator />

                <Crumb active>Desk Lamp</Crumb>
              </>
            ) : (
              <>
                <Crumb>Home</Crumb>

                <Separator />

                <Crumb>eCommerce</Crumb>

                <Separator />

                <Crumb>Products</Crumb>

                <Separator />

                <Crumb active>Desk Lamp</Crumb>
              </>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="ms-1"
              onClick={() => setShortPath(!shortPath)}
            >
              {shortPath ? "Full path" : "Compact"}
            </Button>
          </div>
        </CodeCard>

        {/* ===============================================
            Interactive Location
        =============================================== */}

        <CodeCard
          title="Interactive location"
          description="Bind the current crumb to route or local navigation state."
          code={`const [current, setCurrent] =
  useState("Product details");

<BreadcrumbPage>
  {current}
</BreadcrumbPage>`}
        >
          <div className="space-y-4">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
              <Crumb>eCommerce</Crumb>

              <Separator />

              <Crumb>Products</Crumb>

              <Separator />

              <Crumb active>{current}</Crumb>
            </nav>

            <div className="flex flex-wrap gap-2">
              {["Product details", "Inventory", "Reviews"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCurrent(item)}
                  className={
                    current === item
                      ? "rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                      : "rounded-lg border px-3 py-1.5 text-xs hover:bg-muted"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CodeCard>
      </div>

      {/* =================================================
          Breadcrumb In Context
      ================================================= */}

      <Card
        className="mt-5"
        title="In context"
        description="A breadcrumb can pair with a compact page header and status without competing with the title."
      >
        <div className="rounded-2xl border bg-muted/15 p-5">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs">
            <Crumb>
              <Icons.Home className="size-3.5" />
              <span className="sr-only">Home</span>
            </Crumb>

            <Separator />

            <Crumb>Projects</Crumb>

            <Separator />

            <Crumb active>Website Redesign</Crumb>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Website Redesign</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Project overview and delivery plan
              </p>
            </div>

            <Badge tone="success">On track</Badge>
          </div>
        </div>
      </Card>
    </>
  );
}
