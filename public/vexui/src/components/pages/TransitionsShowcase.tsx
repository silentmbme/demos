import { useState } from "react";
import * as Icons from "lucide-react";
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

export function TransitionsShowcase() {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("Overview");
  const [drawer, setDrawer] = useState(false);
  const [stage, setStage] = useState(1);

  return (
    <>
      <PageHeader
        title="Transitions"
        subtitle="Motion patterns for feedback, state changes and progressive disclosure without visual distraction."
        breadcrumb={["Components", "UI Elements", "Transitions"]}
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
          title="Hover lift"
          description="A small lift and shadow signal that a surface is interactive."
          code={'<button className="transition hover:-translate-y-1 hover:shadow-md">...</button>'}
        >
          <button className="w-full rounded-2xl border p-5 text-start transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
            <Icons.MousePointer2 className="size-5 text-primary" />

            <b className="mt-3 block">Hover over this card</b>

            <p className="mt-1 text-sm text-muted-foreground">
              The surface lifts slightly to confirm it can be selected.
            </p>
          </button>
        </CodeCard>

        <CodeCard
          title="Scale feedback"
          description="Use a gentle scale response for compact controls and media previews."
          code={'<button className="transition hover:scale-105 active:scale-95">...</button>'}
        >
          <div className="flex items-center gap-5">
            <button className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground transition hover:scale-110 active:scale-95">
              <Icons.Heart className="size-6" />
            </button>

            <button className="grid size-16 place-items-center rounded-2xl bg-info text-info-foreground transition hover:rotate-3 hover:scale-105 active:scale-95">
              <Icons.Bookmark className="size-6" />
            </button>

            <button className="grid size-16 place-items-center rounded-2xl bg-success text-success-foreground transition hover:scale-105 hover:shadow-lg active:scale-95">
              <Icons.Check className="size-6" />
            </button>
          </div>
        </CodeCard>

        <CodeCard
          title="Fade in and out"
          description="Fade transient content instead of abruptly removing it from the layout."
          code={'<div className={visible ? "opacity-100" : "opacity-0"}>...</div>'}
        >
          <div>
            <Button size="sm" variant="outline" onClick={() => setVisible(!visible)}>
              {visible ? "Hide message" : "Show message"}
            </Button>

            <div
              className={
                visible
                  ? "mt-4 rounded-xl border border-info/20 bg-info/5 p-4 opacity-100 transition-opacity duration-300"
                  : "mt-4 rounded-xl border border-info/20 bg-info/5 p-4 opacity-0 transition-opacity duration-300"
              }
            >
              <b className="text-sm">New workspace update</b>

              <p className="mt-1 text-sm text-muted-foreground">
                Saved views are now available to your team.
              </p>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Slide reveal"
          description="Reveal supporting content with a short vertical transition after user intent."
          code={
            '<div className={expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}>...</div>'
          }
        >
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between rounded-xl border p-4 text-start"
            >
              <span>
                <b className="block text-sm">Project delivery details</b>
                <small className="text-muted-foreground">
                  Click to reveal the latest delivery update
                </small>
              </span>

              <Icons.ChevronDown
                className={
                  expanded
                    ? "size-4 rotate-180 transition-transform"
                    : "size-4 transition-transform"
                }
              />
            </button>

            <div
              className={
                expanded
                  ? "grid max-h-40 grid-rows-[1fr] transition-all duration-300"
                  : "grid max-h-0 grid-rows-[0fr] transition-all duration-300"
              }
            >
              <div className="overflow-hidden">
                <div className="rounded-b-xl border-x border-b bg-muted/25 p-4 text-sm text-muted-foreground">
                  Checkout QA is 70% complete. The remaining work is mobile validation and payment
                  error handling.
                </div>
              </div>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Animated tabs"
          description="Move an indicator between active views to preserve orientation during navigation."
          code={'<button className="transition-colors">Overview</button>'}
        >
          <div>
            <nav className="flex gap-1 rounded-xl bg-muted p-1">
              {["Overview", "Activity", "Settings"].map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={
                    mode === item
                      ? "flex-1 rounded-lg bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-all"
                      : "flex-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  }
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mt-4 rounded-xl border p-4 transition-all">
              <b className="text-sm">{mode}</b>
              <p className="mt-1 text-sm text-muted-foreground">
                Content updates smoothly when the selected navigation state changes.
              </p>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Loading transition"
          description="Move from a pending control to a completed state with clear feedback."
          code={"<Button loading={loading}>Save changes</Button>"}
        >
          <LoadingButton />
        </CodeCard>

        <CodeCard
          title="Staggered list"
          description="Use subtle stagger delays when a small group of related items enters together."
          code={"<li style={{ animationDelay: `${index * 80}ms` }}>...</li>"}
        >
          <div className="space-y-2">
            {[
              "Workspace created",
              "Team invited",
              "First project added",
              "Dashboard personalized",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border p-3 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="grid size-7 place-items-center rounded-full bg-success/10 text-success">
                  <Icons.Check className="size-3.5" />
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Reduced motion"
          description="Keep motion optional; use transition-safe classes and preserve clear static states."
          code={'<div className="motion-safe:transition motion-reduce:transition-none">...</div>'}
        >
          <div className="rounded-xl border p-4 motion-safe:transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md motion-reduce:transition-none">
            <div className="flex items-center gap-3">
              <Icons.Accessibility className="size-5 text-primary" />

              <div>
                <b className="block text-sm">Motion-safe interaction</b>

                <p className="mt-1 text-sm text-muted-foreground">
                  This surface remains clear when reduced motion is enabled.
                </p>
              </div>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Clip-path reveal"
          description="Use a shape reveal for a high-impact panel transition without changing page layout."
          code={'<div className={open ? "clip-open" : "clip-closed"}>...</div>'}
        >
          <div>
            <Button size="sm" variant="outline" onClick={() => setDrawer(!drawer)}>
              {drawer ? "Close preview" : "Open preview"}
            </Button>

            <div
              className={
                drawer
                  ? "mt-4 max-h-56 overflow-hidden rounded-2xl border opacity-100 transition-all duration-500 [clip-path:circle(150%_at_100%_0%)]"
                  : "mt-4 max-h-0 overflow-hidden rounded-2xl border opacity-0 transition-all duration-500 [clip-path:circle(0%_at_100%_0%)]"
              }
            >
              <div className="bg-gradient-to-br from-primary via-info to-primary p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/15">
                    <Icons.Sparkles className="size-5" />
                  </span>

                  <span className="text-xs text-primary-foreground/80">Focus mode</span>
                </div>

                <b className="mt-5 block text-xl">Workspace ready</b>

                <p className="mt-2 text-sm text-primary-foreground/85">
                  A richer reveal for important, focused actions.
                </p>
              </div>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Animated workflow"
          description="Move stage state forward with both color and position changes to retain orientation."
          code={"<StepProgress stage={stage} onChange={setStage} />"}
        >
          <div>
            <div className="flex items-center">
              {[1, 2, 3, 4].map((number) => (
                <button
                  key={number}
                  onClick={() => setStage(number)}
                  className="relative flex flex-1 flex-col items-center"
                >
                  <span
                    className={
                      number <= stage
                        ? "z-10 grid size-9 place-items-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-all duration-300"
                        : "z-10 grid size-9 place-items-center rounded-full border-2 border-muted bg-card text-sm text-muted-foreground transition-all duration-300"
                    }
                  >
                    {number < number && number < stage ? (
                      <Icons.Check className="size-4" />
                    ) : (
                      number
                    )}
                  </span>

                  {number < 4 && (
                    <span
                      className={
                        number < stage
                          ? "absolute start-1/2 top-4 h-0.5 w-full bg-primary transition-colors duration-500"
                          : "absolute start-1/2 top-4 h-0.5 w-full bg-muted transition-colors duration-500"
                      }
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border bg-muted/20 p-4">
              <b className="text-sm">
                {
                  ["Brief confirmed", "Design review", "Build in progress", "Ready to launch"][
                    stage - 1
                  ]
                }
              </b>

              <p className="mt-1 text-sm text-muted-foreground">
                Stage {stage} of 4 - click a step to preview the animated change.
              </p>
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Notification stack"
          description="Animate incoming feedback into a stack so new messages are noticeable but not disruptive."
          code={"<NotificationStack notifications={notifications} />"}
        >
          <div className="relative min-h-48 overflow-hidden rounded-2xl border bg-muted/15 p-4">
            <div className="absolute inset-x-4 top-4 space-y-2">
              {[
                [
                  "Deployment complete",
                  "Production is running v2.4.0",
                  Icons.CheckCircle2,
                  "text-success",
                ],
                [
                  "New review comment",
                  "Emma left feedback on checkout",
                  Icons.MessageSquare,
                  "text-primary",
                ],
                [
                  "Planning starts soon",
                  "Q4 planning starts in 20 minutes",
                  Icons.CalendarClock,
                  "text-info",
                ],
              ].map(([title, copy, Icon, tone], index) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition duration-300 hover:translate-x-1"
                  style={{
                    transform: `translateY(${index * 4}px) scale(${1 - index * 0.025})`,
                    transformOrigin: "top center",
                    zIndex: 3 - index,
                  }}
                >
                  <span className={`grid size-8 place-items-center rounded-lg bg-muted ${tone}`}>
                    <Icon className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block text-sm">{title}</b>
                    <small className="block truncate text-muted-foreground">{copy}</small>
                  </span>

                  <Icons.X className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </CodeCard>

        <CodeCard
          title="Content crossfade"
          description="Crossfade card content when a summary view changes instead of abruptly swapping the entire surface."
          code={'<div key={view} className="animate-in fade-in zoom-in-95">...</div>'}
        >
          <div>
            <div className="mb-4 flex gap-2">
              {["Summary", "Metrics", "Notes"].map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={mode === item ? "default" : "outline"}
                  onClick={() => setMode(item)}
                >
                  {item}
                </Button>
              ))}
            </div>

            <div
              key={mode}
              className="animate-in fade-in zoom-in-95 rounded-2xl border p-5 duration-300"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  {mode === "Summary" ? (
                    <Icons.LayoutDashboard className="size-5" />
                  ) : mode === "Metrics" ? (
                    <Icons.BarChart3 className="size-5" />
                  ) : (
                    <Icons.StickyNote className="size-5" />
                  )}
                </span>

                <div>
                  <b>{mode}</b>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "Summary"
                      ? "Delivery status is healthy and on track."
                      : mode === "Metrics"
                        ? "Revenue is up 18.6% from last month."
                        : "Three notes need a response before review."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CodeCard>
      </div>
    </>
  );
}

function LoadingButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1300);
      }}
    >
      {loading && <Icons.LoaderCircle className="me-2 size-4 animate-spin" />}

      {loading ? "Saving changes" : "Save changes"}
    </Button>
  );
}
