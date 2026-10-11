import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { localImages } from "@/lib/local-images";

type Item = {
  id: string;
  name: string;
  folder?: boolean;
  type: string;
  size: string;
  modified: string;
  owner: string;
  path: string;
  star?: boolean;
  shared?: boolean;
  trash?: boolean;
};

const seed: Item[] = [
  {
    id: "design",
    name: "Design Assets",
    folder: true,
    type: "Folder",
    size: "24 files",
    modified: "2 hours ago",
    owner: "You",
    path: "/",
  },
  {
    id: "finance",
    name: "Finance",
    folder: true,
    type: "Folder",
    size: "18 files",
    modified: "Yesterday",
    owner: "You",
    path: "/",
  },
  {
    id: "project",
    name: "Project Files",
    folder: true,
    type: "Folder",
    size: "36 files",
    modified: "Aug 21",
    owner: "You",
    path: "/",
  },
  {
    id: "reports",
    name: "Reports",
    folder: true,
    type: "Folder",
    size: "12 files",
    modified: "Aug 20",
    owner: "Sophia",
    path: "/",
    shared: true,
  },
  {
    id: "q3",
    name: "Q3-Revenue-Report.pdf",
    type: "PDF",
    size: "2.4 MB",
    modified: "2 hours ago",
    owner: "Sophia",
    path: "/",
    star: true,
    shared: true,
  },
  {
    id: "wire",
    name: "Dashboard-Wireframes.fig",
    type: "Design",
    size: "18.6 MB",
    modified: "Yesterday",
    owner: "You",
    path: "/",
  },
  {
    id: "data",
    name: "Customer-Data.xlsx",
    type: "Spreadsheet",
    size: "4.8 MB",
    modified: "Aug 21",
    owner: "Daniel",
    path: "/",
    shared: true,
  },
  {
    id: "road",
    name: "Product-Roadmap.pptx",
    type: "Presentation",
    size: "12.2 MB",
    modified: "Aug 19",
    owner: "You",
    path: "/",
  },
  {
    id: "photo",
    name: "Team-Photo.jpg",
    type: "Image",
    size: "3.4 MB",
    modified: "Aug 18",
    owner: "Olivia",
    path: "/",
    star: true,
  },
  {
    id: "invoice",
    name: "Invoice-August.pdf",
    type: "PDF",
    size: "1.2 MB",
    modified: "Aug 17",
    owner: "You",
    path: "/",
  },
];

