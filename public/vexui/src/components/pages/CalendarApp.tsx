import { useMemo, useState } from "react";

import * as Icons from "lucide-react";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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

/* =====================================================
   Types
===================================================== */

type View = "Month" | "Week" | "Day";

type Category =
  "Work" | "Meetings" | "Personal" | "Project" | "Marketing" | "Deadline" | "Reminder";

type EventItem = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  category: Category;
  location: string;
  description: string;
  attendees: string[];
  reminder: string;
  recurrence: string;
  link?: string;
  notes?: string;
  allDay?: boolean;
};

/* =====================================================
   Category Styles
===================================================== */

const categoryStyles: Record<Category, string> = {
  Work: "bg-info/15 text-info",

  Meetings: "bg-primary/12 text-primary",

  Personal: "bg-success/15 text-success",

  Project: "bg-warning/15 text-warning",

  Marketing: "bg-secondary text-secondary-foreground",

  Deadline: "bg-destructive/12 text-destructive",

  Reminder: "bg-muted text-muted-foreground",
};

const categoryDots: Record<Category, string> = {
  Work: "bg-info",
  Meetings: "bg-primary",
  Personal: "bg-success",
  Project: "bg-warning",
  Marketing: "bg-violet-500",
  Deadline: "bg-destructive",
  Reminder: "bg-muted-foreground",
};

/* =====================================================
   Initial Events
===================================================== */

