import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { localImages } from "@/lib/local-images";
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

export function ListsShowcase() {
  const [selected, setSelected] = useState<string[]>(["Website Redesign"]);
  const [tasks, setTasks] = useState([true, true, false, false]);

  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );

  return (
    <>
      <PageHeader
        title="Lists"
        subtitle="Structured rows for activity, people, files, tasks and operational records."
        breadcrumb={["Components", "UI Elements", "Lists"]}
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
          title="Activity list"
          description="Show a chronological stream of meaningful workspace updates."
          code={"<ActivityList items={activity} />"}
        >
          <div className="space-y-4">
            {[
              [
                Icons.CheckCircle2,
                "Sophia completed Design review",
                "Website Redesign - 12 min ago",
                "text-success",
                "bg-success/10",
              ],
              [
                Icons.FilePlus2,
                "Daniel added checkout-spec.pdf",
                "Files - 45 min ago",
                "text-primary",
                "bg-primary/10",
              ],
              [
                Icons.MessageSquare,
                "Emma left a review comment",
                "Mobile App - 2 hours ago",
                "text-info",
                "bg-info/10",
              ],
              [
                Icons.CircleAlert,
                "Budget review is due",
                "Marketing Automation - Today",
                "text-warning",
                "bg-warning/10",
              ],
            ].map(([Icon, title, meta, tone, bg]: any) => (
              <article key={title} className="flex gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${bg} ${tone}`}
                >
                  <Icon className="size-4" />
                </span>

                <div className="min-w-0">
                  <b className="block text-sm">{title}</b>
                  <small className="block text-muted-foreground">{meta}</small>
                </div>
              </article>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Contact list"
          description="Combine avatars, role context, availability and a fast action."
          code={"<ContactList contacts={contacts} />"}
        >
          <div className="divide-y rounded-xl border">
            {[
              ["Sophia Carter", "Project Manager", localImages.sophiaCarter, "Online"],
              ["Daniel Lee", "Frontend Developer", localImages.user2, "In a meeting"],
              ["Emma Wilson", "Product Designer", localImages.user3, "Online"],
            ].map(([name, role, image, status]) => (
              <div key={name} className="flex items-center gap-3 p-3">
                <div className="relative">
                  <img src={image} alt={name} className="size-10 rounded-full object-cover" />

                  <span
                    className={`absolute bottom-0 end-0 size-2.5 rounded-full border-2 border-card ${
                      status === "Online" ? "bg-success" : "bg-warning"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{name}</b>
                  <small className="block truncate text-muted-foreground">{role}</small>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(`Messaging ${name}`)}
                >
                  <Icons.MessageCircle className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Selectable rows"
          description="Use selection for bulk actions without losing row context."
          code={"<SelectableList selected={selected} onChange={setSelected} />"}
        >
          <div className="overflow-hidden rounded-xl border">
            {[
              ["Website Redesign", "PRJ-1048", "On track"],
              ["Mobile App v2", "PRJ-1052", "At risk"],
              ["CRM Migration", "PRJ-1061", "On track"],
            ].map(([name, id, status]) => {
              const active = selected.includes(name);

              return (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className={
                    active
                      ? "flex w-full items-center gap-3 border-b bg-primary/5 p-3 text-start last:border-0"
                      : "flex w-full items-center gap-3 border-b p-3 text-start hover:bg-muted/40 last:border-0"
                  }
                >
                  <span
                    className={
                      active
                        ? "grid size-5 place-items-center rounded border border-primary bg-primary text-primary-foreground"
                        : "grid size-5 place-items-center rounded border"
                    }
                  >
                    {active && <Icons.Check className="size-3" />}
                  </span>

                  <span className="min-w-0 flex-1">
                    <b className="block text-sm">{name}</b>
                    <small className="text-muted-foreground">{id}</small>
                  </span>

                  <Badge tone={status === "On track" ? "success" : "warning"}>{status}</Badge>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {selected.length} project{selected.length === 1 ? "" : "s"} selected
          </p>
        </CodeCard>

        <CodeCard
          title="File list"
          description="Use clear file type icons, metadata and contextual actions."
          code={"<FileList files={files} />"}
        >
          <div className="divide-y rounded-xl border">
            {[
              [Icons.FileText, "checkout-spec.pdf", "PDF - 2.4 MB", "text-danger"],
              [Icons.FileSpreadsheet, "Q3-budget.xlsx", "Spreadsheet - 846 KB", "text-success"],
              [Icons.Image, "design-assets.zip", "Archive - 16.8 MB", "text-info"],
            ].map(([Icon, name, meta, tone]: any) => (
              <div key={name} className="flex items-center gap-3 p-3">
                <span className={`grid size-10 place-items-center rounded-xl bg-muted ${tone}`}>
                  <Icon className="size-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{name}</b>
                  <small className="text-muted-foreground">{meta}</small>
                </span>

                <Button
                  size="iconSm"
                  variant="ghost"
                  onClick={() => toast.success(`${name} downloaded`)}
                >
                  <Icons.Download className="size-4" />
                </Button>

                <Button size="iconSm" variant="ghost">
                  <Icons.MoreHorizontal className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Task list"
          description="Use checks, ownership and priority to keep an active list scannable."
          code={"<TaskList tasks={tasks} onToggle={toggleTask} />"}
        >
          <div className="divide-y rounded-xl border">
            {[
              ["Review desktop layout", "Sophia", "High"],
              ["Validate payment states", "Daniel", "Medium"],
              ["Write mobile test cases", "Emma", "High"],
              ["Prepare QA handoff", "Noah", "Low"],
            ].map(([title, owner, priority], index) => (
              <label key={title} className="flex cursor-pointer items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={tasks[index]}
                  onChange={() =>
                    setTasks((current) => current.map((item, i) => (i === index ? !item : item)))
                  }
                  className="size-4 accent-primary"
                />

                <span className="min-w-0 flex-1">
                  <b
                    className={
                      tasks[index]
                        ? "block text-sm text-muted-foreground line-through"
                        : "block text-sm"
                    }
                  >
                    {title}
                  </b>

                  <small className="text-muted-foreground">Assigned to {owner}</small>
                </span>

                <Badge
                  tone={
                    priority === "High" ? "danger" : priority === "Medium" ? "warning" : "muted"
                  }
                >
                  {priority}
                </Badge>
              </label>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Invoice list"
          description="Use aligned amounts and status pills for financial records."
          code={"<InvoiceList invoices={invoices} />"}
        >
          <div className="divide-y rounded-xl border">
            {[
              ["INV-2048", "CloudAxis", "$8,420", "Paid"],
              ["INV-2049", "Vertex Labs", "$4,860", "Sent"],
              ["INV-2050", "Vexui Systems", "$12,640", "Overdue"],
            ].map(([id, customer, amount, status]) => (
              <div key={id} className="flex items-center gap-3 p-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icons.ReceiptText className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{id}</b>
                  <small className="text-muted-foreground">{customer}</small>
                </span>

                <span className="text-end">
                  <b className="block text-sm">{amount}</b>

                  <Badge
                    tone={status === "Paid" ? "success" : status === "Overdue" ? "danger" : "info"}
                  >
                    {status}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Notification list"
          description="Make unread state and action affordances easy to scan."
          code={"<NotificationList notifications={notifications} />"}
        >
          <div className="divide-y rounded-xl border">
            {[
              [Icons.Sparkles, "AI summary is ready", "Design review meeting - 8 min ago", true],
              [Icons.UserPlus, "Mia joined your workspace", "Invite accepted - 2 hours ago", true],
              [Icons.CalendarClock, "Planning session tomorrow", "Aug 28 at 10:00 AM", false],
            ].map(([Icon, title, meta, unread]: any) => (
              <button
                key={title}
                onClick={() => toast.success(`${title} opened`)}
                className={
                  unread
                    ? "flex w-full items-start gap-3 bg-primary/[.035] p-3 text-start hover:bg-muted/40"
                    : "flex w-full items-start gap-3 p-3 text-start hover:bg-muted/40"
                }
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <Icon className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{title}</b>
                  <small className="block text-muted-foreground">{meta}</small>
                </span>

                {unread && <span className="mt-1 size-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </CodeCard>
      </div>
    </>
  );
}
