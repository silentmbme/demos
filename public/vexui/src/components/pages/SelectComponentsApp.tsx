import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, PageHeader } from "@/components/dashboard/widgets";

function SelectCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const people = ["Elena Marquez", "Noah Bennett", "Sophie Turner", "Liam Walker", "Emma Brooks"];

export function SelectComponentsApp() {
  const [workspace, setWorkspace] = useState("product");
  const [assignee, setAssignee] = useState("Elena Marquez");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(["Design", "Product"]);
  const [country, setCountry] = useState("us");

  const matches = people.filter((person) => person.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        eyebrow="Forms"
        title="Select components"
        subtitle="Single, grouped, searchable, and multi-value selection patterns."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button onClick={() => toast.success("Select preferences saved")}>
              <Icons.Save className="me-2 size-4" />
              Save settings
            </Button>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.ListFilter className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Single selection</h2>
            <p className="text-sm text-muted-foreground">
              Pick one value from a focused set of choices.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SelectCard title="Basic select" description="A simple list for one workspace">
            <Field label="Workspace" hint="Select the workspace for this report.">
              <Select value={workspace} onValueChange={setWorkspace}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="mt-4 rounded-xl bg-primary/5 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Selected workspace: </span>
              <strong className="capitalize text-primary">{workspace}</strong>
            </div>
          </SelectCard>

          <SelectCard
            title="Grouped select"
            description="Organize longer lists into recognizable groups"
          >
            <Field label="Location">
              <Select defaultValue="sf">
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>United States</SelectLabel>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="ldn">London</SelectItem>
                    <SelectItem value="ber">Berlin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <p className="mt-4 text-xs text-muted-foreground">
              Groups reduce visual scanning time when options grow.
            </p>
          </SelectCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <Icons.SearchCheck className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Searchable & rich selects</h2>
            <p className="text-sm text-muted-foreground">
              Help users find a person or choose an option with more context.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          <SelectCard
            title="Searchable assignee"
            description="Filter people, then select an assignee"
          >
            <div className="relative">
              <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="ps-9"
                placeholder="Search people..."
              />
            </div>

            <div className="mt-3 max-h-56 divide-y divide-border overflow-auto rounded-xl border border-border">
              {matches.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => {
                    setAssignee(person);
                    setSearch("");
                    toast.success(`${person} selected`);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-muted/40 ${
                    assignee === person ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-700">
                    {person
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>

                  <span className="flex-1 text-sm font-medium">{person}</span>

                  {assignee === person && <Icons.Check className="size-4 text-primary" />}
                </button>
              ))}

              {matches.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No team members found.
                </p>
              )}
            </div>
          </SelectCard>

          <SelectCard
            title="Select with details"
            description="Use supporting data to clarify each option"
          >
            <Field label="Billing country">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="us">United States USD</SelectItem>
                  <SelectItem value="gb">United Kingdom GBP</SelectItem>
                  <SelectItem value="in">India INR</SelectItem>
                  <SelectItem value="de">Germany EUR</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="mt-5 rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Billing destination</p>

              <p className="mt-1 text-sm font-semibold">
                {country === "us"
                  ? "United States"
                  : country === "gb"
                    ? "United Kingdom"
                    : country === "in"
                      ? "India"
                      : "Germany"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Taxes and available payment methods update automatically.
              </p>
            </div>
          </SelectCard>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Icons.Tags className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Multi-select & states</h2>
            <p className="text-sm text-muted-foreground">
              Use chips and explicit states for multiple selected values.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SelectCard
            title="Multi-select tags"
            description="Add or remove the categories on this project"
          >
            <div className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((item) => item !== tag))}
                    >
                      <Icons.X className="size-3" />
                    </button>
                  </span>
                ))}

                {["Research", "Engineering", "Marketing"]
                  .filter((tag) => !tags.includes(tag))
                  .map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setTags([...tags, tag])}
                      className="rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Click a suggested tag to add it; use to remove it.
            </p>
          </SelectCard>

          <SelectCard title="Select states" description="Disabled, error, and loading treatments">
            <div className="space-y-4">
              <Field label="Disabled select">
                <select
                  disabled
                  className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground"
                >
                  <option>Not available</option>
                </select>
              </Field>

              <Field label="Required category">
                <div className="relative">
                  <select className="h-10 w-full rounded-md border border-destructive bg-background px-3 text-sm">
                    <option>Choose a category</option>
                  </select>

                  <Icons.CircleAlert className="absolute end-8 top-1/2 size-4 -translate-y-1/2 text-destructive" />
                </div>

                <p className="text-xs text-destructive">Please choose a category.</p>
              </Field>

              <Field label="Loading options">
                <div className="relative">
                  <Input readOnly defaultValue="Loading teams..." className="pe-10" />
                  <Icons.LoaderCircle className="absolute end-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
                </div>
              </Field>
            </div>
          </SelectCard>
        </div>
      </section>
    </div>
  );
}