const initialEvents: EventItem[] = [
  {
    id: "standup",
    title: "Product Team Standup",
    date: "2026-08-24",
    start: "09:30",
    end: "10:00",
    category: "Work",
    location: "Focus room",
    description: "Daily planning and blockers.",
    attendees: ["Sophia Carter", "Daniel Lee", "You"],
    reminder: "10 minutes before",
    recurrence: "Daily",
    link: "https://meet.vexuiadmin.com/product",
  },

  {
    id: "design",
    title: "Design Review",
    date: "2026-08-24",
    start: "14:00",
    end: "15:00",
    category: "Project",
    location: "Design Studio",
    description: "Review the onboarding flow and mobile states.",
    attendees: ["Sophia Carter", "Olivia Smith"],
    reminder: "30 minutes before",
    recurrence: "Does not repeat",
  },

  {
    id: "demo",
    title: "Customer Demo - Acme Inc.",
    date: "2026-08-25",
    start: "11:00",
    end: "12:00",
    category: "Meetings",
    location: "Video conference",
    description: "Product walkthrough for Acme stakeholders.",
    attendees: ["Ethan Brown", "Emma Wilson"],
    reminder: "1 hour before",
    recurrence: "Does not repeat",
    link: "https://meet.vexuiadmin.com/acme",
  },

  {
    id: "launch",
    title: "Marketing Campaign Launch",
    date: "2026-08-26",
    start: "08:00",
    end: "09:00",
    category: "Marketing",
    location: "Marketing channel",
    description: "Launch checklist and owner handoff.",
    attendees: ["Mia Johnson", "Noah Williams"],
    reminder: "At time of event",
    recurrence: "Does not repeat",
  },

  {
    id: "sprint",
    title: "Sprint Planning",
    date: "2026-08-27",
    start: "10:00",
    end: "11:30",
    category: "Work",
    location: "North meeting room",
    description: "Plan the next sprint scope.",
    attendees: ["Daniel Lee", "Olivia Smith", "You"],
    reminder: "30 minutes before",
    recurrence: "Weekly",
  },

  {
    id: "qbr",
    title: "Quarterly Business Review",
    date: "2026-08-28",
    start: "15:00",
    end: "16:30",
    category: "Meetings",
    location: "Executive room",
    description: "Quarterly progress and outcomes.",
    attendees: ["Sophia Carter", "Emma Wilson"],
    reminder: "1 day before",
    recurrence: "Does not repeat",
  },

  {
    id: "research",
    title: "Research Readout",
    date: "2026-08-20",
    start: "13:00",
    end: "14:00",
    category: "Project",
    location: "Research room",
    description: "Share usability findings and next steps.",
    attendees: ["Olivia Smith", "You"],
    reminder: "30 minutes before",
    recurrence: "Does not repeat",
  },

  {
    id: "one-on-one",
    title: "1:1 with Daniel",
    date: "2026-08-21",
    start: "11:30",
    end: "12:00",
    category: "Meetings",
    location: "Focus room",
    description: "Weekly check-in with Daniel.",
    attendees: ["Daniel Lee"],
    reminder: "10 minutes before",
    recurrence: "Weekly",
  },

  {
    id: "gym",
    title: "Gym session",
    date: "2026-08-23",
    start: "08:00",
    end: "09:00",
    category: "Personal",
    location: "Wellness center",
    description: "Personal wellbeing block.",
    attendees: [],
    reminder: "30 minutes before",
    recurrence: "Weekly",
  },

  {
    id: "content",
    title: "Content Calendar Review",
    date: "2026-08-24",
    start: "16:00",
    end: "16:45",
    category: "Marketing",
    location: "Marketing channel",
    description: "Approve next week content plan.",
    attendees: ["Mia Johnson"],
    reminder: "10 minutes before",
    recurrence: "Weekly",
  },

  {
    id: "analytics",
    title: "Analytics Deep Dive",
    date: "2026-08-25",
    start: "15:30",
    end: "16:30",
    category: "Work",
    location: "Data hub",
    description: "Review conversion and retention trends.",
    attendees: ["Noah Williams", "You"],
    reminder: "30 minutes before",
    recurrence: "Does not repeat",
  },

  {
    id: "release",
    title: "Release Readiness",
    date: "2026-08-26",
    start: "13:30",
    end: "14:15",
    category: "Deadline",
    location: "Engineering channel",
    description: "Confirm release blockers are closed.",
    attendees: ["Daniel Lee", "Ethan Brown"],
    reminder: "1 hour before",
    recurrence: "Does not repeat",
  },

  {
    id: "client",
    title: "Client Follow-up",
    date: "2026-08-27",
    start: "14:00",
    end: "14:30",
    category: "Meetings",
    location: "Video conference",
    description: "Follow-up discussion with client team.",
    attendees: ["Emma Wilson"],
    reminder: "10 minutes before",
    recurrence: "Does not repeat",
  },

  {
    id: "retro",
    title: "Sprint Retrospective",
    date: "2026-08-28",
    start: "11:00",
    end: "12:00",
    category: "Project",
    location: "North meeting room",
    description: "Capture improvements for the next sprint.",
    attendees: ["Sophia Carter", "Daniel Lee", "Olivia Smith"],
    reminder: "30 minutes before",
    recurrence: "Biweekly",
  },

  {
    id: "weekend",
    title: "Weekly Planning",
    date: "2026-08-30",
    start: "18:00",
    end: "18:30",
    category: "Reminder",
    location: "",
    description: "Review priorities for the coming week.",
    attendees: [],
    reminder: "At time of event",
    recurrence: "Weekly",
  },

  {
    id: "invoice",
    title: "Invoice Deadline",
    date: "2026-08-29",
    start: "",
    end: "",
    category: "Deadline",
    location: "",
    description: "Submit August invoices.",
    attendees: [],
    reminder: "1 day before",
    recurrence: "Monthly",
    allDay: true,
  },
];

/* =====================================================
   Categories
===================================================== */

const categories = Object.keys(categoryStyles) as Category[];

/* =====================================================
   Empty Event
===================================================== */

const emptyEvent = (date = "2026-08-24"): EventItem => ({
  id: "",
  title: "",
  date,
  start: "09:00",
  end: "10:00",
  category: "Work",
  location: "",
  description: "",
  attendees: [],
  reminder: "10 minutes before",
  recurrence: "Does not repeat",
  link: "",
  notes: "",
});

/* =====================================================
   Calendar App
===================================================== */

