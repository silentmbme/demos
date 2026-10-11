import { useState } from "react";
import {
  Plus,
  Search,
  Pin,
  Trash2,
  NotebookPen,
  Download,
  LayoutGrid,
  List,
  Lightbulb,
  Briefcase,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader, Badge } from "@/components/dashboard/widgets";
import { AppShell } from "@/components/layout/AppShell";
type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  pinned: boolean;
};
const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "Weekly priorities",
    content:
      "Review the dashboard designs.\nFinish the project handoff checklist.\nSchedule a team catch-up.",
    category: "Work",
    color: "--primary",
    pinned: true,
  },
  {
    id: "note-2",
    title: "Ideas for the next release",
    content:
      "Improve onboarding guidance.\nExplore keyboard shortcuts.\nCollect feedback from the team.",
    category: "Ideas",
    color: "--warning",
    pinned: false,
  },
  {
    id: "note-3",
    title: "Meeting recap",
    content:
      "Discussed current milestones and next steps.\nShare the updated timeline before the next review.",
    category: "Work",
    color: "--info",
    pinned: false,
  },
  {
    id: "note-4",
    title: "Reading list",
    content: "Read a chapter each evening.\nSave useful articles and write a short summary.",
    category: "Personal",
    color: "--success",
    pinned: false,
  },
];
export function NotesPage() {
  return (
    <AppShell navigationPath="/apps/notes">
      <NotesApp />
    </AppShell>
  );
}
export function NotesApp() {
  const [notes, setNotes] = useState(initialNotes);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editor, setEditor] = useState<Note | null>(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const visible = notes
    .filter(
      (n) =>
        (category === "All" || (category === "Pinned" ? n.pinned : n.category === category)) &&
        `${n.title} ${n.content}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  function save() {
    if (!editor) return;
    if (!editor.title.trim()) {
      setError("Add a title to your note.");
      return;
    }
    const note = { ...editor, title: editor.title.trim(), content: editor.content.trim() };
    setNotes((current) =>
      current.some((n) => n.id === note.id)
        ? current.map((n) => (n.id === note.id ? note : n))
        : [note, ...current],
    );
    setEditor(null);
  }
  function exportNote() {
    if (!editor) return;
    const url = URL.createObjectURL(
      new Blob([editor.title + "\n\n" + editor.content], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "note.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="Notes"
        subtitle="Keep ideas, plans, and everyday details in one place."
        breadcrumb={["Apps", "Notes"]}
        actions={
          <Button
            onClick={() => {
              setError("");
              setEditor({
                id: crypto.randomUUID(),
                title: "",
                content: "",
                category: "Personal",
                color: "--primary",
                pinned: false,
              });
            }}
          >
            <Plus className="size-4" />
            New note
          </Button>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="vexui-card p-4 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <NotebookPen className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">My notebooks</p>
              <p className="text-[11px] text-muted-foreground">Personal workspace</p>
            </div>
          </div>
          <nav aria-label="Note categories" className="flex flex-wrap gap-2 lg:block lg:space-y-1">
            {["All", "Pinned", "Work", "Personal", "Ideas"].map((c) => {
              const Icon =
                c === "Pinned"
                  ? Pin
                  : c === "Work"
                    ? Briefcase
                    : c === "Ideas"
                      ? Lightbulb
                      : c === "Personal"
                        ? UserRound
                        : NotebookPen;
              return (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs lg:w-full " +
                    (category === c
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted")
                  }
                >
                  <Icon className="size-4" />
                  <span className="flex-1 text-start">{c === "All" ? "All notes" : c}</span>
                  <span className="rounded-md bg-card px-1.5 py-0.5 text-[10px]">
                    {
                      notes.filter(
                        (n) => c === "All" || (c === "Pinned" ? n.pinned : n.category === c),
                      ).length
                    }
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-xl bg-muted/40 p-3">
            <p className="text-xs font-semibold">A space for your thoughts</p>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              Sample notes. Changes last for this session. Export to keep a copy.
            </p>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Capture / Organize / Create
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Make room for your next idea.</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {notes.length} notes in your workspace ? {notes.filter((n) => n.pinned).length}{" "}
                pinned for quick access
              </p>
            </div>
            <span className="grid size-14 place-items-center rounded-2xl bg-card/80 text-primary shadow-sm">
              <NotebookPen className="size-7" />
            </span>
          </div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {category === "All" ? "All notes" : category + " notes"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{visible.length} notes in view</p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative min-w-0 flex-1 sm:w-60">
                <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
                <Input
                  aria-label="Search notes"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find a note?"
                  className="ps-9"
                />
              </div>
              <div className="flex rounded-lg border border-border bg-card p-1">
                {(["grid", "list"] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={view === mode ? "secondary" : "ghost"}
                    size="icon"
                    className="size-7"
                    aria-label={mode + " view"}
                    aria-pressed={view === mode}
                    onClick={() => setView(mode)}
                  >
                    {mode === "grid" ? (
                      <LayoutGrid className="size-3.5" />
                    ) : (
                      <List className="size-3.5" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div
            className={view === "grid" ? "grid gap-5 sm:grid-cols-2 2xl:grid-cols-3" : "grid gap-3"}
          >
            {visible.map((note) => (
              <article
                key={note.id}
                className={
                  "vexui-card relative flex flex-col overflow-hidden border-t-[3px] transition-all hover:-translate-y-0.5 hover:shadow-md " +
                  (view === "grid" ? "min-h-72" : "min-h-0")
                }
                style={{
                  background: `linear-gradient(135deg,color-mix(in oklch,var(${note.color}) 5%,var(--card)),var(--card))`,
                  borderTopColor: `var(${note.color})`,
                }}
              >
                <div className="flex items-center justify-between px-5 pt-4">
                  <span
                    className="rounded-md px-2 py-1 text-[10px] font-semibold"
                    style={{
                      color: `var(${note.color})`,
                      background: `color-mix(in oklch,var(${note.color}) 12%,transparent)`,
                    }}
                  >
                    {note.category}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={"size-8 " + (note.pinned ? "text-primary" : "text-muted-foreground")}
                    aria-label={`${note.pinned ? "Unpin" : "Pin"} ${note.title}`}
                    aria-pressed={note.pinned}
                    onClick={() =>
                      setNotes((current) =>
                        current.map((n) => (n.id === note.id ? { ...n, pinned: !n.pinned } : n)),
                      )
                    }
                  >
                    <Pin className="size-4" />
                  </Button>
                </div>
                <button
                  className="flex-1 px-5 py-4 text-start"
                  aria-label={`Edit ${note.title}`}
                  onClick={() => {
                    setError("");
                    setEditor({ ...note });
                  }}
                >
                  <h2 className="text-base font-semibold">{note.title}</h2>
                  <p
                    className={
                      "mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground " +
                      (view === "grid" ? "line-clamp-5" : "line-clamp-2")
                    }
                  >
                    {note.content || "Empty note — add your thoughts."}
                  </p>
                </button>
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                  <span className="text-[11px] text-muted-foreground">
                    {note.content.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${note.title}`}
                    onClick={() => setPendingDelete(note)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="vexui-card py-16 text-center">
              <NotebookPen className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <h2 className="font-semibold">No notes in this view</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another filter or create a new note.
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={!!editor}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {notes.some((n) => n.id === editor?.id) ? "Edit note" : "New note"}
            </DialogTitle>
            <DialogDescription>
              Changes stay in this page session. Export a note to keep a copy.
            </DialogDescription>
          </DialogHeader>
          {editor && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <label className="block text-xs font-medium">
                Title
                <Input
                  aria-label="Note title"
                  className="mt-2"
                  maxLength={100}
                  value={editor.title}
                  onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium">
                Content
                <textarea
                  aria-label="Note content"
                  className="mt-2 min-h-48 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm font-normal outline-none focus:border-primary"
                  maxLength={10000}
                  value={editor.content}
                  onChange={(e) => setEditor({ ...editor, content: e.target.value })}
                />
              </label>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <label className="text-xs font-medium">
                  Category
                  <select
                    aria-label="Note category"
                    className="mt-2 block rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    value={editor.category}
                    onChange={(e) => setEditor({ ...editor, category: e.target.value })}
                  >
                    {["Work", "Personal", "Ideas"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <div>
                  <p className="mb-2 text-xs font-medium">Color</p>
                  <div className="flex gap-2">
                    {["--primary", "--info", "--success", "--warning", "--chart-5"].map(
                      (color, i) => (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Note color ${i + 1}`}
                          aria-pressed={editor.color === color}
                          className={
                            "size-7 rounded-full border-2 " +
                            (editor.color === color
                              ? "border-foreground ring-2 ring-border"
                              : "border-transparent")
                          }
                          style={{ background: `var(${color})` }}
                          onClick={() => setEditor({ ...editor, color })}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex justify-between gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={exportNote}>
                  <Download className="size-4" />
                  Export
                </Button>
                <Button type="submit">Save note</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note?</DialogTitle>
            <DialogDescription>
              This removes “{pendingDelete?.title}” from your notes for this session.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setNotes((current) => current.filter((n) => n.id !== pendingDelete?.id));
                setPendingDelete(null);
              }}
            >
              Delete note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
