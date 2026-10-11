import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, PageHeader } from "@/components/dashboard/widgets";

const steps = [
  {
    title: "Workspace",
    description: "Set up your basics",
    icon: Icons.Building2,
  },
  {
    title: "Your team",
    description: "Invite collaborators",
    icon: Icons.UsersRound,
  },
  {
    title: "Preferences",
    description: "Tailor your experience",
    icon: Icons.SlidersHorizontal,
  },
  {
    title: "Review",
    description: "Ready to launch",
    icon: Icons.CircleCheckBig,
  },
];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}

      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function MultiStepWizardApp() {
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState("Acme Studio");
  const [email, setEmail] = useState("elena@acme.com");
  const [team, setTeam] = useState(["elena@acme.com"]);
  const [invite, setInvite] = useState("");
  const [updates, setUpdates] = useState(true);
  const [tips, setTips] = useState(true);

  const current = steps[step];

  const next = () => {
    if (step === steps.length - 1) {
      toast.success("Workspace created successfully");
      setStep(0);
      return;
    }

    setStep(step + 1);
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Multi-step wizard"
        subtitle="Guided form flows that break complex work into simple steps."
        actions={
          <>
            <Button variant="outline" onClick={() => setStep(0)}>
              <Icons.RotateCcw className="me-2 size-4" />
              Reset wizard
            </Button>

            <Button onClick={() => toast.success("Wizard saved as draft")}>
              <Icons.Save className="me-2 size-4" />
              Save draft
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden border-primary/15">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-primary px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/60">
                Onboarding workflow
              </p>

              <h2 className="mt-2 text-2xl text-white  font-bold">Create your workspace</h2>

              <p className="mt-2 max-w-xl text-sm text-white/70">
                A focused, guided setup with progress, review, and safe navigation between steps.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur">
              <p className="text-xs text-white/65">Setup progress</p>

              <p className="mt-1 text-xl font-bold">
                {Math.round(((step + 1) / steps.length) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="overflow-x-auto">
            <div className="flex min-w-[650px] items-start">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = index === step;
                const done = index < step;

                return (
                  <div key={item.title} className="flex min-w-0 flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => index <= step && setStep(index)}
                      className="flex min-w-0 items-center gap-3 text-start"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          done
                            ? "border-primary bg-primary text-primary-foreground"
                            : active
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <Icons.Check className="size-4" /> : <Icon className="size-4" />}
                      </span>

                      <span>
                        <span
                          className={`block text-sm font-semibold ${
                            active || done ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {item.title}
                        </span>

                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                    </button>

                    {index < steps.length - 1 && (
                      <span
                        className={`mx-4 h-px flex-1 ${index < step ? "bg-primary" : "bg-border"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="overflow-hidden">
          <div className="flex items-start justify-between border-b border-border p-6">
            <div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <current.icon className="size-5" />
              </div>

              <h2 className="mt-4 text-xl font-semibold">{current.title}</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {step === 0
                  ? "Start with the information your team will see every day."
                  : step === 1
                    ? "Invite the people who will build with you."
                    : step === 2
                      ? "Choose how we keep you informed."
                      : "Check the details before creating your workspace."}
              </p>
            </div>

            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {step === 0 && (
              <div className="space-y-5">
                <Field
                  label="Workspace name"
                  hint="This appears in your dashboard and invitations."
                >
                  <Input value={workspace} onChange={(event) => setWorkspace(event.target.value)} />
                </Field>

                <Field label="Workspace URL" hint="You can change this later.">
                  <div className="flex">
                    <span className="inline-flex items-center rounded-s-md border border-e-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                      vexuiadmin.com/
                    </span>

                    <Input
                      className="rounded-s-none"
                      value={workspace.toLowerCase().replace(/\s+/g, "-")}
                      readOnly
                    />
                  </div>
                </Field>

                <Field label="Your role">
                  <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
                    <option>Operations</option>
                    <option>Product</option>
                    <option>Marketing</option>
                    <option>Engineering</option>
                  </select>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                  <p className="text-sm font-medium">Invite your teammates</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    You can invite more people later.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={invite}
                      onChange={(event) => setInvite(event.target.value)}
                      placeholder="name@company.com"
                    />

                    <Button
                      type="button"
                      onClick={() => {
                        if (invite.includes("@")) {
                          setTeam([...team, invite]);
                          setInvite("");
                          toast.success("Invite added");
                        } else toast.error("Enter a valid email address");
                      }}
                    >
                      Add invite
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-border rounded-xl border border-border">
                  {team.map((member, index) => (
                    <div
                      key={`${member}-${index}`}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-700">
                          {member.charAt(0).toUpperCase()}
                        </span>

                        <span className="text-sm">{member}</span>
                      </div>

                      {index === 0 ? (
                        <span className="text-xs text-muted-foreground">Owner</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setTeam(team.filter((_, itemIndex) => itemIndex !== index))
                          }
                        >
                          <Icons.X className="size-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {[
                  [
                    "Weekly workspace summary",
                    "A quick overview every Monday morning",
                    updates,
                    setUpdates,
                  ],
                  ["Helpful product tips", "Guides for getting more from Vexui", tips, setTips],
                ].map(([title, description, checked, setter]) => (
                  <div
                    key={title as string}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{title}</p>

                      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    </div>

                    <Switch
                      checked={checked as boolean}
                      onCheckedChange={setter as (checked: boolean) => void}
                    />
                  </div>
                ))}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-muted/40 p-4 text-sm">
                  <Checkbox defaultChecked />

                  <span>
                    <span className="block font-medium">Share anonymous usage data</span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      Help us improve the product for every team.
                    </span>
                  </span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-emerald-500/10 p-5">
                  <div className="flex gap-3">
                    <Icons.CircleCheckBig className="size-6 shrink-0 text-emerald-600" />

                    <div>
                      <h3 className="font-semibold text-emerald-800">
                        Your workspace is ready to create
                      </h3>

                      <p className="mt-1 text-sm text-emerald-700">
                        Review the setup summary below, then finish to launch.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-border rounded-xl border border-border">
                  {[
                    ["Workspace", workspace],
                    ["Owner", email],
                    ["Team invites", `${team.length} member${team.length === 1 ? "" : "s"}`],
                    ["Weekly summary", updates ? "Enabled" : "Disabled"],
                    ["Product tips", tips ? "Enabled" : "Disabled"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground">{label}</span>

                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
                <Icons.ArrowLeft className="me-2 size-4" />
                Back
              </Button>

              <Button onClick={next}>
                {step === steps.length - 1 ? (
                  <>
                    <Icons.Rocket className="me-2 size-4" />
                    Create workspace
                  </>
                ) : (
                  <>
                    Continue
                    <Icons.ArrowRight className="ms-2 size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        <aside className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Icons.Lightbulb className="size-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold">Why a wizard?</h3>

                <p className="text-xs text-muted-foreground">One decision at a time</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <Icons.Check className="size-4 shrink-0 text-primary" />
                Keeps complex forms manageable
              </li>

              <li className="flex gap-2">
                <Icons.Check className="size-4 shrink-0 text-primary" />
                Shows progress and reduces uncertainty
              </li>

              <li className="flex gap-2">
                <Icons.Check className="size-4 shrink-0 text-primary" />
                Lets users review before submitting
              </li>
            </ul>
          </Card>

          <Card className="bg-slate-950 p-5 text-white">
            <Icons.ShieldCheck className="size-5 text-emerald-400" />

            <h3 className="mt-3 text-sm text-white font-semibold">Safe to leave</h3>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Your progress can be saved as a draft at any point in the flow.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => toast.success("Draft saved")}
            >
              Save progress
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
