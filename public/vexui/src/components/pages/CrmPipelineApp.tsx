import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Stage =
  | "Qualification"
  | "Discovery"
  | "Proposal"
  | "Negotiation"
  | "Contract"
  | "Closed Won"
  | "Closed Lost";

type Deal = {
  id: string;
  name: string;
  company: string;
  contact: string;
  stage: Stage;
  value: number;
  prob: number;
  owner: string;
  close: string;
  next: string;
  tags: string[];
  notes: string[];
  tasks: string[];
};

type PipelineModal = "add" | "move" | "won" | "lost" | "settings" | null;

type PipelineSettings = {
  weighted: boolean;
  prob: boolean;
  next: boolean;
  compact: boolean;
};

const stages: Stage[] = [
  "Qualification",
  "Discovery",
  "Proposal",
  "Negotiation",
  "Contract",
  "Closed Won",
];

const owners = ["Sophia Carter", "Daniel Lee", "Olivia Smith", "Emma Wilson"];

const companies = ["CloudAxis", "Vertex Labs", "Vexui Systems", "BrightWorks", "Acme Inc."];

const base: Deal[] = [
  {
    id: "1048",
    name: "Enterprise Expansion",
    company: "CloudAxis",
    contact: "Ava Thompson",
    stage: "Proposal",
    value: 84500,
    prob: 76,
    owner: "Sophia Carter",
    close: "Sep 12",
    next: "Demo follow-up",
    tags: ["Enterprise", "Expansion"],
    notes: ["Proposal opened by buying committee."],
    tasks: ["Schedule pricing review"],
  },
  {
    id: "1049",
    name: "Automation Rollout",
    company: "Vertex Labs",
    contact: "Liam Brooks",
    stage: "Negotiation",
    value: 42000,
    prob: 68,
    owner: "Daniel Lee",
    close: "Sep 18",
    next: "Security review",
    tags: ["Strategic"],
    notes: [],
    tasks: ["Send terms"],
  },
  {
    id: "1050",
    name: "Marketing Platform Upgrade",
    company: "Vexui Systems",
    contact: "Emma Davis",
    stage: "Contract",
    value: 128000,
    prob: 88,
    owner: "Olivia Smith",
    close: "Sep 05",
    next: "Contract review",
    tags: ["Renewal"],
    notes: ["Final approval expected."],
    tasks: ["Confirm signature"],
  },
  {
    id: "1051",
    name: "Support Renewal",
    company: "BrightWorks",
    contact: "Noah Walker",
    stage: "Discovery",
    value: 18000,
    prob: 42,
    owner: "Emma Wilson",
    close: "Oct 02",
    next: "Needs discovery",
    tags: ["Renewal"],
    notes: [],
    tasks: ["Map requirements"],
  },
  {
    id: "1052",
    name: "Workspace Consolidation",
    company: "Acme Inc.",
    contact: "Mia Patel",
    stage: "Qualification",
    value: 64000,
    prob: 30,
    owner: "Sophia Carter",
    close: "Oct 18",
    next: "Qualification call",
    tags: ["High Intent"],
    notes: [],
    tasks: [],
  },
];

