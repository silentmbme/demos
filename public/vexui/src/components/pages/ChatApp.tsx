import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { localImages } from "@/lib/local-images";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { getUserImage } from "@/lib/user-images";

/* =====================================================
   Types
===================================================== */

type Presence = "online" | "away" | "offline";

type Filter = "All" | "Unread" | "Groups" | "Archived";

type Message = {
  id: string;
  author: "me" | "them" | "system";
  text: string;
  time: string;
  reply?: string;
  reactions?: Record<string, number>;
  attachment?: {
    name: string;
    type: "image" | "file";
    url?: string;
  };
  pinned?: string;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  status: Presence;
  subtitle: string;
  time: string;
  unread: number;
  group?: boolean;
  muted?: boolean;
  pinned?: boolean;
  archived?: boolean;
  email: string;
  messages: Message[];
  members?: string[];
};

/* =====================================================
   Contacts
===================================================== */

const contacts = [
  "Sophia Carter",
  "Daniel Lee",
  "Olivia Smith",
  "Ethan Brown",
  "Emma Wilson",
  "Noah Williams",
  "Mia Johnson",
];

/* =====================================================
   Sample Messages
===================================================== */

const sampleMessages: Message[] = [
  {
    id: "date",
    author: "system",
    text: "Today",
    time: "",
  },
  {
    id: "m1",
    author: "them",
    text: "Can you review the updated onboarding flow before 3 PM?",
    time: "10:21 AM",
    reactions: {
      "": 2,
    },
  },
  {
    id: "m2",
    author: "me",
    text: "Yes, I will check it after the stand-up and leave comments in the prototype.",
    time: "10:24 AM",
  },
  {
    id: "m3",
    author: "them",
    text: "Perfect. I also added the mobile empty states for your review.",
    time: "10:26 AM",
    attachment: {
      name: "onboarding-flow.png",
      type: "image",
      url: localImages.chatOnboardingFlow,
    },
  },
  {
    id: "m4",
    author: "me",
    text: "This direction looks great. The hierarchy is much clearer now.",
    time: "10:29 AM",
    reply: "Perfect. I also added the mobile empty states...",
  },
];

/* =====================================================
   Initial Conversations
===================================================== */

const initialConversations: Conversation[] = [
  {
    id: "sophia",
    name: "Sophia Carter",
    initials: "SC",
    status: "online",
    subtitle: "Can you review the updated onboarding flow?",
    time: "2 min",
    unread: 2,
    pinned: true,
    email: "sophia.carter@vexuiadmin.com",
    messages: sampleMessages,
  },
  {
    id: "product",
    name: "Product Team",
    initials: "PT",
    status: "online",
    subtitle: "Daniel: Build is ready for QA",
    time: "10 min",
    unread: 4,
    group: true,
    email: "product@vexuiadmin.com",
    members: ["Sophia Carter", "Daniel Lee", "Olivia Smith", "You"],
    messages: [
      {
        id: "d",
        author: "system",
        text: "Today",
        time: "",
      },
      {
        id: "p1",
        author: "them",
        text: "The API integration is ready for QA.",
        time: "9:42 AM",
      },
      {
        id: "p2",
        author: "me",
        text: "Great, I will add it to the release checklist.",
        time: "9:48 AM",
      },
    ],
  },
  {
    id: "daniel",
    name: "Daniel Lee",
    initials: "DL",
    status: "away",
    subtitle: "Updated project timeline is ready",
    time: "35 min",
    unread: 0,
    email: "daniel.lee@vexuiadmin.com",
    messages: [
      {
        id: "d",
        author: "system",
        text: "Yesterday",
        time: "",
      },
      {
        id: "x",
        author: "them",
        text: "I shared the revised timeline with the team.",
        time: "4:15 PM",
      },
    ],
  },
  {
    id: "design",
    name: "Design Crew",
    initials: "DC",
    status: "online",
    subtitle: "Olivia: New visual direction attached",
    time: "1 hr",
    unread: 0,
    group: true,
    email: "design@vexuiadmin.com",
    members: ["Olivia Smith", "Emma Wilson", "You"],
    messages: sampleMessages.slice(0, 3),
  },
  {
    id: "emma",
    name: "Emma Wilson",
    initials: "EW",
    status: "offline",
    subtitle: "Thanks for the update!",
    time: "Yesterday",
    unread: 0,
    muted: true,
    email: "emma.wilson@vexuiadmin.com",
    messages: [
      {
        id: "d",
        author: "system",
        text: "Yesterday",
        time: "",
      },
      {
        id: "e",
        author: "them",
        text: "Thanks for the update!",
        time: "3:18 PM",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Ops",
    initials: "MO",
    status: "online",
    subtitle: "Campaign notes have been archived",
    time: "Mon",
    unread: 0,
    group: true,
    archived: true,
    email: "marketing@vexuiadmin.com",
    members: ["Mia Johnson", "Noah Williams", "You"],
    messages: sampleMessages.slice(0, 2),
  },
];

/* =====================================================
   Reactions
===================================================== */

const reactionOptions = ["", "", "", "", ""];

/* =====================================================
   Presence Dot
===================================================== */

function PresenceDot({ status }: { status: Presence }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 end-0 size-3 rounded-full border-2 border-card",
        status === "online"
          ? "bg-success"
          : status === "away"
            ? "bg-warning"
            : "bg-muted-foreground",
      )}
    />
  );
}

