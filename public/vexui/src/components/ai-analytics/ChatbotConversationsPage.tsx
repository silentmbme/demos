import { userImages, getUserImage } from "@/lib/user-images";
import { useState } from "react";
import {
  Bot,
  MessageSquare,
  CheckCheck,
  Clock3,
  Search,
  Send,
  ArrowUpRight,
  Download,
  ShieldCheck,
  StickyNote,
  Globe,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "Open" | "Resolved" | "Needs review";
type Message = { role: "customer" | "assistant" | "agent"; text: string; time: string };
const initialConversations = [
  {
    id: "CHAT-301",
    name: "Olivia Martin",
    email: "olivia@example.com",
    topic: "Order tracking",
    channel: "Website",
    status: "Resolved" as Status,
    time: "09:42 AM",
    confidence: 96,
    priority: "Normal",
    question: "Where can I find my order tracking details?",
    answer:
      "Open your order history and select the order. The tracking link appears when the shipment is dispatched.",
    tag: "Orders",
    tone: "primary",
  },
  {
    id: "CHAT-302",
    name: "James Wilson",
    email: "james@example.com",
    topic: "Invoice correction",
    channel: "Mobile",
    status: "Needs review" as Status,
    time: "09:30 AM",
    confidence: 78,
    priority: "High",
    question: "Can I update the billing address on my invoice?",
    answer:
      "An issued invoice may require a corrected copy. A billing specialist should review the request before changing it.",
    tag: "Billing",
    tone: "warning",
  },
  {
    id: "CHAT-303",
    name: "Sophia Lee",
    email: "sophia@example.com",
    topic: "Invite team members",
    channel: "Website",
    status: "Resolved" as Status,
    time: "09:18 AM",
    confidence: 94,
    priority: "Normal",
    question: "How do I invite my team to the workspace?",
    answer:
      "Open workspace settings, select Members, and enter your teammates' email addresses to invite them.",
    tag: "Onboarding",
    tone: "info",
  },
  {
    id: "CHAT-304",
    name: "Noah Patel",
    email: "noah@example.com",
    topic: "Account access",
    channel: "Website",
    status: "Open" as Status,
    time: "08:57 AM",
    confidence: 82,
    priority: "High",
    question: "I am having trouble signing in to my account.",
    answer:
      "Try the password reset option first. If you still cannot sign in, a support agent can review the account.",
    tag: "Account",
    tone: "success",
  },
  {
    id: "CHAT-305",
    name: "Emma Davis",
    email: "emma@example.com",
    topic: "Subscription options",
    channel: "Mobile",
    status: "Resolved" as Status,
    time: "08:35 AM",
    confidence: 95,
    priority: "Normal",
    question: "Where can I compare the available subscription plans?",
    answer:
      "Compare available plans on the pricing page. You can review your current subscription in workspace settings.",
    tag: "Plans",
    tone: "primary",
  },
  {
    id: "CHAT-306",
    name: "Liam Brown",
    email: "liam@example.com",
    topic: "Export workspace data",
    channel: "Website",
    status: "Open" as Status,
    time: "08:22 AM",
    confidence: 91,
    priority: "Normal",
    question: "Can I export my workspace data as a CSV file?",
    answer:
      "Look for the Export action on the relevant workspace page. Access may depend on your workspace permissions.",
    tag: "Workspace",
    tone: "info",
  },
  {
    id: "CHAT-307",
    name: "Ava Thompson",
    email: "ava@example.com",
    topic: "Unexpected charge",
    channel: "Mobile",
    status: "Needs review" as Status,
    time: "08:10 AM",
    confidence: 72,
    priority: "High",
    question: "I see an unexpected charge on my account. Can you check it?",
    answer:
      "A billing specialist needs to review the charge. Please use the secure billing support form; avoid sharing payment details in chat.",
    tag: "Billing",
    tone: "warning",
  },
  {
    id: "CHAT-308",
    name: "Ethan Miller",
    email: "ethan@example.com",
    topic: "Notification preferences",
    channel: "Website",
    status: "Resolved" as Status,
    time: "07:48 AM",
    confidence: 97,
    priority: "Normal",
    question: "How do I turn off email notifications?",
    answer:
      "Open your profile settings and choose Notifications. Update your email preferences and save the changes.",
    tag: "Settings",
    tone: "success",
  },
];
const photos: Record<string, string> = {
  "CHAT-301": userImages.user1,
  "CHAT-302": userImages.user2,
  "CHAT-303": getUserImage("sophia carter"),
  "CHAT-304": userImages.user4,
  "CHAT-305": userImages.user3,
  "CHAT-306": userImages.user2,
  "CHAT-307": userImages.user1,
  "CHAT-308": userImages.user4,
};
const color = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};
export function ChatbotConversationsPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selected, setSelected] = useState(initialConversations[0].id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [channel, setChannel] = useState("All");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [notice, setNotice] = useState("");
  const visible = conversations.filter(
    (c) =>
      (status === "All" || c.status === status) &&
      (channel === "All" || c.channel === channel) &&
      `${c.id} ${c.name} ${c.topic} ${c.tag}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const active = visible.find((c) => c.id === selected) ?? visible[0];
  const transcript: Message[] = active
    ? [
        { role: "customer", text: active.question, time: active.time },
        { role: "assistant", text: active.answer, time: active.time },
        ...(messages[active.id] ?? []),
      ]
    : [];
  const changeStatus = (value: Status) => {
    if (active) {
      setDraft("");
      setNoteDraft("");
      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, status: value } : c)),
      );
      setNotice(`${active.id} marked ${value.toLowerCase()} in this sample workspace.`);
    }
  };
  const choose = (id: string) => {
    setSelected(id);
    setDraft("");
    setNoteDraft("");
  };
  const exportTranscript = () => {
    if (!active) return;
    const text = [
      `${active.id} - ${active.name}`,
      `Topic: ${active.topic}`,
      `Status: ${active.status}`,
      "Sample conversation - no messages sent externally",
      "",
      ...transcript.map((m) => `${m.role} (${m.time}): ${m.text}`),
      "",
      `Internal note: ${notes[active.id] ?? "None"}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.id}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Sample transcript exported.");
  };
  return (
    <>
      <PageHeader
        title="Chatbot Assistant"
        subtitle="Review conversations, refine replies, and manage your support queue."
        breadcrumb={["Management", "AI Analytics", "Chatbot Assistant"]}
        actions={<Badge tone="primary">Sample workspace</Badge>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Conversations",
            value: conversations.length,
            caption: "Today, Oct 9, 2026",
            Icon: MessageSquare,
            tone: "primary",
          },
          {
            label: "Resolved",
            value: conversations.filter((c) => c.status === "Resolved").length,
            caption: "Reviewed and closed conversations",
            Icon: CheckCheck,
            tone: "success",
          },
          {
            label: "Awaiting response",
            value: conversations.filter((c) => c.status === "Open").length,
            caption: "Open conversations to follow up",
            Icon: Clock3,
            tone: "info",
          },
          {
            label: "Needs human review",
            value: conversations.filter((c) => c.status === "Needs review").length,
            caption: "Prioritize specialist requests",
            Icon: ShieldCheck,
            tone: "warning",
          },
        ].map(({ label, value, caption, Icon, tone }) => (
          <Card key={label} bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <span
                className={`grid size-10 place-items-center rounded-xl ${color[tone as keyof typeof color]}`}
              >
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
          </Card>
        ))}
      </div>
      {notice && (
        <p role="status" className="mb-4 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search conversations"
            className="ps-9"
            placeholder="Search name, topic, or reference..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDraft("");
              setNoteDraft("");
            }}
          />
        </div>
        <select
          aria-label="Conversation status"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setDraft("");
            setNoteDraft("");
          }}
        >
          {["All", "Open", "Resolved", "Needs review"].map((v) => (
            <option key={v} value={v}>
              {v === "All" ? "All statuses" : v}
            </option>
          ))}
        </select>
        <select
          aria-label="Conversation channel"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setDraft("");
            setNoteDraft("");
          }}
        >
          {["All", "Website", "Mobile"].map((v) => (
            <option key={v} value={v}>
              {v === "All" ? "All channels" : v}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{visible.length} conversations</span>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)_280px]">
        <Card title="Inbox" description="Choose a conversation to review" bodyClassName="p-2">
          <div className="max-h-[640px] space-y-1 overflow-y-auto">
            {visible.map((c) => (
              <button
                key={c.id}
                aria-label={`Open ${c.id}`}
                aria-pressed={active?.id === c.id}
                onClick={() => choose(c.id)}
                className={`w-full rounded-xl border p-3 text-start transition-colors ${active?.id === c.id ? "border-primary/30 bg-primary/5" : "border-transparent hover:bg-muted/50"}`}
              >
                <div className="flex gap-3">
                  <img
                    src={photos[c.id]}
                    alt={c.name}
                    className="size-10 shrink-0 rounded-full object-cover ring-2 ring-background"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{c.topic}</p>
                    <div className="mt-2 flex items-center justify-between gap-1">
                      <Badge
                        tone={
                          c.status === "Resolved"
                            ? "success"
                            : c.status === "Needs review"
                              ? "warning"
                              : "info"
                        }
                      >
                        {c.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{c.channel}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {!visible.length && (
            <div className="p-5 text-center">
              <Search className="mx-auto size-6 text-muted-foreground" />
              <p className="my-3 text-sm text-muted-foreground">No matching conversations</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setChannel("All");
                  setDraft("");
                  setNoteDraft("");
                }}
              >
                <RotateCcw className="size-3" />
                Reset filters
              </Button>
            </div>
          )}
        </Card>
        <Card
          title={active?.topic ?? "Conversation review"}
          description={
            active ? `${active.id} - ${active.name}` : "Choose a conversation from the inbox"
          }
          action={
            active ? (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Export conversation"
                onClick={exportTranscript}
              >
                <Download className="size-4" />
                Export
              </Button>
            ) : undefined
          }
          bodyClassName="p-0"
        >
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {active.channel === "Website" ? (
                    <Globe className="size-4" />
                  ) : (
                    <Smartphone className="size-4" />
                  )}
                  {active.channel}
                  <span className="text-border">/</span>
                  <Badge tone={active.priority === "High" ? "warning" : "muted"}>
                    {active.priority} priority
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {active.status !== "Resolved" ? (
                    <Button size="sm" variant="outline" onClick={() => changeStatus("Resolved")}>
                      <CheckCheck className="size-4" />
                      Mark resolved
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => changeStatus("Open")}>
                      Reopen
                    </Button>
                  )}
                  {active.status !== "Needs review" && (
                    <Button size="sm" variant="ghost" onClick={() => changeStatus("Needs review")}>
                      Flag for review
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-[420px] min-h-72 space-y-5 overflow-y-auto bg-muted/20 p-5">
                <p className="text-center text-[10px] text-muted-foreground">
                  October 9, 2026 - Illustrative transcript
                </p>
                {transcript.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${m.role !== "customer" ? "flex-row-reverse" : ""}`}
                  >
                    {m.role === "assistant" ? (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Bot className="size-4" />
                      </span>
                    ) : (
                      <img
                        src={m.role === "customer" ? photos[active.id] : userImages.user4}
                        alt={m.role === "customer" ? active.name : "Agent"}
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${m.role === "customer" ? "border border-border bg-card" : "border border-primary/10 bg-primary/5"}`}
                    >
                      <div className="mb-2 flex flex-wrap justify-between gap-3 text-[10px] text-muted-foreground">
                        <span className="font-semibold">
                          {m.role === "customer"
                            ? active.name
                            : m.role === "assistant"
                              ? "Sample AI assistant"
                              : "Agent preview"}
                        </span>
                        <span>{m.time}</span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-5">
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
                  <SparkleIcon />
                  Suggested follow-ups
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {[
                    "Thanks for reaching out. Could you share more details?",
                    "I will flag this request for a specialist to review.",
                  ].map((reply, i) => (
                    <button
                      key={reply}
                      disabled={active.status === "Resolved"}
                      onClick={() => setDraft(reply)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                      {i === 0 ? "Ask for details" : "Specialist review"}
                      <ArrowUpRight className="ms-2 inline size-3" />
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!draft.trim() || active.status === "Resolved") return;
                    setMessages((prev) => ({
                      ...prev,
                      [active.id]: [
                        ...(prev[active.id] ?? []),
                        { role: "agent", text: draft.trim(), time: "Preview" },
                      ],
                    }));
                    setDraft("");
                    setNotice(`Local reply preview added to ${active.id}. No message was sent.`);
                  }}
                >
                  <textarea
                    aria-label="Reply preview"
                    rows={3}
                    maxLength={2000}
                    disabled={active.status === "Resolved"}
                    placeholder={
                      active.status === "Resolved"
                        ? "Reopen this conversation to draft a reply."
                        : "Write a local reply preview..."
                    }
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary disabled:opacity-50"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] text-muted-foreground">
                      Demo only - no customer messages are sent.
                    </p>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!draft.trim() || active.status === "Resolved"}
                    >
                      <Send className="size-4" />
                      Add reply preview
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No conversation selected. Adjust your filters to see the inbox.
            </p>
          )}
        </Card>
        {active && (
          <div className="space-y-5 lg:col-span-2 2xl:col-span-1">
            <Card title="Conversation context" bodyClassName="p-5">
              <div className="flex items-center gap-3">
                <img
                  src={photos[active.id]}
                  alt={active.name}
                  className="size-11 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{active.name}</p>
                  <p className="break-all text-xs text-muted-foreground">{active.email}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-xs">
                {[
                  ["Topic", active.tag],
                  ["Channel", active.channel],
                  ["Status", active.status],
                  ["Messages", String(transcript.length)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card title="AI quality signal" bodyClassName="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sample confidence</span>
                <span className="text-lg font-semibold">{active.confidence}%</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${active.confidence < 85 ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${active.confidence}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {active.confidence < 85
                  ? "Review this response carefully. Account and billing changes need specialist verification."
                  : "Check the answer against your support guidance before resolving the conversation."}
              </p>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Illustrative score, not a model evaluation.
              </p>
            </Card>
            <Card
              title="Internal note"
              action={<StickyNote className="size-4 text-muted-foreground" />}
              bodyClassName="p-5"
            >
              {notes[active.id] && (
                <p className="mb-3 whitespace-pre-wrap break-words rounded-lg bg-warning/5 p-3 text-xs leading-5">
                  {notes[active.id]}
                </p>
              )}
              <textarea
                aria-label="Internal note"
                rows={3}
                maxLength={1000}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a review note..."
                className="w-full resize-none rounded-lg border border-border bg-card p-3 text-xs outline-none focus:border-primary"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                disabled={!noteDraft.trim()}
                onClick={() => {
                  setNotes((prev) => ({ ...prev, [active.id]: noteDraft.trim() }));
                  setNoteDraft("");
                  setNotice(`Internal note saved for ${active.id}.`);
                }}
              >
                Save note
              </Button>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Notes and replies last for this session.
              </p>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
function SparkleIcon() {
  return <Bot className="size-4" />;
}
