import { Check, RotateCcw, X } from "lucide-react";
import { SKINS, resetSettings, setSettings, type VexuiSettings } from "@/lib/vexui-settings";
import { cn } from "@/lib/utils";

interface CustomizerProps {
  open: boolean;
  onClose: () => void;
  settings: VexuiSettings;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-5 py-4">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="grid gap-1.5 rounded-lg bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-md px-2 py-1.5 text-[12.5px] font-medium transition-colors",
            value === o.value
              ? "bg-card text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Customizer({ open, onClose, settings }: CustomizerProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Theme customizer"
        aria-hidden={!open}
        className={cn(
          "fixed end-0 top-0 z-50 flex h-full w-[320px] max-w-[88vw] flex-col border-s border-border bg-card transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div>
            <p className="text-sm font-semibold">Customizer</p>
            <p className="text-xs text-muted-foreground">Preview your layout</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close customizer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Section title="Appearance">
            <Segmented
              value={settings.mode}
              onChange={(mode) => setSettings({ mode })}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ]}
            />
          </Section>
          <Section title="Layout direction">
            <Segmented
              value={settings.direction}
              onChange={(direction) => setSettings({ direction })}
              options={[
                { value: "ltr", label: "LTR" },
                { value: "rtl", label: "RTL" },
              ]}
            />
          </Section>

          <Section title="Theme color">
            <div className="flex flex-wrap gap-2.5">
              {SKINS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSettings({ skin: s.id })}
                  aria-label={s.label}
                  aria-pressed={settings.skin === s.id}
                  className="relative inline-flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  style={{ background: s.swatch }}
                >
                  {settings.skin === s.id && <Check className="size-4 text-white" />}
                </button>
              ))}
            </div>
          </Section>
          <Section title="Sidebar size">
            <Segmented
              value={settings.sidebarSize}
              onChange={(sidebarSize) => setSettings({ sidebarSize })}
              options={[
                { value: "default", label: "Default" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </Section>

          <Section title="Sidebar color">
            <Segmented
              value={settings.sidebarColor}
              onChange={(sidebarColor) => setSettings({ sidebarColor })}
              options={[
                { value: "light", label: "Surface" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </Section>

          <Section title="Header">
            <Segmented
              value={settings.header}
              onChange={(header) => setSettings({ header })}
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "static", label: "Static" },
              ]}
            />
          </Section>

          <Section title="Density">
            <Segmented
              value={settings.density}
              onChange={(density) => setSettings({ density })}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </Section>
          <Section title="Layout width">
            <Segmented
              value={settings.layoutWidth}
              onChange={(layoutWidth) => setSettings({ layoutWidth })}
              options={[
                { value: "fluid", label: "Fluid" },
                { value: "boxed", label: "Boxed" },
              ]}
            />
          </Section>
        </div>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-input text-sm font-medium transition-colors hover:bg-accent"
          >
            <RotateCcw className="size-4" /> Reset to defaults
          </button>
        </div>
      </aside>
    </>
  );
}
