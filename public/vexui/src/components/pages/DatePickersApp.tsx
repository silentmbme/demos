import { useEffect, useState, type ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date?: Date) {
  return date
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Pick a date";
}

function dateInputValue(date?: Date) {
  if (!date) return "";

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function timeInputValue(date?: Date) {
  return date ? date.toTimeString().slice(0, 5) : "";
}

function DateCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </Card>
  );
}

export function DatePickersApp() {
  const [date, setDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [meetingDate, setMeetingDate] = useState<Date | undefined>();
  const [meetingTime, setMeetingTime] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [preset, setPreset] = useState("This week");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncNow = () => {
      const current = new Date();

      setNow(current);
      setDate((value) => value ?? current);
      setMeetingDate((value) => value ?? current);
      setMeetingTime((value) => value || timeInputValue(current));
      setRange(
        (value) =>
          value ?? {
            from: current,
            to: new Date(current.getFullYear(), current.getMonth(), current.getDate() + 6),
          },
      );
    };

    syncNow();

    const timer = window.setInterval(syncNow, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const selectPreset = (value: string) => {
    setPreset(value);

    const today = new Date();
    const spans: Record<string, number> = {
      Today: 0,
      Tomorrow: 1,
      "This week": 6,
      "Next 30 days": 30,
    };

    const end = new Date(today);
    end.setDate(today.getDate() + spans[value]);

    setRange({
      from: today,
      to: end,
    });
  };

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Date pickers"
        subtitle="Clear date, range, and scheduling patterns for your forms."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Calendar preferences saved")}>
              <Icons.Settings2 className="me-2 size-4" />
              Configure
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.CalendarCheck2 className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Date selection</h2>
            <p className="text-sm text-muted-foreground">
              Choose a single day or open a compact calendar from a field.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <DateCard title="Inline calendar" description="A visible single-date calendar">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-border"
              />

              <div className="w-full rounded-xl bg-primary/5 p-4 lg:mt-3">
                <p className="text-xs font-medium text-primary">Selected date</p>
                <p className="mt-2 text-lg font-semibold">{formatDate(date)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use this when the date is an important part of the form.
                </p>

                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => toast.success(`Date saved: ${formatDate(date)}`)}
                >
                  Confirm date
                </Button>
              </div>
            </div>
          </DateCard>

          <DateCard title="Calendar popover" description="A compact field that opens a calendar">
            <div className="mx-auto max-w-sm py-5">
              <div className="mb-3 flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2 text-xs">
                <span className="flex items-center gap-2 text-primary">
                  <Icons.Radio className="size-3.5" />
                  Live local time
                </span>

                <strong>
                  {now
                    ? now.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "--:--:--"}
                </strong>
              </div>

              <Label className="text-xs">Project deadline</Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-2 w-full justify-start font-normal">
                    <Icons.CalendarDays className="me-2 size-4 text-primary" />
                    {formatDate(meetingDate)}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={meetingDate}
                    onSelect={(value) => {
                      setMeetingDate(value);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setMeetingDate(new Date())}>
                  Use today
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = new Date();

                    setMeetingDate(current);
                    setMeetingTime(timeInputValue(current));
                  }}
                >
                  Use now
                </Button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Choose a date without taking space from the form.
              </p>

              <div className="mt-8 rounded-xl border border-dashed border-border p-4">
                <p className="text-sm font-medium">Deadline reminder</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We will remind you two days before the selected date.
                </p>
              </div>
            </div>
          </DateCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.CalendarRange className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Date ranges & presets</h2>
            <p className="text-sm text-muted-foreground">
              Useful patterns for reporting windows and availability.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          <DateCard title="Range calendar" description="Select a start and end date">
            <div className="flex flex-col gap-5 lg:flex-row">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                className="rounded-xl border border-border"
              />

              <div className="min-w-52 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Selected range</p>

                <div className="rounded-xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.Calendar className="size-4 text-primary" />
                    <span>{formatDate(range?.from)}</span>
                  </div>

                  <div className="my-2 ms-2 h-4 border-s border-dashed border-border" />

                  <div className="flex items-center gap-2 text-sm">
                    <Icons.Calendar className="size-4 text-primary" />
                    <span>{formatDate(range?.to)}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success("Date range applied")}
                >
                  Apply range
                </Button>
              </div>
            </div>
          </DateCard>

          <DateCard title="Quick presets" description="One-click reporting periods">
            <div className="space-y-2">
              {["Today", "Tomorrow", "This week", "Next 30 days"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => selectPreset(item)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-start text-sm transition ${
                    preset === item
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span>{item}</span>
                  {preset === item && <Icons.Check className="size-4" />}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">Current choice</p>
              <p className="mt-1 font-semibold">{preset}</p>
            </div>
          </DateCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Icons.Clock3 className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Scheduling</h2>
            <p className="text-sm text-muted-foreground">
              Combine date and time controls in a clear appointment flow.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <DateCard title="Schedule a meeting" description="A practical date-time form">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                toast.success(
                  `Meeting scheduled for ${formatDate(meetingDate)} at ${meetingTime || "09:00"}`,
                );
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input
                    className="mt-1.5"
                    type="date"
                    value={dateInputValue(meetingDate)}
                    onChange={(event) =>
                      setMeetingDate(
                        event.target.value
                          ? new Date(`${event.target.value}T${meetingTime || "09:00"}`)
                          : undefined,
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">Start time</Label>
                  <Input
                    className="mt-1.5"
                    type="time"
                    value={meetingTime}
                    onChange={(event) => setMeetingTime(event.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Duration</Label>
                  <select className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>1 hour</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs">Time zone</Label>
                  <select className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                    <option>Pacific time</option>
                    <option>Eastern time</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="mt-2">
                <Icons.CalendarPlus className="me-2 size-4" />
                Schedule meeting
              </Button>
            </form>
          </DateCard>

          <DateCard title="Availability slots" description="Choose a time from available openings">
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Thursday, Sep 3</p>
                <p className="text-xs text-muted-foreground">Pacific time (UTC-08:00)</p>
              </div>

              <Icons.CalendarClock className="size-5 text-primary" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["09:00", "10:30", "11:30", "13:00", "14:30", "16:00"].map((time) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  key={time}
                  onClick={() => toast.success(`${time} selected`)}
                >
                  {time}
                </Button>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Select a time to reserve a 30-minute slot.
            </p>
          </DateCard>
        </div>
      </section>
    </div>
  );
}
