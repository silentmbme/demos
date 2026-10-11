import { useState } from "react";
import { Check, ChevronDown, CircleHelp, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge, Card } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 19,
    yearly: 15,
    description: "For individuals and small teams.",
    features: [
      "Up to 5 team members",
      "10 projects",
      "Basic analytics",
      "5 GB storage",
      "Email support",
      "Standard integrations",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 49,
    yearly: 39,
    description: "For growing product teams.",
    featured: true,
    features: [
      "Up to 25 team members",
      "Unlimited projects",
      "Advanced analytics",
      "50 GB storage",
      "Priority support",
      "Workflow automation",
      "Advanced integrations",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthly: 99,
    yearly: 79,
    description: "For larger organizations.",
    features: [
      "Up to 100 team members",
      "Unlimited projects",
      "Advanced reporting",
      "250 GB storage",
      "Role-based permissions",
      "SSO & audit logs",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description: "For organisations with advanced requirements.",
    features: [
      "Unlimited team members",
      "Enterprise security",
      "Custom roles",
      "Dedicated account manager",
      "SLA",
      "Advanced compliance",
      "Custom integrations",
      "Migration assistance",
    ],
  },
];

const compare = [
  ["Core", "Team members", "5", "25", "100", "Unlimited"],
  ["Core", "Projects", "10", "Unlimited", "Unlimited", "Unlimited"],
  ["Core", "Storage", "5 GB", "50 GB", "250 GB", "Custom"],
  ["Productivity", "Analytics", "Basic", "Advanced", "Advanced reporting", "Custom"],
  ["Productivity", "Automation", "", "Included", "Included", "Included"],
  ["Productivity", "Integrations", "Standard", "Advanced", "Advanced", "Custom"],
  ["Security", "SSO", "", "", "Included", "Included"],
  ["Security", "Audit logs", "", "", "Included", "Included"],
  ["Support", "Priority support", "", "Included", "Included", "Included"],
  ["Support", "Dedicated manager", "", "", "", "Included"],
];

const faqs = [
  [
    "Can I change plans later?",
    "Yes. Upgrade, downgrade, or change billing frequency whenever your needs change.",
  ],
  [
    "Do you offer a free trial?",
    "Every Starter, Growth, and Business plan includes a 14-day trial with no credit card required.",
  ],
  [
    "Can I cancel anytime?",
    "Yes. Your plan remains active until the end of the current billing period.",
  ],
  [
    "What happens if I exceed plan limits?",
    "We will notify workspace admins and help you select the right capacity before access is affected.",
  ],
  ["Is SSO included?", "SSO and audit logs are included with Business and Enterprise."],
  [
    "Do you offer enterprise discounts?",
    "Annual Enterprise agreements are tailored by team size, security, and support requirements.",
  ],
];

export function PricingApp() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const [chosen, setChosen] = useState<Plan | null>(null);
  const [sales, setSales] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const price = (plan: Plan) => (billing === "monthly" ? plan.monthly : plan.yearly);

  const selectPlan = (plan: Plan) => (plan.id === "enterprise" ? setSales(true) : setChosen(plan));

  const finishPlan = () => {
    if (!chosen) return;

    setChosen(null);
    toast.success(`${chosen.name} selected`, {
      description: `Your ${billing} plan selection is ready for checkout.`,
    });
  };

  const sendSales = () => {
    setSales(false);
    toast.success("Sales request submitted", {
      description: "Our team will be in touch shortly.",
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] pb-8">
      <section className="rounded-2xl border border-border bg-card px-5 py-9 text-center shadow-sm sm:px-10 sm:py-11">
        <Badge tone="primary">Plans & billing</Badge>

        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing for teams of every size
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Choose the plan that fits your workflow and scale as your team grows.
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          No hidden fees. Upgrade or cancel anytime.
        </p>

        <div
          className="mt-6 inline-flex items-center rounded-xl border bg-muted/45 p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              billing === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Yearly
            <Badge tone="success">Save 20%</Badge>
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const amount = price(plan);

          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex min-h-[478px] flex-col rounded-2xl border bg-card p-5",
                plan.featured
                  ? "border-primary bg-primary/[0.035] shadow-sm ring-1 ring-primary/20"
                  : "border-border",
              )}
            >
              {plan.featured && (
                <Badge tone="primary">
                  <Sparkles className="me-1 size-3" />
                  Most Popular
                </Badge>
              )}

              <h2 className={cn("text-xl font-semibold", plan.featured && "mt-3")}>{plan.name}</h2>

              <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {amount === null ? "Custom" : `$${amount}`}
                </span>

                {amount !== null && (
                  <span className="mb-1 text-sm text-muted-foreground">/ user / month</span>
                )}
              </div>

              <p className="mt-1 min-h-5 text-xs text-muted-foreground">
                {amount !== null && (billing === "yearly" ? "Billed annually" : "Billed monthly")}
              </p>

              <Button
                className="mt-5 w-full"
                variant={plan.featured ? "default" : "outline"}
                onClick={() => selectPlan(plan)}
              >
                {plan.id === "enterprise"
                  ? "Contact Sales"
                  : plan.id === "starter"
                    ? "Start Free Trial"
                    : `Choose ${plan.name}`}
              </Button>

              <div className="mt-6 border-t pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Included
                </p>

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-5 grid gap-3 rounded-xl border bg-muted/25 p-4 text-center text-xs text-muted-foreground sm:grid-cols-4">
        {["14-day free trial", "No credit card required", "Cancel anytime", "Secure billing"].map(
          (item) => (
            <span key={item} className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              {item}
            </span>
          ),
        )}
      </div>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Compare plans</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything you need to find the right capacity for your team.
          </p>
        </div>

        <Card className="overflow-hidden" bodyClassName="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-start text-sm">
            <thead className="bg-muted/45">
              <tr>
                {["Feature", "Starter", "Growth", "Business", "Enterprise"].map((head) => (
                  <th
                    key={head}
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {compare.map((row, index) => (
                <tr key={row[1]} className="border-t border-border">
                  {index === 0 || row[0] !== compare[index - 1][0] ? (
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <span className="block text-[11px] uppercase tracking-wider text-primary">
                        {row[0]}
                      </span>
                      {row[1]}
                    </td>
                  ) : (
                    <td className="px-5 py-3.5 font-medium">{row[1]}</td>
                  )}

                  {row.slice(2).map((value) => (
                    <td
                      key={value}
                      className={cn(
                        "px-5 py-3.5",
                        value === "" ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card
          title="Optional add-ons"
          description="Extend any paid plan only when you need more capacity."
        >
          <div className="space-y-3">
            {[
              ["Extra storage", "+$10 / 100 GB", "Add room for files, recordings, and assets."],
              [
                "Advanced analytics",
                "+$20 / month",
                "Deeper cohort reports and scheduled insights.",
              ],
              [
                "Priority SLA",
                "Custom",
                "Response targets and support coverage for critical teams.",
              ],
            ].map((addon) => (
              <div
                key={addon[0]}
                className="flex items-center justify-between gap-3 rounded-xl border p-3.5"
              >
                <span>
                  <b className="block text-sm">{addon[0]}</b>
                  <small className="text-muted-foreground">{addon[2]}</small>
                </span>
                <span className="text-sm font-semibold">{addon[1]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Frequently asked questions" description="Clear answers before you choose.">
          <div className="divide-y">
            {faqs.map(([question, answer], index) => (
              <div key={question}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-start text-sm font-medium"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={cn("size-4 transition", openFaq === index && "rotate-180")}
                  />
                </button>

                {openFaq === index && (
                  <p className="pb-3 text-sm leading-6 text-muted-foreground">{answer}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.055] px-6 py-8 text-center sm:px-10">
        <h2 className="text-2xl font-semibold">Ready to get started?</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Start with Growth or choose the plan that fits your team.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setChosen(plans[1])}>Start Free Trial</Button>
          <Button variant="outline" onClick={() => setSales(true)}>
            Contact Sales
          </Button>
        </div>
      </section>

      <Dialog open={!!chosen} onOpenChange={(open) => !open && setChosen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose {chosen?.name}</DialogTitle>
          </DialogHeader>

          {chosen && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/35 p-4">
                <p className="text-sm text-muted-foreground">
                  {billing === "yearly" ? "Yearly billing" : "Monthly billing"}
                </p>

                <p className="mt-1 text-3xl font-semibold">
                  ${price(chosen)}{" "}
                  <span className="text-sm font-normal text-muted-foreground">/ user / month</span>
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {billing === "yearly"
                    ? "Billed annually after your trial."
                    : "Billed monthly after your trial."}
                </p>
              </div>

              <ul className="space-y-2">
                {chosen.features.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setChosen(null)}>
              Cancel
            </Button>
            <Button onClick={finishPlan}>
              <CreditCard className="me-2 size-4" />
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sales} onOpenChange={setSales}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Sales</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Name", "Your name"],
              ["Work email", "you@company.com"],
              ["Company", "Company name"],
              ["Team size", "e.g. 150"],
            ].map((field) => (
              <label key={field[0]} className="grid gap-1.5 text-sm font-medium">
                {field[0]}
                <input
                  required
                  placeholder={field[1]}
                  className="h-10 rounded-lg border bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>

          <label className="mt-3 grid gap-1.5 text-sm font-medium">
            Message
            <textarea
              placeholder="Tell us about your requirements"
              className="min-h-24 rounded-lg border bg-background p-3 text-sm font-normal outline-none focus:border-primary"
            />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSales(false)}>
              Cancel
            </Button>
            <Button onClick={sendSales}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
