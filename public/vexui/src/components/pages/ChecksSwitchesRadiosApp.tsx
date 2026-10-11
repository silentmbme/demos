import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

import { Card, PageHeader } from "@/components/dashboard/widgets";

/* =====================================================
   Control Card
===================================================== */

type ControlCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

function ControlCard({ title, description, children, className = "" }: ControlCardProps) {
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

/* =====================================================
   Checks, Switches & Radios App
===================================================== */

export function ChecksSwitchesRadiosApp() {
  /* ---------------------------------------------------
     State
  --------------------------------------------------- */

  const [newsletter, setNewsletter] = useState(true);

  const [analytics, setAnalytics] = useState(false);

  const [notifications, setNotifications] = useState(true);

  const [billing, setBilling] = useState("monthly");

  const [role, setRole] = useState("editor");

  const [tasks, setTasks] = useState({
    research: true,
    design: false,
    testing: true,
  });

  const [channels, setChannels] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [view, setView] = useState("board");

  const [consent, setConsent] = useState(false);

  return (
    <div className="space-y-7 pb-8">
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        eyebrow="Forms"
        title="Checks, switches & radios"
        subtitle="Selection controls for simple choices, preferences, and configuration."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Control preferences saved")}>
              <Icons.Save className="me-2 size-4" />
              Save settings
            </Button>
          </>
        }
      />

      {/* =================================================
          Checkboxes
      ================================================= */}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.CheckSquare className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Checkboxes</h2>

            <p className="text-sm text-muted-foreground">
              Use checkboxes when people can select multiple options.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* ---------------------------------------------
              Basic Checkbox List
          --------------------------------------------- */}

          <ControlCard title="Basic checkbox list" description="Clear labels and helper text">
            <div className="space-y-4">
              {/* Newsletter */}

              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={newsletter}
                  onCheckedChange={(value) => setNewsletter(value === true)}
                  className="mt-0.5"
                />

                <span>
                  <span className="block text-sm font-medium">Weekly product newsletter</span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    A round-up of releases, tips, and product news.
                  </span>
                </span>
              </label>

              {/* Analytics */}

              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={analytics}
                  onCheckedChange={(value) => setAnalytics(value === true)}
                  className="mt-0.5"
                />

                <span>
                  <span className="block text-sm font-medium">Share anonymous analytics</span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    Help improve the dashboard experience.
                  </span>
                </span>
              </label>

              {/* Disabled */}

              <label className="flex items-start gap-3 opacity-55">
                <Checkbox disabled className="mt-0.5" />

                <span>
                  <span className="block text-sm font-medium">Required compliance setting</span>

                  <span className="mt-1 block text-xs text-muted-foreground">
                    This option is managed by your organization.
                  </span>
                </span>
              </label>
            </div>
          </ControlCard>

          {/* ---------------------------------------------
              Task Checklist
          --------------------------------------------- */}

          <ControlCard title="Task checklist" description="A compact multiple-selection list">
            <div className="divide-y divide-border rounded-xl border border-border">
              {[
                ["research", "Customer research", "Review interview notes"],
                ["design", "Design exploration", "Create first concept directions"],
                ["testing", "Usability testing", "Schedule five participants"],
              ].map(([id, title, description]) => (
                <label key={id} className="flex cursor-pointer items-center gap-3 p-4">
                  <Checkbox
                    checked={tasks[id as keyof typeof tasks]}
                    onCheckedChange={(value) =>
                      setTasks({
                        ...tasks,
                        [id]: value === true,
                      })
                    }
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{title}</span>

                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>

                  {tasks[id as keyof typeof tasks] && (
                    <Icons.CircleCheck className="size-4 text-emerald-500" />
                  )}
                </label>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {Object.values(tasks).filter(Boolean).length} of 3 tasks selected
            </p>
          </ControlCard>
        </div>
      </section>

      {/* =================================================
          Switches
      ================================================= */}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.ToggleRight className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Switches</h2>

            <p className="text-sm text-muted-foreground">
              Use a switch for a setting that turns on or off immediately.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          {/* ---------------------------------------------
              Notification Preferences
          --------------------------------------------- */}

          <ControlCard
            title="Notification preferences"
            description="Settings with a direct on/off action"
          >
            <div className="divide-y divide-border">
              {[
                [
                  "Workspace notifications",
                  "Activity and updates from your workspace",
                  notifications,
                  setNotifications,
                ],
                ["Product recommendations", "Personalized feature suggestions", true, () => {}],
                ["Security activity", "Sign-ins and account changes", true, () => {}],
              ].map(([title, description, checked, setter]) => (
                <div key={title as string} className="flex items-center justify-between gap-4 py-4">
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
            </div>
          </ControlCard>

          {/* ---------------------------------------------
              Live Setting
          --------------------------------------------- */}

          <ControlCard title="Live setting" description="A clear binary control">
            <div className={`rounded-2xl p-5 ${notifications ? "bg-emerald-500/10" : "bg-muted"}`}>
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-11 items-center justify-center rounded-xl ${
                    notifications
                      ? "bg-emerald-500 text-white"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  <Icons.BellRing className="size-5" />
                </span>

                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <h3 className="mt-5 font-semibold">
                {notifications ? "Notifications are on" : "Notifications are off"}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {notifications
                  ? "You will receive workspace alerts."
                  : "You will not receive workspace alerts."}
              </p>
            </div>
          </ControlCard>
        </div>
      </section>

      {/* =================================================
          Radio Groups
      ================================================= */}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Icons.CircleDot className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Radio groups</h2>

            <p className="text-sm text-muted-foreground">
              Use radio controls when only one option can be active.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* ---------------------------------------------
              Plan Selection
          --------------------------------------------- */}

          <ControlCard
            title="Plan selection"
            description="Visual cards make pricing options easier to compare"
          >
            <RadioGroup value={billing} onValueChange={setBilling} className="space-y-3">
              {[
                ["monthly", "Monthly", "$24 / month", "Flexible, cancel any time"],
                ["yearly", "Yearly", "$19 / month", "Save 20% with annual billing"],
                ["enterprise", "Enterprise", "Talk to us", "For teams with custom needs"],
              ].map(([value, title, price, description]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    billing === value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value={value} />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{title}</span>

                    <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                  </span>

                  <strong className="text-sm">{price}</strong>
                </label>
              ))}
            </RadioGroup>
          </ControlCard>

          {/* ---------------------------------------------
              Team Role
          --------------------------------------------- */}

          <ControlCard
            title="Team role"
            description="A simple radio group with a current-value panel"
          >
            <RadioGroup value={role} onValueChange={setRole} className="grid gap-3 sm:grid-cols-3">
              {[
                ["viewer", "Viewer", Icons.Eye],
                ["editor", "Editor", Icons.Pencil],
                ["admin", "Admin", Icons.ShieldCheck],
              ].map(([value, title, Icon]) => {
                const RoleIcon = Icon as Icons.LucideIcon;

                return (
                  <label
                    key={value as string}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition ${
                      role === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:border-primary/40"
                    }`}
                  >
                    <RadioGroupItem value={value as string} className="sr-only" />

                    <RoleIcon className="mx-auto size-5" />

                    <span className="mt-2 block text-sm font-medium">{title}</span>
                  </label>
                );
              })}
            </RadioGroup>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/40 p-4">
              <span className="text-sm text-muted-foreground">Selected role</span>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">
                {role}
              </span>
            </div>
          </ControlCard>
        </div>
      </section>

      {/* =================================================
          More Control Patterns
      ================================================= */}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Icons.Settings2 className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">More control patterns</h2>

            <p className="text-sm text-muted-foreground">
              Compact selection patterns for everyday product settings.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* ---------------------------------------------
              Notification Channels
          --------------------------------------------- */}

          <ControlCard
            title="Notification channels"
            description="Select multiple delivery channels"
          >
            <div className="space-y-3">
              {[
                ["email", "Email", "Receive updates in your inbox", Icons.Mail],
                ["push", "Push notifications", "Show browser and mobile alerts", Icons.Bell],
                ["sms", "SMS", "Use text messages for urgent updates", Icons.MessageSquare],
              ].map(([id, title, description, Icon]) => {
                const ChannelIcon = Icon as Icons.LucideIcon;

                return (
                  <label
                    key={id as string}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition hover:border-primary/40"
                  >
                    <Checkbox
                      checked={channels[id as keyof typeof channels]}
                      onCheckedChange={(value) =>
                        setChannels({
                          ...channels,
                          [id]: value === true,
                        })
                      }
                    />

                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ChannelIcon className="size-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{title}</span>

                      <span className="block text-xs text-muted-foreground">{description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </ControlCard>

          {/* ---------------------------------------------
              Segmented Radio Control
          --------------------------------------------- */}

          <ControlCard
            title="Segmented radio control"
            description="A compact single-choice alternative"
          >
            <div className="rounded-xl bg-muted p-1">
              <div className="grid grid-cols-3 gap-1">
                {[
                  ["board", "Board", Icons.Columns3],
                  ["list", "List", Icons.List],
                  ["calendar", "Calendar", Icons.CalendarDays],
                ].map(([value, label, Icon]) => {
                  const ViewIcon = Icon as Icons.LucideIcon;

                  return (
                    <button
                      type="button"
                      key={value as string}
                      onClick={() => setView(value as string)}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        view === value
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ViewIcon className="size-4" />

                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-border p-4">
              <p className="text-sm font-medium">
                {view.charAt(0).toUpperCase() + view.slice(1)} view selected
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                This keeps the radio behavior but uses a compact visual layout.
              </p>
            </div>
          </ControlCard>

          {/* ---------------------------------------------
              Consent Confirmation
          --------------------------------------------- */}

          <ControlCard
            title="Consent confirmation"
            description="A required acknowledgement before an action"
          >
            <div className="rounded-xl bg-muted/40 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(value) => setConsent(value === true)}
                  className="mt-0.5"
                />

                <span>
                  <span className="block text-sm font-medium">I agree to the workspace terms</span>

                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    I understand that this action shares the selected workspace information with
                    invited members.
                  </span>
                </span>
              </label>
            </div>

            <Button
              className="mt-4"
              disabled={!consent}
              onClick={() => toast.success("Workspace created")}
            >
              Continue
            </Button>
          </ControlCard>

          {/* ---------------------------------------------
              Status Switches
          --------------------------------------------- */}

          <ControlCard
            title="Status switches"
            description="Switches can clearly show operating status"
          >
            <div className="space-y-3">
              {[
                ["Automations", true, "Run rules when records change"],
                ["Maintenance mode", false, "Temporarily pause public access"],
                ["Public API", true, "Allow external integrations"],
              ].map(([label, checked, description]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{label}</p>

                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>

                  <Switch
                    defaultChecked={checked as boolean}
                    onCheckedChange={() => toast.message(`${label} updated`)}
                  />
                </div>
              ))}
            </div>
          </ControlCard>
        </div>
      </section>
    </div>
  );
}
