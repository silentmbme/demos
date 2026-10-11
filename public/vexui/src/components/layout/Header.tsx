import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import {
  AppWindow,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  CircleDollarSign,
  CircleHelp,
  CreditCard,
  Expand,
  Grid2x2,
  FileText,
  HardDrive,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Rocket,
  SlidersHorizontal,
  Sun,
  User,
  UserRoundPlus,
  Settings,
  Globe,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { notifications } from "@/data/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* =====================================================
   Props
===================================================== */

interface HeaderProps {
  dark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
  onOpenCustomizer: () => void;
  fixed: boolean;
}

/* =====================================================
   Common Icon Button Styles
===================================================== */

const iconBtn =
  "inline-flex size-9 items-center justify-center rounded-lg " +
  "text-muted-foreground transition-[color,background-color,box-shadow] " +
  "duration-[var(--transition-fast)] hover:bg-accent hover:text-foreground";

/* =====================================================
   Header Component
===================================================== */

export function Header({
  dark,
  onToggleTheme,
  onToggleSidebar,
  onOpenMobileNav,
  onOpenCustomizer,
  fixed,
}: HeaderProps) {
  const navigate = useNavigate();
  /* ---------------------------------------------------
     Search
  --------------------------------------------------- */

  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    const searchPages = [
      ["patients", "/hospital/patients"],
      ["doctors", "/hospital/doctors"],
      ["appointments", "/hospital/appointments"],
      ["wards & beds", "/hospital/wards"],
      ["pharmacy", "/hospital/pharmacy"],
      ["ambulance", "/hospital/ambulance"],
      ["billing", "/hospital/billing"],
      ["employees", "/hrm/employees"],
      ["payroll", "/hrm/payroll"],
      ["leave requests", "/hrm/leave-requests"],
      ["performance reviews", "/hrm/reviews"],
      ["students", "/school/students"],
      ["classes", "/school/classes"],
      ["attendance", "/school/attendance"],
      ["exams", "/school/exams"],
      ["ai insights", "/ai-analytics/insights"],
      ["chatbot assistant", "/ai-analytics/chatbot-conversations"],
      ["predictions", "/ai-analytics/predictions"],
      ["model settings", "/ai-analytics/model-settings"],
      ["logistics", "/dashboards/logistics-dashboard"],
      ["notes", "/apps/notes"],
      ["ai chat", "/apps/ai-chat"],
      ["restaurant", "/dashboards/restaurant-pos"],
      ["pos", "/dashboards/restaurant-pos"],
      ["school", "/dashboards/school-management"],
      ["hrm", "/dashboards/hrm-dashboard"],
      ["human resources", "/dashboards/hrm-dashboard"],
      ["lms", "/dashboards/lms-dashboard"],
      ["learning", "/dashboards/lms-dashboard"],
      ["hospital", "/dashboards/hospital-management"],
      ["crypto", "/dashboards/crypto"],
      ["ai analytics", "/dashboards/ai-analytics"],
      ["email", "/apps/email"],
      ["chat", "/apps/chat"],
      ["calendar", "/apps/calendar"],
      ["task", "/apps/tasks"],
      ["product", "/ecommerce/products"],
      ["order", "/ecommerce/orders"],
      ["contact", "/crm/contacts"],
      ["project", "/projects/list"],
      ["profile", "/pages/profile"],
      ["setting", "/pages/settings"],
      ["analytics", "/dashboards/analytics"],
    ];

    const result = searchPages.find(([term]) => query.includes(term));

    if (result) {
      void navigate({ to: result[1] });
    } else {
      toast.message("No matching page found");
    }
  };

  /* ---------------------------------------------------
     CMD + K / CTRL + K Search Shortcut
  --------------------------------------------------- */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        document.getElementById("vexui-global-search")?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* ---------------------------------------------------
     Language
  --------------------------------------------------- */

  const [language, setLanguage] = useState("English");

  /* ---------------------------------------------------
     User Presence
  --------------------------------------------------- */

  const [presence, setPresence] = useState("Online");

  /* ---------------------------------------------------
     Notifications
  --------------------------------------------------- */

  const [notificationItems, setNotificationItems] = useState(() =>
    notifications.map((notification, index) => ({
      ...notification,

      id: `notification-${index}`,

      read: index === 2,

      tone: index === 0 ? "success" : index === 1 ? "primary" : index === 2 ? "info" : "warning",
    })),
  );

  /* ---------------------------------------------------
     Unread Notification Count
  --------------------------------------------------- */

  const unreadCount = notificationItems.filter((item) => !item.read).length;

  /* ---------------------------------------------------
     Mark One Notification as Read
  --------------------------------------------------- */

  const markNotificationRead = (id: string) => {
    setNotificationItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );
  };

  /* ---------------------------------------------------
     Mark All Notifications as Read
  --------------------------------------------------- */

  const markAllRead = () => {
    setNotificationItems((items) =>
      items.map((item) => ({
        ...item,
        read: true,
      })),
    );

    toast.success("All notifications marked as read");
  };

  /* ---------------------------------------------------
     Clear Notifications
  --------------------------------------------------- */

  const clearNotifications = () => {
    setNotificationItems([]);

    toast.message("Notifications cleared");
  };

  /* ---------------------------------------------------
     Fullscreen
  --------------------------------------------------- */

  const requestFullscreen = () => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <header
      className={cn(
        `
          z-30
          flex
          min-h-16
          flex-wrap
          items-center
          gap-2
          border-b
          border-border
          bg-header
          px-4
          backdrop-blur-xl
          lg:px-6
        `,
        fixed ? "sticky top-0" : "relative",
      )}
    >
      {/* =================================================
          Mobile Menu Button
      ================================================= */}

      <button
        type="button"
        onClick={onOpenMobileNav}
        className={cn(iconBtn, "lg:hidden")}
        aria-label="Open navigation"
      >
        <Menu className="size-[18px]" />
      </button>

      {/* =================================================
          Desktop Sidebar Toggle
      ================================================= */}

      <button
        type="button"
        onClick={onToggleSidebar}
        className={cn(iconBtn, "hidden lg:inline-flex")}
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose className="size-[18px]" />
      </button>

      {/* =================================================
          Search
      ================================================= */}

      <div className="relative ms-1 hidden max-w-sm flex-1 md:block">
        <Search
          className="
            pointer-events-none
            absolute
            start-3
            top-1/2
            size-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <input
          id="vexui-global-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitSearch();
            }
          }}
          aria-label="Global search"
          placeholder="Search customers, orders, reports"
          className="
            h-10
            w-full
            rounded-lg
            border
            border-input
            bg-background
            ps-9
            pe-14
            text-sm
            outline-none
            placeholder:text-muted-foreground
            focus:border-primary
            focus:ring-2
            focus:ring-ring/20
          "
        />

        <kbd
          className="
            pointer-events-none
            absolute
            end-2.5
            top-1/2
            hidden
            -translate-y-1/2
            rounded
            border
            border-border
            px-1.5
            py-0.5
            text-[10px]
            font-medium
            text-muted-foreground
            lg:block
          "
        >
          K
        </kbd>
      </div>

      {/* =================================================
          Right Header Actions
      ================================================= */}

      <div className="ms-auto flex items-center gap-1">
        {/* Applications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(iconBtn, "hidden sm:inline-flex")}
              aria-label="Open applications"
            >
              <Grid2x2 className="size-[18px]" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-[min(22rem,calc(100vw-2rem))]
              overflow-hidden
              p-0
            "
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Applications</p>

              <p className="mt-0.5 text-xs text-muted-foreground">Jump to your workspace tools</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-2">
              {[
                {
                  label: "Email",
                  href: "/apps/email",
                  icon: Mail,
                },
                {
                  label: "Chat",
                  href: "/apps/chat",
                  icon: CircleHelp,
                },
                {
                  label: "Calendar",
                  href: "/apps/calendar",
                  icon: CalendarDays,
                },
                {
                  label: "Tasks",
                  href: "/apps/tasks",
                  icon: CheckCheck,
                },
                {
                  label: "Files",
                  href: "/apps/files",
                  icon: FileText,
                },
                {
                  label: "Dashboard",
                  href: "/",
                  icon: Grid2x2,
                },
              ].map((app) => {
                const AppIcon = app.icon;

                return (
                  <Link
                    key={app.label}
                    to={app.href}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      p-3
                      transition-colors
                      hover:bg-primary/[0.07]
                    "
                  >
                    <span
                      className="
                        grid
                        size-9
                        place-items-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                        transition-colors
                        group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                    >
                      <AppIcon className="size-4" />
                    </span>

                    <span>
                      <span className="block text-[13px] font-semibold">{app.label}</span>

                      <span className="block text-[11px] text-muted-foreground">Open app</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* =================================================
            Language
        ================================================= */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(iconBtn, "hidden min-w-9 gap-1 px-2 sm:inline-flex")}
              aria-label="Choose language"
            >
              <Globe className="size-[17px]" />

              <span className="text-[11px] font-semibold">
                {language.slice(0, 2).toUpperCase()}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 p-1.5">
            <DropdownMenuLabel className="px-2 py-2 text-xs text-muted-foreground">
              Language
            </DropdownMenuLabel>

            {["English", "Espaol", "Franais", "Deutsch"].map((item) => (
              <DropdownMenuItem
                key={item}
                onSelect={() => {
                  setLanguage(item);

                  toast.success(`Language set to ${item}`);
                }}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  px-2.5
                  py-2
                "
              >
                <span>{item}</span>

                {language === item && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* =================================================
            Notifications
        ================================================= */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(iconBtn, "relative")}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="size-[18px]" />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    end-1
                    top-0
                    grid
                    size-4
                    place-items-center
                    rounded-full
                    bg-destructive
                    text-[9px]
                    font-bold
                    text-destructive-foreground
                    ring-2
                    ring-card
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              w-[min(24rem,calc(100vw-2rem))]
              overflow-hidden
              p-0
            "
          >
            {/* Header */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
                border-b
                border-border
                px-4
                py-3.5
              "
            >
              <div>
                <p className="text-sm font-semibold">Notifications</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {unreadCount ? `${unreadCount} unread updates` : "You are all caught up"}
                </p>
              </div>

              {notificationItems.length > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="
                    rounded-md
                    px-2
                    py-1
                    text-xs
                    font-semibold
                    text-primary
                    transition-colors
                    hover:bg-primary/10
                  "
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}

            <div className="max-h-[22rem] overflow-y-auto p-1.5">
              {notificationItems.length === 0 ? (
                <div className="grid place-items-center px-5 py-10 text-center">
                  <span
                    className="
                      grid
                      size-11
                      place-items-center
                      rounded-full
                      bg-primary/10
                      text-primary
                    "
                  >
                    <CheckCheck className="size-5" />
                  </span>

                  <p className="mt-3 text-sm font-semibold">All caught up</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    New workspace updates will appear here.
                  </p>
                </div>
              ) : (
                notificationItems.map((notification) => {
                  const NotificationIcon =
                    notification.tone === "success"
                      ? CircleDollarSign
                      : notification.tone === "primary"
                        ? UserRoundPlus
                        : notification.tone === "info"
                          ? Rocket
                          : HardDrive;

                  const toneClass =
                    notification.tone === "success"
                      ? "bg-success/12 text-success"
                      : notification.tone === "primary"
                        ? "bg-primary/12 text-primary"
                        : notification.tone === "info"
                          ? "bg-info/12 text-info"
                          : "bg-warning/14 text-warning";

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      onSelect={() => markNotificationRead(notification.id)}
                      className={cn(
                        `
                            group
                            relative
                            flex
                            cursor-pointer
                            items-start
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            pe-8 mb-2
                          `,
                        !notification.read && "bg-primary/[0.045]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl",
                          toneClass,
                        )}
                      >
                        <NotificationIcon className="size-4" />
                      </span>

                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-semibold">
                            {notification.title}
                          </span>

                          {!notification.read && (
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                          )}
                        </span>

                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                          {notification.detail}
                        </span>

                        <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
                          {notification.time} ago
                        </span>
                      </span>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>

            {/* Notification Footer */}

            {notificationItems.length > 0 && (
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-border
                  px-3
                  py-2
                "
              >
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="
                    rounded-md
                    px-2
                    py-1.5
                    text-xs
                    font-medium
                    text-muted-foreground
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  Clear all
                </button>

                <Link
                  to="/apps/tasks"
                  className="
                    rounded-md
                    px-2
                    py-1.5
                    text-xs
                    font-semibold
                    text-primary
                    hover:bg-primary/10
                  "
                >
                  View activity
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* =================================================
            Fullscreen
        ================================================= */}

        <button
          type="button"
          onClick={requestFullscreen}
          className={cn(iconBtn, "hidden sm:inline-flex")}
          aria-label="Toggle fullscreen"
        >
          <Expand className="size-[18px]" />
        </button>

        {/* =================================================
            Theme Toggle
        ================================================= */}

        <button
          type="button"
          onClick={onToggleTheme}
          className={iconBtn}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </button>

        {/* =================================================
            Theme Customizer
        ================================================= */}

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenCustomizer}
          className="hidden text-muted-foreground lg:inline-flex"
          aria-label="Open theme customizer"
          title="Customize"
        >
          <SlidersHorizontal className="size-[18px]" />
        </Button>

        {/* =================================================
            Account Menu
        ================================================= */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="
                ms-1
                flex
                items-center
                gap-2
                rounded-lg
                py-1
                ps-1
                pe-2
                transition-colors
                hover:bg-accent
              "
              aria-label="Account menu"
            >
              <span
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary
                  text-[12px]
                  font-semibold
                  text-primary-foreground
                "
              >
                EM
              </span>

              <span className="hidden text-start leading-tight md:block">
                <span className="block text-[13px] font-semibold">Elena Mrquez</span>

                <span className="block text-[11px] text-muted-foreground">Operations Lead</span>
              </span>

              <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 overflow-hidden p-0">
            {/* User */}

            <div className="bg-primary/[0.06] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  EM
                </span>

                <span>
                  <span className="block text-sm font-semibold">Elena Mrquez</span>

                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <i
                      className={cn(
                        "size-1.5 rounded-full",

                        presence === "Online"
                          ? "bg-success"
                          : presence === "Away"
                            ? "bg-warning"
                            : "bg-muted-foreground",
                      )}
                    />

                    {presence}
                  </span>
                </span>
              </div>
            </div>

            {/* Account Links */}

            <div className="p-1.5">
              <DropdownMenuItem asChild>
                <Link to="/pages/profile">
                  <User className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/pages/settings">
                  <Settings className="size-4" />
                  Account settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/invoices/list">
                  <CreditCard className="size-4" />
                  Billing & plan
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="mx-1.5" />

            {/* Status */}

            <div className="p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-[11px] text-muted-foreground">
                Set status
              </DropdownMenuLabel>

              {["Online", "Away", "Invisible"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => {
                    setPresence(status);

                    toast.success(`Status set to ${status}`);
                  }}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <i
                      className={cn(
                        "size-2 rounded-full",

                        status === "Online"
                          ? "bg-success"
                          : status === "Away"
                            ? "bg-warning"
                            : "bg-muted-foreground",
                      )}
                    />

                    {status}
                  </span>

                  {presence === status && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="mx-1.5" />

            {/* Logout */}

            <div className="p-1.5">
              <DropdownMenuItem
                asChild
                className="
                  text-destructive
                  focus:bg-destructive/10
                  focus:text-destructive
                "
              >
                <Link to="/auth/login">
                  <LogOut className="size-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>

              <Link
                to="/pages/faq"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <CircleHelp className="size-3.5" />
                Help & support
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
