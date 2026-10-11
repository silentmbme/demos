import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function ElementCard({
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
  hint,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
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

export function FormElementsApp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState("pro");
  const [volume, setVolume] = useState([64]);
  const [alerts, setAlerts] = useState(true);
  const [access, setAccess] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Form elements"
        subtitle="Core inputs, selection controls, and feedback states for every workflow."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Form configuration saved")}>
              <Icons.Save className="me-2 size-4" />
              Save configuration
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.TextCursorInput className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Text inputs</h2>
            <p className="text-sm text-muted-foreground">
              Standard text fields, input groups, sizes, and states.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ElementCard
            title="Basic inputs"
            description="Clear labels, helper text, and predictable dimensions"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input placeholder="Elena Marquez" />
              </Field>

              <Field label="Email address" required>
                <Input type="email" placeholder="elena@company.com" />
              </Field>

              <Field label="Phone">
                <Input type="tel" placeholder="+1 (415) 555-0136" />
              </Field>

              <Field label="Website">
                <Input type="url" placeholder="https://company.com" />
              </Field>

              <Field label="Read only">
                <Input readOnly defaultValue="PRJ-1048" className="bg-muted/40" />
              </Field>

              <Field label="Disabled">
                <Input disabled defaultValue="Unavailable" />
              </Field>
            </div>
          </ElementCard>

          <ElementCard
            title="Input variations"
            description="Choose a size to match the density of its context"
          >
            <div className="space-y-4">
              <Field label="Search">
                <div className="relative">
                  <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="ps-9" placeholder="Search workspace" />
                </div>
              </Field>

              <Field label="Password" hint="Use the icon to reveal the current value.">
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    defaultValue="Vexui2026"
                    className="pe-10"
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {passwordVisible ? (
                      <Icons.EyeOff className="size-4" />
                    ) : (
                      <Icons.Eye className="size-4" />
                    )}
                  </button>
                </div>
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Input className="h-8 text-xs" placeholder="Small" />
                <Input placeholder="Default" />
                <Input className="h-11 text-base" placeholder="Large" />
              </div>
            </div>
          </ElementCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <ElementCard
            title="Input groups"
            description="Combine useful context with a familiar text field"
          >
            <div className="space-y-4">
              <Field label="Profile URL">
                <div className="flex">
                  <span className="inline-flex items-center rounded-s-md border border-e-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                    vexui.com/
                  </span>
                  <Input className="rounded-s-none" placeholder="elena" />
                </div>
              </Field>

              <Field label="Budget">
                <div className="flex">
                  <span className="inline-flex items-center rounded-s-md border border-e-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                    $
                  </span>

                  <Input className="rounded-none" type="number" placeholder="0.00" />

                  <span className="inline-flex items-center rounded-e-md border border-s-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                    USD
                  </span>
                </div>
              </Field>

              <Field label="Search reports">
                <div className="flex">
                  <Input className="rounded-e-none" placeholder="Search reports" />

                  <Button
                    className="rounded-s-none"
                    onClick={() => toast.message("Search submitted")}
                  >
                    Search
                  </Button>
                </div>
              </Field>
            </div>
          </ElementCard>

          <ElementCard
            title="Textarea & character count"
            description="Long-form input with a visible maximum"
          >
            <Field label="Project notes" hint={`${note.length} / 240 characters`}>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 240))}
                placeholder="Add useful delivery context for the team..."
                className="min-h-36 resize-y"
              />
            </Field>

            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNote("");
                  toast.message("Notes cleared");
                }}
              >
                Clear notes
              </Button>
            </div>
          </ElementCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.ListChecks className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Choices & toggles</h2>
            <p className="text-sm text-muted-foreground">
              Use the right selection pattern for one, many, or binary choices.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          <ElementCard title="Radio cards" description="A visual single-selection control">
            <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-3 sm:grid-cols-3">
              {[
                ["starter", "Starter", "$0", "For personal work"],
                ["pro", "Pro", "$24", "For small teams"],
                ["scale", "Scale", "$79", "For growing teams"],
              ].map(([value, title, price, description]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    plan === value
                      ? "border-primary bg-primary/[.05] ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <RadioGroupItem value={value} />
                    <span className="text-sm font-semibold">{price}</span>
                  </div>

                  <p className="mt-4 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </label>
              ))}
            </RadioGroup>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <span className="text-sm">Selected plan</span>
              <strong className="capitalize">{plan}</strong>
            </div>
          </ElementCard>

          <ElementCard
            title="Checkboxes & switches"
            description="Multiple selections and binary preferences"
          >
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox defaultChecked />
                Share usage analytics
              </label>

              <label className="flex items-center gap-3 text-sm">
                <Checkbox />
                Include guest users in reports
              </label>

              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <Checkbox disabled />
                Restricted setting
              </label>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Product alerts</p>
                    <p className="text-xs text-muted-foreground">Feature and release messages</p>
                  </div>

                  <Switch checked={alerts} onCheckedChange={setAlerts} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Private workspace</p>
                    <p className="text-xs text-muted-foreground">
                      Only invited teammates can view it
                    </p>
                  </div>

                  <Switch checked={access} onCheckedChange={setAccess} />
                </div>
              </div>
            </div>
          </ElementCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Icons.SlidersHorizontal className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Special controls</h2>
            <p className="text-sm text-muted-foreground">
              Native, upload, and feedback controls for complete data capture.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ElementCard title="Range slider" description="Set a notification volume">
            <div className="pt-5">
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Silent</span>

                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {volume[0]}%
                </span>

                <span className="text-xs text-muted-foreground">Loud</span>
              </div>
            </div>
          </ElementCard>

          <ElementCard title="File upload" description="Browse or drop a file">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <Icons.UploadCloud className="size-6 text-primary" />

              <p className="mt-2 text-sm font-medium">
                {file ? file.name : "Upload an attachment"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">PDF, PNG, or JPG up to 10 MB</p>
            </button>
          </ElementCard>

          <ElementCard title="Native controls" description="Color, date, and time input types">
            <div className="space-y-4">
              <Field label="Accent color">
                <Input type="color" defaultValue="#6366f1" className="h-10 p-1" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date">
                  <Input type="date" />
                </Field>

                <Field label="Review time">
                  <Input type="time" />
                </Field>
              </div>
            </div>
          </ElementCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Icons.CircleAlert className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Field feedback</h2>
            <p className="text-sm text-muted-foreground">
              Make each state easy to identify and resolve.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ElementCard title="Success" description="A verified input">
            <Field label="Verified email">
              <div className="relative">
                <Input
                  defaultValue="elena@northstar.com"
                  className="border-emerald-500 pe-10 focus-visible:ring-emerald-500"
                />

                <Icons.CircleCheck className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-emerald-500" />
              </div>

              <p className="text-xs text-emerald-600">Email is verified.</p>
            </Field>
          </ElementCard>

          <ElementCard title="Error" description="Explain what needs to change">
            <Field label="Project slug">
              <div className="relative">
                <Input
                  defaultValue="North Star!"
                  className="border-destructive pe-10 focus-visible:ring-destructive"
                />

                <Icons.CircleAlert className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-destructive" />
              </div>

              <p className="text-xs text-destructive">
                Use lowercase letters, numbers, and hyphens only.
              </p>
            </Field>
          </ElementCard>

          <ElementCard title="Loading" description="Tell users when a check is running">
            <Field label="Workspace URL">
              <div className="relative">
                <Input defaultValue="Checking availability..." readOnly className="pe-10" />

                <Icons.LoaderCircle className="absolute end-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
              </div>

              <p className="text-xs text-muted-foreground">
                Checking this value in the background.
              </p>
            </Field>
          </ElementCard>
        </div>
      </section>
    </div>
  );
}
