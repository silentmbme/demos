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
import { getUserImage } from "@/lib/user-images";

type Status = "Backlog" | "Todo" | "In Progress" | "Review" | "Completed";
type Priority = "Critical" | "High" | "Medium" | "Low";

type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
  status: Status;
  priority: Priority;
  assignees: string[];
  due: string;
  tags: string[];
  subtasks: { title: string; done: boolean }[];
  comments: { id: string; author: string; text: string }[];
  attachments: string[];
  reminder: string;
  created: string;
  updated: string;
};

const people = [
  "Sophia Carter",
  "Daniel Lee",
  "Olivia Smith",
  "Ethan Brown",
  "Emma Wilson",
  "Noah Williams",
  "Mia Johnson",
];

const statuses: Status[] = ["Backlog", "Todo", "In Progress", "Review", "Completed"];

const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];

const priorityStyle: Record<Priority, string> = {
  Critical: "bg-destructive/12 text-destructive",
  High: "bg-warning/16 text-warning",
  Medium: "bg-info/14 text-info",
  Low: "bg-muted text-muted-foreground",
};

const statusStyle: Record<Status, string> = {
  Backlog: "bg-muted text-muted-foreground",
  Todo: "bg-info/14 text-info",
  "In Progress": "bg-primary/12 text-primary",
  Review: "bg-warning/16 text-warning",
  Completed: "bg-success/14 text-success",
};

const initial: Task[] = [
  {
    id: "payment",
    title: "Fix checkout payment validation",
    description: "Resolve Safari validation error on the checkout payment form.",
    project: "Commerce Platform",
    status: "In Progress",
    priority: "High",
    assignees: ["Sophia Carter", "You"],
    due: "2026-08-24",
    tags: ["Bug", "Frontend"],
    subtasks: [
      { title: "Reproduce Safari issue", done: true },
      { title: "Add validation fix", done: true },
      { title: "Add unit test", done: false },
      { title: "QA verification", done: false },
    ],
    comments: [
      {
        id: "c1",
        author: "Sophia Carter",
        text: "The issue is isolated to the saved-card flow.",
      },
    ],
    attachments: ["safari-console.png", "checkout-spec.pdf"],
    reminder: "30 minutes before",
    created: "Aug 18",
    updated: "12 min ago",
  },
  {
    id: "illustrations",
    title: "Finalize onboarding illustrations",
    description: "Review final illustrations and handoff exports to engineering.",
    project: "Website Redesign",
    status: "Review",
    priority: "Medium",
    assignees: ["Olivia Smith"],
    due: "2026-08-25",
    tags: ["Design"],
    subtasks: [
      { title: "Review illustration set", done: true },
      { title: "Export SVG assets", done: false },
    ],
    comments: [],
    attachments: ["onboarding-assets.zip"],
    reminder: "1 hour before",
    created: "Aug 17",
    updated: "1 hr ago",
  },
  {
    id: "crm",
    title: "Migrate legacy CRM contacts",
    description: "Validate contact mapping and import the final migration batch.",
    project: "CRM Migration",
    status: "Todo",
    priority: "Critical",
    assignees: ["Daniel Lee", "Ethan Brown"],
    due: "2026-08-23",
    tags: ["Backend", "Urgent"],
    subtasks: [
      { title: "Verify field mappings", done: true },
      { title: "Run import", done: false },
      { title: "Review failed records", done: false },
    ],
    comments: [
      {
        id: "c2",
        author: "Daniel Lee",
        text: "Waiting on the final source export.",
      },
    ],
    attachments: ["mapping.csv"],
    reminder: "1 day before",
    created: "Aug 15",
    updated: "Yesterday",
  },
  {
    id: "campaign",
    title: "Prepare campaign launch assets",
    description: "Package approved assets for the September campaign launch.",
    project: "Marketing Automation",
    status: "In Progress",
    priority: "High",
    assignees: ["Emma Wilson", "Mia Johnson"],
    due: "2026-08-27",
    tags: ["Marketing", "Design"],
    subtasks: [
      { title: "Approve hero artwork", done: true },
      { title: "Create email variants", done: false },
    ],
    comments: [],
    attachments: [],
    reminder: "At due time",
    created: "Aug 19",
    updated: "2 hrs ago",
  },
  {
    id: "invoice",
    title: "Add invoice export option",
    description: "Add a CSV export action to the invoice history table.",
    project: "Finance Suite",
    status: "Backlog",
    priority: "Low",
    assignees: ["Noah Williams"],
    due: "2026-09-01",
    tags: ["Frontend", "Finance"],
    subtasks: [],
    comments: [],
    attachments: [],
    reminder: "None",
    created: "Aug 20",
    updated: "Yesterday",
  },
];

