import { useState } from "react";
import {
  BrainCircuit,
  Bot,
  Target,
  Tags,
  Languages,
  FileText,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
  Search,
  Download,
  RotateCcw,
  Play,
  CheckCheck,
  Clock3,
} from "lucide-react";
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Model = {
  id: string;
  name: string;
  purpose: string;
  category: string;
  version: string;
  enabled: boolean;
  temperature: number;
  tokens: number;
  threshold: number;
  timeout: number;
  retries: number;
  humanReview: boolean;
  logging: boolean;
  prompt: string;
  tone: "primary" | "info" | "success" | "warning";
};
const defaults: Model[] = [
  {
    id: "MOD-01",
    name: "Insight engine",
    purpose: "Discover patterns and business opportunities",
    category: "Analytics",
    version: "v2.4",
    enabled: true,
    temperature: 0.3,
    tokens: 2048,
    threshold: 85,
    timeout: 30,
    retries: 1,
    humanReview: true,
    logging: false,
    prompt:
      "Summarize evidence clearly. Separate observations from recommendations and identify uncertainty.",
    tone: "primary",
  },
  {
    id: "MOD-02",
    name: "Support assistant",
    purpose: "Prepare helpful customer support responses",
    category: "Conversations",
    version: "v3.1",
    enabled: true,
    temperature: 0.6,
    tokens: 4096,
    threshold: 80,
    timeout: 45,
    retries: 2,
    humanReview: true,
    logging: false,
    prompt:
      "Use a clear, friendly tone. Escalate account and billing changes to a human specialist.",
    tone: "info",
  },
  {
    id: "MOD-03",
    name: "Forecast model",
    purpose: "Explore trends and business metric estimates",
    category: "Analytics",
    version: "v1.8",
    enabled: true,
    temperature: 0.2,
    tokens: 2048,
    threshold: 90,
    timeout: 60,
    retries: 1,
    humanReview: true,
    logging: false,
    prompt:
      "Describe assumptions and forecast limitations. Never present an estimate as a guaranteed outcome.",
    tone: "success",
  },
  {
    id: "MOD-04",
    name: "Content classifier",
    purpose: "Organize content by topic and intent",
    category: "Content",
    version: "v1.2",
    enabled: false,
    temperature: 0.1,
    tokens: 1024,
    threshold: 88,
    timeout: 20,
    retries: 1,
    humanReview: false,
    logging: false,
    prompt: "Assign relevant categories. Flag ambiguous content for review rather than guessing.",
    tone: "warning",
  },
  {
    id: "MOD-05",
    name: "Language assistant",
    purpose: "Draft translations and localized content",
    category: "Content",
    version: "v2.0",
    enabled: true,
    temperature: 0.4,
    tokens: 4096,
    threshold: 85,
    timeout: 45,
    retries: 1,
    humanReview: true,
    logging: false,
    prompt:
      "Preserve meaning and formatting. Flag culturally sensitive or ambiguous phrases for review.",
    tone: "info",
  },
  {
    id: "MOD-06",
    name: "Document summarizer",
    purpose: "Create structured summaries from documents",
    category: "Content",
    version: "v1.5",
    enabled: false,
    temperature: 0.2,
    tokens: 2048,
    threshold: 90,
    timeout: 60,
    retries: 2,
    humanReview: true,
    logging: false,
    prompt:
      "Summarize key points and preserve important qualifications. Do not introduce unsupported facts.",
    tone: "primary",
  },
];
const icons = [BrainCircuit, Bot, Target, Tags, Languages, FileText];
const colors = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};
function validation(m: Model) {
  if (!Number.isFinite(m.temperature) || m.temperature < 0 || m.temperature > 1)
    return "Temperature must be between 0 and 1.";
  if (!Number.isInteger(m.tokens) || m.tokens < 256 || m.tokens > 8192)
    return "Token limit must be a whole number from 256 to 8192.";
  if (!Number.isInteger(m.threshold) || m.threshold < 50 || m.threshold > 100)
    return "Confidence threshold must be a whole number from 50 to 100.";
  if (!Number.isInteger(m.timeout) || m.timeout < 5 || m.timeout > 120)
    return "Timeout must be a whole number from 5 to 120 seconds.";
  if (!Number.isInteger(m.retries) || m.retries < 0 || m.retries > 3)
    return "Retries must be a whole number from 0 to 3.";
  if (!m.prompt.trim() || m.prompt.length > 2000)
    return "Enter instructions between 1 and 2000 characters.";
  return "";
}
export function ModelSettingsPage() {
  const [models, setModels] = useState(defaults);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState<Model | null>(null);
  const [tab, setTab] = useState("Generation");
  const [error, setError] = useState("");
  const [check, setCheck] = useState("");
  const [notice, setNotice] = useState("");
  const [events, setEvents] = useState<
    { id: number; model: string; action: string; time: string }[]
  >([]);
  const record = (model: string, action: string) => {
    setEvents((prev) =>
      [
        {
          id: Date.now() + Math.random(),
          model,
          action,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ].slice(0, 5),
    );
    setNotice(`${model}: ${action}. Changes apply only to this session.`);
  };
  const visible = models.filter(
    (m) =>
      `${m.name} ${m.id} ${m.purpose}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (status === "All" || (status === "Active" ? m.enabled : !m.enabled)) &&
      (category === "All" || m.category === category),
  );
  const changed = models.filter(
    (m) => JSON.stringify(m) !== JSON.stringify(defaults.find((d) => d.id === m.id)),
  ).length;
  const open = (model: Model) => {
    setEditing({ ...model });
    setTab("Generation");
    setError("");
    setCheck("");
  };
  const exportSettings = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ environment: "demo", sessionOnly: true, models }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "demo-model-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Demo model configuration exported. No API credentials are included.");
  };
  return (
    <>
      <PageHeader
        title="Model Settings"
        subtitle="Manage model behavior, review thresholds, and configuration profiles in your AI workspace."
        breadcrumb={["Management", "AI Analytics", "Model Settings"]}
        actions={
          <Button variant="outline" onClick={exportSettings}>
            <Download className="size-4" />
            Export settings
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Model profiles",
            value: models.length,
            caption: "Three workspace categories",
            Icon: BrainCircuit,
            tone: "primary",
          },
          {
            label: "Active profiles",
            value: models.filter((m) => m.enabled).length,
            caption: `${models.filter((m) => !m.enabled).length} paused profiles`,
            Icon: Activity,
            tone: "success",
          },
          {
            label: "Human review enabled",
            value: models.filter((m) => m.humanReview).length,
            caption: "Demo review preferences",
            Icon: ShieldCheck,
            tone: "info",
          },
          {
            label: "Customized profiles",
            value: changed,
            caption: "Changed from sample defaults",
            Icon: SlidersHorizontal,
            tone: "warning",
          },
        ].map((s) => (
          <Card key={s.label} bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`grid size-11 place-items-center rounded-xl ${colors[s.tone as keyof typeof colors]}`}
              >
                <s.Icon className="size-5" />
              </span>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="mt-3 text-3xl font-semibold">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.caption}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Demo configuration workspace</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Configure illustrative model profiles without an API connection. Saving, activating,
              and validation checks update this page only; no live models, logging, or review
              policies are changed.
            </p>
          </div>
        </div>
        <Badge tone="primary">Session only</Badge>
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 sm:min-w-52">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search models"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search model profiles..."
                className="ps-9"
              />
            </div>
            <select
              aria-label="Model status"
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["All", "Active", "Paused"].map((v) => (
                <option key={v} value={v}>
                  {v === "All" ? "All statuses" : v}
                </option>
              ))}
            </select>
            <select
              aria-label="Model category"
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["All", "Analytics", "Conversations", "Content"].map((v) => (
                <option key={v} value={v}>
                  {v === "All" ? "All categories" : v}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {visible.map((m) => {
              const Icon = icons[defaults.findIndex((d) => d.id === m.id)];
              return (
                <Card key={m.id} bodyClassName="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid size-12 place-items-center rounded-2xl ${colors[m.tone]}`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge tone={m.enabled ? "success" : "muted"}>
                        {m.enabled ? "Active" : "Paused"}
                      </Badge>
                      <Switch
                        aria-label={`Enable ${m.name}`}
                        checked={m.enabled}
                        onCheckedChange={(enabled) => {
                          setModels((prev) =>
                            prev.map((model) =>
                              model.id === m.id ? { ...model, enabled } : model,
                            ),
                          );
                          record(m.name, enabled ? "Profile activated" : "Profile paused");
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] text-muted-foreground">
                    {m.id} / {m.category} / {m.version}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{m.name}</h2>
                  <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">
                    {m.purpose}
                  </p>
                  <div className="my-5 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-4">
                    {[
                      ["Temperature", m.temperature.toFixed(1)],
                      ["Output tokens", m.tokens.toLocaleString()],
                      ["Threshold", `${m.threshold}%`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={m.humanReview ? "info" : "muted"}>
                      {m.humanReview ? "Human review" : "Auto review preference"}
                    </Badge>
                    <Badge tone="muted">{m.timeout}s timeout</Badge>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      aria-label={`Configure ${m.id}`}
                      onClick={() => open(m)}
                    >
                      <SlidersHorizontal className="size-4" />
                      Configure
                    </Button>
                    <Button
                      variant="ghost"
                      aria-label={`Validate ${m.id}`}
                      onClick={() => {
                        const issue = validation(m);
                        record(
                          m.name,
                          issue
                            ? `Validation failed: ${issue}`
                            : "Local configuration validation passed",
                        );
                      }}
                    >
                      <CheckCheck className="size-4" />
                      Validate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          {!visible.length && (
            <Card bodyClassName="p-8 text-center">
              <p className="text-sm text-muted-foreground">No model profiles match your filters.</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setCategory("All");
                }}
              >
                Reset filters
              </Button>
            </Card>
          )}
        </div>
        <div className="space-y-5">
          <Card title="Configuration guide" bodyClassName="p-5">
            <div className="space-y-5">
              {[
                [
                  "Generation behavior",
                  "Lower temperatures favor consistent responses; higher values allow more variation.",
                ],
                [
                  "Confidence threshold",
                  "Sample minimum score preference for review. It does not guarantee accuracy.",
                ],
                [
                  "Output limits",
                  "Token limits control response length. Timeout and retry values are demo runtime preferences.",
                ],
              ].map(([label, text]) => (
                <div key={label}>
                  <h3 className="text-xs font-semibold">{label}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Session activity"
            description="Your five most recent configuration actions"
            bodyClassName="p-5"
          >
            {events.length ? (
              <ol className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="flex gap-3">
                    <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Clock3 className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{event.model}</p>
                      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                        {event.action}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{event.time}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="py-5 text-center">
                <Activity className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 text-xs text-muted-foreground">
                  Configuration changes appear here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Dialog
        open={!!editing}
        onOpenChange={(value) => {
          if (!value) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {editing?.name}</DialogTitle>
            <DialogDescription>
              {editing?.id} / Draft changes apply only when you save. No live model is connected.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const issue = validation(editing);
                setError(issue);
                if (issue) return;
                setModels((prev) =>
                  prev.map((m) =>
                    m.id === editing.id ? { ...editing, prompt: editing.prompt.trim() } : m,
                  ),
                );
                record(editing.name, "Configuration saved");
                setEditing(null);
              }}
            >
              <div
                role="group"
                aria-label="Configuration sections"
                className="mb-5 flex flex-wrap gap-2 rounded-xl bg-muted/40 p-2"
              >
                {["Generation", "Review & runtime", "Instructions"].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={tab === value ? "default" : "ghost"}
                    size="sm"
                    aria-pressed={tab === value}
                    onClick={() => setTab(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              {tab === "Generation" && (
                <div className="space-y-5">
                  <div className="rounded-xl bg-primary/5 p-4">
                    <p className="text-xs leading-5 text-muted-foreground">
                      Set response variation and output length. These controls edit a sample
                      profile.
                    </p>
                  </div>
                  <label className="block text-sm font-medium">
                    Temperature: {editing.temperature.toFixed(1)}
                    <input
                      aria-label="Model temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="mt-3 w-full accent-primary"
                      value={editing.temperature}
                      onChange={(e) => {
                        setEditing({ ...editing, temperature: Number(e.target.value) });
                        setCheck("");
                      }}
                    />
                    <span className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>Consistent</span>
                      <span>Creative</span>
                    </span>
                  </label>
                  <label className="block text-sm font-medium">
                    Maximum output tokens
                    <Input
                      aria-label="Maximum output tokens"
                      type="number"
                      min="256"
                      max="8192"
                      step="1"
                      className="mt-2"
                      value={editing.tokens}
                      onChange={(e) => {
                        setEditing({ ...editing, tokens: Number(e.target.value) });
                        setCheck("");
                      }}
                    />
                    <span className="mt-2 block text-xs font-normal text-muted-foreground">
                      256-8192 tokens. A token is a piece of text, not necessarily a word.
                    </span>
                  </label>
                </div>
              )}
              {tab === "Review & runtime" && (
                <div className="space-y-5">
                  <label className="block text-sm font-medium">
                    Confidence threshold (%)
                    <Input
                      aria-label="Confidence threshold"
                      type="number"
                      min="50"
                      max="100"
                      step="1"
                      className="mt-2"
                      value={editing.threshold}
                      onChange={(e) => {
                        setEditing({ ...editing, threshold: Number(e.target.value) });
                        setCheck("");
                      }}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium">
                      Timeout (seconds)
                      <Input
                        aria-label="Model timeout"
                        type="number"
                        min="5"
                        max="120"
                        step="1"
                        className="mt-2"
                        value={editing.timeout}
                        onChange={(e) => {
                          setEditing({ ...editing, timeout: Number(e.target.value) });
                          setCheck("");
                        }}
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Retry attempts
                      <Input
                        aria-label="Retry attempts"
                        type="number"
                        min="0"
                        max="3"
                        step="1"
                        className="mt-2"
                        value={editing.retries}
                        onChange={(e) => {
                          setEditing({ ...editing, retries: Number(e.target.value) });
                          setCheck("");
                        }}
                      />
                    </label>
                  </div>
                  {[
                    {
                      label: "Human review",
                      description: "Demo preference to flag outputs for human review.",
                      key: "humanReview" as const,
                    },
                    {
                      label: "Request logging",
                      description: "Demo preference only; enabling this does not log requests.",
                      key: "logging" as const,
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                    >
                      <div>
                        <label htmlFor={`model-${setting.key}`} className="text-sm font-medium">
                          {setting.label}
                        </label>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <Switch
                        id={`model-${setting.key}`}
                        checked={editing[setting.key]}
                        onCheckedChange={(checked) => {
                          setEditing({ ...editing, [setting.key]: checked });
                          setCheck("");
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {tab === "Instructions" && (
                <div>
                  <label htmlFor="model-instructions" className="text-sm font-medium">
                    Model instructions
                  </label>
                  <textarea
                    id="model-instructions"
                    aria-label="Model instructions"
                    rows={7}
                    maxLength={2000}
                    className="mt-3 w-full resize-y rounded-xl border border-border bg-card p-4 text-sm leading-6 outline-none focus:border-primary"
                    value={editing.prompt}
                    onChange={(e) => {
                      setEditing({ ...editing, prompt: e.target.value });
                      setCheck("");
                    }}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {editing.prompt.length}/2000 characters. Avoid putting credentials or private
                    customer details in instructions.
                  </p>
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              {check && (
                <p role="status" className="mt-4 rounded-lg bg-success/10 p-3 text-xs text-success">
                  {check}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing({ ...defaults.find((m) => m.id === editing.id)! });
                      setError("");
                      setCheck("");
                    }}
                  >
                    <RotateCcw className="size-4" />
                    Reset draft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const issue = validation(editing);
                      setError(issue);
                      setCheck(
                        issue
                          ? ""
                          : "All configuration fields are valid. This check does not test model outputs or connectivity.",
                      );
                    }}
                  >
                    <Play className="size-4" />
                    Validate draft
                  </Button>
                </div>
                <Button type="submit">Save configuration</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