export function FileManagerApp() {
  const [items, setItems] = useState(seed);
  const [section, setSection] = useState("My Drive");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Item | null>(null);
  const [folder, setFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [rename, setRename] = useState<Item | null>(null);
  const [preview, setPreview] = useState<Item | null>(null);
  const [move, setMove] = useState<Item | null>(null);

  const [fileInput] = [useRef<HTMLInputElement>(null)];

  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (section === "Trash"
            ? i.trash
            : section === "Starred"
              ? i.star
              : section === "Shared with Me"
                ? i.shared
                : section === "Recent"
                  ? !i.trash
                  : !i.trash) &&
          `${i.name} ${i.type} ${i.owner}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, section, search],
  );

  const addFolder = () => {
    const name = folderName.trim();

    if (!name) return toast.error("Folder name is required");

    if (items.some((item) => item.folder && item.name.toLowerCase() === name.toLowerCase())) {
      return toast.error("A folder with this name already exists");
    }

    setItems((x) => [
      ...x,
      {
        id: `f${Date.now()}`,
        name,
        folder: true,
        type: "Folder",
        size: "0 files",
        modified: "Now",
        owner: "You",
        path: "/",
      },
    ]);

    setFolderName("");
    setFolder(false);
    toast.success("Folder created");
  };

  const upload = (files: FileList | null) => {
    if (!files) return;

    setItems((x) => [
      ...x,
      ...Array.from(files).map((f) => ({
        id: `u${Date.now()}${f.name}`,
        name: f.name,
        type: f.type.startsWith("image") ? "Image" : "File",
        size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
        modified: "Now",
        owner: "You",
        path: "/",
      })),
    ]);

    toast.success("Files uploaded");
  };

  const trash = (ids: string[]) => {
    setItems((x) => x.map((i) => (ids.includes(i.id) ? { ...i, trash: true } : i)));

    setSelected([]);
    setDetail(null);
    toast.success("Moved to trash");
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] overflow-hidden rounded-xl border bg-card">
      <aside className="hidden w-60 shrink-0 border-e p-3 lg:block">
        <Nav section={section} setSection={setSection} />
        <Storage />
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b p-4">
          <div className="flex flex-wrap gap-2">
            <div className="me-auto">
              <h1 className="text-xl font-semibold">File Manager</h1>
              <p className="text-xs text-muted-foreground">
                Your files, projects, and shared work.
              </p>
            </div>

            <Button variant="outline" onClick={() => setFolder(true)}>
              <Icons.FolderPlus className="size-4" />
              New folder
            </Button>

            <Button onClick={() => fileInput.current?.click()}>
              <Icons.Upload className="size-4" />
              Upload
            </Button>

            <input
              ref={fileInput}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => upload(e.target.files)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <label className="relative min-w-0 flex-1">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files and folders"
                className="h-9 w-full rounded border bg-background ps-9 pe-3 text-sm"
              />
            </label>

            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <Icons.Grid2X2 className="size-4" />
            </Button>

            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <Icons.List className="size-4" />
            </Button>
          </div>
        </header>

        {selected.length > 0 && (
          <div className="flex gap-2 border-b bg-primary/10 p-2 text-sm">
            <b>{selected.length} selected</b>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setItems((x) => x.map((i) => (selected.includes(i.id) ? { ...i, star: true } : i)))
              }
            >
              Star
            </Button>

            <Button size="sm" variant="destructive" onClick={() => trash(selected)}>
              Move to trash
            </Button>
          </div>
        )}

        <div className="border-b px-4 py-2 text-sm text-muted-foreground">
          My Drive <Icons.ChevronRight className="inline size-3" /> {section}
        </div>

        <section className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Folders</h2>

          <div
            className={cn(
              view === "grid"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
                : "space-y-1",
            )}
          >
            {shown
              .filter((item) => item.folder)
              .map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  view={view}
                  checked={selected.includes(item.id)}
                  onCheck={() =>
                    setSelected((x) =>
                      x.includes(item.id) ? x.filter((id) => id !== item.id) : [...x, item.id],
                    )
                  }
                  onOpen={() => toast.info(`${item.name} selected`)}
                  onDetail={() => setDetail(item)}
                />
              ))}

            {!shown.some((item) => item.folder) && (
              <p className="col-span-full py-3 text-sm text-muted-foreground">
                No folders in this location.
              </p>
            )}
          </div>

          <h2 className="mb-3 mt-7 text-sm font-semibold">Files</h2>

          <div
            className={cn(
              view === "grid"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
                : "space-y-1",
            )}
          >
            {shown
              .filter((item) => !item.folder)
              .map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  view={view}
                  checked={selected.includes(item.id)}
                  onCheck={() =>
                    setSelected((x) =>
                      x.includes(item.id) ? x.filter((id) => id !== item.id) : [...x, item.id],
                    )
                  }
                  onOpen={() => setPreview(item)}
                  onDetail={() => setDetail(item)}
                />
              ))}

            {!shown.some((item) => !item.folder) && (
              <p className="col-span-full py-3 text-sm text-muted-foreground">
                No files in this location.
              </p>
            )}
          </div>
        </section>
      </main>

      <Dialog open={folder} onOpenChange={setFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Give the new folder a clear, unique name.</DialogDescription>
          </DialogHeader>

          <label className="grid gap-1 text-sm font-medium">
            Folder name
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFolder()}
              autoFocus
              placeholder="e.g. Product assets"
              className="h-10 rounded border bg-background px-3"
            />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFolder(false)}>
              Cancel
            </Button>
            <Button onClick={addFolder}>Create folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(detail)} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{detail?.name}</SheetTitle>
          </SheetHeader>

          {detail && (
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {detail.folder ? (
                  <Icons.Folder className="size-8" />
                ) : (
                  <Icons.File className="size-8" />
                )}
              </div>

              <p>
                <b>Type:</b> {detail.type}
              </p>
              <p>
                <b>Size:</b> {detail.size}
              </p>
              <p>
                <b>Owner:</b> {detail.owner}
              </p>
              <p>
                <b>Modified:</b> {detail.modified}
              </p>
              <p>
                <b>Shared:</b> {detail.shared ? "Yes" : "Private"}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setRename(detail)}>
                  Rename
                </Button>

                <Button variant="outline" onClick={() => setMove(detail)}>
                  Move / Copy
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setItems((x) =>
                      x.map((i) => (i.id === detail.id ? { ...i, star: !i.star } : i)),
                    )
                  }
                >
                  Star
                </Button>

                <Button variant="destructive" onClick={() => trash([detail.id])}>
                  Trash
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <NameDialog
        title={rename?.folder ? "Rename folder" : "Rename file"}
        item={rename}
        setItem={setRename}
        onSave={(name) => {
          if (rename) {
            setItems((x) => x.map((i) => (i.id === rename.id ? { ...i, name } : i)));
          }

          setRename(null);
          toast.success("Item renamed");
        }}
      />

      <NameDialog
        title="Move or copy item"
        item={move}
        setItem={setMove}
        onSave={() => {
          setMove(null);
          toast.success("Item copied to My Drive");
        }}
      />

      <Dialog open={Boolean(preview)} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
            <DialogDescription>
              {preview?.type} - {preview?.size}
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-52 items-center justify-center rounded-lg bg-muted">
            <Icons.FileText className="size-16 text-primary" />
          </div>

          <DialogFooter>
            <Button onClick={() => setPreview(null)}>Close preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Nav({ section, setSection }: { section: string; setSection: (x: string) => void }) {
  return (
    <>
      {["My Drive", "Recent", "Starred", "Shared with Me", "Trash"].map((x, i) => {
        const I = [Icons.HardDrive, Icons.Clock3, Icons.Star, Icons.Users, Icons.Trash2][i];

        return (
          <button
            key={x}
            onClick={() => setSection(x)}
            className={cn(
              "mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
              section === x ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
          >
            <I className="size-4" />
            {x}
          </button>
        );
      })}
    </>
  );
}

function Storage() {
  const categories = [
    { label: "Documents", value: "3.2 GB", width: "w-[34%]", tone: "bg-primary" },
    { label: "Images", value: "2.8 GB", width: "w-[30%]", tone: "bg-info" },
    { label: "Video", value: "2.1 GB", width: "w-[22%]", tone: "bg-warning" },
    { label: "Other", value: "1.3 GB", width: "w-[14%]", tone: "bg-muted-foreground" },
  ];

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/[0.09] via-card to-info/[0.07] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Icons.HardDrive className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Storage overview</p>
          <p className="mt-0.5 text-xs text-muted-foreground">9.4 GB of 20 GB used</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[47%] rounded-full bg-gradient-to-r from-primary to-info" />
      </div>
      <div className="mt-4 space-y-2.5">
        {categories.map((category) => (
          <div key={category.label} className="flex items-center gap-2 text-xs">
            <span className={cn("size-2 rounded-full", category.tone)} />
            <span className="flex-1 text-muted-foreground">{category.label}</span>
            <span className="font-medium text-foreground">{category.value}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full rounded-lg border bg-background/80 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-background"
      >
        Manage storage
      </button>
    </section>
  );
}
function ItemCard({
  item,
  view,
  checked,
  onCheck,
  onOpen,
  onDetail,
}: {
  item: Item;
  view: "grid" | "list";
  checked: boolean;
  onCheck: () => void;
  onOpen: () => void;
  onDetail: () => void;
}) {
  const icon = item.folder ? (
    <Icons.Folder className="size-8 fill-current" />
  ) : item.type === "PDF" ? (
    <Icons.FileText className="size-7" />
  ) : item.type === "Spreadsheet" ? (
    <Icons.Sheet className="size-7" />
  ) : item.type === "Presentation" ? (
    <Icons.Presentation className="size-7" />
  ) : item.type === "Design" ? (
    <Icons.Palette className="size-7" />
  ) : (
    <Icons.File className="size-7" />
  );
  const tone = item.folder
    ? "from-amber-300/35 to-orange-400/20 text-amber-600"
    : item.type === "PDF"
      ? "from-rose-500/18 to-orange-400/10 text-rose-600"
      : item.type === "Spreadsheet"
        ? "from-emerald-500/18 to-teal-400/10 text-emerald-600"
        : item.type === "Presentation"
          ? "from-violet-500/18 to-indigo-400/10 text-violet-600"
          : "from-primary/18 to-info/10 text-primary";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg",
        checked && "border-primary ring-2 ring-primary/15",
        view === "grid" ? "min-h-44" : "flex items-center gap-3 p-3",
      )}
    >
      <button
        type="button"
        aria-label={checked ? `Remove ${item.name} from selection` : `Select ${item.name}`}
        onClick={onCheck}
        className={cn(
          "absolute end-3 top-3 z-10 grid size-6 place-items-center rounded-lg border bg-card/90 text-transparent shadow-sm transition",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-primary hover:text-primary",
        )}
      >
        <Icons.Check className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "min-w-0 text-start",
          view === "grid"
            ? "flex h-full w-full flex-col p-3"
            : "flex min-w-0 flex-1 items-center gap-3",
        )}
      >
        {item.folder ? (
          <div
            className={cn(
              "mb-4 flex h-20 items-center justify-between rounded-xl bg-gradient-to-br px-4",
              tone,
              view === "list" && "mb-0 size-11 shrink-0 p-0 justify-center",
            )}
          >
            <span className="grid size-11 place-items-center rounded-xl bg-background/55">
              {icon}
            </span>
            {view === "grid" && (
              <span className="rounded-full bg-background/60 px-2 py-1 text-[10px] font-semibold">
                {item.size}
              </span>
            )}
          </div>
        ) : item.type === "Image" ? (
          <div
            className={cn(
              "relative mb-4 h-24 overflow-hidden rounded-xl",
              view === "list" && "mb-0 size-11 shrink-0",
            )}
          >
            <img src={localImages.workspaceDashboard} alt="" className="size-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div
            className={cn(
              "mb-4 grid h-24 place-items-center rounded-xl bg-gradient-to-br",
              tone,
              view === "list" && "mb-0 size-11 shrink-0",
            )}
          >
            {icon}
          </div>
        )}
        <div className={cn("min-w-0", view === "list" && "flex min-w-0 flex-1 items-center gap-5")}>
          <div className="min-w-0 flex-1">
            <b className="block truncate pe-8 text-sm">{item.name}</b>
            <small className="mt-1 block text-xs text-muted-foreground">
              {item.folder ? `${item.size} - ${item.modified}` : `${item.type} - ${item.size}`}
            </small>
          </div>
          {view === "list" && (
            <>
              <small className="hidden w-20 text-xs text-muted-foreground md:block">
                {item.owner}
              </small>
              <small className="hidden w-24 text-end text-xs text-muted-foreground lg:block">
                {item.modified}
              </small>
            </>
          )}
        </div>
        {view === "grid" && (
          <div className="mt-auto flex items-center gap-1.5 pt-4">
            <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
              {item.owner === "You" ? "Private" : item.owner}
            </span>
            {item.shared && (
              <span className="inline-flex items-center gap-1 rounded-full bg-info/12 px-2 py-1 text-[10px] font-medium text-info">
                <Icons.Users className="size-3" />
                Shared
              </span>
            )}
            {item.star && <Icons.Star className="ms-auto size-3.5 fill-warning text-warning" />}
          </div>
        )}
      </button>
      <button
        type="button"
        onClick={onDetail}
        aria-label={`Details for ${item.name}`}
        className="absolute bottom-2 end-2 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
      >
        <Icons.MoreHorizontal className="size-4" />
      </button>
    </article>
  );
}
function NameDialog({
  title,
  item,
  setItem,
  onSave,
}: {
  title: string;
  item: Item | null;
  setItem: (x: Item | null) => void;
  onSave: (x: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <Dialog open={Boolean(item)} onOpenChange={(o) => !o && setItem(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <input
          defaultValue={item?.name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded border bg-background px-3"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setItem(null)}>
            Cancel
          </Button>

          <Button onClick={() => onSave(name || item?.name || "")}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
