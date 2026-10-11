import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Bot,
  Sparkles,
  Plus,
  Send,
  MessageSquare,
  Copy,
  UserRound,
  Lightbulb,
  PenLine,
  Code2,
  Check,
  Download,
  Search,
  Paperclip,
  Link2,
  ImagePlus,
  Mic,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader, Badge } from "@/components/dashboard/widgets";
type Attachment = { id: string; name: string; url: string; kind: "file" | "image" | "link" };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};
type VoiceRecognition = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type Conversation = { id: string; title: string; messages: Message[] };
const suggestions = [
  {
    title: "Plan my day",
    prompt: "Help me plan a productive workday",
    color: "--warning",
    icon: Lightbulb,
  },
  {
    title: "Write an email",
    prompt: "Draft a friendly project update email",
    color: "--success",
    icon: PenLine,
  },
  {
    title: "Explain a concept",
    prompt: "Explain how React components work",
    color: "--info",
    icon: Code2,
  },
];
function demoReply(prompt: string) {
  const query = prompt.toLowerCase();
  if (query.includes("email"))
    return "Subject: Project update\n\nHi team,\n\nHere is a quick update on our project. We have completed the initial review and are working through the next milestones. Please share any blockers before our next check-in.\n\nThanks for your contributions!\n\nThis is a sample draft. Add your project details before sending.";
  if (query.includes("react") || query.includes("component"))
    return "React components are reusable pieces of an interface. A component receives inputs called props and returns the UI to display. State stores values that change over time, such as a selected tab or message draft.\n\nFor example, a Message component can accept a sender and text, while a Chat component keeps the message list in state.\n\nThis is a preset demo explanation.";
  if (query.includes("plan") || query.includes("day"))
    return "Here is a sample workday plan:\n\n09:00 — Choose your three most important tasks.\n09:30 — Focus on the highest-priority task.\n11:00 — Take a break and check messages.\n13:00 — Work on your second priority.\n15:00 — Collaborate and review progress.\n16:30 — Record next steps for tomorrow.\n\nAdjust these times to suit your schedule. This is a preset demo response.";
  return "This chat is running in demo mode with preset replies. Try “Plan my day”, “Write an email”, or “Explain how React components work” to explore the interface.\n\nYour messages stay in this page session. Connect an AI backend to support open-ended conversations.";
}
export function AiChat() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "chat-1", title: "New conversation", messages: [] },
  ]);
  const [activeId, setActiveId] = useState("chat-1");
  const [draft, setDraft] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<VoiceRecognition | null>(null);
  useEffect(() => () => recognitionRef.current?.abort(), []);
  useEffect(() => {
    recognitionRef.current?.abort();
  }, [activeId]);
  const endRef = useRef<HTMLDivElement>(null);
  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId, active?.messages.length]);
  function newChat() {
    const id = crypto.randomUUID();
    setConversations((current) => [{ id, title: "New conversation", messages: [] }, ...current]);
    setAttachments([]);
    setActiveId(id);
    setDraft("");
  }
  function send(text: string) {
    const content = text.trim();
    if ((!content && !attachments.length) || !active) return;
    const id = crypto.randomUUID();
    setConversations((current) =>
      current.map((c) =>
        c.id === active.id
          ? {
              ...c,
              title: c.messages.length
                ? c.title
                : (content || attachments[0]?.name || "Attachment").slice(0, 40),
              messages: [
                ...c.messages,
                { id, role: "user", content, attachments },
                {
                  id: id + "-reply",
                  role: "assistant",
                  content: attachments.length
                    ? "Attachments have been added to this local conversation. Demo mode does not upload, open, or analyze their contents.\n\n" +
                      demoReply(content)
                    : demoReply(content),
                },
              ],
            }
          : c,
      ),
    );
    setDraft("");
    setAttachments([]);
    recognitionRef.current?.abort();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }
  async function copy(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(message.id);
    } catch {
      toast.error("Could not copy the message");
    }
  }
  function exportChat() {
    if (!active?.messages.length) return;
    const content = active.messages
      .map(
        (message) => (message.role === "user" ? "You" : "Demo assistant") + ":\n" + message.content,
      )
      .join("\n\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-chat.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function attachFiles(files: FileList | null, imageOnly: boolean) {
    if (!files) return;
    const available = 4 - attachments.length;
    if (files.length > available) toast.error("Attach up to four items per message.");
    const added: Attachment[] = [];
    for (const file of Array.from(files).slice(0, Math.max(0, available))) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each attachment must be under 5 MB.");
        continue;
      }
      const isImage = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
      if (imageOnly && !isImage) {
        toast.error("Choose a JPG, PNG, WebP, or GIF image.");
        continue;
      }
      try {
        const url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        added.push({
          id: crypto.randomUUID(),
          name: file.name,
          url,
          kind: isImage ? "image" : "file",
        });
      } catch {
        toast.error("Could not read " + file.name);
      }
    }
    setAttachments((current) => [...current, ...added].slice(0, 4));
  }
  function attachLink() {
    try {
      const url = new URL(linkValue.trim());
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      if (attachments.length >= 4) {
        setLinkError("Attach up to four items per message.");
        return;
      }
      setAttachments((current) => [
        ...current,
        { id: crypto.randomUUID(), name: url.hostname, url: url.href, kind: "link" },
      ]);
      setLinkOpen(false);
      setLinkValue("");
    } catch {
      setLinkError("Enter a valid HTTP or HTTPS URL.");
    }
  }
  function voiceInput() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const browser = window as unknown as {
      SpeechRecognition?: new () => VoiceRecognition;
      webkitSpeechRecognition?: new () => VoiceRecognition;
    };
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new Constructor();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setDraft((current) => (current + " " + transcript).trim().slice(0, 4000));
    };
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice input could not start. Check microphone permission.");
    };
    recognition.onend = () => setListening(false);
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      toast.error("Could not start voice input.");
    }
  }
  return (
    <>
      <PageHeader
        title="AI Chat"
        subtitle="A focused space for ideas, writing, and everyday questions."
        breadcrumb={["Apps", "AI Chat"]}
        actions={
          <Badge tone="primary">
            <Sparkles className="size-3" />
            Demo assistant
          </Badge>
        }
      />
      <div className="vexui-card grid min-h-[650px] overflow-hidden lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-muted/30 p-5 lg:border-b-0 lg:border-e">
          <Button className="mb-5 w-full" onClick={newChat}>
            <Plus className="size-4" />
            New conversation
          </Button>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Conversations
          </p>
          <div className="relative mb-4">
            <Search className="absolute start-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              aria-label="Search conversations"
              placeholder="Search conversations"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card ps-9 pe-3 text-xs outline-none focus:border-primary/50"
            />
          </div>
          <div className="max-h-48 space-y-2 overflow-auto lg:max-h-[480px]">
            {conversations
              .filter((c) => c.title.toLowerCase().includes(historySearch.toLowerCase()))
              .map((c) => (
                <div
                  key={c.id}
                  className={
                    "flex items-center gap-1 rounded-lg " +
                    (c.id === activeId ? "border border-border bg-muted" : "hover:bg-muted")
                  }
                >
                  <button
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-3 text-start text-xs"
                    aria-current={c.id === activeId ? "true" : undefined}
                    onClick={() => {
                      setAttachments([]);
                      setActiveId(c.id);
                      setDraft("");
                    }}
                  >
                    <MessageSquare className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{c.title}</span>
                  </button>
                </div>
              ))}
          </div>
          <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Bot className="size-4 text-primary" />
              Local demo mode
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              Preset responses. Conversations stay in this page session.
            </p>
          </div>
        </aside>
        <section className="flex min-w-0 flex-col">
          <header className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="grid size-10 place-items-center rounded-xl bg-info/10 text-info">
              <Bot className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold">{active?.title}</h2>
              <p className="text-[11px] text-muted-foreground">
                Vexui assistant · Preset demo replies
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportChat}
              disabled={!active?.messages.length}
              aria-label="Export conversation"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </header>
          <div
            className="max-h-[560px] flex-1 overflow-y-auto p-5 sm:p-8"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {!active?.messages.length ? (
              <div className="mx-auto max-w-xl py-10 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-info/15 text-primary ring-8 ring-primary/5">
                  <Sparkles className="size-8" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold">What would you like to explore?</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Start with a sample prompt or write a message below.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => send(s.prompt)}
                      className="rounded-2xl border border-border bg-card p-5 text-start shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <span
                        className="mb-4 grid size-10 place-items-center rounded-xl"
                        style={{
                          color: `var(${s.color})`,
                          background: `color-mix(in oklch,var(${s.color}) 12%,transparent)`,
                        }}
                      >
                        <s.icon className="size-5" />
                      </span>
                      <p className="text-xs font-semibold">{s.title}</p>
                      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{s.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-6">
                {active.messages.map((message) => (
                  <article
                    key={message.id}
                    className={"flex gap-3 " + (message.role === "user" ? "flex-row-reverse" : "")}
                  >
                    <span
                      className={
                        "grid size-8 shrink-0 place-items-center rounded-lg " +
                        (message.role === "user" ? "bg-muted" : "bg-info/10 text-info")
                      }
                    >
                      {message.role === "user" ? (
                        <UserRound className="size-4" />
                      ) : (
                        <Bot className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 max-w-[85%]">
                      <p
                        className={
                          "mb-1 text-[10px] font-semibold text-muted-foreground " +
                          (message.role === "user" ? "text-end" : "")
                        }
                      >
                        {message.role === "user" ? "You" : "Demo assistant"}
                      </p>
                      <div
                        className={
                          "whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 " +
                          (message.role === "user"
                            ? "bg-primary/10 text-foreground border border-primary/15"
                            : "border border-border bg-muted/20")
                        }
                      >
                        {message.content}
                        {message.attachments?.map((item) => (
                          <div
                            key={item.id}
                            className="mt-3 rounded-lg border border-border bg-card p-2 text-foreground"
                          >
                            {item.kind === "image" && (
                              <img
                                src={item.url}
                                alt={item.name}
                                className="mb-2 max-h-48 rounded-md object-contain"
                              />
                            )}
                            <a
                              href={item.url}
                              download={item.kind !== "link" ? item.name : undefined}
                              target={item.kind === "link" ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="block break-all text-xs text-primary underline"
                            >
                              {item.name}
                            </a>
                          </div>
                        ))}
                      </div>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-7 text-[11px]"
                          onClick={() => copy(message)}
                        >
                          {copied === message.id ? (
                            <Check className="size-3" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                          {copied === message.id ? "Copied" : "Copy response"}
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="border-t border-border p-4 sm:px-6">
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                void attachFiles(e.target.files, false);
                e.target.value = "";
              }}
            />
            <input
              ref={imageRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(e) => {
                void attachFiles(e.target.files, true);
                e.target.value = "";
              }}
            />
            {!!attachments.length && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="flex max-w-full items-center gap-2 rounded-lg border border-border bg-muted/30 p-2"
                  >
                    {item.kind === "image" ? (
                      <img src={item.url} alt="" className="size-9 rounded object-cover" />
                    ) : (
                      <Paperclip className="size-4 text-primary" />
                    )}
                    <span className="max-w-40 truncate text-xs">{item.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      aria-label={`Remove attachment ${item.name}`}
                      onClick={() =>
                        setAttachments((current) => current.filter((a) => a.id !== item.id))
                      }
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/5">
              <textarea
                aria-label="Message AI assistant"
                rows={2}
                maxLength={4000}
                placeholder="Ask a question…"
                className="min-w-0 flex-1 resize-none bg-transparent p-2 text-sm outline-none"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() && !attachments.length}
                aria-label="Send message"
              >
                <Send className="size-4 rtl:-scale-x-100" />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Attach file"
                onClick={() => fileRef.current?.click()}
              >
                <Paperclip className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Attach link"
                onClick={() => {
                  setLinkError("");
                  setLinkOpen(true);
                }}
              >
                <Link2 className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Attach image"
                onClick={() => imageRef.current?.click()}
              >
                <ImagePlus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={"size-8 " + (listening ? "animate-pulse text-destructive" : "")}
                aria-label="Voice input"
                aria-pressed={listening}
                onClick={voiceInput}
              >
                <Mic className="size-4" />
              </Button>
              {listening && (
                <span role="status" className="text-xs text-destructive">
                  Listening? click to stop
                </span>
              )}
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Demo responses · Enter to send · Shift + Enter for a new line
            </p>
          </form>
        </section>
      </div>
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach a link</DialogTitle>
            <DialogDescription>
              Add a web link to your message. Links are not fetched in demo mode.
            </DialogDescription>
          </DialogHeader>
          <label htmlFor="chat-link" className="text-sm font-medium">
            URL
          </label>
          <input
            id="chat-link"
            type="url"
            placeholder="https://example.com"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
          />
          {linkError && (
            <p role="alert" className="text-sm text-destructive">
              {linkError}
            </p>
          )}
          <Button onClick={attachLink}>Add link</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
