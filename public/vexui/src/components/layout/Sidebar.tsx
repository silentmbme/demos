import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";

import { NAVIGATION, type NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/branding/BrandLogo";

/* =====================================================
   Icon Component
===================================================== */

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;

  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;

  return <Cmp className={className} aria-hidden />;
}

/* =====================================================
   Sidebar Props
===================================================== */

interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  onNavigate?: () => void;
  darkSurface?: boolean;
}

/* =====================================================
   Check whether current navigation item is active
===================================================== */

function isActive(item: NavItem, path: string) {
  if (item.href === "/") {
    return path === "/";
  }

  return path.startsWith(item.href);
}

/* =====================================================
   Check whether parent or any child is active
===================================================== */

function branchActive(item: NavItem, path: string) {
  return isActive(item, path) || item.children?.some((child) => branchActive(child, path)) === true;
}

/* =====================================================
   NavLeaf
   Used for navigation items without children
===================================================== */

function NavLeaf({
  item,
  path,
  collapsed,
  depth,
  onNavigate,
}: {
  item: NavItem;
  path: string;
  collapsed: boolean;
  depth: number;
  onNavigate?: () => void;
}) {
  const active = isActive(item, path);

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2",
        "text-[13.5px] font-medium transition-colors",

        depth > 0 && "py-1.5 text-[13px]",
        depth === 1 && "ps-9",
        depth >= 2 && "ps-[3.5rem]",

        collapsed && depth === 0 && "justify-center px-0",

        active
          ? "text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      {/* Main icon or child dot */}
      {depth === 0 ? (
        <Icon name={item.icon} className="size-[18px] shrink-0" />
      ) : (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-primary" : "bg-border")}
        />
      )}

      {/* Navigation label */}
      {(!collapsed || depth > 0) && <span className="truncate">{item.label}</span>}

      {/* Badge */}
      {!collapsed && item.badge && (
        <span
          className="
            ms-auto
            rounded-full
            bg-primary/12
            px-2
            py-0.5
            text-[11px]
            font-semibold
            text-primary
          "
        >
          {item.badge.text}
        </span>
      )}
    </Link>
  );
}

/* =====================================================
   NavBranch
   Used for navigation items having children
===================================================== */

function NavBranch({
  item,
  path,
  collapsed,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  path: string;
  collapsed: boolean;
  depth?: number;
  onNavigate?: () => void;
}) {
  const active = branchActive(item, path);

  const [open, setOpen] = useState(active);

  /*
   If sidebar is collapsed,
   top-level branches are displayed like normal items.
  */
  if (collapsed && depth === 0) {
    return <NavLeaf item={item} path={path} collapsed depth={depth} onNavigate={onNavigate} />;
  }

  return (
    <div>
      {/* Parent navigation button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3",
          "rounded-lg px-3 py-2",
          "text-[13.5px] font-medium",
          "transition-colors",

          depth > 0 && "py-1.5 ps-9 text-[13px]",

          depth >= 1 && "ps-9",

          active
            ? "bg-primary/8 text-primary shadow-[inset_3px_0_0_var(--primary)] rtl:shadow-[inset_-3px_0_0_var(--primary)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        {/* Icon */}
        {depth === 0 ? (
          <Icon name={item.icon} className="size-[18px] shrink-0" />
        ) : (
          <span
            className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-primary" : "bg-border")}
          />
        )}

        {/* Label */}
        <span className="truncate">{item.label}</span>

        {/* Arrow */}
        <Icons.ChevronRight
          className={cn(
            "ms-auto size-4 shrink-0",
            "transition-transform duration-200",
            open ? "rotate-90" : "rtl:rotate-180",
          )}
          aria-hidden
        />
      </button>

      {/* Children container */}
      <div
        className={cn(
          "grid",
          "transition-[grid-template-rows]",
          "duration-200 ease-out",

          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "mt-0.5 space-y-0.5 pb-1",

              depth > 0 && "ms-7 border-s border-sidebar-border/70",
            )}
          >
            {item.children?.map((child) => {
              /*
               Child also contains children
                render NavBranch recursively
              */
              if (child.children) {
                return (
                  <NavBranch
                    key={child.href}
                    item={child}
                    path={path}
                    collapsed={false}
                    depth={depth + 1}
                    onNavigate={onNavigate}
                  />
                );
              }

              /*
               Normal child
                render NavLeaf
              */
              return (
                <NavLeaf
                  key={child.href}
                  item={child}
                  path={path}
                  collapsed={false}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   Main Sidebar Component
===================================================== */

export function Sidebar({ collapsed, currentPath, onNavigate, darkSurface }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* ===============================================
          Logo Section
      =============================================== */}

      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          "border-b border-sidebar-border",
          "px-5",

          collapsed && "justify-center px-0",
        )}
      >
        <Link to="/" className="flex items-center gap-2.5" aria-label="Vexui home">
          <BrandLogo
            variant={collapsed ? "icon" : "full"}
            darkSurface={darkSurface}
            className={collapsed ? "size-9" : "h-9 w-[118px]"}
          />
        </Link>
      </div>

      {/* ===============================================
          Navigation
      =============================================== */}

      <nav
        aria-label="Main navigation"
        className="
          flex-1
          space-y-5
          overflow-y-auto
          px-3
          py-4
          [scrollbar-width:thin]
        "
      >
        {NAVIGATION.map((group) => (
          <div key={group.title}>
            {/* Navigation Group Title */}
            <p
              className={cn(
                "mb-1.5 px-3",
                "text-[11px]",
                "font-semibold",
                "uppercase",
                "tracking-[0.09em]",
                "text-muted-foreground",

                collapsed && "px-0 text-center",
              )}
            >
              {collapsed ? "" : group.title}
            </p>

            {/* Group Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                // Item contains children
                if (item.children) {
                  return (
                    <NavBranch
                      key={item.href}
                      item={item}
                      path={currentPath}
                      collapsed={collapsed}
                      onNavigate={onNavigate}
                    />
                  );
                }

                // Normal navigation item
                return (
                  <NavLeaf
                    key={item.href}
                    item={item}
                    path={currentPath}
                    collapsed={collapsed}
                    depth={0}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ===============================================
          Storage Widget
      =============================================== */}

      {!collapsed && (
        <div
          className="
            m-3
            rounded-xl
            border
            border-sidebar-border
            bg-primary/8
            p-4
          "
        >
          <p className="text-[13px] font-semibold">Workspace storage</p>

          <p className="mt-0.5 text-xs text-muted-foreground">18.4 GB of 25 GB used</p>

          {/* Progress Bar */}
          <div
            className="
              mt-2.5
              h-1.5
              w-full
              overflow-hidden
              rounded-full
              bg-border
            "
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: "74%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
