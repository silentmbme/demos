import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, PageHeader } from "@/components/dashboard/widgets";

function DemoCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </Card>
  );
}

function Field({
  label,
  children,
  required = false,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="ms-0.5 text-destructive">*</span>}
      </Label>

      {children}

      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FormButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  return (
    <Button size="sm" onClick={() => toast.success("Changes saved successfully")}>
      {children}
    </Button>
  );
}

export function FormLayoutsApp() {
  const [step, setStep] = useState(1);
  const [progressStep, setProgressStep] = useState(1);

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Form layouts"
        subtitle="Common patterns for arranging controls and full-page form experiences."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("New layout created")}>
              <Icons.FilePlus2 className="me-2 size-4" />
              Create layout
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.LayoutPanelTop className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Field arrangement</h2>
            <p className="text-sm text-muted-foreground">
              Common ways to arrange labels and controls.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <DemoCard title="Vertical form" description="Labels stacked above each control">
            <div className="space-y-4">
              <Field label="Full name" required>
                <Input placeholder="Jane Cooper" />
              </Field>

              <Field label="Email" required>
                <Input type="email" placeholder="jane@example.com" />
              </Field>

              <Field label="Message">
                <Textarea placeholder="How can we help?" className="min-h-24" />
              </Field>

              <label className="flex items-center gap-2 text-xs">
                <Checkbox /> Subscribe to the newsletter
              </label>

              <div className="flex justify-end border-t border-border pt-4">
                <FormButton>Submit</FormButton>
              </div>
            </div>
          </DemoCard>

          <DemoCard
            title="Horizontal form"
            description="Labels beside controls, aligned in a column"
          >
            <div className="space-y-4">
              {[
                ["Company", <Input key="c" defaultValue="Acme Inc." />],
                [
                  "Website",
                  <div key="w" className="flex">
                    <span className="inline-flex items-center rounded-s-md border border-e-0 border-border bg-muted px-3 text-xs text-muted-foreground">
                      https://
                    </span>
                    <Input className="rounded-s-none" defaultValue="acme.com" />
                  </div>,
                ],
                [
                  "Time zone",
                  <select
                    key="t"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option>Pacific (UTC-08:00)</option>
                    <option>Eastern (UTC-05:00)</option>
                  </select>,
                ],
                [
                  "Bio",
                  <Textarea key="b" className="min-h-20" placeholder="Tell us about yourself..." />,
                ],
              ].map(([label, control]) => (
                <div
                  className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-center"
                  key={label as string}
                >
                  <Label className="text-xs">{label}</Label>
                  {control}
                </div>
              ))}

              <div className="flex justify-end border-t border-border pt-4">
                <FormButton />
              </div>
            </div>
          </DemoCard>
        </div>

        <div className="mt-5 space-y-5">
          <DemoCard title="Inline form" description="Compact fields on a single row">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Field label="Email">
                  <Input placeholder="teammate@company.com" />
                </Field>
              </div>

              <div className="sm:w-36">
                <Field label="Role">
                  <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </Field>
              </div>

              <FormButton>Send invite</FormButton>
            </div>
          </DemoCard>

          <DemoCard title="Two-column form" description="Related fields side by side">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <Input placeholder="Jane" />
              </Field>

              <Field label="Last name" required>
                <Input placeholder="Cooper" />
              </Field>

              <Field label="Email" required>
                <Input placeholder="jane@example.com" />
              </Field>

              <Field label="Company">
                <Input placeholder="Acme Inc." />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Message">
                  <Textarea placeholder="How can we help?" className="min-h-24" />
                </Field>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <FormButton />
            </div>
          </DemoCard>

          <DemoCard title="Floating labels" description="Labels float inside the field border">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["First name", "Jane"],
                ["Last name", "Cooper"],
                ["Email", "jane@example.com"],
                ["Password", ""],
              ].map(([label, placeholder]) => (
                <div className="relative pt-2" key={label}>
                  <Label className="absolute start-2 top-0 z-10 bg-card px-1 text-[11px] text-muted-foreground">
                    {label}
                  </Label>

                  <Input
                    placeholder={placeholder}
                    type={label === "Password" ? "password" : "text"}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <FormButton>Submit</FormButton>
            </div>
          </DemoCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Icons.Layers3 className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Complete layouts</h2>
            <p className="text-sm text-muted-foreground">
              Full-page patterns with clear hierarchy and actions.
            </p>
          </div>
        </div>

        <DemoCard
          title="Sectioned settings"
          description="Label and description on the left, control on the right"
        >
          <div className="divide-y divide-border">
            {[
              ["Public profile", "Make your profile visible to everyone", true],
              ["Product updates", "News about features and releases", true],
              ["Security alerts", "Alerts about sign-ins and security", false],
            ].map(([title, description, checked]) => (
              <div className="flex items-center justify-between gap-5 py-4" key={title as string}>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>

                <Switch defaultChecked={checked as boolean} />
              </div>
            ))}

            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The language used across the dashboard
                </p>
              </div>

              <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">Delete account</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently remove your account and all data
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.error("Delete action requires confirmation")}
              >
                <Icons.Trash2 className="me-2 size-3.5" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <FormButton />
          </div>
        </DemoCard>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <DemoCard title="Billing" description="Payment method and plan">
            <div className="grid gap-5 md:grid-cols-[1fr_180px]">
              <div className="space-y-4">
                <Field label="Name on card" required>
                  <Input placeholder="Jane Cooper" />
                </Field>

                <Field label="Card number" required>
                  <Input placeholder="4242 4242 4242 4242" />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry" required>
                    <Input placeholder="MM/YY" />
                  </Field>

                  <Field label="CVC" required>
                    <Input placeholder="123" />
                  </Field>
                </div>

                <Field label="Country">
                  <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                    <option>United States</option>
                  </select>
                </Field>
              </div>

              <div className="h-fit rounded-xl bg-muted/50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Order summary
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Pro plan</span>
                    <strong>$290.00</strong>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>$23.20</span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-3 text-sm font-semibold">
                    <span>Total</span>
                    <span>$313.20</span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => toast.success("Payment submitted")}
                >
                  Pay now
                </Button>
              </div>
            </div>
          </DemoCard>

          <DemoCard
            title="Sticky action bar"
            description="Actions stay visible while the form scrolls"
          >
            <div className="space-y-4">
              <Field label="About">
                <Textarea className="min-h-24" placeholder="Tell us about yourself..." />
              </Field>

              <Field label="Message">
                <Textarea className="min-h-24" placeholder="How can we help?" />
              </Field>

              <div className="flex items-center justify-between border-t border-border bg-card pt-4">
                <p className="text-xs text-muted-foreground">You have unsaved changes</p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                  <FormButton />
                </div>
              </div>
            </div>
          </DemoCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <DemoCard title="Multi-step form" description="A guided three-step flow">
            <div className="mb-6 flex items-center">
              {["Details", "Preferences", "Review"].map((label, index) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setStep(index + 1)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-start"
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                      step >= index + 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="hidden text-xs sm:block">
                    <span className="block font-medium">{label}</span>
                    <span className="text-muted-foreground">
                      {index === 0 ? "Your info" : index === 1 ? "Choose options" : "Confirm"}
                    </span>
                  </span>

                  {index < 2 && <span className="mx-2 h-px flex-1 bg-border" />}
                </button>
              ))}
            </div>

            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input placeholder="Jane Cooper" />
                </Field>

                <Field label="Email" required>
                  <Input placeholder="jane@example.com" />
                </Field>
              </div>
            ) : step === 2 ? (
              <div className="space-y-3 rounded-lg bg-muted/40 p-4 text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox defaultChecked /> Send product updates
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox /> Join the beta program
                </label>
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-700">
                Everything looks good. Review and submit your request.
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <Button
                size="sm"
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((value) => Math.max(1, value - 1))}
              >
                Back
              </Button>

              <Button
                size="sm"
                onClick={() =>
                  step === 3 ? toast.success("Form submitted") : setStep((value) => value + 1)
                }
              >
                {step === 3 ? "Submit" : "Next"}
              </Button>
            </div>
          </DemoCard>

          <DemoCard title="Multi-step progress" description="A progress-bar variant of the wizard">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">
                {progressStep === 1 ? "Details" : progressStep === 2 ? "Company" : "Review"}
              </span>

              <span className="text-muted-foreground">Step {progressStep} of 3</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressStep * 33.33}%` }}
              />
            </div>

            <div className="mt-5 space-y-4">
              {progressStep === 1 && (
                <>
                  <Field label="Company" required>
                    <Input placeholder="Acme Inc." />
                  </Field>

                  <Field label="Team size">
                    <select className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                      <option>11-50</option>
                    </select>
                  </Field>
                </>
              )}

              {progressStep === 2 && (
                <Field label="Workspace URL">
                  <Input placeholder="acme.vexuiadmin.com" />
                </Field>
              )}

              {progressStep === 3 && (
                <div className="rounded-lg bg-muted p-4 text-sm">
                  Ready to create your workspace.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                size="sm"
                variant="outline"
                disabled={progressStep === 1}
                onClick={() => setProgressStep((value) => value - 1)}
              >
                Back
              </Button>

              <Button
                size="sm"
                onClick={() =>
                  progressStep === 3
                    ? toast.success("Workspace created")
                    : setProgressStep((value) => value + 1)
                }
              >
                {progressStep === 3 ? "Finish" : "Next"}
              </Button>
            </div>
          </DemoCard>
        </div>
      </section>
    </div>
  );
}
