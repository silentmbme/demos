import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Customizer } from "./Customizer";
import { isDark, setSettings, useVexuiSettings } from "@/lib/vexui-settings";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({
  children,
  navigationPath,
}: {
  children: ReactNode;
  navigationPath?: string;
}) {
  const settings = useVexuiSettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const dark = hydrated ? isDark(settings) : false;
  const collapsed = hydrated && (settings.sidebarCollapsed || settings.sidebarSize === "compact");
  const sidebarWidth = collapsed ? "80px" : "264px";

  const sidebarTone = hydrated && (settings.sidebarColor === "dark" || dark) ? "dark" : "light";

  return (
    <div
      className="min-h-screen max-w-full overflow-x-clip bg-background"
      data-density={settings.density}
    >
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 start-0 z-30 hidden border-e border-sidebar-border transition-[width] duration-200 lg:block"
        style={{ width: sidebarWidth }}
      >
        <div className="vexui-sidebar h-full" data-tone={sidebarTone}>
          <Sidebar
            collapsed={collapsed}
            currentPath={navigationPath ?? pathname}
            darkSurface={sidebarTone === "dark"}
          />
        </div>
      </aside>

      {/* Mobile offcanvas */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <aside
        aria-label="Navigation"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-[264px] max-w-[85vw] border-e border-sidebar-border transition-transform duration-250 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <div className="vexui-sidebar h-full" data-tone={sidebarTone}>
          <Sidebar
            collapsed={false}
            currentPath={navigationPath ?? pathname}
            onNavigate={() => setMobileOpen(false)}
            darkSurface={sidebarTone === "dark"}
          />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col transition-[padding] duration-200">
        <div
          className="lg:ps-(--vexui-sidebar-w)"
          style={{ "--vexui-sidebar-w": sidebarWidth } as React.CSSProperties}
        >
          <Header
            dark={dark}
            fixed={settings.header === "fixed"}
            onToggleTheme={() => setSettings({ mode: dark ? "light" : "dark" })}
            onToggleSidebar={() =>
              setSettings({
                sidebarCollapsed: !collapsed,
                ...(settings.sidebarSize === "compact" ? { sidebarSize: "default" as const } : {}),
              })
            }
            onOpenMobileNav={() => setMobileOpen(true)}
            onOpenCustomizer={() => setCustomizerOpen(true)}
          />
          <main
            className={cn(
              "mx-auto w-full px-4 lg:px-6",
              settings.density === "compact" ? "py-4" : "py-6",
              settings.layoutWidth === "boxed" ? "max-w-[1400px]" : "max-w-none",
            )}
          >
            {children}
          </main>
          <footer className="mt-auto border-t border-border px-4 py-4 text-[13px] text-muted-foreground lg:px-6">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <p>&copy; 2026 Developed by SM Pixel Crafts.</p>
              <div className="flex gap-4">
                <Link to="/pages/faq" className="hover:text-foreground">
                  Support
                </Link>
                <Link to="/pages/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
                <Link
                  to="https://vexui-documentation.adminsmpixelcraft.workers.dev/"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <Toaster
        dir={settings.direction}
        position={settings.direction === "rtl" ? "top-left" : "top-right"}
        theme={dark ? "dark" : "light"}
        richColors
        closeButton
      />
      <Customizer
        open={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        settings={settings}
      />
    </div>
  );
}
