import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileText,
  Mail,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Badge, Card } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
};

const faqs: Faq[] = [
  {
    id: "first-project",
    category: "Getting Started",
    question: "How do I create my first project?",
    answer:
      "Open Projects, select Create Project, add a name and owner, then invite the people who will work on it.",
    keywords: ["new project", "create", "start"],
  },
  {
    id: "invite",
    category: "Getting Started",
    question: "How do I invite a team member?",
    answer:
      "Open the Team page, choose Invite Member, enter their email address and assign a role. They will receive an invitation to join the workspace.",
    keywords: ["team", "invite", "member"],
  },
  {
    id: "dashboards",
    category: "Getting Started",
    question: "How do I switch between dashboards?",
    answer:
      "Use the Dashboards item in the sidebar and select the workspace that best matches the work you want to review.",
    keywords: ["dashboard", "overview", "switch"],
  },
  {
    id: "profile",
    category: "Account & Profile",
    question: "How do I update my profile information?",
    answer:
      "Visit Profile from the account menu, edit your details, and save. Changes are reflected across your workspace.",
    keywords: ["profile", "name", "avatar"],
  },
  {
    id: "password",
    category: "Account & Profile",
    question: "How do I change my password?",
    answer:
      "Open Settings, choose Security, then use Change password. For a secure account, choose a unique password you do not reuse elsewhere.",
    keywords: ["password", "security", "login"],
  },
  {
    id: "project-members",
    category: "Projects & Tasks",
    question: "How do I add members to a project?",
    answer:
      "Open the project details page, select the team area, then add members and choose their project role.",
    keywords: ["project", "members", "team"],
  },
  {
    id: "kanban",
    category: "Projects & Tasks",
    question: "How do I move a task between Kanban stages?",
    answer:
      "Drag the task card to its new column, or open it and update its status from the task details panel.",
    keywords: ["task", "kanban", "move", "status"],
  },
  {
    id: "progress",
    category: "Projects & Tasks",
    question: "How do I track project progress?",
    answer:
      "Project details show completion, milestones, tasks and activity. Keep task status and due dates up to date for the clearest view.",
    keywords: ["project", "progress", "milestones"],
  },
  {
    id: "plan",
    category: "Billing & Invoices",
    question: "How do I change my subscription plan?",
    answer:
      "Open Pricing, choose the plan that fits your team, and continue with the plan selection flow. Your workspace administrator may need to approve changes.",
    keywords: ["pricing", "subscription", "upgrade", "plan"],
  },
  {
    id: "invoice",
    category: "Billing & Invoices",
    question: "How do I create an invoice?",
    answer:
      "Go to Invoices, choose Create Invoice, add your customer and line items, then review before saving.",
    keywords: ["invoice", "billing", "payment"],
  },
  {
    id: "two-factor",
    category: "Security & Privacy",
    question: "How do I enable two-factor authentication?",
    answer:
      "Go to Settings, choose Security, and enable two-factor authentication. Follow the setup steps for your preferred authenticator app.",
    keywords: ["2fa", "two factor", "security", "authentication"],
  },
  {
    id: "privacy",
    category: "Security & Privacy",
    question: "How is my account data protected?",
    answer:
      "Use the security and privacy controls available to your workspace. For organisation-specific compliance questions, contact your administrator or support team.",
    keywords: ["privacy", "data", "security"],
  },
  {
    id: "github",
    category: "Integrations",
    question: "How do I connect GitHub?",
    answer:
      "Open Settings, select Connected Apps, then choose GitHub and follow the connection prompts.",
    keywords: ["github", "connect", "integration"],
  },
  {
    id: "sync",
    category: "Integrations",
    question: "Why is an integration not syncing?",
    answer:
      "Check that the connection is still authorised, then review the connected app settings. Reconnect the app if access was changed.",
    keywords: ["sync", "integration", "connection"],
  },
  {
    id: "email-alerts",
    category: "Notifications",
    question: "How do I turn off email notifications?",
    answer:
      "Open Settings, choose Notifications, then turn off the update types you no longer want to receive.",
    keywords: ["email", "notifications", "alerts"],
  },
  {
    id: "quiet-hours",
    category: "Notifications",
    question: "Can I change notification frequency?",
    answer:
      "Yes. Notification controls let you adjust which product, team, and digest updates are delivered.",
    keywords: ["notification", "frequency", "quiet hours"],
  },
  {
    id: "loading",
    category: "Troubleshooting",
    question: "Why is a page not loading correctly?",
    answer:
      "Refresh the page first. If the problem remains, clear saved UI preferences or contact support with the page name and what you were doing.",
    keywords: ["page", "loading", "error", "refresh"],
  },
  {
    id: "upload",
    category: "Troubleshooting",
    question: "What should I do if a file upload fails?",
    answer:
      "Check your connection and file size, then try again. If it continues, contact support and include the file type and any error shown.",
    keywords: ["file", "upload", "failed"],
  },
];

const categories = ["All", ...Array.from(new Set(faqs.map((item) => item.category)))];

