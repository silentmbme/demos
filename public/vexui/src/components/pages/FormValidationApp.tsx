import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function StateField({
  label,
  state,
  message,
  children,
}: {
  label: string;
  state: "success" | "error" | "default";
  message?: string;
  children: React.ReactNode;
}) {
  const colors =
    state === "error"
      ? "border-destructive focus-visible:ring-destructive"
      : state === "success"
        ? "border-emerald-500 focus-visible:ring-emerald-500"
        : "";

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>

      <div className="relative">
        {children}

        <span className="absolute end-3 top-1/2 -translate-y-1/2">
          {state === "success" && <Icons.CircleCheck className="size-4 text-emerald-500" />}

          {state === "error" && <Icons.CircleAlert className="size-4 text-destructive" />}
        </span>
      </div>

      {message && (
        <p
          className={`text-xs ${
            state === "error"
              ? "text-destructive"
              : state === "success"
                ? "text-emerald-600"
                : "text-muted-foreground"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function FormValidationApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timingEmail, setTimingEmail] = useState("");
  const [timingTouched, setTimingTouched] = useState(false);
  const [submitTiming, setSubmitTiming] = useState(false);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);

  const passwordRules = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password)];

  const passwordOk = passwordRules.every(Boolean);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (emailOk && passwordOk) {
      toast.success("Account created successfully");
    } else {
      toast.error("Please correct the highlighted fields");
    }
  };

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Form validation"
        subtitle="Clear validation states, useful messages, and friendly recovery patterns."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Validation rules saved")}>
              <Icons.ShieldCheck className="me-2 size-4" />
              Save rules
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.CircleCheckBig className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Field states</h2>
            <p className="text-sm text-muted-foreground">
              Use immediate, readable feedback near the field.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <DemoCard title="Default" description="Neutral helper text">
            <StateField
              label="Workspace name"
              state="default"
              message="Use the name your team recognizes."
            >
              <Input defaultValue="Vexui" className="pe-10" />
            </StateField>
          </DemoCard>

          <DemoCard title="Success" description="Input is ready to submit">
            <StateField label="Work email" state="success" message="This email is available.">
              <Input
                defaultValue="elena@vexuiadmin.com"
                className="border-emerald-500 pe-10 focus-visible:ring-emerald-500"
              />
            </StateField>
          </DemoCard>

          <DemoCard title="Error" description="Explain how to fix it">
            <StateField
              label="Website"
              state="error"
              message="Enter a valid URL, such as https://example.com."
            >
              <Input
                defaultValue="vexui admin"
                className="border-destructive pe-10 focus-visible:ring-destructive"
              />
            </StateField>
          </DemoCard>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
        <DemoCard
          title="Create your account"
          description="Inline validation after submitting the form"
        >
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Full name</Label>
                <Input placeholder="Jane Cooper" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Company</Label>
                <Input placeholder="Acme Inc." />
              </div>
            </div>

            <StateField
              label="Work email"
              state={email ? (emailOk ? "success" : "error") : submitted ? "error" : "default"}
              message={
                email
                  ? emailOk
                    ? "Looks good."
                    : "Please enter a valid email address."
                  : submitted
                    ? "Email is required."
                    : "We will use this for account updates."
              }
            >
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@company.com"
                className={`pe-10 ${
                  email &&
                  (emailOk
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : "border-destructive focus-visible:ring-destructive")
                }`}
              />
            </StateField>

            <StateField
              label="Password"
              state={
                password ? (passwordOk ? "success" : "error") : submitted ? "error" : "default"
              }
              message={
                password
                  ? passwordOk
                    ? "Strong password."
                    : "Your password does not meet all requirements."
                  : submitted
                    ? "Password is required."
                    : "Choose a strong password to protect your account."
              }
            >
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Create a password"
                className={`pe-10 ${
                  password &&
                  (passwordOk
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : "border-destructive focus-visible:ring-destructive")
                }`}
              />
            </StateField>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setSubmitted(false);
                }}
              >
                Clear form
              </Button>

              <Button type="submit">Create account</Button>
            </div>
          </form>
        </DemoCard>

        <DemoCard title="Password requirements" description="Guide the user while they type">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium">Password strength</span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                passwordOk ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
              }`}
            >
              {passwordOk ? "Strong" : password ? "In progress" : "Not set"}
            </span>
          </div>

          <div className="flex gap-1.5">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  passwordRules[index] ? "bg-emerald-500" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["At least 8 characters", passwordRules[0]],
              ["One uppercase letter", passwordRules[1]],
              ["One number", passwordRules[2]],
            ].map(([label, complete]) => (
              <div className="flex items-center gap-2 text-xs" key={label as string}>
                {complete ? (
                  <Icons.CircleCheck className="size-4 text-emerald-500" />
                ) : (
                  <Icons.Circle className="size-4 text-muted-foreground" />
                )}

                <span className={complete ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </DemoCard>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Icons.TriangleAlert className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Validation patterns</h2>
            <p className="text-sm text-muted-foreground">Helpful messages for complex forms.</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <DemoCard
            title="Form-level summary"
            description="Bring attention to fields that need review"
          >
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex gap-3">
                <Icons.CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />

                <div>
                  <p className="text-sm font-semibold text-destructive">
                    There are 2 issues to fix
                  </p>

                  <ul className="mt-2 space-y-1 text-xs text-destructive/90">
                    <li> Email address is required</li>
                    <li> Please accept the terms to continue</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <StateField label="Email" state="error" message="Email is required.">
                <Input className="border-destructive pe-10" />
              </StateField>

              <label className="flex items-center gap-2 text-xs text-destructive">
                <input type="checkbox" /> I agree to the terms of service
              </label>
            </div>
          </DemoCard>

          <DemoCard
            title="Async availability"
            description="Validate values that need a server check"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Workspace URL</Label>

                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-s-md border border-e-0 border-border bg-muted px-3 text-xs text-muted-foreground">
                    vexuiadmin.com/
                  </span>

                  <Input className="rounded-s-none" defaultValue="design-team" />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700">
                <Icons.CircleCheck className="size-4 shrink-0" />
                This workspace URL is available.
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Availability checked")}
              >
                Check availability
              </Button>
            </div>
          </DemoCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.TimerReset className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Validation timing</h2>
            <p className="text-sm text-muted-foreground">
              Choose when feedback appears for a calmer form experience.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <DemoCard title="On change" description="Feedback updates while the user types">
            <div className="space-y-2">
              <Label className="text-xs">Email address</Label>

              <Input defaultValue="invalid-email" className="border-destructive" />

              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <Icons.CircleAlert className="size-3.5" />
                Enter a valid email address.
              </div>

              <p className="pt-2 text-[11px] text-muted-foreground">
                Best for predictable input formats and passwords.
              </p>
            </div>
          </DemoCard>

          <DemoCard title="On blur" description="Validate after a field is finished">
            <div className="space-y-2">
              <Label className="text-xs">Email address</Label>

              <Input
                value={timingEmail}
                onChange={(event) => setTimingEmail(event.target.value)}
                onBlur={() => setTimingTouched(true)}
                placeholder="you@company.com"
                className={
                  timingTouched && !/^\S+@\S+\.\S+$/.test(timingEmail)
                    ? "border-destructive"
                    : timingTouched
                      ? "border-emerald-500"
                      : ""
                }
              />

              {timingTouched && (
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    /^\S+@\S+\.\S+$/.test(timingEmail) ? "text-emerald-600" : "text-destructive"
                  }`}
                >
                  {/^\S+@\S+\.\S+$/.test(timingEmail) ? (
                    <Icons.CircleCheck className="size-3.5" />
                  ) : (
                    <Icons.CircleAlert className="size-3.5" />
                  )}

                  {/^\S+@\S+\.\S+$/.test(timingEmail)
                    ? "Email looks good."
                    : "Enter a valid email address."}
                </div>
              )}

              <p className="pt-2 text-[11px] text-muted-foreground">
                Click outside the field to validate it.
              </p>
            </div>
          </DemoCard>

          <DemoCard title="On submit" description="Show messages only after the form is sent">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitTiming(true);
                toast.error("Please complete the required field");
              }}
            >
              <div className="space-y-2">
                <Label className="text-xs">Project name</Label>

                <Input
                  placeholder="Website redesign"
                  className={submitTiming ? "border-destructive" : ""}
                />

                {submitTiming && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive">
                    <Icons.CircleAlert className="size-3.5" />
                    Project name is required.
                  </div>
                )}
              </div>

              <Button type="submit" size="sm" className="mt-1">
                Submit form
              </Button>

              <p className="text-[11px] text-muted-foreground">
                Good for shorter forms with a single final action.
              </p>
            </form>
          </DemoCard>
        </div>
      </section>

      <DemoCard
        title="Validated contact request"
        description="Error messages remain close to the fields and preserve the user input"
      >
        <form
          className="grid gap-5 lg:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Request sent");
          }}
        >
          <div className="space-y-4">
            <StateField label="Project name" state="success" message="Name is available.">
              <Input defaultValue="Website redesign" className="border-emerald-500 pe-10" />
            </StateField>

            <StateField label="Budget" state="error" message="Enter a budget greater than $500.">
              <Input defaultValue="$100" className="border-destructive pe-10" />
            </StateField>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Project details</Label>

              <Textarea className="min-h-28" placeholder="Tell us what you are planning..." />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Send request</Button>
            </div>
          </div>
        </form>
      </DemoCard>
    </div>
  );
}
