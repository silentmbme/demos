import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
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
import { toast } from "sonner";

type Priority = "Critical" | "High" | "Medium" | "Low";

type Card = {
  id: string;
  title: string;
  description: string;
  column: string;
  priority: Priority;
  assignees: string[];
  labels: string[];
  due: string;
  subtasks: { title: string; done: boolean }[];
  comments: string[];
  attachments: string[];
};

type Column = {
  id: string;
  name: string;
};

const baseCols: Column[] = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "Todo" },
  { id: "progress", name: "In Progress" },
  { id: "review", name: "Review" },
  { id: "done", name: "Done" },
];

const baseCards: Card[] = [
  {
    id: "pay",
    title: "Fix checkout payment validation",
    description: "Resolve Safari and mobile validation issues.",
    column: "progress",
    priority: "High",
    assignees: ["Sophia", "Daniel"],
    labels: ["Bug", "Frontend"],
    due: "Aug 24",
    subtasks: [
      { title: "Reproduce Safari issue", done: true },
      { title: "Add validation fix", done: false },
      { title: "QA verification", done: false },
    ],
    comments: ["Safari logs attached."],
    attachments: ["safari-console.png"],
  },
  {
    id: "onboard",
    title: "Finalize onboarding illustrations",
    description: "Complete visual handoff for the new flow.",
    column: "review",
    priority: "Medium",
    assignees: ["Olivia"],
    labels: ["Design"],
    due: "Aug 25",
    subtasks: [
      { title: "Review exports", done: true },
      { title: "Send handoff", done: false },
    ],
    comments: [],
    attachments: [],
  },
  {
    id: "crm",
    title: "Migrate legacy CRM contacts",
    description: "Validate mappings before the final import.",
    column: "todo",
    priority: "Critical",
    assignees: ["Daniel"],
    labels: ["Backend", "Urgent"],
    due: "Aug 23",
    subtasks: [
      { title: "Validate mapping", done: true },
      { title: "Run import", done: false },
    ],
    comments: ["Source export is ready."],
    attachments: ["contacts.csv"],
  },
  {
    id: "campaign",
    title: "Prepare campaign launch assets",
    description: "Package approved campaign assets.",
    column: "progress",
    priority: "High",
    assignees: ["Emma", "Mia"],
    labels: ["Marketing"],
    due: "Aug 27",
    subtasks: [],
    comments: [],
    attachments: [],
  },
  {
    id: "export",
    title: "Add invoice export option",
    description: "Add CSV export to invoice history.",
    column: "backlog",
    priority: "Low",
    assignees: ["Noah"],
    labels: ["Frontend"],
    due: "Sep 01",
    subtasks: [],
    comments: [],
    attachments: [],
  },
  {
    id: "mobile",
    title: "QA mobile navigation",
    description: "Validate navigation states across mobile breakpoints.",
    column: "review",
    priority: "Medium",
    assignees: ["Olivia", "Emma"],
    labels: ["QA"],
    due: "Aug 26",
    subtasks: [
      { title: "iOS checks", done: true },
      { title: "Android checks", done: true },
    ],
    comments: [],
    attachments: [],
  },
];

const styles: Record<Priority, string> = {
  Critical: "bg-destructive/12 text-destructive",
  High: "bg-warning/16 text-warning",
  Medium: "bg-info/14 text-info",
  Low: "bg-muted text-muted-foreground",
};

const blank = (column: string): Card => ({
  id: "",
  title: "",
  description: "",
  column,
  priority: "Medium",
  assignees: [],
  labels: [],
  due: "Aug 30",
  subtasks: [],
  comments: [],
  attachments: [],
});