export function FaqApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const [support, setSupport] = useState(false);

  const results = useMemo(
    () =>
      faqs.filter((item) => {
        const text =
          `${item.question} ${item.answer} ${item.category} ${item.keywords.join(" ")}`.toLowerCase();

        return (
          (category === "All" || item.category === category) &&
          text.includes(query.toLowerCase().trim())
        );
      }),
    [query, category],
  );

  const choose = (item: Faq) => {
    setCategory(item.category);
    setQuery(item.question);
    setOpen(item.id);
  };

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      <section className="rounded-2xl border bg-card px-5 py-9 text-center shadow-sm sm:px-10">
        <Badge tone="primary">Help Center</Badge>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">How can we help?</h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Find answers to common questions about your account, projects, billing, security and
          integrations.
        </p>

        <label className="relative mx-auto mt-6 block max-w-2xl">
          <span className="sr-only">Search help articles and FAQs</span>

          <Search className="absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search help articles and FAQs..."
            className="h-13 w-full rounded-xl border bg-background py-3 ps-12 pe-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Browse by topic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a category or search across all support content.
            </p>
          </div>

          {category !== "All" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCategory("All");
                setQuery("");
              }}
            >
              Clear filter
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item;
            const count =
              item === "All" ? faqs.length : faqs.filter((faq) => faq.category === item).length;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-start text-sm transition",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span>{item}</span>
                <span className="ms-2 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
        <Card
          title="Popular questions"
          description="Quick answers to common tasks."
          className="h-fit"
        >
          <div className="space-y-2">
            {["invite", "plan", "invoice", "two-factor", "upload"].map((id) => {
              const item = faqs.find((faq) => faq.id === id)!;

              return (
                <button
                  key={id}
                  onClick={() => choose(item)}
                  className="w-full rounded-lg border p-3 text-start text-sm font-medium transition hover:border-primary/40 hover:bg-primary/[0.035]"
                >
                  {item.question}
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {item.category}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl bg-muted/45 p-4">
            <CircleHelp className="size-5 text-primary" />

            <p className="mt-2 text-sm font-semibold">Need help with something specific?</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Search the help center or send a request to the support team.
            </p>

            <Button className="mt-3" size="sm" variant="outline" onClick={() => setSupport(true)}>
              <Mail className="me-2 size-4" />
              Contact Support
            </Button>
          </div>
        </Card>

        <Card
          title={`${results.length} ${results.length === 1 ? "answer" : "answers"} found`}
          description={category === "All" ? "All help-center topics" : `Filtered by ${category}`}
        >
          <div className="divide-y">
            {results.map((item) => (
              <article key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="flex w-full items-center gap-3 py-4 text-start"
                >
                  <span className="min-w-0 flex-1">
                    <Badge tone="muted">{item.category}</Badge>
                    <span className="mt-2 block text-sm font-semibold">{item.question}</span>
                  </span>

                  <ChevronDown
                    className={cn("size-4 shrink-0 transition", open === item.id && "rotate-180")}
                  />
                </button>

                {open === item.id && (
                  <div className="pb-4">
                    <p className="text-sm leading-6 text-muted-foreground">{item.answer}</p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Was this helpful?</span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Thanks for your feedback.")}
                      >
                        Yes
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toast.message("Thanks  we will use your feedback to improve this answer.")
                        }
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {!results.length && (
              <div className="grid place-items-center py-16 text-center">
                <Search className="size-8 text-muted-foreground" />

                <h3 className="mt-3 font-semibold">No matching answers found</h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try a different search term or browse by category.
                </p>

                <Button
                  className="mt-4"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                >
                  Browse all questions
                </Button>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.055] px-6 py-8 text-center">
        <ShieldCheck className="mx-auto size-6 text-primary" />

        <h2 className="mt-3 text-2xl font-semibold">Still need help?</h2>

        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Our support team can help with account, billing, or product questions.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setSupport(true)}>
            <Mail className="me-2 size-4" />
            Contact Support
          </Button>

          <Button variant="outline" onClick={() => toast.message("Documentation is coming soon.")}>
            <FileText className="me-2 size-4" />
            View Documentation
          </Button>
        </div>
      </section>

      <Dialog open={support} onOpenChange={setSupport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Name", "Your name"],
              ["Email", "you@company.com"],
            ].map(([label, placeholder]) => (
              <label key={label} className="grid gap-1.5 text-sm font-medium">
                {label}
                <input
                  placeholder={placeholder}
                  className="h-10 rounded-lg border bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
            ))}

            <label className="grid gap-1.5 text-sm font-medium">
              Topic
              <select className="h-10 rounded-lg border bg-background px-3 text-sm font-normal">
                <option>Account</option>
                <option>Billing</option>
                <option>Projects</option>
                <option>Security</option>
                <option>Integrations</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-sm font-medium">
              Subject
              <input
                placeholder="What can we help with?"
                className="h-10 rounded-lg border bg-background px-3 text-sm font-normal outline-none focus:border-primary"
              />
            </label>
          </div>

          <label className="mt-3 grid gap-1.5 text-sm font-medium">
            Message
            <textarea
              placeholder="Share the details so we can help."
              className="min-h-24 rounded-lg border bg-background p-3 text-sm font-normal outline-none focus:border-primary"
            />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSupport(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                setSupport(false);
                toast.success("Support request submitted", {
                  description: "We will follow up through your workspace email.",
                });
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
