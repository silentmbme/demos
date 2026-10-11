import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";

type IconItem = {
  name: string;
  icon: Icons.LucideIcon;
  category: string;
  keywords: string[];
};

const registry: IconItem[] = [
  ["Home", Icons.Home, "Navigation", ["house", "dashboard"]],
  ["Search", Icons.Search, "Navigation", ["find", "magnify"]],
  ["Menu", Icons.Menu, "Navigation", ["hamburger", "sidebar"]],
  ["Compass", Icons.Compass, "Navigation", ["explore", "route"]],
  ["ChevronRight", Icons.ChevronRight, "Arrows", ["next", "forward"]],
  ["ArrowLeft", Icons.ArrowLeft, "Arrows", ["back", "previous"]],
  ["ArrowRight", Icons.ArrowRight, "Arrows", ["next", "forward"]],
  ["ArrowUpRight", Icons.ArrowUpRight, "Arrows", ["external", "link"]],
  ["MoveRight", Icons.MoveRight, "Arrows", ["next", "forward"]],
  ["User", Icons.User, "User", ["person", "account"]],
  ["Users", Icons.Users, "User", ["team", "people"]],
  ["UserPlus", Icons.UserPlus, "User", ["invite", "add"]],
  ["Mail", Icons.Mail, "Communication", ["email", "inbox"]],
  ["MessageSquare", Icons.MessageSquare, "Communication", ["chat", "comment"]],
  ["Bell", Icons.Bell, "Communication", ["notification", "alert"]],
  ["Send", Icons.Send, "Communication", ["message", "mail"]],
  ["Calendar", Icons.Calendar, "Navigation", ["date", "schedule"]],
  ["Clock", Icons.Clock, "Status", ["time", "schedule"]],
  ["File", Icons.File, "Files", ["document", "page"]],
  ["Folder", Icons.Folder, "Files", ["directory", "files"]],
  ["Upload", Icons.Upload, "Files", ["import", "arrow"]],
  ["Download", Icons.Download, "Files", ["export", "arrow"]],
  ["Image", Icons.Image, "Media", ["photo", "gallery"]],
  ["Play", Icons.Play, "Media", ["video", "start"]],
  ["Camera", Icons.Camera, "Media", ["photo", "image"]],
  ["ShoppingCart", Icons.ShoppingCart, "Commerce", ["cart", "order"]],
  ["CreditCard", Icons.CreditCard, "Commerce", ["payment", "billing"]],
  ["Package", Icons.Package, "Commerce", ["product", "box"]],
  ["BarChart3", Icons.BarChart3, "Charts", ["analytics", "report"]],
  ["PieChart", Icons.PieChart, "Charts", ["analytics", "report"]],
  ["TrendingUp", Icons.TrendingUp, "Charts", ["growth", "analytics"]],
  ["Monitor", Icons.Monitor, "Devices", ["desktop", "screen"]],
  ["Smartphone", Icons.Smartphone, "Devices", ["mobile", "phone"]],
  ["ShieldCheck", Icons.ShieldCheck, "Security", ["safe", "verified"]],
  ["KeyRound", Icons.KeyRound, "Security", ["password", "access"]],
  ["Lock", Icons.Lock, "Security", ["secure", "password"]],
  ["Settings", Icons.Settings, "Actions", ["gear", "preferences"]],
  ["Plus", Icons.Plus, "Actions", ["add", "create"]],
  ["Pencil", Icons.Pencil, "Actions", ["edit", "write"]],
  ["Trash2", Icons.Trash2, "Actions", ["delete", "remove"]],
  ["Check", Icons.Check, "Status", ["done", "success"]],
  ["CircleAlert", Icons.CircleAlert, "Status", ["warning", "error"]],
  ["Info", Icons.Info, "Status", ["help", "details"]],
  ["Cloud", Icons.Cloud, "Weather", ["sky", "storage"]],
  ["Sun", Icons.Sun, "Weather", ["light", "day"]],
  ["Github", Icons.Github, "Social", ["git", "code"]],
  ["Code2", Icons.Code2, "Development", ["code", "developer"]],
  ["Terminal", Icons.Terminal, "Development", ["command", "developer"]],
].map(([name, icon, category, keywords]) => ({
  name: name as string,
  icon: icon as Icons.LucideIcon,
  category: category as string,
  keywords: keywords as string[],
}));

const popular = [
  "Home",
  "Search",
  "User",
  "Settings",
  "Bell",
  "Mail",
  "Calendar",
  "Menu",
  "ChevronRight",
  "Plus",
  "Trash2",
  "Pencil",
];

const sizes = [16, 20, 24, 32, 40, 48];
const storageKey = "vexui-icons-favorites";