const blank = (): Task => ({
  id: "",
  title: "",
  description: "",
  project: "Website Redesign",
  status: "Todo",
  priority: "Medium",
  assignees: [],
  due: "2026-08-25",
  tags: [],
  subtasks: [],
  comments: [],
  attachments: [],
  reminder: "30 minutes before",
  created: "Now",
  updated: "Now",
});

export function TasksApp() {
  const [tasks, setTasks] = useState(initial);
  const [search, setSearch] = useState("");
  const [taskView, setTaskView] = useState<
    "All Tasks" | "Today" | "Upcoming" | "Overdue" | "Completed"
  >("All Tasks");
  const [status, setStatus] = useState<Status | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [assignee, setAssignee] = useState("All");
  const [sort, setSort] = useState("Due date");
  const [group, setGroup] = useState("None");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Task | null>(null);
  const [form, setForm] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | "bulk" | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const shown = useMemo(
    () =>
      tasks
        .filter((task) => {
          const isCompleted = task.status === "Completed";
          const matchesView =
            taskView === "All Tasks" ||
            (taskView === "Today" && task.due === "2026-08-24") ||
            (taskView === "Upcoming" && task.due > "2026-08-24" && !isCompleted) ||
            (taskView === "Overdue" && task.due < "2026-08-24" && !isCompleted) ||
            (taskView === "Completed" && isCompleted);

          return (
            matchesView &&
            (status === "All" || task.status === status) &&
            (priority === "All" || task.priority === priority) &&
            (assignee === "All" || task.assignees.includes(assignee)) &&
            `${task.title} ${task.description} ${task.project} ${task.tags.join(" ")} ${task.assignees.join(" ")}`
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        })
        .sort((a, b) =>
          sort === "Title A-Z"
            ? a.title.localeCompare(b.title)
            : sort === "Priority"
              ? priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
              : a.due.localeCompare(b.due),
        ),
    [tasks, taskView, status, priority, assignee, search, sort],
  );

  const update = (task: Task) =>
    setTasks((all) =>
      task.id
        ? all.map((item) => (item.id === task.id ? { ...task, updated: "Now" } : item))
        : [
            {
              ...task,
              id: `task-${Date.now()}`,
              updated: "Now",
            },
            ...all,
          ],
    );

  const complete = (ids: string[]) => {
    setTasks((all) =>
      all.map((task) =>
        ids.includes(task.id)
          ? {
              ...task,
              status: task.status === "Completed" ? "Todo" : "Completed",
              updated: "Now",
            }
          : task,
      ),
    );

    setSelected([]);
    toast.success(ids.length > 1 ? "Tasks updated" : "Task updated");
  };

  const moveTask = (nextStatus: Status) => {
    if (!draggedId) return;

    setTasks((all) =>
      all.map((task) =>
        task.id === draggedId
          ? {
              ...task,
              status: nextStatus,
              updated: "Now",
            }
          : task,
      ),
    );

    setDraggedId(null);
    toast.success(`Task moved to ${nextStatus}`);
  };

  const grouped =
    group === "None"
      ? [["All tasks", shown]]
      : Object.entries(
          shown.reduce<Record<string, Task[]>>((acc, t) => {
            const key =
              group === "Status"
                ? t.status
                : group === "Priority"
                  ? t.priority
                  : group === "Assignee"
                    ? t.assignees[0] || "Unassigned"
                    : t.project;

            (acc[key] ||= []).push(t);
            return acc;
          }, {}),
        );

  return (
    <div className="flex min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl border bg-card shadow-sm">
      <aside className="hidden w-64 shrink-0 border-e lg:block">
        <Filters
          taskView={taskView}
          setTaskView={setTaskView}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          assignee={assignee}
          setAssignee={setAssignee}
          tasks={tasks}
        />
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open filters"
              onClick={() => setFiltersOpen(true)}
            >
              <Icons.SlidersHorizontal className="size-4" />
            </Button>

            <div className="me-auto">
              <h1 className="text-xl font-semibold">Tasks</h1>
              <p className="text-xs text-muted-foreground">
                Plan, assign and track work across your team.
              </p>
            </div>

            <Button onClick={() => setForm(blank())}>
              <Icons.Plus className="size-4" />
              Add task
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="relative min-w-48 flex-1">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks"
                className="h-9 w-full rounded-md border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <Select
              value={sort}
              setValue={setSort}
              options={["Due date", "Priority", "Title A-Z"]}
            />

            <Select
              value={group}
              setValue={setGroup}
              options={["None", "Status", "Priority", "Assignee", "Project"]}
            />
          </div>
        </header>

        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 text-xs">
          <span>
            <b>{tasks.filter((t) => t.status !== "Completed").length} Active</b>
            <span className="mx-2 text-muted-foreground">
              {tasks.filter((t) => t.status === "In Progress").length} In progress
            </span>
            <span className="text-muted-foreground">
              {tasks.filter((t) => t.status === "Completed").length} completed
            </span>
          </span>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={shown.length > 0 && selected.length === shown.length}
              onChange={(e) => setSelected(e.target.checked ? shown.map((t) => t.id) : [])}
            />
            Select all
          </label>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-primary/10 px-4 py-2 text-sm">
            <b>{selected.length} selected</b>

            <Button size="sm" onClick={() => complete(selected)}>
              Mark complete
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setTasks((all) =>
                  all.map((t) => (selected.includes(t.id) ? { ...t, status: "In Progress" } : t)),
                );
                setSelected([]);
                toast.success("Status updated");
              }}
            >
              Move to progress
            </Button>

            <Button size="sm" variant="destructive" onClick={() => setDeleteTarget("bulk")}>
              Delete
            </Button>
          </div>
        )}

        <section className="p-3 sm:p-4">
          {grouped.map(([name, items]) => (
            <div
              key={name}
              onDragOver={(event) => {
                if (group === "Status") event.preventDefault();
              }}
              onDrop={() => {
                if (group === "Status" && statuses.includes(name as Status))
                  moveTask(name as Status);
              }}
              className={cn(
                "mb-5 rounded-lg transition",
                group === "Status" &&
                  draggedId &&
                  "ring-1 ring-dashed ring-primary/60 bg-primary/[0.025]",
              )}
            >
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {name} - {items.length}
              </h2>

              <div className="overflow-hidden rounded-lg border">
                {items.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    selected={selected.includes(task.id)}
                    onSelect={() =>
                      setSelected((all) =>
                        all.includes(task.id)
                          ? all.filter((id) => id !== task.id)
                          : [...all, task.id],
                      )
                    }
                    onOpen={() => setDetail(task)}
                    onComplete={() => complete([task.id])}
                    onDragStart={() => setDraggedId(task.id)}
                  />
                ))}

                {group === "Status" && draggedId && (
                  <div className="border-t border-dashed px-3 py-2 text-xs text-muted-foreground">
                    Drop task here to move it to {name}
                  </div>
                )}
              </div>
            </div>
          ))}

          {!shown.length && (
            <div className="py-20 text-center text-sm text-muted-foreground">
              <Icons.ListTodo className="mx-auto mb-3 size-8" />
              No tasks match these filters.
            </div>
          )}
        </section>
      </main>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="overflow-y-auto lg:hidden">
          <SheetHeader>
            <SheetTitle>Task filters</SheetTitle>
            <SheetDescription>Refine the tasks you see.</SheetDescription>
          </SheetHeader>

          <div className="mt-5">
            <Filters
              taskView={taskView}
              setTaskView={setTaskView}
              status={status}
              setStatus={setStatus}
              priority={priority}
              setPriority={setPriority}
              assignee={assignee}
              setAssignee={setAssignee}
              tasks={tasks}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <TaskDetails
            task={detail}
            onEdit={() => {
              setForm(detail);
              setDetail(null);
            }}
            onComplete={() => detail && complete([detail.id])}
            onDuplicate={() => {
              if (detail) {
                setTasks((all) => [
                  {
                    ...detail,
                    id: `task-${Date.now()}`,
                    title: `${detail.title} (Copy)`,
                    status: "Todo",
                  },
                  ...all,
                ]);
                toast.success("Task duplicated");
              }
            }}
            onDelete={() => setDeleteTarget(detail)}
            setTasks={setTasks}
          />
        </SheetContent>
      </Sheet>

      <TaskForm
        task={form}
        setTask={setForm}
        onClose={() => setForm(null)}
        onSave={() => {
          if (!form?.title.trim()) return toast.error("Task title is required");

          update(form);
          setForm(null);
          toast.success(form.id ? "Task updated" : "Task created");
        }}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteTarget === "bulk" ? `Delete ${selected.length} tasks?` : "Delete task?"}
            </DialogTitle>
            <DialogDescription>
              This task will be removed from the demo workspace.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                const ids =
                  deleteTarget === "bulk" ? selected : deleteTarget ? [deleteTarget.id] : [];

                setTasks((all) => all.filter((t) => !ids.includes(t.id)));
                setSelected([]);
                setDetail(null);
                setDeleteTarget(null);
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

