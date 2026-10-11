import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

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

function Dot({
  icon: Icon,
  tone = "bg-primary text-primary-foreground",
}: {
  icon: any;
  tone?: string;
}) {
  return (
    <span
      className={`grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-card ${tone}`}
    >
      <Icon className="size-3.5" />
    </span>
  );
}

export function TimelinesShowcase() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <PageHeader
        title="Timelines"
        subtitle="Chronological patterns for activity, milestones, delivery plans and system history."
        breadcrumb={["Components", "UI Elements", "Timelines"]}
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
          title="Activity timeline"
          description="Use a vertical activity stream for recent workspace events."
          code={'<TimelineItem icon={CheckCircle2} title="Design approved" time="12 min ago" />'}
        >
          <div className="relative ms-4 space-y-6 border-s ps-6">
            {[
              [
                Icons.CheckCircle2,
                "Design review completed",
                "Sophia approved the latest homepage direction.",
                "12 min ago",
                "bg-success text-success-foreground",
              ],
              [
                Icons.MessageSquare,
                "New review comment",
                "Emma asked for feedback on the mobile layout.",
                "45 min ago",
                "bg-info text-info-foreground",
              ],
              [
                Icons.FilePlus2,
                "File uploaded",
                "Daniel added checkout-spec.pdf to the project.",
                "2 hours ago",
                "bg-primary text-primary-foreground",
              ],
            ].map(([Icon, title, copy, time, tone]: any) => (
              <article key={title} className="relative">
                <span className="absolute -start-10 top-0">
                  <Dot icon={Icon} tone={tone} />
                </span>

                <div className="flex justify-between gap-3">
                  <b className="text-sm">{title}</b>
                  <small className="shrink-0 text-muted-foreground">{time}</small>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Milestone timeline"
          description="Show a small number of project milestones with clear completion state."
          code={'<Milestone completed label="Discovery" date="Aug 02" />'}
        >
          <div className="relative ms-4 space-y-6 border-s ps-6">
            {[
              ["Discovery", "Aug 02", true],
              ["Design direction", "Aug 12", true],
              ["Build and QA", "Aug 28", false],
              ["Launch", "Sep 10", false],
            ].map(([label, date, done], index) => (
              <div key={label} className="relative">
                <span
                  className={
                    done
                      ? "absolute -start-[35px] top-0 grid size-6 place-items-center rounded-full bg-success text-success-foreground ring-4 ring-card"
                      : "absolute -start-[35px] top-0 grid size-6 place-items-center rounded-full border-2 border-muted bg-card ring-4 ring-card"
                  }
                >
                  {done && <Icons.Check className="size-3.5" />}
                </span>

                <div className="flex items-center justify-between">
                  <b className={done ? "text-sm" : "text-sm text-muted-foreground"}>{label}</b>

                  <small className="text-muted-foreground">{date}</small>
                </div>

                {index === 2 && <p className="mt-1 text-xs text-primary">Current phase</p>}
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Status timeline"
          description="Use color to differentiate completed, active, waiting and blocked events."
          code={'<TimelineItem tone="warning" status="Waiting" />'}
        >
          <div className="relative ms-4 space-y-5 border-s ps-6">
            {[
              [Icons.CheckCircle2, "Data import completed", "success", "Completed"],
              [Icons.LoaderCircle, "Validating records", "primary", "In progress"],
              [Icons.Clock3, "Waiting for approval", "warning", "Waiting"],
              [Icons.CircleAlert, "Payment verification", "destructive", "Blocked"],
            ].map(([Icon, title, tone, status]: any) => (
              <div key={title} className="relative">
                <span
                  className={`absolute -start-10 top-0 grid size-8 place-items-center rounded-full ring-4 ring-card ${
                    tone === "success"
                      ? "bg-success/15 text-success"
                      : tone === "warning"
                        ? "bg-warning/15 text-warning"
                        : tone === "destructive"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-primary/15 text-primary"
                  }`}
                >
                  <Icon className={tone === "primary" ? "size-4 animate-spin" : "size-4"} />
                </span>

                <div className="flex items-center justify-between gap-2">
                  <b className="text-sm">{title}</b>

                  <Badge tone={tone === "destructive" ? "danger" : (tone as any)}>{status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Compact history"
          description="A narrow format works well inside cards, detail panels and drawers."
          code={"<CompactTimeline events={events} />"}
        >
          <div className="space-y-3">
            {[
              ["Today, 10:26 AM", "Published delivery plan"],
              ["Today, 09:40 AM", "Assigned Daniel to checkout review"],
              ["Yesterday, 04:18 PM", "Added responsive design notes"],
            ].map(([time, event]) => (
              <div key={event} className="flex gap-3 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">{time}</span>

                <span className="relative mt-1.5 size-2 shrink-0 rounded-full bg-primary">
                  <span className="absolute left-1/2 top-2 h-7 border-s border-dashed" />
                </span>

                <span>{event}</span>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Horizontal timeline"
          description="Use a horizontal sequence for a small, clearly ordered set of stages."
          code={"<HorizontalTimeline steps={steps} active={2} />"}
        >
          <div className="flex overflow-x-auto pb-2">
            {[
              ["Brief", "Complete"],
              ["Design", "Complete"],
              ["Build", "Current"],
              ["QA", "Next"],
              ["Launch", "Next"],
            ].map(([label, status], index) => (
              <div key={label} className="relative min-w-28 flex-1 text-center">
                <span
                  className={
                    status === "Complete"
                      ? "grid size-9 place-items-center rounded-full bg-success text-success-foreground"
                      : "grid size-9 place-items-center rounded-full border-2 border-muted bg-card text-muted-foreground"
                  }
                >
                  {status === "Complete" ? <Icons.Check className="size-4" /> : index + 1}
                </span>

                {index < 4 && (
                  <span
                    className={
                      status === "Complete"
                        ? "absolute start-9 end-0 top-4 h-0.5 bg-success"
                        : "absolute start-9 end-0 top-4 h-0.5 bg-muted"
                    }
                  />
                )}

                <b className="mt-3 block text-sm">{label}</b>

                <small className={status === "Current" ? "text-primary" : "text-muted-foreground"}>
                  {status}
                </small>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Release timeline"
          description="Combine version markers with notes and quick release actions."
          code={"<ReleaseTimeline releases={releases} />"}
        >
          <div className="relative ms-4 space-y-6 border-s ps-6">
            {[
              ["v2.4.0", "Today", "Custom fields, saved views and performance improvements.", true],
              ["v2.3.0", "Aug 12", "New project health signals and updated filters.", false],
              ["v2.2.0", "Jul 28", "Improved notification preferences and faster search.", false],
            ].map(([version, date, copy, current]) => (
              <article key={version} className="relative">
                <span
                  className={
                    current
                      ? "absolute -start-9 top-0 grid size-6 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground ring-4 ring-card"
                      : "absolute -start-9 top-0 grid size-6 place-items-center rounded-full bg-muted text-[10px] ring-4 ring-card"
                  }
                >
                  {current ? (
                    <Icons.Sparkles className="size-3" />
                  ) : (
                    <Icons.Tag className="size-3" />
                  )}
                </span>

                <div className="flex items-center justify-between">
                  <Badge tone={current ? "primary" : "muted"}>{version}</Badge>

                  <small className="text-muted-foreground">{date}</small>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>

                {current && (
                  <Button
                    size="sm"
                    className="mt-3"
                    variant="outline"
                    onClick={() => toast.success("Release notes opened")}
                  >
                    View release notes
                  </Button>
                )}
              </article>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Expandable activity"
          description="Reveal more event context only when a user asks for it."
          code={"<TimelineItem expandable onToggle={setExpanded} />"}
        >
          <div className="relative ms-4 border-s ps-6">
            <span className="absolute -start-4 top-0">
              <Dot icon={Icons.GitPullRequest} tone="bg-primary/15 text-primary" />
            </span>

            <b className="text-sm">Pull request merged</b>

            <p className="mt-1 text-sm text-muted-foreground">
              Daniel merged checkout validation updates.
            </p>

            {expanded && (
              <div className="mt-3 rounded-xl bg-muted/45 p-3 text-sm">
                <b>Included changes</b>

                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>Updated payment error messages</li>
                  <li>Added mobile layout tests</li>
                  <li>Refined checkout summary</li>
                </ul>
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-sm font-medium text-primary"
            >
              {expanded ? "Hide details" : "View details"}
            </button>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
