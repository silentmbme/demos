import { useEffect, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Skin = "sapphire" | "emerald" | "violet" | "rose" | "orange" | "cyan" | "graphite";
export type SidebarSize = "default" | "compact";
export type SidebarColor = "light" | "dark";
export type LayoutWidth = "fluid" | "boxed";
export type HeaderMode = "fixed" | "static";
export type Density = "comfortable" | "compact";
export type LayoutDirection = "ltr" | "rtl";

export interface VexuiSettings {
  direction: LayoutDirection;
  density: Density;
  mode: ThemeMode;
  skin: Skin;
  sidebarSize: SidebarSize;
  sidebarColor: SidebarColor;
  layoutWidth: LayoutWidth;
  header: HeaderMode;
  sidebarCollapsed: boolean;
}

export const DEFAULT_SETTINGS: VexuiSettings = {
  direction: "ltr",
  density: "comfortable",
  mode: "light",
  skin: "sapphire",
  sidebarSize: "default",
  sidebarColor: "light",
  layoutWidth: "fluid",
  header: "fixed",
  sidebarCollapsed: false,
};

export const SKINS: { id: Skin; label: string; swatch: string }[] = [
  { id: "sapphire", label: "Sapphire", swatch: "oklch(0.57 0.18 250)" },
  { id: "emerald", label: "Emerald", swatch: "oklch(0.61 0.145 163)" },
  { id: "violet", label: "Violet", swatch: "oklch(0.57 0.225 302)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.61 0.205 13)" },
  { id: "orange", label: "Orange", swatch: "oklch(0.64 0.18 55)" },
  { id: "cyan", label: "Cyan", swatch: "oklch(0.61 0.12 215)" },
  { id: "graphite", label: "Graphite", swatch: "oklch(0.45 0.032 260)" },
];

const STORAGE_KEY = "vexui-admin-settings";

/** Applies the saved color mode before CSS paints, preventing a light-theme flash. */
export const themeBootstrapScript = `(() => {
  try {
    const defaults = { mode: "light", skin: "sapphire" };
    const stored = JSON.parse(window.localStorage.getItem("vexui-admin-settings") || "{}");
    const mode = ["light", "dark", "system"].includes(stored.mode) ? stored.mode : defaults.mode;
    const skin = ["sapphire", "emerald", "violet", "rose", "orange", "cyan", "graphite"].includes(stored.skin)
      ? stored.skin
      : defaults.skin;
    const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.dataset.skin = skin;
    root.dir = stored.direction === "rtl" ? "rtl" : "ltr";
    root.dataset.bsTheme = dark ? "dark" : "light";
  } catch {
    // Keep the default light theme when storage is unavailable or malformed.
  }
})();`;

let state: VexuiSettings = typeof window === "undefined" ? DEFAULT_SETTINGS : readStored();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSettings() {
  return state;
}

export function setSettings(patch: Partial<VexuiSettings>) {
  state = { ...state, ...patch };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Settings still work for this session when storage is unavailable.
    }
    applySettings(state);
  }
  emit();
}

export function isDark(settings: VexuiSettings) {
  if (settings.mode === "system") {
    return typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  }
  return settings.mode === "dark";
}

export function applySettings(settings: VexuiSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dir = settings.direction;
  root.classList.toggle("dark", isDark(settings));
  root.dataset["skin"] = settings.skin;
  root.dataset["bsTheme"] = isDark(settings) ? "dark" : "light";
}

function readStored(): VexuiSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const stored = JSON.parse(raw) as Partial<VexuiSettings>;
    const skin = typeof stored.skin === "string" ? stored.skin : DEFAULT_SETTINGS.skin;
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      direction: stored.direction === "rtl" ? "rtl" : "ltr",
      skin: SKINS.some((item) => item.id === skin) ? (skin as Skin) : DEFAULT_SETTINGS.skin,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Reads persisted settings + keeps the DOM in sync. Call once, in the shell. */
export function useVexuiSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    () => state,
    () => DEFAULT_SETTINGS,
  );

  useEffect(() => {
    applySettings(state);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (state.mode === "system") applySettings(state);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return settings;
}

export function resetSettings() {
  setSettings(DEFAULT_SETTINGS);
}
