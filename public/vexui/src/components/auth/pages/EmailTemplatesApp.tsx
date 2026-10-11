import { useMemo, useState } from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Monitor,
  Package,
  Search,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";
import { BrandLogo } from "@/components/branding/BrandLogo";

import { PageHeader, Card } from "@/components/dashboard/widgets";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* =====================================================
   Email Template Data
===================================================== */

export const templates = [
  {
    id: "welcome",
    name: "Welcome Email",
    category: "Account",
    subject: "Your workspace is ready",
    icon: Users,
    heading: "Welcome to Vexui",
    body: "Hi Sophia, your workspace is ready. Start by creating a project, inviting your team, or exploring the dashboard.",
    cta: "Open Dashboard",
  },

  {
    id: "verify-email",
    name: "Verify Email",
    category: "Authentication",
    subject: "Confirm your email address",
    icon: ShieldCheck,
    heading: "Verify your email address",
    body: "Confirm your email to activate your account and secure access to your workspace.",
    cta: "Verify Email",
  },

  {
    id: "reset-password",
    name: "Reset Password",
    category: "Authentication",
    subject: "Reset your Vexui password",
    icon: ShieldCheck,
    heading: "Reset your password",
    body: "We received a request to reset the password for your account.",
    cta: "Reset Password",
  },

  {
    id: "password-changed",
    name: "Password Changed",
    category: "Security",
    subject: "Your password was changed",
    icon: CheckCircle2,
    heading: "Your password was changed",
    body: "Your account password was updated successfully.",
    cta: "Secure My Account",
  },

  {
    id: "invitation",
    name: "Invitation",
    category: "Account",
    subject: "Sophia invited you to Vexui Workspace",
    icon: Users,
    heading: "Youve been invited",
    body: "Sophia Carter invited you to join Vexui Workspace as a Project Member.",
    cta: "Accept Invitation",
  },

  {
    id: "invoice",
    name: "Invoice Email",
    category: "Billing",
    subject: "Invoice INV-2048 is ready",
    icon: Mail,
    heading: "Invoice INV-2048 is ready",
    body: "Your invoice for CloudAxis is ready to view. Payment is due Sep 05, 2026.",
    cta: "View Invoice",
  },

  {
    id: "order-confirmation",
    name: "Order Confirmation",
    category: "Commerce",
    subject: "Your order #ORD-10482 is confirmed",
    icon: Package,
    heading: "Thanks for your order",
    body: "Were preparing your order and will let you know as soon as it ships.",
    cta: "View Order",
  },

  {
    id: "payment-received",
    name: "Payment Received",
    category: "Billing",
    subject: "Payment received for INV-2048",
    icon: CheckCircle2,
    heading: "Payment received",
    body: "We received your payment of $8,420.00 for invoice INV-2048.",
    cta: "View Payment",
  },

  {
    id: "project-assignment",
    name: "Project Assignment",
    category: "Workspace",
    subject: "You have been added to Website Redesign",
    icon: Users,
    heading: "You have been added to Website Redesign",
    body: "Sophia Carter added you as Frontend Developer. The project is 82% complete and due Sep 10.",
    cta: "View Project",
  },

  {
    id: "task-assignment",
    name: "Task Assignment",
    category: "Workspace",
    subject: "New task: Finalize checkout flow",
    icon: CheckCircle2,
    heading: "A new task was assigned to you",
    body: "Sophia Carter assigned you the high-priority task Finalize checkout flow, due Aug 27.",
    cta: "View Task",
  },

  {
    id: "subscription",
    name: "Subscription",
    category: "Billing",
    subject: "Your Growth plan is active",
    icon: CheckCircle2,
    heading: "Your Growth plan is active",
    body: "Your Growth plan is now active with yearly billing of $468.00. It renews Aug 25, 2027.",
    cta: "Manage Subscription",
  },

  {
    id: "notification",
    name: "Notification",
    category: "Notifications",
    subject: "Youve been assigned to Website Redesign",
    icon: Mail,
    heading: "Youve been assigned to Website Redesign",
    body: "Sophia Carter assigned you as Frontend Developer on Website Redesign.",
    cta: "View Project",
  },
] as const;

/* =====================================================
   Template Type
===================================================== */

type Template = (typeof templates)[number];

/* =====================================================
   Logo
===================================================== */

function Logo() {
  return <BrandLogo className="h-7 w-[96px]" />;
}

/* =====================================================
   Email Footer
===================================================== */

function Footer() {
  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-7 py-6 text-center text-[11px] leading-5 text-slate-400">
      <p>
        Need help?{" "}
        <a href="#support" className="text-indigo-600">
          Contact Support
        </a>
      </p>

      <p className="mt-1">
        <a href="#privacy">Privacy</a>

        <span className="mx-2"></span>

        <a href="#terms">Terms</a>

        <span className="mx-2"></span>

        <a href="#preferences">Preferences</a>
      </p>

      <p className="mt-2">2026 Vexui</p>
    </div>
  );
}

/* =====================================================
   Information Box
===================================================== */

function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
      {children}
    </div>
  );
}

/* =====================================================
   Email Preview Component
===================================================== */