export function CrmPipelineApp() {
  const [deals, setDeals] = useState(base);
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("All owners");
  const [company, setCompany] = useState("All companies");
  const [probability, setProbability] = useState("All probabilities");

  const [active, setActive] = useState<Deal | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [modal, setModal] = useState<PipelineModal>(null);
  const [target, setTarget] = useState<Stage>("Qualification");

  const [settings, setSettings] = useState<PipelineSettings>({
    weighted: true,
    prob: true,
    next: true,
    compact: false,
  });

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        !query ||
        [deal.name, deal.company, deal.contact, deal.owner, ...deal.tags]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesOwner = owner === "All owners" || deal.owner === owner;

      const matchesCompany = company === "All companies" || deal.company === company;

      const matchesProbability =
        probability === "All probabilities" ||
        (probability === "0-25%" && deal.prob <= 25) ||
        (probability === "26-50%" && deal.prob > 25 && deal.prob <= 50) ||
        (probability === "51-75%" && deal.prob > 50 && deal.prob <= 75) ||
        (probability === "76-99%" && deal.prob > 75 && deal.prob < 100) ||
        (probability === "100%" && deal.prob === 100);

      return matchesSearch && matchesOwner && matchesCompany && matchesProbability;
    });
  }, [deals, query, owner, company, probability]);

  const moveDeal = (id: string, to: Stage) => {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              stage: to,
              prob: to === "Closed Won" ? 100 : deal.prob,
            }
          : deal,
      ),
    );

    setActive((deal) =>
      deal?.id === id
        ? {
            ...deal,
            stage: to,
            prob: to === "Closed Won" ? 100 : deal.prob,
          }
        : deal,
    );

    toast.success(`Deal moved to ${to}`);
  };

  const openPipeline = filtered.filter(
    (deal) => deal.stage !== "Closed Won" && deal.stage !== "Closed Lost",
  );

  const total = openPipeline.reduce((sum, deal) => sum + deal.value, 0);

  const weighted = filtered.reduce((sum, deal) => sum + (deal.value * deal.prob) / 100, 0);

  const resetFilters = () => {
    setQuery("");
    setOwner("All owners");
    setCompany("All companies");
    setProbability("All probabilities");
  };

  const createDeal = () => {
    const input = document.getElementById("deal-name") as HTMLInputElement | null;

    const name = input?.value || "New Opportunity";

    setDeals((current) => [
      ...current,
      {
        id: String(Date.now()),
        name,
        company: "CloudAxis",
        contact: "Ava Thompson",
        stage: target,
        value: 25000,
        prob: 40,
        owner: "Sophia Carter",
        close: "Sep 30",
        next: "Qualification call",
        tags: ["New"],
        notes: [],
        tasks: [],
      },
    ]);

    toast.success("Deal added to pipeline");
  };

  const markLost = () => {
    if (!active) return;

    setDeals((current) =>
      current.map((deal) =>
        deal.id === active.id
          ? {
              ...deal,
              stage: "Closed Lost",
              prob: 0,
            }
          : deal,
      ),
    );

    setActive((deal) =>
      deal
        ? {
            ...deal,
            stage: "Closed Lost",
            prob: 0,
          }
        : deal,
    );

    toast.success("Deal marked lost");
  };

  const handleDialogAction = () => {
    if (modal === "add") {
      createDeal();
    }

    if (modal === "move" && active) {
      moveDeal(active.id, target);
    }

    if (modal === "won" && active) {
      moveDeal(active.id, "Closed Won");
    }

    if (modal === "lost") {
      markLost();
    }

    setModal(null);
  };

  return (
    <>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Visualize opportunities, manage deal stages and forecast revenue across your pipeline."
        breadcrumb={["Vexui", "CRM", "Pipeline"]}
        actions={
          <>
            <Button variant="outline" onClick={() => setModal("settings")}>
              <Icons.Settings2 />
              Pipeline Settings
            </Button>

            <Button onClick={() => setModal("add")}>
              <Icons.Plus />
              Add Deal
            </Button>
          </>
        }
      />

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Open Pipeline", `$${(total / 1000).toFixed(1)}K`],
            ["Weighted Pipeline", `$${(weighted / 1000).toFixed(1)}K`],
            [
              "Open Deals",
              String(filtered.filter((deal) => !deal.stage.includes("Closed")).length),
            ],
            ["Closing This Month", "$254K"],
            ["Win Rate", "31.6%"],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[150px] flex-1 px-5 py-3">
              <small className="text-muted-foreground">{label}</small>
              <b className="block text-lg">{value}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-4">
        <div className="flex flex-wrap gap-2">
          <label className="relative min-w-52 flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities"
              className="h-9 w-full rounded-md border bg-background ps-9 pe-3 text-sm"
            />
          </label>

          <select
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="h-9 rounded border bg-background px-2 text-sm"
          >
            <option>All owners</option>
            {owners.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="h-9 rounded border bg-background px-2 text-sm"
          >
            <option>All companies</option>
            {companies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={probability}
            onChange={(event) => setProbability(event.target.value)}
            className="h-9 rounded border bg-background px-2 text-sm"
          >
            <option>All probabilities</option>
            <option>0-25%</option>
            <option>26-50%</option>
            <option>51-75%</option>
            <option>76-99%</option>
            <option>100%</option>
          </select>

          <Button size="sm" variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      <div className="mt-4 overflow-x-auto">
        <div className="flex min-h-[540px] min-w-max gap-3">
          {stages.map((stage) => {
            const rows = filtered.filter((deal) => deal.stage === stage);

            const value = rows.reduce((sum, deal) => sum + deal.value, 0);

            const weightedValue = rows.reduce(
              (sum, deal) => sum + (deal.value * deal.prob) / 100,
              0,
            );

            return (
              <section
                key={stage}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => drag && moveDeal(drag, stage)}
                className="flex w-72 flex-col rounded-xl border bg-card"
              >
                <header className="border-b p-3">
                  <div className="flex items-center gap-2">
                    <b className="text-sm">{stage}</b>

                    <span className="rounded-full bg-muted px-1.5 text-xs">{rows.length}</span>

                    <button
                      type="button"
                      aria-label={`Add deal to ${stage}`}
                      onClick={() => {
                        setTarget(stage);
                        setModal("add");
                      }}
                      className="ms-auto rounded p-1 hover:bg-muted"
                    >
                      <Icons.Plus className="size-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-sm font-semibold">${(value / 1000).toFixed(1)}K</p>

                  {settings.weighted && (
                    <small className="text-muted-foreground">
                      Weighted ${(weightedValue / 1000).toFixed(1)}K
                    </small>
                  )}
                </header>

                <div className="flex-1 space-y-2 p-2">
                  {rows.map((deal) => (
                    <button
                      key={deal.id}
                      type="button"
                      draggable
                      onDragStart={() => setDrag(deal.id)}
                      onClick={() => setActive(deal)}
                      className={`w-full cursor-grab rounded-lg border bg-card text-start shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 ${
                        settings.compact ? "p-2" : "p-3"
                      }`}
                    >
                      <div className="flex justify-between gap-2">
                        <b className="text-sm">{deal.name}</b>
                        <span className="text-sm font-semibold">
                          ${(deal.value / 1000).toFixed(1)}K
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {deal.company} {deal.contact}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs">
                          {settings.prob && `${deal.prob}% probability`}
                        </span>

                        <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-[9px] text-primary">
                          {deal.owner
                            .split(" ")
                            .map((item) => item[0])
                            .join("")}
                        </span>
                      </div>

                      {settings.next && (
                        <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
                          Next: {deal.next} {deal.close}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1">
                        {deal.tags.map((item) => (
                          <Badge key={item}>{item}</Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTarget(stage);
                    setModal("add");
                  }}
                  className="m-2 rounded-md border border-dashed p-2 text-start text-xs text-muted-foreground hover:bg-muted"
                >
                  <Icons.Plus className="me-1 inline size-3" />
                  Add deal
                </button>
              </section>
            );
          })}
        </div>
      </div>

      <Sheet
        open={Boolean(active) && !modal}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{active?.name}</SheetTitle>
          </SheetHeader>

          {active && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Company", active.company],
                  ["Contact", active.contact],
                  ["Stage", active.stage],
                  ["Value", `$${active.value.toLocaleString()}`],
                  ["Probability", `${active.prob}%`],
                  ["Weighted", `$${((active.value * active.prob) / 100).toLocaleString()}`],
                  ["Owner", active.owner],
                  ["Close", active.close],
                ].map(([label, value]) => (
                  <div key={label} className="rounded border p-2 text-sm">
                    <small className="text-muted-foreground">{label}</small>
                    <b className="block">{value}</b>
                  </div>
                ))}
              </div>

              <div>
                <b className="text-sm">Stage progress</b>

                <div className="mt-2 flex gap-1">
                  {stages.map((stage) => (
                    <span
                      key={stage}
                      className={`h-2 flex-1 rounded ${
                        stage === active.stage ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <b>Notes & tasks</b>

                {active.notes.map((note) => (
                  <p key={note} className="mt-2 rounded border p-2 text-sm">
                    {note}
                  </p>
                ))}

                {active.tasks.map((task) => (
                  <p key={task} className="mt-2 rounded border p-2 text-sm">
                    {task}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTarget(active.stage);
                    setModal("move");
                  }}
                >
                  Move stage
                </Button>

                <Button onClick={() => setModal("won")}>Mark won</Button>

                <Button variant="outline" onClick={() => setModal("lost")}>
                  Mark lost
                </Button>

                <Button variant="outline" onClick={() => toast.success("Activity logged")}>
                  Log activity
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(modal)}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal === "add"
                ? "Add Deal"
                : modal === "move"
                  ? "Move Deal"
                  : modal === "won"
                    ? "Mark Deal as Won"
                    : modal === "lost"
                      ? "Mark Deal as Lost"
                      : "Pipeline Settings"}
            </DialogTitle>
          </DialogHeader>

          {modal === "add" && (
            <input
              id="deal-name"
              placeholder="Deal name"
              className="h-10 w-full rounded border bg-background px-3"
            />
          )}

          {modal === "move" && (
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value as Stage)}
              className="h-10 rounded border bg-background px-3"
            >
              {stages.map((stage) => (
                <option key={stage}>{stage}</option>
              ))}
            </select>
          )}

          {modal === "settings" && (
            <div className="space-y-3 text-sm">
              {[
                ["Show weighted values", "weighted"],
                ["Show probability on cards", "prob"],
                ["Show next activity", "next"],
                ["Compact card mode", "compact"],
              ].map(([label, key]) => (
                <label key={key} className="flex justify-between">
                  <span>{label}</span>

                  <input
                    type="checkbox"
                    checked={settings[key as keyof PipelineSettings]}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        [key]: event.target.checked,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancel
            </Button>

            <Button
              onClick={
                modal === "settings"
                  ? () => {
                      toast.success("Pipeline settings saved");
                      setModal(null);
                    }
                  : handleDialogAction
              }
            >
              {modal === "won"
                ? "Mark Won"
                : modal === "lost"
                  ? "Mark Lost"
                  : modal === "settings"
                    ? "Save Settings"
                    : modal === "add"
                      ? "Create Deal"
                      : "Move Deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
