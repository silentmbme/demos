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
   Cards Showcase
===================================================== */

export function CardsShowcase() {
  const [selected, setSelected] = useState("Pro");
  const [saved, setSaved] = useState(false);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Cards"
        subtitle="Flexible content surfaces for summaries, records, media, actions and selectable options."
        breadcrumb={["Components", "UI Elements", "Cards"]}
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
          Basic Cards
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ===============================================
            Metric Card
        =============================================== */}

        <CodeCard
          title="Metric card"
          description="A compact dashboard card for one primary number and its trend."
          code={`<Card>
  <Metric
    value="$84,240"
    trend="+12.4%"
  />
</Card>`}
        >
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5">
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Icons.WalletCards className="size-5" />
              </span>

              <Badge tone="success">+12.4%</Badge>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">Monthly revenue</p>

            <b className="mt-1 block text-3xl">$84,240</b>

            <p className="mt-2 text-xs text-muted-foreground">Compared to $74,916 last month</p>
          </div>
        </CodeCard>

        {/* ===============================================
            Profile Card
        =============================================== */}

        <CodeCard
          title="Profile card"
          description="Combine identity, role, availability and one clear action."
          code={`<Card>
  <Avatar />
  <ProfileMeta />
  <Button>
    Message
  </Button>
</Card>`}
        >
          <div className="flex items-center gap-4 rounded-2xl border p-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
              EM
            </span>

            <div className="min-w-0 flex-1">
              <b className="block truncate">Elena Marquez</b>

              <p className="mt-1 text-sm text-muted-foreground">Operations Lead</p>

              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-success">
                <span className="size-1.5 rounded-full bg-success" />
                Available now
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Message composer opened")}
            >
              Message
            </Button>
          </div>
        </CodeCard>

        {/* ===============================================
            Product Card
        =============================================== */}

        <CodeCard
          title="Product card"
          description="Use media, pricing and a direct purchase action for commerce content."
          code={`<Card>
  <ProductImage />
  <ProductMeta />
  <Button>
    Add to cart
  </Button>
</Card>`}
        >
          <div className="overflow-hidden rounded-2xl border">
            <div className="relative grid h-36 place-items-center bg-gradient-to-br from-info/20 to-primary/10">
              <Icons.LampDesk className="size-16 text-primary" />

              <Badge tone="danger" className="absolute start-3 top-3">
                -19%
              </Badge>

              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-card/90"
              >
                <Icons.Heart
                  className={saved ? "size-4 fill-destructive text-destructive" : "size-4"}
                />
              </button>
            </div>

            <div className="p-4">
              <b>Aperture Desk Lamp</b>

              <p className="mt-1 text-sm text-muted-foreground">Lighting and workspace</p>

              <div className="mt-3 flex items-center justify-between">
                <span>
                  <b>$129.00</b>

                  <del className="ms-2 text-xs text-muted-foreground">$159.00</del>
                </span>

                <Button size="sm" onClick={() => toast.success("Added to cart")}>
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </CodeCard>

        {/* ===============================================
            Action Card
        =============================================== */}

        <CodeCard
          title="Action card"
          description="Make a full surface clickable for a lightweight navigation or creation action."
          code={`<button className="group">
  <Card>
    ...
  </Card>
</button>`}
        >
          <button
            type="button"
            onClick={() => toast.success("New project flow opened")}
            className="group w-full rounded-2xl border border-dashed p-5 text-start transition hover:border-primary hover:bg-primary/5"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icons.Plus className="size-5" />
            </span>

            <b className="mt-4 block">Create a new project</b>

            <p className="mt-1 text-sm text-muted-foreground">
              Start with a template or build a project from scratch.
            </p>

            <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
              Create project
              <Icons.ArrowRight className="ms-1 size-4" />
            </span>
          </button>
        </CodeCard>

        {/* ===============================================
            Selectable Cards
        =============================================== */}

        <CodeCard
          title="Selectable cards"
          description="Cards can represent plans, settings or any exclusive option set."
          code={`<SelectableCard
  selected={plan === "Pro"}
  onClick={...}
/>`}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Starter", "$0", "For personal work"],
              ["Pro", "$24", "For small teams"],
              ["Scale", "$79", "For growing teams"],
            ].map(([plan, price, copy]) => (
              <button
                type="button"
                key={plan}
                onClick={() => setSelected(plan)}
                className={
                  selected === plan
                    ? "rounded-2xl border-2 border-primary bg-primary/5 p-4 text-start shadow-sm"
                    : "rounded-2xl border p-4 text-start hover:border-primary/50"
                }
              >
                <div className="flex justify-between gap-2">
                  <b>{plan}</b>

                  {selected === plan && <Icons.CheckCircle2 className="size-4 text-primary" />}
                </div>

                <b className="mt-4 block text-xl">
                  {price}

                  <small className="text-xs font-normal text-muted-foreground"> /mo</small>
                </b>

                <p className="mt-2 text-xs text-muted-foreground">{copy}</p>
              </button>
            ))}
          </div>
        </CodeCard>

        {/* ===============================================
            Project Summary
        =============================================== */}

        <CodeCard
          title="Project summary"
          description="Mix a status, progress and owners without turning the card into a dense table."
          code={`<Card>
  <ProjectMeta />
  <Progress value={82} />
  <AvatarGroup />
</Card>`}
        >
          <div className="rounded-2xl border p-5">
            <div className="flex items-start justify-between">
              <div>
                <Badge tone="info">Design</Badge>

                <b className="mt-3 block">Website Redesign</b>

                <p className="mt-1 text-sm text-muted-foreground">Nexora client project</p>
              </div>

              <Button size="iconSm" variant="ghost">
                <Icons.MoreHorizontal className="size-4" />
              </Button>
            </div>

            <div className="mt-5 flex justify-between text-sm">
              <span>Progress</span>

              <b>82%</b>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[82%] rounded-full bg-primary" />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <span className="grid size-8 place-items-center rounded-full border-2 border-card bg-primary text-[10px] text-primary-foreground">
                  SC
                </span>

                <span className="grid size-8 place-items-center rounded-full border-2 border-card bg-info text-[10px] text-info-foreground">
                  DL
                </span>

                <span className="grid size-8 place-items-center rounded-full border-2 border-card bg-success text-[10px] text-success-foreground">
                  EW
                </span>
              </div>

              <span className="text-xs text-muted-foreground">Due Sep 10</span>
            </div>
          </div>
        </CodeCard>

        {/* ===============================================
            Media Card
        =============================================== */}

        <CodeCard
          title="Media card"
          description="Layer labels and actions on media without losing the content hierarchy."
          code={`<Card className="overflow-hidden">
  <img />
  <CardContent />
</Card>`}
        >
          <div className="overflow-hidden rounded-2xl border">
            <div className="relative h-36 bg-[radial-gradient(circle_at_top_left,var(--primary),transparent_45%),linear-gradient(135deg,var(--info),var(--primary))]">
              <div className="absolute inset-0 bg-black/10" />

              <Badge className="absolute start-3 top-3">Featured</Badge>

              <button
                type="button"
                className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-card/90"
              >
                <Icons.Bookmark className="size-4" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Product update
              </p>

              <b className="mt-2 block">A calmer way to manage your workspace</b>

              <p className="mt-2 text-sm text-muted-foreground">
                Explore the latest navigation, dashboard and collaboration improvements.
              </p>

              <Button className="mt-4" size="sm" variant="outline">
                Read update
                <Icons.ArrowUpRight className="ms-1 size-4" />
              </Button>
            </div>
          </div>
        </CodeCard>

        {/* ===============================================
            Loading Card
        =============================================== */}

        <CodeCard
          title="Loading card"
          description="Maintain the final card shape while asynchronous data is loading."
          code={`<Card>
  <Skeleton className="h-5 w-32" />
  <Skeleton className="h-24" />
</Card>`}
        >
          <div className="rounded-2xl border p-5">
            <span className="block h-4 w-28 animate-pulse rounded bg-muted" />

            <span className="mt-4 block h-8 w-36 animate-pulse rounded bg-muted" />

            <span className="mt-5 block h-24 animate-pulse rounded-xl bg-muted/70" />

            <div className="mt-4 flex gap-2">
              <span className="h-8 w-20 animate-pulse rounded-lg bg-muted" />

              <span className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </CodeCard>
      </div>

      {/* =================================================
          Image Card Gallery
      ================================================= */}

      <Card
        className="mt-5"
        title="Image card gallery"
        description="Media-first cards for products, teams, articles and locations."
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Wireless Headphones Pro", "Audio", "$129.00", localImages.productCatalog],
            ["Product planning workshop", "Team event", "Aug 28", localImages.workspaceDashboard],
            [
              "A focused workspace",
              "Workspace guide",
              "5 min read",
              localImages.workspaceDashboard,
            ],
            [
              "Modern team space",
              "Office location",
              "San Francisco",
              localImages.workspaceDashboard,
            ],
          ].map(([title, meta, value, image], index) => (
            <article key={title} className="group overflow-hidden rounded-2xl border bg-card">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />

                {index === 0 && (
                  <Badge tone="danger" className="absolute start-3 top-3">
                    -19%
                  </Badge>
                )}

                {index === 1 && (
                  <Badge tone="success" className="absolute start-3 top-3">
                    Upcoming
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() => toast.success(`${title} saved`)}
                  className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 shadow-sm"
                >
                  <Icons.Heart className="size-4" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-xs font-medium text-primary">{meta}</p>

                <b className="mt-2 block truncate">{title}</b>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">{value}</span>

                  <Button
                    size="sm"
                    variant={index === 0 ? "default" : "outline"}
                    onClick={() => toast.success(`${title} opened`)}
                  >
                    {index === 0 ? "Add to cart" : "Open"}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>

      {/* =================================================
          Advanced Cards
      ================================================= */}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {/* ===============================================
            Revenue Intelligence
        =============================================== */}

        <Card
          className="overflow-hidden xl:col-span-2"
          bodyClassName="p-0"
          title="Revenue intelligence"
          description="A richer metric card with trend, breakdown and an at-a-glance chart."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.success("Revenue report opened")}
            >
              View report
              <Icons.ArrowUpRight className="ms-1 size-4" />
            </Button>
          }
        >
          <div className="grid md:grid-cols-[1.35fr_.8fr]">
            {/* Revenue Chart */}

            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total revenue</p>

                  <b className="mt-1 block text-3xl">$248,560</b>

                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-success">
                    <Icons.TrendingUp className="size-4" />
                    18.6% from last month
                  </p>
                </div>

                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  <button type="button" className="rounded-md bg-card px-2 py-1 text-xs shadow-sm">
                    Month
                  </button>

                  <button type="button" className="px-2 py-1 text-xs text-muted-foreground">
                    Quarter
                  </button>
                </div>
              </div>

              <div className="mt-6 flex h-28 items-end gap-2">
                {[35, 51, 42, 68, 57, 84, 63, 77, 91, 72, 88, 96].map((height, index) => (
                  <span
                    key={index}
                    className={
                      index === 11
                        ? "flex-1 rounded-t bg-primary"
                        : "flex-1 rounded-t bg-primary/18"
                    }
                    style={{
                      height: `${height}%`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>Aug 01</span>

                <span>Aug 15</span>

                <span>Aug 31</span>
              </div>
            </div>

            {/* Revenue Mix */}

            <aside className="border-t bg-muted/20 p-5 md:border-s md:border-t-0">
              <b className="text-sm">Revenue mix</b>

              <div className="mt-5 space-y-4">
                {[
                  ["Subscriptions", "$168.2K", "68%", "bg-primary"],
                  ["Services", "$52.4K", "21%", "bg-info"],
                  ["Marketplace", "$27.9K", "11%", "bg-success"],
                ].map(([label, value, amount, tone]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>

                      <b>{value}</b>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${tone}`}
                        style={{
                          width: amount,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Card>

        {/* ===============================================
            Business Card
        =============================================== */}

        <Card className="overflow-hidden" bodyClassName="p-0">
          <div className="bg-gradient-to-br from-slate-900 via-primary to-info p-5 text-white">
            <div className="flex items-center justify-between text-xs text-white/75">
              <span>Vexui Business</span>

              <Icons.Wifi className="size-5 rotate-90" />
            </div>

            <div className="mt-8 text-lg tracking-[.25em]">4242 8251 9902 1028</div>

            <div className="mt-6 flex justify-between">
              <span>
                <small className="block text-[10px] text-white/60">CARD HOLDER</small>

                <b className="text-sm">ELENA MARQUEZ</b>
              </span>

              <span>
                <small className="block text-[10px] text-white/60">EXPIRES</small>

                <b className="text-sm">08/29</b>
              </span>

              <Icons.CreditCard className="size-7 text-white/80" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
            <span>
              <b className="block text-sm">$12,840.24</b>

              <small className="text-muted-foreground">Available balance</small>
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Card settings opened")}
            >
              Manage
            </Button>
          </div>
        </Card>

        {/* ===============================================
            Task Focus
        =============================================== */}

        <Card
          title="Task focus"
          description="A dense task card with context, checklist and collaboration."
          action={<Badge tone="warning">Due tomorrow</Badge>}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-warning/10 text-warning">
              <Icons.ListChecks className="size-5" />
            </span>

            <div>
              <b className="block">Finalize checkout flow</b>

              <small className="text-muted-foreground">Website Redesign</small>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Review desktop states", true],
              ["Validate payment errors", true],
              ["Add mobile test coverage", false],
            ].map(([label, done]: any) => (
              <label key={label} className="flex items-center gap-3 text-sm">
                <input type="checkbox" defaultChecked={done} className="size-4 accent-primary" />

                <span className={done ? "text-muted-foreground line-through" : ""}>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              <img
                className="size-7 rounded-full border-2 border-card object-cover"
                src={localImages.sophiaCarter}
                alt="Sophia Carter"
              />

              <img
                className="size-7 rounded-full border-2 border-card object-cover"
                src={localImages.user2}
                alt="Daniel Lee"
              />
            </div>

            <Button size="sm" onClick={() => toast.success("Task opened")}>
              Open task
            </Button>
          </div>
        </Card>

        {/* ===============================================
            Team Availability
        =============================================== */}

        <Card
          title="Team availability"
          description="Use people cards for staffing and workload decisions."
        >
          <div className="space-y-4">
            {[
              [
                "Sophia Carter",
                "Project Manager",
                "Available",
                localImages.sophiaCarter,
                "bg-success",
              ],
              [
                "Daniel Lee",
                "Frontend Developer",
                "In focus time",
                localImages.user2,
                "bg-warning",
              ],
              ["Emma Wilson", "Product Designer", "Available", localImages.user3, "bg-success"],
            ].map(([name, role, status, image, tone]) => (
              <div key={name} className="flex items-center gap-3">
                <div className="relative">
                  <img src={image} alt={name} className="size-10 rounded-full object-cover" />

                  <span
                    className={`absolute bottom-0 end-0 size-3 rounded-full border-2 border-card ${tone}`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{name}</b>

                  <small className="block truncate text-muted-foreground">{role}</small>
                </div>

                <small className="text-xs text-muted-foreground">{status}</small>
              </div>
            ))}
          </div>

          <Button
            className="mt-5 w-full"
            variant="outline"
            onClick={() => toast.success("Team directory opened")}
          >
            View team directory
          </Button>
        </Card>

        {/* ===============================================
            Security Health
        =============================================== */}

        <Card
          title="Security health"
          description="Combine a posture score with specific, actionable checks."
        >
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full border-[7px] border-success/20 text-lg font-semibold text-success">
              92
            </div>

            <div>
              <b>Strong security posture</b>

              <p className="mt-1 text-sm text-muted-foreground">
                4 of 5 recommended checks complete
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              [Icons.CheckCircle2, "Two-factor authentication", "Enabled", "text-success"],
              [Icons.CheckCircle2, "Recovery codes", "Saved", "text-success"],
              [Icons.CircleAlert, "SSO enforcement", "Recommended", "text-warning"],
            ].map(([Icon, label, status, tone]: any) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/35 p-3">
                <Icon className={`size-4 ${tone}`} />

                <span className="flex-1 text-sm">{label}</span>

                <small className="text-muted-foreground">{status}</small>
              </div>
            ))}
          </div>

          <Button className="mt-5 w-full" onClick={() => toast.success("Security settings opened")}>
            Review security
          </Button>
        </Card>

        {/* ===============================================
            Customer Story
        =============================================== */}

        <Card className="overflow-hidden" bodyClassName="p-0">
          <div
            className="relative h-28 bg-cover bg-center"
            style={{ backgroundImage: `url(${localImages.workspaceDashboard})` }}
          >
            <div className="absolute inset-0 bg-primary/45" />

            <Badge className="absolute start-4 top-4">Customer story</Badge>
          </div>

          <div className="relative px-5 pb-5">
            <img
              src={localImages.user3}
              alt="Jordan Kim"
              className="absolute -top-7 size-14 rounded-2xl border-4 border-card object-cover"
            />

            <div className="pt-10">
              <p className="text-sm leading-6 text-muted-foreground">
                The new workspace made delivery reviews much faster. Every important metric is
                finally in one place.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span>
                  <b className="block text-sm">Jordan Kim</b>

                  <small className="text-muted-foreground">VP Operations, Northstar</small>
                </span>

                <div className="flex text-warning">
                  {Array.from(
                    {
                      length: 5,
                    },
                    (_, index) => (
                      <Icons.Star key={index} className="size-4 fill-current" />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