export function EmailPreview({ template }: { template: Template }) {
  const special = template.id;

  return (
    <article
      className="
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-white
        text-slate-700
        shadow-[0_22px_60px_rgba(15,23,42,.14)]
      "
    >
      {/* Header */}

      <header className="border-b border-slate-100 bg-slate-50/70 px-7 py-5">
        <Logo />
      </header>

      {/* Email Content */}

      <div className="px-7 py-9">
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[.17em]
            text-indigo-600
          "
        >
          {template.category}
        </p>

        <h1
          className="
            mt-3
            text-[29px]
            font-semibold
            leading-[1.16]
            tracking-tight
            text-slate-900
          "
        >
          {template.heading}
        </h1>

        <p className="mt-4 text-[15px] leading-7">{template.body}</p>

        {/* =================================================
            Welcome Email Extra Content
        ================================================= */}

        {special === "welcome" && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["Create projects", "Invite team", "Track progress"].map((item) => (
              <div
                key={item}
                className="
                  rounded-lg
                  bg-indigo-50
                  px-2
                  py-3
                  text-center
                  text-[11px]
                  font-medium
                  text-indigo-700
                "
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            Verify Email Extra Content
        ================================================= */}

        {special === "verify-email" && (
          <>
            <Info>This verification link expires in 30 minutes.</Info>

            <p className="mt-4 break-all text-xs leading-5 text-slate-400">
              If the button doesnt work, copy this link:
              https://vexuiadmin.demo/verify-email/example-link
            </p>
          </>
        )}

        {/* =================================================
            Reset Password Extra Content
        ================================================= */}

        {special === "reset-password" && (
          <Info>
            This link expires in 30 minutes. If you didnt request this change, you can safely ignore
            this email.
          </Info>
        )}

        {/* =================================================
            Password Changed
        ================================================= */}

        {special === "password-changed" && (
          <Info>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <span>
                <b className="block text-slate-800">Date</b>
                Aug 25, 2026
              </span>

              <span>
                <b className="block text-slate-800">Device</b>
                Chrome on Windows
              </span>

              <span>
                <b className="block text-slate-800">Location</b>
                Hyderabad, India
              </span>
            </div>
          </Info>
        )}

        {/* =================================================
            Invitation
        ================================================= */}

        {special === "invitation" && (
          <Info>
            <p>
              <b className="text-slate-800">Workspace</b> Vexui Workspace
            </p>

            <p>
              <b className="text-slate-800">Role</b> Project Member
            </p>

            <p className="mt-2 text-xs">Invitation expires in 7 days.</p>
          </Info>
        )}

        {/* =================================================
            Invoice
        ================================================= */}

        {special === "invoice" && (
          <Info>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Invoice Number</span>

                <b className="text-slate-800">INV-2048</b>
              </div>

              <div className="flex justify-between">
                <span>Due Date</span>

                <b className="text-slate-800">Sep 05, 2026</b>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span>Amount due</span>

                <b className="text-slate-800">$8,420.00</b>
              </div>
            </div>
          </Info>
        )}

        {/* =================================================
            Order Confirmation
        ================================================= */}

        {special === "order-confirmation" && (
          <Info>
            <div className="space-y-3 text-xs">
              {[
                ["Aperture Desk Lamp", "Graphite  1", "$129.00"],
                ["Cork Desk Mat", "Natural  1", "$38.00"],
              ].map((row) => (
                <div key={row[0]} className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-slate-200 text-slate-400">
                    <Package className="size-4" />
                  </span>

                  <span className="flex-1">
                    <b className="block text-slate-800">{row[0]}</b>

                    {row[1]}
                  </span>

                  <b className="text-slate-800">{row[2]}</b>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span>Total</span>

                <b className="text-slate-900">$181.64</b>
              </div>
            </div>
          </Info>
        )}

        {/* =================================================
            Notification
        ================================================= */}

        {special === "notification" && (
          <Info>
            <p>
              <b className="text-slate-800">Project</b> Website Redesign
            </p>

            <p>
              <b className="text-slate-800">Role</b> Frontend Developer
            </p>

            <p>
              <b className="text-slate-800">Due</b> Sep 10
            </p>
          </Info>
        )}

        {/* =================================================
            CTA Button
        ================================================= */}

        <a
          href="#action"
          className="
            mt-7
            inline-block
            rounded-xl
            bg-indigo-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-[0_8px_18px_rgba(79,70,229,.25)]
          "
        >
          {template.cta}
        </a>
      </div>

      <Footer />
    </article>
  );
}

/* =====================================================
   Email Templates Listing Page
===================================================== */

export function EmailTemplatesIndex() {
  const [query, setQuery] = useState("");

  /* ---------------------------------------------------
     Filter Templates
  --------------------------------------------------- */

  const visible = useMemo(() => {
    return templates.filter((template) => {
      const searchableText = `${template.name} ${template.category}`.toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}

      <PageHeader
        breadcrumb={["Authentication", "Email Templates"]}
        title="Email Templates"
        subtitle="
          Reusable transactional email layouts
          for authentication, billing, orders
          and system notifications.
        "
      />

      {/* Search */}

      <div className="flex max-w-sm items-center gap-2">
        <Search className="size-4 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search templates"
        />
      </div>

      {/* Templates Grid */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((template) => (
          <Card
            key={template.id}
            bodyClassName="p-0"
            className="
              overflow-hidden
              transition
              duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            {/* Mini Email Preview */}

            <div
              className="
                h-48
                overflow-hidden
                bg-gradient-to-br
                from-slate-100
                to-indigo-50/60
                p-4
              "
            >
              <div
                className="origin-top scale-[.48]"
                style={{
                  width: "208%",
                }}
              >
                <EmailPreview template={template} />
              </div>
            </div>

            {/* Template Information */}

            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <Badge tone="primary">{template.category}</Badge>

                <h2 className="mt-2 text-sm font-semibold">{template.name}</h2>

                <p className="mt-1 text-xs text-muted-foreground">{template.subject}</p>
              </div>

              <Link
                to="/auth/email-templates/$template"
                params={{
                  template: template.id,
                }}
                className="
                  inline-flex
                  h-8
                  items-center
                  rounded-md
                  bg-primary
                  px-3
                  text-xs
                  font-medium
                  text-primary-foreground
                  hover:bg-primary/90
                "
              >
                Preview
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   Email Template Detail Page
===================================================== */

export function EmailTemplateDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  /* ---------------------------------------------------
     Find Selected Template
  --------------------------------------------------- */

  const template = templates.find((template) => template.id === id) ?? templates[0];

  /* ---------------------------------------------------
     Mobile / Desktop Preview
  --------------------------------------------------- */

  const [mobile, setMobile] = useState(false);

  /* ---------------------------------------------------
     Current Template Index
  --------------------------------------------------- */

  const index = templates.indexOf(template);

  return (
    <div className="space-y-5 pb-8">
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        breadcrumb={["Authentication", "Email Templates", template.name]}
        title={template.name}
        subtitle="
          Preview the transactional email layout
          across desktop and mobile widths.
        "
        actions={
          <>
            {/* Template Selector */}

            <label className="sr-only" htmlFor="template-selector">
              Select template
            </label>

            <select
              id="template-selector"
              value={template.id}
              onChange={(event) => {
                void navigate({ to: `/auth/email-templates/${event.target.value}` });
              }}
              className="
                h-9
                max-w-[190px]
                rounded-md
                border
                border-input
                bg-background
                px-3
                text-sm
              "
            >
              <option value="" disabled>
                Choose template
              </option>

              {templates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* Desktop / Mobile Toggle */}

            <div className="flex rounded-lg border border-border p-1">
              <Button
                size="sm"
                variant={mobile ? "ghost" : "secondary"}
                onClick={() => setMobile(false)}
                className="gap-1.5"
              >
                <Monitor className="size-3.5" />
                Desktop
              </Button>

              <Button
                size="sm"
                variant={mobile ? "secondary" : "ghost"}
                onClick={() => setMobile(true)}
                className="gap-1.5"
              >
                <Smartphone className="size-3.5" />
                Mobile
              </Button>
            </div>
          </>
        }
      />

      {/* =================================================
          Preview Area
      ================================================= */}

      <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-8">
        <div className="mx-auto mb-5 flex max-w-[600px] items-center justify-between text-xs text-muted-foreground">
          <span>{template.category} template</span>

          <span>
            {index + 1} of {templates.length}
          </span>
        </div>

        <div
          className={cn(
            "mx-auto transition-all duration-300",

            mobile ? "max-w-[360px]" : "max-w-[600px]",
          )}
        >
          <EmailPreview template={template} />
        </div>
      </div>

      {/* =================================================
          Previous / Next Navigation
      ================================================= */}

      <nav
        className="
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-border
          bg-card
          p-3
        "
        aria-label="Email template navigation"
      >
        {/* Previous */}

        {index > 0 ? (
          <Link
            to="/auth/email-templates/$template"
            params={{
              template: templates[index - 1].id,
            }}
            className="
              inline-flex
              h-9
              items-center
              rounded-md
              px-3
              text-sm
              font-medium
              hover:bg-muted
            "
          >
            <ChevronLeft className="me-1 size-4 rtl:rotate-180" />

            {templates[index - 1].name}
          </Link>
        ) : (
          <span className="px-3 text-sm text-muted-foreground">First template</span>
        )}

        {/* All Templates */}

        <Link
          to="/auth/email-templates"
          className="
            text-sm
            font-medium
            text-primary
            hover:underline
          "
        >
          All templates
        </Link>

        {/* Next */}

        {index < templates.length - 1 ? (
          <Link
            to="/auth/email-templates/$template"
            params={{
              template: templates[index + 1].id,
            }}
            className="
              inline-flex
              h-9
              items-center
              rounded-md
              px-3
              text-sm
              font-medium
              hover:bg-muted
            "
          >
            {templates[index + 1].name}

            <ChevronRight className="ms-1 size-4 rtl:rotate-180" />
          </Link>
        ) : (
          <span className="px-3 text-sm text-muted-foreground">Last template</span>
        )}
      </nav>
    </div>
  );
}