export function KanbanBoard() {
  const [columns, setColumns] = useState(baseCols);
  const [cards, setCards] = useState(baseCards);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [drag, setDrag] = useState<string | null>(null);
  const [detail, setDetail] = useState<Card | null>(null);
  const [form, setForm] = useState<Card | null>(null);
  const [columnForm, setColumnForm] = useState<Column | null>(null);
  const [deleteCard, setDeleteCard] = useState<Card | null>(null);

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          (priority === "All" || c.priority === priority) &&
          `${c.title} ${c.description} ${c.labels.join(" ")} ${c.assignees.join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [cards, search, priority],
  );

  const save = () => {
    if (!form?.title.trim()) return toast.error("Task title is required");

    setCards((all) =>
      form.id
        ? all.map((c) => (c.id === form.id ? form : c))
        : [...all, { ...form, id: `card-${Date.now()}` }],
    );

    setForm(null);
    toast.success(form.id ? "Task updated" : "Task created");
  };

  const move = (col: string) => {
    if (!drag) return;

    setCards((all) => all.map((c) => (c.id === drag ? { ...c, column: col } : c)));

    setDrag(null);
    toast.success("Task moved");
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="border-b p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="me-auto">
            <h1 className="text-xl font-semibold">Kanban Board</h1>
            <p className="text-xs text-muted-foreground">
              Plan and track tasks across your workflow.
            </p>
          </div>

          <Button variant="outline" onClick={() => setColumnForm({ id: "", name: "" })}>
            <Icons.Columns3 className="size-4" />
            Add column
          </Button>

          <Button onClick={() => setForm(blank(columns[0]?.id || "backlog"))}>
            <Icons.Plus className="size-4" />
            Add task
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <label className="relative min-w-48 flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search board"
              className="h-9 w-full rounded-md border bg-background ps-9 pe-3 text-sm"
            />
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-9 rounded-md border bg-background px-2 text-xs"
          >
            <option>All</option>
            {(["Critical", "High", "Medium", "Low"] as Priority[]).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          <b>{cards.filter((c) => c.column !== "done").length} active tasks</b>
          <span className="mx-2">
            {cards.filter((c) => c.column === "progress").length} in progress
          </span>
          Drag a card to move it, or use its Move action.
        </p>
      </header>

      <div className="overflow-x-auto bg-muted/20 p-4">
        <div className="flex min-h-[620px] min-w-max gap-3">
          {columns.map((col) => {
            const items = filtered.filter((c) => c.column === col.id);

            return (
              <section
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => move(col.id)}
                className={cn(
                  "flex w-72 flex-col rounded-xl border bg-card/80",
                  drag && "ring-1 ring-dashed ring-primary/50",
                )}
              >
                <header className="flex items-center gap-2 border-b p-3">
                  <b className="text-sm">{col.name}</b>

                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{items.length}</span>

                  <button
                    className="ms-auto rounded p-1 hover:bg-muted"
                    aria-label={`Rename ${col.name}`}
                    onClick={() => setColumnForm(col)}
                  >
                    <Icons.Pencil className="size-3.5" />
                  </button>

                  <button
                    className="rounded p-1 hover:bg-muted"
                    aria-label={`Add task to ${col.name}`}
                    onClick={() => setForm(blank(col.id))}
                  >
                    <Icons.Plus className="size-3.5" />
                  </button>
                </header>

                <div className="flex-1 space-y-2 p-2">
                  {items.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      onOpen={() => setDetail(card)}
                      onDrag={() => setDrag(card.id)}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setForm(blank(col.id))}
                  className="m-2 rounded-md border border-dashed p-2 text-start text-xs text-muted-foreground hover:bg-muted"
                >
                  <Icons.Plus className="me-1 inline size-3" />
                  Add task
                </button>
              </section>
            );
          })}

          <button
            onClick={() => setColumnForm({ id: "", name: "" })}
            className="h-12 w-44 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted"
          >
            + Add column
          </button>
        </div>
      </div>

      <TaskDrawer
        card={detail}
        columns={columns}
        onClose={() => setDetail(null)}
        onEdit={() => {
          setForm(detail);
          setDetail(null);
        }}
        onMove={(column) => {
          if (detail) {
            setCards((all) => all.map((c) => (c.id === detail.id ? { ...c, column } : c)));
            setDetail(null);
            toast.success("Task moved");
          }
        }}
        onDuplicate={() => {
          if (detail) {
            setCards((all) => [
              ...all,
              {
                ...detail,
                id: `card-${Date.now()}`,
                title: `${detail.title} (Copy)`,
              },
            ]);
            toast.success("Task duplicated");
          }
        }}
        onDelete={() => setDeleteCard(detail)}
      />

      <TaskDialog
        card={form}
        columns={columns}
        setCard={setForm}
        onClose={() => setForm(null)}
        onSave={save}
      />

      <ColumnDialog
        column={columnForm}
        setColumn={setColumnForm}
        onClose={() => setColumnForm(null)}
        onSave={() => {
          if (!columnForm?.name.trim()) return;

          setColumns((all) =>
            columnForm.id
              ? all.map((c) => (c.id === columnForm.id ? columnForm : c))
              : [...all, { ...columnForm, id: `col-${Date.now()}` }],
          );

          setColumnForm(null);
          toast.success("Column saved");
        }}
      />

      <Dialog open={Boolean(deleteCard)} onOpenChange={(o) => !o && setDeleteCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>This task will be removed from the board.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCard(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setCards((all) => all.filter((c) => c.id !== deleteCard?.id));
                setDeleteCard(null);
                setDetail(null);
                toast.success("Task deleted");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CardItem({
  card,
  onOpen,
  onDrag,
}: {
  card: Card;
  onOpen: () => void;
  onDrag: () => void;
}) {
  const done = card.subtasks.filter((s) => s.done).length;

  return (
    <article
      draggable
      onDragStart={onDrag}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      tabIndex={0}
      className="cursor-grab rounded-lg border bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow active:cursor-grabbing"
    >
      <b className="block text-sm">{card.title}</b>

      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{card.description}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {card.labels.map((x) => (
          <span key={x} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
            {x}
          </span>
        ))}

        <span
          className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", styles[card.priority])}
        >
          {card.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{card.assignees.join(", ")}</span>
        <span>{card.due}</span>
      </div>

      <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
        <span>
          <Icons.CheckSquare className="me-1 inline size-3" />
          {done}/{card.subtasks.length}
        </span>

        <span>
          <Icons.MessageSquare className="me-1 inline size-3" />
          {card.comments.length}
        </span>

        <span>
          <Icons.Paperclip className="me-1 inline size-3" />
          {card.attachments.length}
        </span>
      </div>
    </article>
  );
}

function TaskDrawer({
  card,
  columns,
  onClose,
  onEdit,
  onMove,
  onDuplicate,
  onDelete,
}: {
  card: Card | null;
  columns: Column[];
  onClose: () => void;
  onEdit: () => void;
  onMove: (x: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <Sheet open={Boolean(card)} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{card?.title}</SheetTitle>
          <SheetDescription>{card?.description}</SheetDescription>
        </SheetHeader>

        {card && (
          <div className="mt-5 space-y-5 text-sm">
            <p>
              <b>Priority:</b> {card.priority}
              <span className="ms-3">
                <b>Due:</b> {card.due}
              </span>
            </p>

            <section>
              <b className="text-xs uppercase text-muted-foreground">Move task</b>

              <select
                value={card.column}
                onChange={(e) => onMove(e.target.value)}
                className="mt-2 h-9 w-full rounded border bg-background px-2"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <b className="text-xs uppercase text-muted-foreground">Subtasks</b>

              {card.subtasks.map((s) => (
                <label key={s.title} className="mt-2 flex gap-2">
                  <input type="checkbox" checked={s.done} readOnly />
                  {s.title}
                </label>
              ))}
            </section>

            <section>
              <b className="text-xs uppercase text-muted-foreground">Comments</b>

              {card.comments.length ? (
                card.comments.map((c) => (
                  <p key={c} className="mt-2 rounded bg-muted p-2">
                    {c}
                  </p>
                ))
              ) : (
                <p className="mt-2 text-muted-foreground">No comments.</p>
              )}
            </section>

            <section>
              <b className="text-xs uppercase text-muted-foreground">Attachments</b>

              {card.attachments.map((a) => (
                <p key={a} className="mt-2 flex gap-2">
                  <Icons.File className="size-4 text-primary" />
                  {a}
                </p>
              ))}
            </section>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onEdit}>
                Edit
              </Button>

              <Button variant="outline" onClick={onDuplicate}>
                Duplicate
              </Button>

              <Button variant="destructive" className="col-span-2" onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function TaskDialog({
  card,
  columns,
  setCard,
  onClose,
  onSave,
}: {
  card: Card | null;
  columns: Column[];
  setCard: (x: Card | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const set = (k: keyof Card, v: any) => card && setCard({ ...card, [k]: v });

  return (
    <Dialog open={Boolean(card)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{card?.id ? "Edit task" : "Add task"}</DialogTitle>
          <DialogDescription>Add details to your board task.</DialogDescription>
        </DialogHeader>

        {card && (
          <div className="grid gap-3">
            <label>
              Title
              <input
                value={card.title}
                onChange={(e) => set("title", e.target.value)}
                className="mt-1 h-10 w-full rounded border bg-background px-3"
              />
            </label>

            <label>
              Description
              <textarea
                value={card.description}
                onChange={(e) => set("description", e.target.value)}
                className="mt-1 min-h-20 w-full rounded border bg-background p-3"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                Column
                <select
                  value={card.column}
                  onChange={(e) => set("column", e.target.value)}
                  className="mt-1 h-10 w-full rounded border bg-background px-2"
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={card.priority}
                  onChange={(e) => set("priority", e.target.value)}
                  className="mt-1 h-10 w-full rounded border bg-background px-2"
                >
                  {(["Critical", "High", "Medium", "Low"] as Priority[]).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Assignees
              <input
                value={card.assignees.join(", ")}
                onChange={(e) =>
                  set(
                    "assignees",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
                className="mt-1 h-10 w-full rounded border bg-background px-3"
              />
            </label>

            <label>
              Labels
              <input
                value={card.labels.join(", ")}
                onChange={(e) =>
                  set(
                    "labels",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
                className="mt-1 h-10 w-full rounded border bg-background px-3"
              />
            </label>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onSave}>Save task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ColumnDialog({
  column,
  setColumn,
  onClose,
  onSave,
}: {
  column: Column | null;
  setColumn: (x: Column | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={Boolean(column)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{column?.id ? "Rename column" : "Add column"}</DialogTitle>
        </DialogHeader>

        <input
          value={column?.name || ""}
          onChange={(e) => column && setColumn({ ...column, name: e.target.value })}
          className="h-10 w-full rounded border bg-background px-3"
          placeholder="Column name"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onSave}>Save column</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
