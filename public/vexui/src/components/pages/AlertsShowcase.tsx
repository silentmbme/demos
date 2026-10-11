import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { Card, PageHeader } from "@/components/dashboard/widgets";

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
   Alerts Showcase
===================================================== */

export function AlertsShowcase() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Alerts"
        subtitle="Contextual feedback, status messages, action prompts and announcements."
        breadcrumb={["Components", "UI Elements", "Alerts"]}
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
          Alerts Grid
      ================================================= */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ===============================================
            Soft Alerts
        =============================================== */}

        <CodeCard
          title="Soft"
          description="Tinted fill  the default variant, four tones."
          code={`<Alert
  tone="info"
  title="Heads up"
>
  
</Alert>

<Alert
  tone="success"
  title="Saved"
>
  
</Alert>`}
        >
          <div className="space-y-2.5">
            <Alert title="Heads up" tone="info" icon={Icons.Info}>
              A new dashboard layout is available in Layout Settings.
            </Alert>

            <Alert title="Saved" tone="success" icon={Icons.CheckCircle2}>
              Your changes have been saved successfully.
            </Alert>

            <Alert title="Storage almost full" tone="warning" icon={Icons.HardDrive}>
              You've used 92% of your plan's storage.
            </Alert>

            <Alert title="Payment failed" tone="danger" icon={Icons.CircleAlert}>
              We couldn't process your last invoice.
            </Alert>
          </div>
        </CodeCard>

        {/* ===============================================
            Solid Alerts
        =============================================== */}

        <CodeCard
          title="Solid"
          description="High-contrast status fills via variant=solid."
          code={`<Alert
  variant="solid"
  tone="info"
  title="Scheduled maintenance"
>
  
</Alert>`}
        >
          <div className="space-y-2.5">
            <Alert
              variant="solid"
              title="Scheduled maintenance"
              tone="info"
              icon={Icons.CalendarClock}
            >
              The API will be read-only on Sunday from 02:0004:00 UTC.
            </Alert>

            <Alert variant="solid" title="Deployment complete" tone="success" icon={Icons.Rocket}>
              Version 2.4.0 is now live in production.
            </Alert>

            <Alert
              variant="solid"
              title="Certificate expiring"
              tone="warning"
              icon={Icons.ShieldAlert}
            >
              Your SSL certificate expires in 14 days.
            </Alert>

            <Alert variant="solid" title="Build failed" tone="danger" icon={Icons.XCircle}>
              The main pipeline failed on the test stage.
            </Alert>
          </div>
        </CodeCard>

        {/* ===============================================
            Outline Alerts
        =============================================== */}

        <CodeCard
          title="Outline"
          description="Border-only alerts on the surface via variant=outline."
          code={`<Alert
  variant="outline"
  tone="success"
  title="Backup verified"
>
  
</Alert>`}
        >
          <div className="space-y-2.5">
            <Alert variant="outline" title="Tip" tone="info" icon={Icons.Lightbulb}>
              Press K to open the command palette anywhere.
            </Alert>

            <Alert
              variant="outline"
              title="Backup verified"
              tone="success"
              icon={Icons.DatabaseBackup}
            >
              Last night's backup was restored in a test environment.
            </Alert>

            <Alert variant="outline" title="Action required" tone="warning" icon={Icons.KeyRound}>
              Two-factor authentication is not enabled on this account.
            </Alert>
          </div>
        </CodeCard>

        {/* ===============================================
            Left Accent Alerts
        =============================================== */}

        <CodeCard
          title="Left accent"
          description="Surface card with a colored edge via variant=accent."
          code={`<Alert
  variant="accent"
  tone="info"
  title="New in v2.4"
>
  
</Alert>`}
        >
          <div className="space-y-2.5">
            <Alert variant="accent" title="New in v2.4" tone="info" icon={Icons.Sparkles}>
              Custom fields are now available on every record type.
            </Alert>

            <Alert variant="accent" title="Rate limit at 80%" tone="warning" icon={Icons.Gauge}>
              Consider caching frequent queries to stay under the limit.
            </Alert>

            <Alert
              variant="accent"
              title="All checks passed"
              tone="success"
              icon={Icons.CheckCheck}
            >
              12 of 12 integration checks completed without errors.
            </Alert>
          </div>
        </CodeCard>

        {/* ===============================================
            Alerts With Actions
        =============================================== */}

        <CodeCard
          title="With actions"
          description="Action slot, dismissible behavior and custom icon support."
          code={`<Alert
  title="Unsaved changes"
  icon={Pencil}
  onDismiss={close}
  action={
    <>
      <Button>
        Save now
      </Button>

      <Button>
        Discard
      </Button>
    </>
  }
>
  
</Alert>`}
        >
          {visible ? (
            <div className="space-y-2.5">
              <Alert
                title="Unsaved changes"
                tone="warning"
                icon={Icons.Pencil}
                onDismiss={() => setVisible(false)}
                action={
                  <>
                    <Button size="sm" onClick={() => toast.success("Changes saved")}>
                      Save now
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.message("Changes discarded")}
                    >
                      Discard
                    </Button>
                  </>
                }
              >
                You have edits on this page that haven't been saved.
              </Alert>

              <Alert
                tone="info"
                icon={Icons.SlidersHorizontal}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.message("Settings opened")}
                  >
                    Review settings
                  </Button>
                }
              >
                A compact alert with no title, just a message.
              </Alert>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setVisible(true)}>
              Restore dismissible alert
            </Button>
          )}
        </CodeCard>

        {/* ===============================================
            Announcement Alerts
        =============================================== */}

        <CodeCard
          title="Announcement"
          description="Gradient banner built from Alert as a page-local recipe."
          code={`<Alert
  className="border-0 bg-gradient-to-r from-primary to-primary/75 text-primary-foreground"
  title="Introducing AI insights"
>
  
</Alert>`}
        >
          <div className="space-y-2.5">
            <Alert
              title="Introducing AI insights"
              className="border-0 bg-gradient-to-r from-primary to-primary/75 text-primary-foreground"
              icon={Icons.Sparkles}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toast.message("AI insights opened")}
                >
                  Try it now
                </Button>
              }
            >
              <span className="text-white">Ask questions about your data in plain language.</span>
            </Alert>

            <Alert
              title="Webinar this Thursday"
              className="border-0 bg-gradient-to-r from-info to-primary text-primary-foreground"
              icon={Icons.Video}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toast.success("Registration opened")}
                >
                  Register
                </Button>
              }
            >
              <span className="text-white">
                {" "}
                Scaling dashboards to 1M rows live Q&A with the team.
              </span>
            </Alert>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