function Filters({
  taskView,
  setTaskView,
  status,
  setStatus,
  priority,
  setPriority,
  assignee,
  setAssignee,
  tasks,
}: {
  taskView: "All Tasks" | "Today" | "Upcoming" | "Overdue" | "Completed";
  setTaskView: (view: "All Tasks" | "Today" | "Upcoming" | "Overdue" | "Completed") => void;
  status: Status | "All";
  setStatus: (value: Status | "All") => void;
  priority: Priority | "All";
  setPriority: (value: Priority | "All") => void;
  assignee: string;
  setAssignee: (value: string) => void;
  tasks: Task[];
}) {
  const viewItems: {
    label: "All Tasks" | "Today" | "Upcoming" | "Overdue" | "Completed";
    icon: React.ElementType;
    count: number;
  }[] = [
    { label: "All Tasks", icon: Icons.ListTodo, count: tasks.length },
    {
      label: "Today",
      icon: Icons.CalendarDays,
      count: tasks.filter((task) => task.due === "2026-08-24" && task.status !== "Completed")
        .length,
    },
    {
      label: "Upcoming",
      icon: Icons.ArrowUpRight,
      count: tasks.filter((task) => task.due > "2026-08-24" && task.status !== "Completed").length,
    },
    {
      label: "Overdue",
      icon: Icons.CircleAlert,
      count: tasks.filter((task) => task.due < "2026-08-24" && task.status !== "Completed").length,
    },
    {
      label: "Completed",
      icon: Icons.CircleCheck,
      count: tasks.filter((task) => task.status === "Completed").length,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Views
          </h2>
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        </div>
        <div className="space-y-1">
          {viewItems.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              type="button"
              onClick={() => setTaskView(label)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition",
                taskView === label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="flex-1">{label}</span>
              <span
                className={cn(
                  "grid min-w-5 place-items-center rounded-md px-1.5 py-0.5 text-xs",
                  taskView === label ? "bg-white/20 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t pt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...statuses] as (Status | "All")[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                status === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="border-t pt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Priority
        </h2>
        <div className="space-y-1">
          {(["All", ...priorities] as (Priority | "All")[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPriority(item)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition",
                priority === item
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  item === "Critical"
                    ? "bg-destructive"
                    : item === "High"
                      ? "bg-warning"
                      : item === "Medium"
                        ? "bg-info"
                        : item === "Low"
                          ? "bg-muted-foreground"
                          : "bg-primary",
                )}
              />
              <span className="flex-1">{item}</span>
              {item !== "All" && (
                <span className="text-xs">
                  {tasks.filter((task) => task.priority === item).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="border-t pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assignees
          </h2>
          <button
            type="button"
            onClick={() => setAssignee("All")}
            className="text-xs text-primary hover:underline"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1.5">
          {people.slice(0, 5).map((person) => {
            const count = tasks.filter((task) => task.assignees.includes(person)).length;
            return (
              <button
                key={person}
                type="button"
                onClick={() => setAssignee(assignee === person ? "All" : person)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg p-1.5 text-start transition",
                  assignee === person ? "bg-primary/10" : "hover:bg-muted/60",
                )}
              >
                <img
                  src={getUserImage(person)}
                  alt=""
                  className="size-7 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm">{person}</span>
                <span className="grid size-5 place-items-center rounded-full bg-muted text-[10px] text-muted-foreground">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
function TaskRow({
  task,
  selected,
  onSelect,
  onOpen,
  onComplete,
  onDragStart,
}: {
  task: Task;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onComplete: () => void;
  onDragStart: () => void;
}) {
  const done = task.subtasks.filter((s) => s.done).length;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={() => {}}
      className={cn(
        "flex cursor-grab gap-3 border-b p-3 last:border-0 hover:bg-muted/40 active:cursor-grabbing",
        selected && "bg-primary/5",
      )}
    >
      <button
        type="button"
        aria-label={selected ? `Remove ${task.title} from selection` : `Select ${task.title}`}
        onClick={onSelect}
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border text-muted-foreground transition hover:border-primary hover:text-primary",
          selected && "border-primary bg-primary text-primary-foreground",
        )}
      >
        <Icons.Layers2 className="size-3" />
      </button>

      <button
        type="button"
        aria-label={
          task.status === "Completed" ? `Reopen ${task.title}` : `Mark ${task.title} complete`
        }
        onClick={onComplete}
        className={cn(
          "mt-0.5 shrink-0 rounded-full text-muted-foreground transition hover:text-success",
          task.status === "Completed" && "text-success",
        )}
      >
        <Icons.CircleCheck className="size-5" />
      </button>

      <button onClick={onOpen} className="min-w-0 flex-1 text-start">
        <b
          className={cn(
            "block text-sm",
            task.status === "Completed" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </b>

        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{task.project}</span>

          {task.tags.map((tag) => (
            <span key={tag} className="rounded bg-muted px-1.5 py-0.5">
              {tag}
            </span>
          ))}

          <span>
            {done}/{task.subtasks.length || 0} subtasks
          </span>
        </span>
      </button>

      <div className="hidden items-end gap-2 sm:flex sm:flex-col">
        <span
          className={cn(
            "rounded px-2 py-0.5 text-[11px] font-medium",
            priorityStyle[task.priority],
          )}
        >
          {task.priority}
        </span>

        <span
          className={cn("rounded px-2 py-0.5 text-[11px] font-medium", statusStyle[task.status])}
        >
          {task.status}
        </span>
      </div>

      <small className="hidden w-16 shrink-0 text-end text-xs text-muted-foreground md:block">
        {task.due.slice(5)}
      </small>
    </div>
  );
}

function TaskDetails({
  task,
  onEdit,
  onComplete,
  onDuplicate,
  onDelete,
  setTasks,
}: {
  task: Task | null;
  onEdit: () => void;
  onComplete: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [comment, setComment] = useState("");

  if (!task) return null;

  const addComment = () => {
    if (!comment.trim()) return;

    setTasks((all) =>
      all.map((t) =>
        t.id === task.id
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `c-${Date.now()}`,
                  author: "You",
                  text: comment,
                },
              ],
            }
          : t,
      ),
    );

    setComment("");
    toast.success("Comment added");
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>{task.title}</SheetTitle>
        <SheetDescription>{task.project}</SheetDescription>
      </SheetHeader>

      <div className="mt-5 space-y-5 text-sm">
        <p className="leading-6 text-muted-foreground">{task.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className={cn("rounded px-2 py-1 text-xs", statusStyle[task.status])}>
            {task.status}
          </span>

          <span className={cn("rounded px-2 py-1 text-xs", priorityStyle[task.priority])}>
            {task.priority}
          </span>

          <span className="rounded bg-muted px-2 py-1 text-xs">Due {task.due}</span>
        </div>

        <Section
          title={`Subtasks (${task.subtasks.filter((s) => s.done).length}/${task.subtasks.length})`}
        >
          {task.subtasks.length ? (
            task.subtasks.map((sub, i) => (
              <label key={sub.title} className="flex gap-2 py-1">
                <input
                  type="checkbox"
                  checked={sub.done}
                  onChange={() =>
                    setTasks((all) =>
                      all.map((t) =>
                        t.id === task.id
                          ? {
                              ...t,
                              subtasks: t.subtasks.map((s, x) =>
                                x === i ? { ...s, done: !s.done } : s,
                              ),
                            }
                          : t,
                      ),
                    )
                  }
                />
                <span className={cn(sub.done && "line-through text-muted-foreground")}>
                  {sub.title}
                </span>
              </label>
            ))
          ) : (
            <p className="text-muted-foreground">No subtasks yet.</p>
          )}
        </Section>

        <Section title="Assignees">
          <p>{task.assignees.join(", ") || "Unassigned"}</p>
        </Section>

        <Section title={`Attachments (${task.attachments.length})`}>
          {task.attachments.length ? (
            task.attachments.map((file) => (
              <div key={file} className="flex items-center gap-2 rounded border p-2">
                <Icons.File className="size-4 text-primary" />
                {file}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No attachments.</p>
          )}
        </Section>

        <Section title={`Comments (${task.comments.length})`}>
          {task.comments.map((c) => (
            <div key={c.id} className="rounded bg-muted p-2">
              <b className="text-xs">{c.author}</b>
              <p>{c.text}</p>
            </div>
          ))}

          <div className="mt-2 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment"
              className="h-9 min-w-0 flex-1 rounded border bg-background px-2 text-sm"
            />
            <Button size="sm" onClick={addComment}>
              Add
            </Button>
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Icons.Pencil className="size-4" />
            Edit
          </Button>

          <Button variant="outline" onClick={onDuplicate}>
            <Icons.Copy className="size-4" />
            Duplicate
          </Button>

          <Button onClick={onComplete}>
            <Icons.Check className="size-4" />
            Complete
          </Button>

          <Button variant="destructive" onClick={onDelete}>
            <Icons.Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}

function TaskForm({
  task,
  setTask,
  onClose,
  onSave,
}: {
  task: Task | null;
  setTask: (task: Task | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const set = (key: keyof Task, value: any) => task && setTask({ ...task, [key]: value });

  return (
    <Dialog open={Boolean(task)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task?.id ? "Edit task" : "Add task"}</DialogTitle>
          <DialogDescription>Set details, ownership, and due dates.</DialogDescription>
        </DialogHeader>

        {task && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" wide>
              <input
                value={task.title}
                onChange={(e) => set("title", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </Field>

            <Field label="Project">
              <input
                value={task.project}
                onChange={(e) => set("project", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>

            <Field label="Assignees">
              <input
                value={task.assignees.join(", ")}
                onChange={(e) =>
                  set(
                    "assignees",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Sophia Carter, Daniel Lee"
              />
            </Field>

            <Field label="Status">
              <select
                value={task.status}
                onChange={(e) => set("status", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                {statuses.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={task.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                {priorities.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>

            <Field label="Due date">
              <input
                type="date"
                value={task.due}
                onChange={(e) => set("due", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>

            <Field label="Tags">
              <input
                value={task.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>

            <Field label="Reminder">
              <select
                value={task.reminder}
                onChange={(e) => set("reminder", e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[
                  "None",
                  "At due time",
                  "10 minutes before",
                  "30 minutes before",
                  "1 hour before",
                  "1 day before",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>

            <Field label="Description" wide>
              <textarea
                value={task.description}
                onChange={(e) => set("description", e.target.value)}
                className="field min-h-24 py-2"
              />
            </Field>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>{task?.id ? "Save changes" : "Create task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Select({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (x: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="h-9 rounded-md border bg-background px-2 text-xs"
    >
      {options.map((x) => (
        <option key={x}>{x}</option>
      ))}
    </select>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("grid gap-1 text-xs font-medium", wide && "sm:col-span-2")}>
      {label}
      {children}
    </label>
  );
}