function copy(text: string, message: string) {
  navigator.clipboard
    ?.writeText(text)
    .then(() => toast.success(message))
    .catch(() => toast.message(text));
}

export function IconsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [size, setSize] = useState(24);
  const [view, setView] = useState<"grid" | "compact" | "list">("grid");
  const [tab, setTab] = useState<"all" | "favorites" | "recent">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [selected, setSelected] = useState<IconItem | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]");

      setFavorites(
        Array.isArray(stored)
          ? stored.filter((item): item is string => typeof item === "string")
          : [],
      );
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  const categories = [
    "All categories",
    ...Array.from(new Set(registry.map((item) => item.category))),
  ];

  const results = useMemo(
    () =>
      registry.filter((item) => {
        const haystack = [item.name, item.category, ...item.keywords].join(" ").toLowerCase();

        return (
          (category === "All categories" || item.category === category) &&
          (tab === "all" ||
            (tab === "favorites" ? favorites.includes(item.name) : recent.includes(item.name))) &&
          haystack.includes(query.toLowerCase())
        );
      }),
    [query, category, tab, favorites, recent],
  );

  const visible = results.slice((page - 1) * 24, page * 24);
  const pages = Math.max(1, Math.ceil(results.length / 24));

  useEffect(() => setPage(1), [query, category, tab]);

  const markRecent = (name: string) =>
    setRecent((items) => [name, ...items.filter((item) => item !== name)].slice(0, 12));

  const toggleFavorite = (name: string) =>
    setFavorites((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name],
    );

  const usage = (name: string, value = size) =>
    `import { ${name} } from "lucide-react";\n\n<${name} size={${value}} />`;

  const reset = () => {
    setQuery("");
    setCategory("All categories");
    setSize(24);
    setTab("all");
    setView("grid");
  };

  return (
    <>
      <PageHeader
        title="Icons"
        subtitle="Browse, preview and copy reusable icons available across the template."
        breadcrumb={["UI", "Icons"]}
        actions={
          <>
            <Button
              variant={tab === "favorites" ? "default" : "outline"}
              onClick={() => setTab("favorites")}
            >
              <Icons.Heart className="me-2 size-4" />
              Favorites
            </Button>

            <Button
              variant={tab === "recent" ? "default" : "outline"}
              onClick={() => setTab("recent")}
            >
              <Icons.History className="me-2 size-4" />
              Recently Used
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <Card title="Popular Icons" description="Frequently used building blocks in Vexui.">
          <div className="flex flex-wrap gap-2">
            {popular.map((name) => {
              const item = registry.find((icon) => icon.name === name)!;
              const Icon = item.icon;

              return (
                <button
                  key={name}
                  onClick={() => {
                    setSelected(item);
                    markRecent(name);
                  }}
                  className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <Icon className="size-4 text-primary" />
                  {name}
                </button>
              );
            })}
          </div>
        </Card>

        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_150px_170px_130px_auto]">
            <label className="relative">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search icons, categories or keywords..."
                className="h-10 ps-9"
              />
            </label>

            <select
              value="Lucide"
              disabled
              className="h-10 rounded-md border bg-muted/50 px-3 text-sm"
            >
              <option>Lucide</option>
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {sizes.map((item) => (
                <option key={item} value={item}>
                  {item}px
                </option>
              ))}
            </select>

            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={cn(
                  "grid size-8 place-items-center rounded-md",
                  view === "grid" && "bg-background text-primary shadow-sm",
                )}
              >
                <Icons.Grid2X2 className="size-4" />
              </button>

              <button
                onClick={() => setView("compact")}
                aria-label="Compact grid view"
                className={cn(
                  "grid size-8 place-items-center rounded-md",
                  view === "compact" && "bg-background text-primary shadow-sm",
                )}
              >
                <Icons.Grid3X3 className="size-4" />
              </button>

              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={cn(
                  "grid size-8 place-items-center rounded-md",
                  view === "list" && "bg-background text-primary shadow-sm",
                )}
              >
                <Icons.List className="size-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              <b className="text-foreground">{results.length}</b>{" "}
              {results.length === 1 ? "icon" : "icons"} Lucide outline
            </p>
          </div>
        </section>

        {!results.length ? (
          <Card title="No icons found" description="Try another keyword or reset your filters.">
            <Button variant="outline" onClick={reset}>
              Reset filters
            </Button>
          </Card>
        ) : (
          <section
            className={cn(
              view === "list"
                ? "space-y-2"
                : view === "compact"
                  ? "grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
                  : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6",
            )}
          >
            {visible.map((item) => {
              const Icon = item.icon;
              const favorite = favorites.includes(item.name);

              return (
                <article
                  key={item.name}
                  tabIndex={0}
                  onClick={() => {
                    setSelected(item);
                    markRecent(item.name);
                  }}
                  onKeyDown={(event) => event.key === "Enter" && setSelected(item)}
                  className={cn(
                    "group cursor-pointer rounded-2xl border bg-card p-3 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/30",
                    view === "list" && "flex items-center gap-4",
                  )}
                >
                  <div
                    className={cn(
                      "grid place-items-center rounded-xl bg-muted/60 text-primary",
                      view === "compact"
                        ? "mx-auto size-12"
                        : view === "list"
                          ? "size-12 shrink-0"
                          : "size-16",
                    )}
                  >
                    <Icon
                      size={view === "compact" ? Math.min(size, 24) : size}
                      aria-hidden="true"
                    />
                  </div>

                  <div className={cn("min-w-0", view !== "list" && "mt-3")}>
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Lucide {item.category}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "mt-3 flex gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100",
                      view === "list" && "ms-auto mt-0",
                    )}
                  >
                    <button
                      aria-label={`Copy ${item.name} name`}
                      onClick={(event) => {
                        event.stopPropagation();
                        copy(item.name, "Icon name copied");
                        markRecent(item.name);
                      }}
                      className="grid size-7 place-items-center rounded-md hover:bg-muted"
                    >
                      <Icons.Copy className="size-3.5" />
                    </button>

                    <button
                      aria-label={`Copy ${item.name} usage`}
                      onClick={(event) => {
                        event.stopPropagation();
                        copy(usage(item.name), "Icon usage copied");
                        markRecent(item.name);
                      }}
                      className="grid size-7 place-items-center rounded-md hover:bg-muted"
                    >
                      <Icons.Code2 className="size-3.5" />
                    </button>

                    <button
                      aria-label={`Favorite ${item.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(item.name);
                      }}
                      className={cn(
                        "grid size-7 place-items-center rounded-md hover:bg-muted",
                        favorite && "text-primary",
                      )}
                    >
                      <Icons.Heart className={cn("size-3.5", favorite && "fill-current")} />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {visible.length} of {results.length} icons
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>

            <span className="grid h-8 min-w-8 place-items-center rounded-md bg-muted px-2 text-xs font-semibold">
              {page}/{pages}
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={page === pages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        <Card
          title="Icon states"
          description="Use current theme tokens to check semantic icon behavior."
        >
          <div className="flex flex-wrap gap-5">
            {[
              ["Default", "text-foreground"],
              ["Muted", "text-muted-foreground"],
              ["Accent", "text-primary"],
              ["Success", "text-emerald-600"],
              ["Warning", "text-amber-600"],
              ["Danger", "text-destructive"],
            ].map(([label, tone]) => (
              <span key={label} className={cn("text-center", tone)}>
                <Icons.Bell className="mx-auto size-5" />
                <small className="mt-2 block text-xs text-muted-foreground">{label}</small>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <IconPreview
            item={selected}
            size={size}
            favorite={favorites.includes(selected.name)}
            onSize={setSize}
            onFavorite={() => toggleFavorite(selected.name)}
            onRecent={() => markRecent(selected.name)}
            usage={usage}
          />
        )}
      </Dialog>
    </>
  );
}

function IconPreview({
  item,
  size,
  favorite,
  onSize,
  onFavorite,
  onRecent,
  usage,
}: {
  item: IconItem;
  size: number;
  favorite: boolean;
  onSize: (value: number) => void;
  onFavorite: () => void;
  onRecent: () => void;
  usage: (name: string, value?: number) => string;
}) {
  const Icon = item.icon;

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>{item.name}</DialogTitle>
        <DialogDescription>Lucide {item.category}</DialogDescription>
      </DialogHeader>

      <div className="grid place-items-center rounded-2xl bg-muted/55 py-10 text-primary">
        <Icon size={Math.min(size * 2, 96)} />
      </div>

      <div className="flex flex-wrap gap-2">
        {[16, 20, 24, 32, 40, 48, 64].map((value) => (
          <button
            key={value}
            onClick={() => onSize(value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold",
              size === value && "border-primary bg-primary/10 text-primary",
            )}
          >
            {value}px
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto rounded-xl border bg-muted/45 p-4 text-xs leading-6">
        <code>{usage(item.name)}</code>
      </pre>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            copy(item.name, "Icon name copied");
            onRecent();
          }}
        >
          <Icons.Copy className="me-2 size-4" />
          Copy name
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            copy(usage(item.name), "Icon usage copied");
            onRecent();
          }}
        >
          <Icons.Code2 className="me-2 size-4" />
          Copy usage
        </Button>

        <Button onClick={onFavorite}>
          <Icons.Heart className={cn("me-2 size-4", favorite && "fill-current")} />
          {favorite ? "Favorited" : "Add to favorites"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