export function CalendarApp() {
  const [events, setEvents] = useState(initialEvents);

  const [current, setCurrent] = useState(new Date(2026, 7, 24));

  const [view, setView] = useState<View>("Month");

  const [visible, setVisible] = useState<Record<Category, boolean>>(
    Object.fromEntries(categories.map((item) => [item, true])) as Record<Category, boolean>,
  );

  const [search, setSearch] = useState("");

  const [form, setForm] = useState<EventItem | null>(null);

  const [detail, setDetail] = useState<EventItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ===================================================
     Filter Events
  =================================================== */

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase();

    return events.filter(
      (event) =>
        visible[event.category] &&
        `${event.title} ${event.location} ${event.description} ${event.attendees.join(" ")}`
          .toLowerCase()
          .includes(query),
    );
  }, [events, visible, search]);

  /* ===================================================
     Save Event
  =================================================== */

  const saveEvent = () => {
    if (!form?.title.trim()) {
      toast.error("Event title is required");

      return;
    }

    if (!form.allDay && form.end < form.start) {
      toast.error("End time must be after start time");

      return;
    }

    const isNew = !form.id;

    const saved = {
      ...form,

      id: form.id || `event-${Date.now()}`,
    };

    setEvents((all) =>
      isNew ? [...all, saved] : all.map((event) => (event.id === saved.id ? saved : event)),
    );

    setForm(null);

    setDetail(saved);

    toast.success(isNew ? "Event created" : "Event updated");
  };

  /* ===================================================
     Duplicate Event
  =================================================== */

  const duplicate = () => {
    if (!detail) {
      return;
    }

    setForm({
      ...detail,
      id: "",
      title: `${detail.title} copy`,
    });

    setDetail(null);

    toast.success("Event duplicated");
  };

  /* ===================================================
     Delete Event
  =================================================== */

  const deleteEvent = () => {
    if (!detail) {
      return;
    }

    setEvents((all) => all.filter((event) => event.id !== detail.id));

    setDeleteOpen(false);
    setDetail(null);

    toast.success("Event deleted");
  };

  /* ===================================================
     Calendar Navigation
  =================================================== */

  const nav = (amount: number) => {
    setCurrent((date) =>
      view === "Month"
        ? addMonths(date, amount)
        : addDays(date, view === "Week" ? amount * 7 : amount),
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* ===============================================
          Desktop Sidebar
      =============================================== */}

      <div className="hidden w-[280px] shrink-0 border-e lg:block">
        <CalendarSidebar
          current={current}
          onDate={setCurrent}
          visible={visible}
          setVisible={setVisible}
          events={filteredEvents}
          onCreate={() => setForm(emptyEvent(format(current, "yyyy-MM-dd")))}
        />
      </div>

      {/* ===============================================
          Main Calendar
      =============================================== */}

      <main className="min-w-0 flex-1">
        <CalendarToolbar
          current={current}
          view={view}
          setView={setView}
          onNav={nav}
          onToday={() => setCurrent(new Date(2026, 7, 24))}
          search={search}
          setSearch={setSearch}
          onCreate={() => setForm(emptyEvent(format(current, "yyyy-MM-dd")))}
          onSidebar={() => setSidebarOpen(true)}
        />

        <CalendarGrid
          view={view}
          current={current}
          events={filteredEvents}
          onEvent={setForm}
          onEmpty={(date) => setForm(emptyEvent(format(date, "yyyy-MM-dd")))}
        />
      </main>

      {/* ===============================================
          Mobile Sidebar
      =============================================== */}

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="overflow-y-auto lg:hidden">
          <SheetHeader>
            <SheetTitle>Calendars</SheetTitle>

            <SheetDescription>Schedule, filters, and upcoming events.</SheetDescription>
          </SheetHeader>

          <div className="mt-5">
            <CalendarSidebar
              current={current}
              onDate={(date) => {
                setCurrent(date);

                setSidebarOpen(false);
              }}
              visible={visible}
              setVisible={setVisible}
              events={filteredEvents}
              onCreate={() => {
                setSidebarOpen(false);

                setForm(emptyEvent(format(current, "yyyy-MM-dd")));
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ===============================================
          Event Form
      =============================================== */}

      <EventForm
        open={Boolean(form)}
        event={form}
        setEvent={setForm}
        onClose={() => setForm(null)}
        onSave={saveEvent}
      />

      {/* ===============================================
          Event Details
      =============================================== */}

      <Sheet open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <EventDetails
            event={detail}
            onEdit={() => {
              setForm(detail);
              setDetail(null);
            }}
            onDuplicate={duplicate}
            onDelete={() => setDeleteOpen(true)}
          />
        </SheetContent>
      </Sheet>

      {/* ===============================================
          Delete Confirmation
      =============================================== */}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event?</DialogTitle>

            <DialogDescription>This event will be removed from your calendar.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={deleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
/* =====================================================
   Calendar Subcomponents
===================================================== */

function CalendarSidebar({
  current,
  onDate,
  visible,
  setVisible,
  events,
  onCreate,
}: {
  current: Date;
  onDate: (date: Date) => void;
  visible: Record<Category, boolean>;
  setVisible: React.Dispatch<React.SetStateAction<Record<Category, boolean>>>;
  events: EventItem[];
  onCreate: () => void;
}) {
  const upcoming = events
    .filter((event) => new Date(`${event.date}T00:00:00`) >= current)
    .slice(0, 4);

  return (
    <aside className="space-y-5 p-4">
      <Button className="w-full" onClick={onCreate}>
        <Icons.Plus className="me-2 size-4" /> New event
      </Button>
      <div className="rounded-xl border bg-muted/20 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDate(addMonths(current, -1))}
            aria-label="Previous month"
          >
            <Icons.ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-semibold">{format(current, "MMMM yyyy")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDate(addMonths(current, 1))}
            aria-label="Next month"
          >
            <Icons.ChevronRight className="size-4" />
          </Button>
        </div>
        <button
          type="button"
          onClick={() => onDate(new Date(2026, 7, 24))}
          className="w-full rounded-lg bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Today: August 24
        </button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Calendars
        </p>
        <div className="space-y-1">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted/60"
            >
              <input
                type="checkbox"
                checked={visible[category]}
                onChange={() => setVisible((all) => ({ ...all, [category]: !all[category] }))}
                className="size-4 accent-primary"
              />
              <span className={cn("size-2 rounded-full", categoryDots[category])} />
              <span className="flex-1">{category}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Upcoming
        </p>
        <div className="space-y-2">
          {upcoming.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onDate(new Date(`${event.date}T00:00:00`))}
              className="w-full rounded-lg border p-2 text-start transition hover:border-primary/40 hover:bg-muted/30"
            >
              <p className="truncate text-sm font-medium">{event.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {format(new Date(`${event.date}T00:00:00`), "MMM d")}{" "}
                {event.allDay ? "All day" : event.start}
              </p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function CalendarToolbar({
  current,
  view,
  setView,
  onNav,
  onToday,
  search,
  setSearch,
  onCreate,
  onSidebar,
}: {
  current: Date;
  view: View;
  setView: (view: View) => void;
  onNav: (amount: number) => void;
  onToday: () => void;
  search: string;
  setSearch: (value: string) => void;
  onCreate: () => void;
  onSidebar: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onSidebar}
          aria-label="Open calendar sidebar"
        >
          <Icons.PanelLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNav(-1)} aria-label="Previous">
          <Icons.ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNav(1)} aria-label="Next">
          <Icons.ChevronRight className="size-4" />
        </Button>
        <h1 className="ms-1 text-lg font-semibold">
          {format(current, view === "Month" ? "MMMM yyyy" : "MMMM d, yyyy")}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative hidden md:block">
          <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events"
            className="h-9 w-48 rounded-lg border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="flex rounded-lg bg-muted p-1">
          {(["Month", "Week", "Day"] as View[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium",
                view === item
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onCreate}>
          <Icons.Plus className="me-1 size-4" /> Create
        </Button>
      </div>
    </header>
  );
}

function CalendarGrid({
  view,
  current,
  events,
  onEvent,
  onEmpty,
}: {
  view: View;
  current: Date;
  events: EventItem[];
  onEvent: (event: EventItem) => void;
  onEmpty: (date: Date) => void;
}) {
  const start =
    view === "Month"
      ? startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
      : view === "Week"
        ? startOfWeek(current, { weekStartsOn: 1 })
        : current;
  const count = view === "Month" ? 42 : view === "Week" ? 7 : 1;
  const days = Array.from({ length: count }, (_, index) => addDays(start, index));
  const dayEvents = (date: Date) =>
    events.filter((event) => isSameDay(new Date(`${event.date}T00:00:00`), date));
  return (
    <div className="overflow-x-auto">
      <div
        className={cn(
          "min-w-[720px]",
          view === "Month"
            ? "grid grid-cols-7"
            : view === "Week"
              ? "grid grid-cols-7"
              : "grid grid-cols-1",
        )}
      >
        {view !== "Day" &&
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {day}
            </div>
          ))}
        {days.map((day) => {
          const sameMonth = isSameMonth(day, current);
          const items = dayEvents(day);
          return (
            <section
              key={day.toISOString()}
              className={cn(
                "min-h-36 border-b border-e p-2",
                !sameMonth && "bg-muted/20",
                view === "Day" && "min-h-[540px]",
              )}
            >
              <button
                type="button"
                onClick={() => onEmpty(day)}
                className={cn(
                  "mb-2 grid size-7 place-items-center rounded-full text-sm font-medium hover:bg-muted",
                  isSameDay(day, new Date(2026, 7, 24)) && "bg-primary text-primary-foreground",
                  !sameMonth && "text-muted-foreground",
                )}
              >
                {format(day, "d")}
              </button>
              <div className="space-y-1">
                {items.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onEvent(event)}
                    className={cn(
                      "block w-full truncate rounded-md px-2 py-1 text-start text-xs font-medium",
                      categoryStyles[event.category],
                    )}
                  >
                    {event.allDay ? "All day" : event.start} {event.title}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function EventForm({
  open,
  event,
  setEvent,
  onClose,
  onSave,
}: {
  open: boolean;
  event: EventItem | null;
  setEvent: (event: EventItem | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const update = <K extends keyof EventItem>(key: K, value: EventItem[K]) =>
    event && setEvent({ ...event, [key]: value });
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Edit event" : "Create event"}</DialogTitle>
          <DialogDescription>Add the details for this calendar event.</DialogDescription>
        </DialogHeader>
        {event && (
          <div className="grid gap-4 py-2">
            <input
              value={event.title}
              onChange={(item) => update("title", item.target.value)}
              placeholder="Event title"
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={event.date}
                onChange={(item) => update("date", item.target.value)}
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              />
              <select
                value={event.category}
                onChange={(item) => update("category", item.target.value as Category)}
                className="h-10 rounded-lg border bg-background px-3 text-sm"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                value={event.start}
                onChange={(item) => update("start", item.target.value)}
                disabled={event.allDay}
                className="h-10 rounded-lg border bg-background px-3 text-sm disabled:opacity-50"
              />
              <input
                type="time"
                value={event.end}
                onChange={(item) => update("end", item.target.value)}
                disabled={event.allDay}
                className="h-10 rounded-lg border bg-background px-3 text-sm disabled:opacity-50"
              />
            </div>
            <input
              value={event.location}
              onChange={(item) => update("location", item.target.value)}
              placeholder="Location"
              className="h-10 rounded-lg border bg-background px-3 text-sm"
            />
            <textarea
              value={event.description}
              onChange={(item) => update("description", item.target.value)}
              placeholder="Description"
              className="min-h-24 rounded-lg border bg-background p-3 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(event.allDay)}
                onChange={(item) => update("allDay", item.target.checked)}
                className="size-4 accent-primary"
              />{" "}
              All day event
            </label>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EventDetails({
  event,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  event: EventItem | null;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  if (!event) return null;
  return (
    <div className="pt-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
              categoryStyles[event.category],
            )}
          >
            {event.category}
          </span>
          <h2 className="mt-3 text-xl font-semibold">{event.title}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit event">
          <Icons.Pencil className="size-4" />
        </Button>
      </div>
      <div className="space-y-4 text-sm">
        <p className="flex gap-3">
          <Icons.CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
          {format(new Date(`${event.date}T00:00:00`), "EEEE, MMMM d, yyyy")}{" "}
          {event.allDay ? "All day" : `${event.start} - ${event.end}`}
        </p>
        {event.location && (
          <p className="flex gap-3">
            <Icons.MapPin className="mt-0.5 size-4 text-muted-foreground" />
            {event.location}
          </p>
        )}
        {event.description && (
          <p className="rounded-lg bg-muted/50 p-3 leading-6 text-muted-foreground">
            {event.description}
          </p>
        )}
        {event.attendees.length > 0 && (
          <p className="flex gap-3">
            <Icons.Users className="mt-0.5 size-4 text-muted-foreground" />
            {event.attendees.join(", ")}
          </p>
        )}
      </div>
      <div className="mt-7 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onDuplicate}>
          <Icons.Copy className="me-2 size-4" />
          Duplicate
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Icons.Trash2 className="me-2 size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