/* =====================================================
   Person Avatar
===================================================== */

function PersonAvatar({
  name,
  initials,
  status,
  image,
  className,
}: {
  name: string;
  initials: string;
  status?: Presence;
  image?: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)} title={name}>
      <Avatar>
        <AvatarImage src={image ?? getUserImage(name)} alt={name} className="object-cover" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {status && <PresenceDot status={status} />}
    </span>
  );
}

/* =====================================================
   Icon Button
===================================================== */

function IconButton({
  label,
  children,
  onClick,
  className,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* =====================================================
   Chat App
===================================================== */

export function ChatApp() {
  const [conversations, setConversations] = useState(initialConversations);

  const [activeId, setActiveId] = useState("sophia");

  const [filter, setFilter] = useState<Filter>("All");

  const [search, setSearch] = useState("");

  const [draft, setDraft] = useState("");

  const [reply, setReply] = useState<Message | null>(null);

  const [editing, setEditing] = useState<Message | null>(null);

  const [attachment, setAttachment] = useState<{
    name: string;
    type: "image" | "file";
    url?: string;
  } | null>(null);

  const [infoOpen, setInfoOpen] = useState(false);

  const [newChatOpen, setNewChatOpen] = useState(false);

  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const [action, setAction] = useState<{
    kind: "delete" | "pin";
    message: Message;
  } | null>(null);

  const [imagePreview, setImagePreview] = useState<Message | null>(null);

  const [groupName, setGroupName] = useState("");

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const [groupAction, setGroupAction] = useState<"add" | "rename" | "leave" | null>(null);

  const [conversationDeleteOpen, setConversationDeleteOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  /* ===================================================
     Active Conversation
  =================================================== */

  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];

  /* ===================================================
     Filtered Conversations
  =================================================== */
  const [mobileConversationsOpen, setMobileConversationsOpen] = useState(false);

  const displayed = useMemo(() => {
    return conversations
      .filter((item) => {
        const target = `${item.name} ${item.subtitle}`.toLowerCase();

        if (!target.includes(search.toLowerCase())) {
          return false;
        }

        if (filter === "Unread") {
          return item.unread > 0;
        }

        if (filter === "Groups") {
          return item.group;
        }

        if (filter === "Archived") {
          return item.archived;
        }

        return !item.archived;
      })
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [conversations, search, filter]);

  /* ===================================================
     Update Active Conversation
  =================================================== */

  const updateActive = (fn: (item: Conversation) => Conversation) => {
    setConversations((all) => all.map((item) => (item.id === activeId ? fn(item) : item)));
  };

  /* ===================================================
     Open Conversation
  =================================================== */

  const openConversation = (id: string) => {
    setActiveId(id);

    setMobileConversationsOpen(false);

    setConversations((all) =>
      all.map((item) =>
        item.id === id
          ? {
              ...item,
              unread: 0,
            }
          : item,
      ),
    );
  };

  /* ===================================================
     Send / Update Message
  =================================================== */

  const send = () => {
    const text = draft.trim();

    if (!text && !attachment) {
      return;
    }

    if (editing) {
      updateActive((item) => ({
        ...item,

        subtitle: text,

        messages: item.messages.map((msg) =>
          msg.id === editing.id
            ? {
                ...msg,
                text,
              }
            : msg,
        ),
      }));

      setEditing(null);
      setDraft("");

      toast.success("Message updated");

      return;
    }

    const msg: Message = {
      id: `m-${Date.now()}`,

      author: "me",

      text,

      time: "Now",

      reply: reply?.text,

      attachment: attachment ?? undefined,
    };

    setConversations((all) => [
      {
        ...active,

        subtitle: text || attachment?.name || "Attachment",

        time: "Now",

        messages: [...active.messages, msg],
      },

      ...all.filter((item) => item.id !== activeId),
    ]);

    setDraft("");
    setReply(null);
    setAttachment(null);

    toast.success("Message sent");
  };

  /* ===================================================
     Attachment
  =================================================== */

  const handleAttachment = (file?: File) => {
    if (!file) {
      return;
    }

    const isImage = file.type.startsWith("image/");

    setAttachment({
      name: file.name,

      type: isImage ? "image" : "file",

      url: isImage ? URL.createObjectURL(file) : undefined,
    });
  };

  /* ===================================================
     Reaction
  =================================================== */

  const reactTo = (messageId: string, emoji: string) => {
    updateActive((item) => ({
      ...item,

      messages: item.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,

              reactions: {
                ...message.reactions,

                [emoji]: (message.reactions?.[emoji] ?? 0) + 1,
              },
            }
          : message,
      ),
    }));
  };

  /* ===================================================
     Delete Message
  =================================================== */

  const deleteMessage = () => {
    if (!action) {
      return;
    }

    updateActive((item) => ({
      ...item,

      messages: item.messages.filter((message) => message.id !== action.message.id),
    }));

    setAction(null);

    toast.success("Message deleted");
  };

  /* ===================================================
     Pin Message
  =================================================== */

  const pinMessage = () => {
    if (!action) {
      return;
    }

    updateActive((item) => ({
      ...item,

      messages: item.messages.map((message) =>
        message.id === action.message.id
          ? {
              ...message,
              pinned: "Always",
            }
          : message,
      ),
    }));

    setAction(null);

    toast.success("Message pinned");
  };

  /* ===================================================
     Create Group
  =================================================== */

  const createGroup = () => {
    if (!groupName.trim() || !selectedContacts.length) {
      return;
    }

    const id = `group-${Date.now()}`;

    const group: Conversation = {
      id,

      name: groupName,

      initials: groupName.slice(0, 2).toUpperCase(),

      status: "online",

      subtitle: "Group created",

      time: "Now",

      unread: 0,

      group: true,

      email: "group@vexuiadmin.com",

      members: [...selectedContacts, "You"],

      messages: [
        {
          id: "welcome",

          author: "system",

          text: "Group created today",

          time: "",
        },
      ],
    };

    setConversations((all) => [group, ...all]);

    setActiveId(id);

    setCreateGroupOpen(false);

    setNewChatOpen(false);

    setGroupName("");

    setSelectedContacts([]);

    toast.success("Group created");
  };

  return (
    <div className="flex h-[calc(100dvh-7rem)] min-h-[34rem] min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm md:h-[calc(100vh-10rem)] md:min-h-[36rem]">
      <button
        type="button"
        aria-label="Close conversations"
        onClick={() => setMobileConversationsOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/35 md:hidden",
          !mobileConversationsOpen && "pointer-events-none opacity-0",
        )}
      />
      {/* =================================================
          Conversations Sidebar
      ================================================= */}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-[min(20rem,88vw)] shrink-0 flex-col border-e bg-card shadow-2xl transition-transform duration-200 md:static md:z-auto md:w-[310px] md:translate-x-0 rtl:md:translate-x-0 md:shadow-none xl:w-[330px]",
          mobileConversationsOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        {/* Sidebar Header */}

        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h1 className="text-lg font-semibold">Messages</h1>

            <p className="text-xs text-muted-foreground">Your conversations</p>
          </div>

          <IconButton label="New chat" onClick={() => setNewChatOpen(true)}>
            <Icons.SquarePen className="size-4" />
          </IconButton>
        </div>

        {/* Search + Filters */}

        <div className="space-y-3 p-3">
          <label className="relative block">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages"
              className="h-10 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <div className="flex gap-1 overflow-x-auto">
            {(["All", "Unread", "Groups", "Archived"] as Filter[]).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium",
                  filter === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {displayed.length ? (
            displayed.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => openConversation(item.id)}
                className={cn(
                  "mb-1 flex w-full gap-3 rounded-lg p-3 text-start transition hover:bg-muted",
                  activeId === item.id && "bg-primary/10",
                )}
              >
                <PersonAvatar name={item.name} initials={item.initials} status={item.status} />

                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2">
                    <b className="truncate text-sm">{item.name}</b>

                    <small className="shrink-0 text-[11px] text-muted-foreground">
                      {item.time}
                    </small>
                  </span>

                  <span className="mt-1 flex items-center gap-1.5">
                    <small className="truncate text-muted-foreground">{item.subtitle}</small>

                    {item.muted && <Icons.BellOff className="size-3 shrink-0" />}
                  </span>
                </span>

                <span className="flex flex-col items-end gap-1">
                  {item.pinned && <Icons.Pin className="size-3 text-primary" />}

                  {item.unread > 0 && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {item.unread}
                    </span>
                  )}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-16 text-center text-sm text-muted-foreground">
              No conversations found.
            </div>
          )}
        </div>
      </aside>

      {/* =================================================
          Main Chat
      ================================================= */}

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Chat Header */}

        <header className="shrink-0 flex items-center justify-between border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <IconButton
              label="Open conversations"
              className="md:hidden"
              onClick={() => setMobileConversationsOpen(true)}
            >
              <Icons.Menu className="size-4" />
            </IconButton>
            <PersonAvatar name={active.name} initials={active.initials} status={active.status} />

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{active.name}</h2>

              <p className="text-xs text-muted-foreground">
                {active.status === "online"
                  ? "Online now"
                  : active.status === "away"
                    ? "Away"
                    : "Last seen recently"}
              </p>
            </div>
          </div>

          <div className="flex">
            <IconButton label="Call" className="hidden sm:inline-flex">
              <Icons.Phone className="size-4" />
            </IconButton>

            <IconButton label="Video call" className="hidden sm:inline-flex">
              <Icons.Video className="size-4" />
            </IconButton>

            <IconButton label="Search conversation" className="hidden sm:inline-flex">
              <Icons.Search className="size-4" />
            </IconButton>

            <IconButton label="Conversation info" onClick={() => setInfoOpen(true)}>
              <Icons.PanelRight className="size-4" />
            </IconButton>
          </div>
        </header>

        {/* Messages */}

        <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20 p-4 lg:p-6">
          {active.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReply={() => {
                setReply(message);

                setEditing(null);
              }}
              onEdit={() => {
                setEditing(message);

                setDraft(message.text);

                setReply(null);
              }}
              onDelete={() =>
                setAction({
                  kind: "delete",
                  message,
                })
              }
              onPin={() =>
                setAction({
                  kind: "pin",
                  message,
                })
              }
              onReact={(emoji) => reactTo(message.id, emoji)}
              onImage={() => setImagePreview(message)}
            />
          ))}

          {active.status === "online" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex gap-1">
                <i className="size-1.5 animate-bounce rounded-full bg-primary" />

                <i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />

                <i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </span>
              {active.name.split(" ")[0]} is typing...
            </div>
          )}
        </section>

        {/* Message Composer */}

        <footer className="shrink-0 border-t p-3">
          {/* Reply / Editing */}

          {(reply || editing) && (
            <div className="mb-2 flex items-center justify-between rounded-md bg-muted px-3 py-2 text-xs">
              <span>
                <b>
                  {editing
                    ? "Editing message"
                    : `Replying to ${reply?.author === "me" ? "You" : active.name}`}
                </b>

                <span className="ms-2 text-muted-foreground">
                  {(editing?.text ?? reply?.text)?.slice(0, 56)}
                </span>
              </span>

              <IconButton
                label="Cancel"
                onClick={() => {
                  setReply(null);

                  setEditing(null);

                  setDraft("");
                }}
              >
                <Icons.X className="size-4" />
              </IconButton>
            </div>
          )}

          {/* Attachment */}

          {attachment && (
            <div className="mb-2 flex items-center justify-between rounded-md border bg-muted/50 p-2 text-xs">
              <span className="flex items-center gap-2">
                {attachment.type === "image" ? (
                  <Icons.Image className="size-4 text-primary" />
                ) : (
                  <Icons.File className="size-4 text-primary" />
                )}

                {attachment.name}
              </span>

              <IconButton label="Remove attachment" onClick={() => setAttachment(null)}>
                <Icons.X className="size-4" />
              </IconButton>
            </div>
          )}

          {/* Composer */}

          <div className="flex items-end gap-2">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(event) => handleAttachment(event.target.files?.[0])}
            />

            <IconButton label="Attach file" onClick={() => inputRef.current?.click()}>
              <Icons.Paperclip className="size-4" />
            </IconButton>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  send();
                }
              }}
              rows={1}
              placeholder={editing ? "Edit message" : "Write a message"}
              className="max-h-28 min-h-10 flex-1 resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />

            <IconButton label="Add emoji" onClick={() => setDraft((value) => value + " ")}>
              <Icons.Smile className="size-4" />
            </IconButton>

            <Button size="icon" aria-label="Send message" onClick={send}>
              <Icons.Send className="size-4" />
            </Button>
          </div>
        </footer>
      </main>

      {/* =================================================
          Conversation Info Sheet
      ================================================= */}

      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          <SheetHeader className="border-b px-5 pb-4 pt-5 text-start">
            <SheetTitle>{active.group ? "Group information" : "Contact information"}</SheetTitle>
            <SheetDescription>
              Conversation details, shared items, and notification controls.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-5">
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div className="h-20 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent" />
              <div className="-mt-9 px-4 pb-4">
                <PersonAvatar
                  name={active.name}
                  initials={active.initials}
                  image={getUserImage(active.name)}
                  className="[&_span]:size-[72px] [&_span]:border-4 [&_span]:border-card"
                />
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{active.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {active.group ? `${active.members?.length ?? 0} members` : active.email}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      active.status === "online"
                        ? "bg-success/15 text-success"
                        : active.status === "away"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {active.status === "online"
                      ? "Available"
                      : active.status === "away"
                        ? "Away"
                        : "Offline"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setInfoOpen(false)}
                  >
                    <Icons.MessageSquare className="size-3.5" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => toast.info("Voice call started")}
                  >
                    <Icons.Phone className="size-3.5" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => toast.info("Video call started")}
                  >
                    <Icons.Video className="size-3.5" />
                    Video
                  </Button>
                </div>
              </div>
            </section>

            {!active.group && (
              <InfoSection title="Contact details">
                <div className="divide-y overflow-hidden rounded-xl border">
                  <a
                    href={`mailto:${active.email}`}
                    className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icons.Mail className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-muted-foreground">Email</span>
                      <span className="block truncate text-sm font-medium">{active.email}</span>
                    </span>
                    <Icons.ChevronRight className="size-4 text-muted-foreground" />
                  </a>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-success/10 text-success">
                      <Icons.Clock3 className="size-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-muted-foreground">Local time</span>
                      <span className="block text-sm font-medium">10:30 AM (UTC-08:00)</span>
                    </span>
                  </div>
                </div>
              </InfoSection>
            )}

            {active.group && (
              <InfoSection title={`Members (${active.members?.length ?? 0})`}>
                <div className="space-y-1 rounded-xl border p-2">
                  {active.members?.map((member) => (
                    <div
                      key={member}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                    >
                      <PersonAvatar
                        name={member}
                        initials={member.slice(0, 2)}
                        className="[&_span]:size-7"
                      />
                      <span className="flex-1">{member}</span>
                      {member === "You" && (
                        <span className="text-xs text-muted-foreground">You</span>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => {
                    setSelectedContacts([]);
                    setGroupAction("add");
                  }}
                >
                  <Icons.UserPlus className="size-4" />
                  Add member
                </Button>
              </InfoSection>
            )}

            <section className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border bg-muted/20 p-3">
                <p className="text-lg font-semibold">{active.messages.length}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <p className="text-lg font-semibold">
                  {active.messages.filter((message) => message.attachment).length}
                </p>
                <p className="text-xs text-muted-foreground">Shared files</p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <p className="text-lg font-semibold">
                  {active.messages.filter((message) => message.pinned).length}
                </p>
                <p className="text-xs text-muted-foreground">Pinned</p>
              </div>
            </section>

            <InfoSection title="Pinned messages">
              {active.messages.filter((message) => message.pinned).length ? (
                <div className="space-y-2">
                  {active.messages
                    .filter((message) => message.pinned)
                    .map((message) => (
                      <div key={message.id} className="rounded-xl border bg-muted/25 p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                          <Icons.Pin className="size-3.5" />
                          Pinned message
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No pinned messages in this conversation.
                </div>
              )}
            </InfoSection>

            <InfoSection title="Shared media">
              {active.messages.some((message) => message.attachment?.type === "image") ? (
                <div className="grid grid-cols-3 gap-2">
                  {active.messages
                    .filter((message) => message.attachment?.type === "image")
                    .map((message) => (
                      <button
                        type="button"
                        key={message.id}
                        onClick={() => setImagePreview(message)}
                        className="aspect-square overflow-hidden rounded-xl border transition hover:opacity-80"
                      >
                        <img
                          src={message.attachment?.url}
                          alt={message.attachment?.name}
                          className="size-full object-cover"
                        />
                      </button>
                    ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No media shared yet.
                </div>
              )}
            </InfoSection>

            <div className="space-y-2 border-t pt-5">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  updateActive((item) => ({ ...item, muted: !item.muted }));
                  toast.success(active.muted ? "Conversation unmuted" : "Conversation muted");
                }}
              >
                {active.muted ? (
                  <Icons.Bell className="size-4" />
                ) : (
                  <Icons.BellOff className="size-4" />
                )}
                {active.muted ? "Unmute notifications" : "Mute notifications"}
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setConversationDeleteOpen(true)}
              >
                <Icons.Trash2 className="size-4" />
                Delete conversation
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* =================================================
          New Chat Dialog
      ================================================= */}

      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new chat</DialogTitle>

            <DialogDescription>Select a person or create a group conversation.</DialogDescription>
          </DialogHeader>

          <div className="space-y-1">
            {contacts.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() => {
                  const existing = conversations.find((item) => item.name === name);

                  if (existing) {
                    openConversation(existing.id);
                  } else {
                    const id = name.toLowerCase().replace(" ", "-");

                    setConversations((all) => [
                      {
                        id,

                        name,

                        initials: name
                          .split(" ")
                          .map((item) => item[0])
                          .join(""),

                        status: "online",

                        subtitle: "Start a conversation",

                        time: "Now",

                        unread: 0,

                        email: `${name.toLowerCase().replace(" ", ".")}@vexuiadmin.com`,

                        messages: [],
                      },

                      ...all,
                    ]);

                    setActiveId(id);
                  }

                  setNewChatOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md p-2 text-start hover:bg-muted"
              >
                <PersonAvatar
                  name={name}
                  initials={name
                    .split(" ")
                    .map((item) => item[0])
                    .join("")}
                />

                <span className="text-sm">{name}</span>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewChatOpen(false);

                setCreateGroupOpen(true);
              }}
            >
              <Icons.Users className="size-4" />
              Create group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          Create Group Dialog
      ================================================= */}

      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create group</DialogTitle>

            <DialogDescription>
              Add at least one member to create a shared conversation.
            </DialogDescription>
          </DialogHeader>

          <input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Group name"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />

          <div className="grid grid-cols-2 gap-2">
            {contacts.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() =>
                  setSelectedContacts((all) =>
                    all.includes(name) ? all.filter((item) => item !== name) : [...all, name],
                  )
                }
                className={cn(
                  "rounded-md border px-3 py-2 text-start text-sm",
                  selectedContacts.includes(name) && "border-primary bg-primary/10 text-primary",
                )}
              >
                {name}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateGroupOpen(false)}>
              Cancel
            </Button>

            <Button onClick={createGroup}>Create group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          Message Action Dialog
      ================================================= */}

      <Dialog open={Boolean(action)} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.kind === "delete" ? "Delete message?" : "Pin this message?"}
            </DialogTitle>

            <DialogDescription>
              {action?.kind === "delete"
                ? "This message will be removed from the conversation."
                : "Choose how long this message should stay pinned."}
            </DialogDescription>
          </DialogHeader>

          {action?.kind === "pin" && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                24 hours
              </Button>

              <Button variant="outline" className="flex-1">
                7 days
              </Button>

              <Button variant="outline" className="flex-1">
                Always
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>
              Cancel
            </Button>

            <Button
              variant={action?.kind === "delete" ? "destructive" : "default"}
              onClick={action?.kind === "delete" ? deleteMessage : pinMessage}
            >
              {action?.kind === "delete" ? "Delete" : "Pin message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          Group Actions Dialog
      ================================================= */}

      <Dialog open={Boolean(groupAction)} onOpenChange={(open) => !open && setGroupAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {groupAction === "add"
                ? "Add group members"
                : groupAction === "rename"
                  ? "Rename group"
                  : "Leave group?"}
            </DialogTitle>

            <DialogDescription>
              {groupAction === "add"
                ? "Select teammates to add to this conversation."
                : groupAction === "rename"
                  ? "Choose a new group name."
                  : "The conversation will remain in your history unless you remove it."}
            </DialogDescription>
          </DialogHeader>

          {groupAction === "add" && (
            <div className="grid grid-cols-2 gap-2">
              {contacts
                .filter((name) => !active.members?.includes(name))
                .map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() =>
                      setSelectedContacts((all) =>
                        all.includes(name) ? all.filter((item) => item !== name) : [...all, name],
                      )
                    }
                    className={cn(
                      "rounded-md border px-3 py-2 text-start text-sm",
                      selectedContacts.includes(name) &&
                        "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    {name}
                  </button>
                ))}
            </div>
          )}

          {groupAction === "rename" && (
            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Group name"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupAction(null)}>
              Cancel
            </Button>

            <Button
              variant={groupAction === "leave" ? "destructive" : "default"}
              onClick={() => {
                if (groupAction === "add") {
                  updateActive((item) => ({
                    ...item,

                    members: [...(item.members ?? []), ...selectedContacts],
                  }));

                  toast.success("Members added");
                }

                if (groupAction === "rename" && groupName.trim()) {
                  updateActive((item) => ({
                    ...item,

                    name: groupName.trim(),
                  }));

                  toast.success("Group renamed");
                }

                if (groupAction === "leave") {
                  setConversations((all) => all.filter((item) => item.id !== activeId));

                  toast.success("You left the group");
                }

                setGroupAction(null);

                setSelectedContacts([]);
              }}
            >
              {groupAction === "add"
                ? "Add members"
                : groupAction === "rename"
                  ? "Save changes"
                  : "Leave group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          Delete Conversation Dialog
      ================================================= */}

      <Dialog open={conversationDeleteOpen} onOpenChange={setConversationDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete conversation?</DialogTitle>

            <DialogDescription>
              This conversation and its local messages will be removed from the list.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConversationDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setConversations((all) => all.filter((item) => item.id !== activeId));

                setConversationDeleteOpen(false);

                setInfoOpen(false);

                toast.success("Conversation deleted");
              }}
            >
              Delete conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          Image Preview
      ================================================= */}

      <Dialog open={Boolean(imagePreview)} onOpenChange={(open) => !open && setImagePreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{imagePreview?.attachment?.name}</DialogTitle>

            <DialogDescription>
              {active.name} - {imagePreview?.time}
            </DialogDescription>
          </DialogHeader>

          {imagePreview?.attachment?.url && (
            <img
              src={imagePreview.attachment.url}
              alt={imagePreview.attachment.name}
              className="max-h-[65vh] w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =====================================================
   Message Bubble
===================================================== */

function MessageBubble({
  message,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onReact,
  onImage,
}: {
  message: Message;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  onImage: () => void;
}) {
  if (message.author === "system") {
    return (
      <div className="my-5 text-center text-xs text-muted-foreground">
        <span className="rounded-full border bg-card px-3 py-1">{message.text}</span>
      </div>
    );
  }

  const mine = message.author === "me";

  return (
    <div className={cn("group mb-4 flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[86%] sm:max-w-[70%]", mine && "items-end")}>
        {/* Message */}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
            mine ? "rounded-ee-md bg-primary/12 text-foreground" : "rounded-es-md border bg-card",
          )}
        >
          {message.reply && (
            <div className="mb-2 border-s-2 border-primary ps-2 text-xs text-muted-foreground">
              {message.reply}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{message.text}</p>

          {/* Attachment */}

          {message.attachment &&
            (message.attachment.type === "image" ? (
              <button
                type="button"
                className="mt-2 block overflow-hidden rounded-lg"
                onClick={onImage}
              >
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name}
                  className="max-h-48 w-full object-cover"
                />
              </button>
            ) : (
              <div className="mt-2 flex items-center gap-2 rounded-md border bg-background/60 p-2">
                <Icons.File className="size-4 text-primary" />

                {message.attachment.name}
              </div>
            ))}

          {/* Message Meta */}

          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>{message.time}</span>

            {mine && <Icons.CheckCheck className="size-3" />}
          </div>
        </div>

        {/* Existing Reactions */}

        {message.reactions && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <button
                type="button"
                key={emoji}
                onClick={() => onReact(emoji)}
                className="rounded-full border bg-card px-1.5 py-0.5 text-xs"
              >
                {emoji} {count}
              </button>
            ))}
          </div>
        )}

        {/* Message Actions */}

        <div
          className={cn(
            "mt-1 flex opacity-0 transition group-hover:opacity-100",
            mine ? "justify-end" : "justify-start",
          )}
        >
          {reactionOptions.slice(0, 3).map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => onReact(emoji)}
              className="px-1 text-xs"
            >
              {emoji}
            </button>
          ))}

          <button type="button" onClick={onReply} title="Reply" className="p-1">
            <Icons.Reply className="size-3.5" />
          </button>

          {mine && (
            <button type="button" onClick={onEdit} title="Edit" className="p-1">
              <Icons.Pencil className="size-3.5" />
            </button>
          )}

          <button type="button" onClick={onPin} title="Pin" className="p-1">
            <Icons.Pin className="size-3.5" />
          </button>

          {mine && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete"
              className="p-1 text-destructive"
            >
              <Icons.Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   Information Section
===================================================== */

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>

      {children}
    </section>
  );
}
