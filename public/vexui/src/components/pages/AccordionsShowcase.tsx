import { useState } from "react";
import * as Icons from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";

/* =====================================================
   FAQ Data
===================================================== */

const questions = [
  [
    "What is included in the Growth plan?",
    "Growth includes unlimited projects, advanced analytics, workflow automation, priority support, and room for up to 25 team members.",
  ],
  [
    "Can I change plans later?",
    "Yes. Workspace administrators can upgrade or change billing frequency whenever your team needs change.",
  ],
  [
    "Do you offer a free trial?",
    "Every paid plan includes a 14-day trial with no credit card required.",
  ],
];

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
   Standard Accordion Items
===================================================== */

type StandardItemsProps = {
  icons?: boolean;
};

function StandardItems({ icons = false }: StandardItemsProps) {
  const questionIcons = [
    <Icons.CreditCard key="credit" className="size-4" />,

    <Icons.ArrowRightLeft key="change" className="size-4" />,

    <Icons.Sparkles key="trial" className="size-4" />,
  ];

  return (
    <>
      {questions.map(([question, answer], index) => (
        <AccordionItem key={question} value={`item-${index}`}>
          <AccordionTrigger>
            {icons ? (
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
                  {questionIcons[index]}
                </span>

                {question}
              </span>
            ) : (
              question
            )}
          </AccordionTrigger>

          <AccordionContent className="leading-6 text-muted-foreground">{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

/* =====================================================
   Accordions Showcase
===================================================== */

export function AccordionsShowcase() {
  const [all, setAll] = useState<string[]>(["a"]);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Accordions"
        subtitle="Expandable content patterns for help, settings, details and dense information."
        breadcrumb={["Components", "UI Elements", "Accordions"]}
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
            Single Open
        =============================================== */}

        <CodeCard
          title="Single open"
          description="The default disclosure pattern keeps one answer open at a time."
          code={`<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    
  </AccordionItem>
</Accordion>`}
        >
          <Accordion type="single" collapsible defaultValue="item-0">
            <StandardItems />
          </Accordion>
        </CodeCard>

        {/* ===============================================
            Multiple Open
        =============================================== */}

        <CodeCard
          title="Multiple open"
          description="Allow people to keep several sections expanded while comparing details."
          code={`<Accordion
  type="multiple"
  value={openItems}
  onValueChange={setOpenItems}
>
  
</Accordion>`}
        >
          <Accordion type="multiple" value={all} onValueChange={setAll}>
            <AccordionItem value="a">
              <AccordionTrigger>Workspace access</AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                Manage team invitations, roles and workspace permissions from the Team page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="b">
              <AccordionTrigger>Security controls</AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                Security settings include password, session and two-factor authentication controls.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="c">
              <AccordionTrigger>Billing preferences</AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                Use the Pricing and Invoices pages to manage plans, invoices and payment details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CodeCard>

        {/* ===============================================
            Icon Headers
        =============================================== */}

        <CodeCard
          title="Icon headers"
          description="A compact leading icon adds useful scanability to product-help content."
          code={`<AccordionTrigger>
  <span>
    <CreditCard />
    What is included?
  </span>
</AccordionTrigger>`}
        >
          <Accordion type="single" collapsible defaultValue="item-0">
            <StandardItems icons />
          </Accordion>
        </CodeCard>

        {/* ===============================================
            Boxed Items
        =============================================== */}

        <CodeCard
          title="Boxed items"
          description="Individual bordered surfaces create clear separation in dense settings pages."
          code={`<Accordion
  type="single"
  collapsible
  className="space-y-2"
>
  <AccordionItem
    className="rounded-xl border px-4"
  >
    
  </AccordionItem>
</Accordion>`}
        >
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem
              value="notifications"
              className="rounded-xl border px-4 data-[state=open]:border-primary/35"
            >
              <AccordionTrigger className="hover:no-underline">
                <span>
                  <b className="block">Notifications</b>

                  <small className="block font-normal text-muted-foreground">
                    Email, product and task preferences
                  </small>
                </span>
              </AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                Control which updates are delivered, how often they arrive, and when you would like
                to be notified.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="appearance"
              className="rounded-xl border px-4 data-[state=open]:border-primary/35"
            >
              <AccordionTrigger className="hover:no-underline">
                <span>
                  <b className="block">Appearance</b>

                  <small className="block font-normal text-muted-foreground">
                    Theme, accent and display preferences
                  </small>
                </span>
              </AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                Choose the theme and accent that work best for your workspace.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CodeCard>

        {/* ===============================================
            Status & Actions
        =============================================== */}

        <CodeCard
          title="Status & actions"
          description="Use badges and a trailing action for operational details or review queues."
          code={`<AccordionTrigger>
  <span>
    Deployment
    <Badge tone="success">
      Healthy
    </Badge>
  </span>
</AccordionTrigger>`}
        >
          <Accordion type="single" collapsible defaultValue="deploy">
            <AccordionItem value="deploy">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  Production deployment
                  <Badge tone="success">Healthy</Badge>
                </span>
              </AccordionTrigger>

              <AccordionContent>
                <p className="mb-3 leading-6 text-muted-foreground">
                  Version 2.4.0 completed successfully 18 minutes ago. All checks have passed.
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Deployment details opened")}
                >
                  View deployment
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="backup">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  Nightly backup
                  <Badge tone="warning">Review</Badge>
                </span>
              </AccordionTrigger>

              <AccordionContent className="leading-6 text-muted-foreground">
                The backup completed, but one archive is awaiting an integrity check.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CodeCard>

        {/* ===============================================
            Disabled & Controlled
        =============================================== */}

        <CodeCard
          title="Disabled & controlled"
          description="Unavailable disclosures remain visibly disabled; external buttons can also control state."
          code={`<Accordion
  type="single"
  value={active}
  onValueChange={setActive}
>
  
</Accordion>`}
        >
          <div className="space-y-4">
            {/* External Controls */}

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setAll(["release"])}>
                Open release notes
              </Button>

              <Button size="sm" variant="ghost" onClick={() => setAll([])}>
                Collapse all
              </Button>
            </div>

            <Accordion type="multiple" value={all} onValueChange={setAll}>
              <AccordionItem value="release">
                <AccordionTrigger>Release notes</AccordionTrigger>

                <AccordionContent className="leading-6 text-muted-foreground">
                  Version 2.4 adds custom fields, improved filters and new workspace controls.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="locked" disabled className="opacity-45">
                <AccordionTrigger>
                  Advanced compliance
                  <Badge size="sm">Enterprise</Badge>
                </AccordionTrigger>

                <AccordionContent>This content is unavailable.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
