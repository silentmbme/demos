import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Link2,
  LockKeyhole,
  Palette,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";

const sections = [
  { name: "Profile", icon: UserRound, note: "Personal details" },
  { name: "Account", icon: ShieldCheck, note: "Workspace preferences" },
  { name: "Security", icon: LockKeyhole, note: "Access and sign-in" },
  { name: "Notifications", icon: Bell, note: "Alerts and updates" },
  { name: "Appearance", icon: Palette, note: "Theme and display" },
  { name: "Connected Apps", icon: Link2, note: "External integrations" },
];

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-foreground">
      <span>{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function Toggle({
  title,
  detail,
  enabled = true,
}: {
  title: string;
  detail: string;
  enabled?: boolean;
}) {
  const [on, setOn] = useState(enabled);

  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-border p-3.5 text-start transition hover:bg-muted/45"
    >
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
      </span>

      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          on ? "bg-primary" : "bg-muted-foreground/25",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-4 rounded-full bg-white shadow-sm transition",
            on ? "start-6" : "start-1",
          )}
        />
      </span>
    </button>
  );
}

export function SettingsApp() {
  const [tab, setTab] = useState("Profile");

  const current = sections.find((section) => section.name === tab)!;
  const CurrentIcon = current.icon;

  const save = () =>
    toast.success(`${tab} settings saved`, {
      description: "Your changes have been applied.",
    });

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your account, workspace preferences, and security."
        actions={
          <Button onClick={save}>
            <Check className="me-2 size-4" />
            Save changes
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[248px_minmax(0,1fr)]">
        <Card className="h-fit p-2">
          <div className="px-3 pb-2 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace settings
            </p>
          </div>

          <nav className="space-y-1" aria-label="Settings sections">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = tab === section.name;

              return (
                <button
                  key={section.name}
                  type="button"
                  onClick={() => setTab(section.name)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{section.name}</span>
                    <span
                      className={cn(
                        "block truncate text-xs",
                        active ? "text-primary-foreground/75" : "text-muted-foreground",
                      )}
                    >
                      {section.note}
                    </span>
                  </span>

                  <ChevronRight className={cn("size-4", active ? "opacity-100" : "opacity-0")} />
                </button>
              );
            })}
          </nav>
        </Card>

        <Card
          title={`${tab} settings`}
          description={`Configure your ${tab.toLowerCase()} preferences.`}
          className="p-2 sm:p-3"
        >
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 p-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <CurrentIcon className="size-4" />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">{tab}</p>
              <p className="text-xs text-muted-foreground">
                Changes in this section are saved independently.
              </p>
            </div>
          </div>

          {tab === "Profile" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" value="Elena" />
              <Field label="Last name" value="Mrquez" />
              <Field label="Work email" value="elena@vexuiadmin.io" type="email" />
              <Field label="Phone" value="+1 415 555 0148" />
              <Field label="Job title" value="Operations Lead" />
              <Field label="Location" value="San Francisco, CA" />
            </div>
          )}

          {tab === "Account" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Workspace name" value="Vexui" />
              <Field label="Workspace URL" value="vexuiadmin.io" />

              <label className="space-y-1.5 text-sm font-medium">
                Language
                <select
                  defaultValue="English (US)"
                  className="h-10 w-full rounded-lg border bg-background px-3 font-normal"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium">
                Time zone
                <select
                  defaultValue="GMT-07:00 Pacific Time"
                  className="h-10 w-full rounded-lg border bg-background px-3 font-normal"
                >
                  <option>GMT-07:00 Pacific Time</option>
                  <option>GMT+00:00 UTC</option>
                  <option>GMT+05:30 India Standard Time</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Security" && (
            <div className="space-y-3">
              <Toggle
                title="Two-factor authentication"
                detail="Require a verification code when you sign in."
                enabled
              />
              <Toggle
                title="New device alerts"
                detail="Receive an alert when your account is used on a new device."
                enabled
              />
              <Toggle
                title="Session timeout"
                detail="Automatically sign out after 30 minutes of inactivity."
                enabled={false}
              />

              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">Password</p>
                <p className="mt-1 text-xs text-muted-foreground">Last updated 42 days ago.</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Change password
                </Button>
              </div>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="space-y-3">
              <Toggle
                title="Product updates"
                detail="News about releases and major improvements."
              />
              <Toggle
                title="Team activity"
                detail="Mentions, assignments, and collaborative updates."
              />
              <Toggle
                title="Weekly digest"
                detail="A concise report of workspace activity every Monday."
                enabled={false}
              />
              <Toggle
                title="Security notices"
                detail="Important sign-in and account-security information."
              />
            </div>
          )}

          {tab === "Appearance" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {["System", "Light", "Dark"].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    className={cn(
                      "rounded-xl border p-4 text-start transition hover:border-primary/50",
                      theme === "System" && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    )}
                  >
                    <span className="mb-5 block h-12 rounded-lg bg-muted" />
                    <span className="text-sm font-medium">{theme}</span>

                    {theme === "System" && <Badge className="ms-2">Active</Badge>}
                  </button>
                ))}
              </div>

              <label className="block space-y-1.5 text-sm font-medium">
                Accent color
                <select
                  defaultValue="Indigo"
                  className="h-10 w-full rounded-lg border bg-background px-3 font-normal"
                >
                  <option>Indigo</option>
                  <option>Emerald</option>
                  <option>Rose</option>
                </select>
              </label>
            </div>
          )}

          {tab === "Connected Apps" && (
            <div className="space-y-3">
              {[
                ["Google Workspace", "Calendar and document sync", true],
                ["Slack", "Workspace notifications", true],
                ["GitHub", "Repository activity and pull requests", false],
              ].map(([name, detail, linked]) => (
                <div
                  key={String(name)}
                  className="flex items-center gap-3 rounded-xl border border-border p-3.5"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-muted font-semibold text-muted-foreground">
                    {String(name).slice(0, 1)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{name}</span>
                    <span className="block text-xs text-muted-foreground">{detail}</span>
                  </span>

                  <Button variant={linked ? "outline" : "default"} size="sm">
                    {linked ? "Manage" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              variant="outline"
              onClick={() => toast.message("No unsaved changes to discard")}
            >
              Cancel
            </Button>

            <Button onClick={save}>
              <Check className="me-2 size-4" />
              Save {tab}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
