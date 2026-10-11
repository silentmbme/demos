import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { localImages, productImages } from "@/lib/local-images";
import { getUserImage } from "@/lib/user-images";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const skills = [
  "Operations Strategy",
  "Process Design",
  "Project Delivery",
  "Client Success",
  "Analytics",
];

const projects = [
  ["Website Redesign", "82%", "Active"],
  ["CRM Migration", "46%", "At Risk"],
  ["Marketing Automation", "71%", "Active"],
];

export function ProfileApp() {
  const [tab, setTab] = useState("About");
  const [galleryImage, setGalleryImage] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your professional presence, availability and workspace activity."
        breadcrumb={["Vexui", "Profile"]}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Profile link copied")}>
              <Icons.Link />
              Share
            </Button>
            <Button onClick={() => toast.success("Edit profile ready")}>Edit Profile</Button>
          </>
        }
      />

      <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="h-36 bg-gradient-to-br from-primary via-primary/80 to-info" />
        <div className="absolute -end-14 top-0 size-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative px-6 pb-6 lg:px-8">
          <div className="absolute -top-14 start-6 rounded-2xl border-4 border-card bg-card p-1 shadow-lg lg:start-8">
            <img
              src={getUserImage("Avery Morgan")}
              alt="Avery Morgan"
              className="size-24 rounded-xl object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 pt-4">
            <Badge tone="success">Available for new work</Badge>
            <button
              type="button"
              className="rounded-lg bg-card/90 p-2 text-muted-foreground shadow-sm hover:text-primary"
              aria-label="Profile settings"
              onClick={() => location.assign("/pages/settings")}
            >
              <Icons.Settings2 className="size-4" />
            </button>
          </div>
          <div className="pt-10 lg:flex lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">Avery Morgan</h2>
                <span
                  className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
                  title="Verified"
                >
                  <Icons.Check className="size-3" />
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Operations Lead at Vexui</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Building repeatable operating systems, healthy delivery practices, and clear
                cross-functional experiences for growing teams.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 lg:mt-0">
              {[
                ["18", "Projects"],
                ["142", "Tasks"],
                ["1.2k", "Followers"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="min-w-20 rounded-xl border bg-muted/[.3] px-3 py-2.5 text-center"
                >
                  <b className="block text-lg">{value}</b>
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <nav
        className="mt-5 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1.5"
        aria-label="Profile sections"
      >
        {["About", "Projects", "Gallery", "Followers", "Friends"].map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => setTab(x)}
            className={cn(
              "min-w-max rounded-lg px-4 py-2.5 text-sm font-medium transition",
              tab === x
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {x}
            {x === "Followers" && (
              <span
                className={cn(
                  "ms-2 rounded-full px-1.5 py-0.5 text-[10px]",
                  tab === x ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                1.2k
              </span>
            )}
          </button>
        ))}
      </nav>
      {tab !== "About" ? (
        <Card className="mt-4" title={tab}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(tab === "Projects"
              ? [
                  ["Website Redesign", "Nexora", "82%", "Active"],
                  ["CRM Migration", "Vertex Labs", "46%", "At Risk"],
                  ["Marketing Automation", "BrightWorks", "71%", "Active"],
                  ["Mobile App v2", "CloudAxis", "64%", "Active"],
                ]
              : tab === "Friends"
                ? [
                    ["Maya Rodriguez", localImages.sophiaCarter, "Product Strategist", ""],
                    ["Ethan Cole", localImages.user2, "Engineering Lead", ""],
                    ["Priya Nair", localImages.user3, "Design Director", ""],
                  ]
                : tab === "Followers"
                  ? [
                      [
                        "Sophia Carter",
                        localImages.sophiaCarter,
                        "Project Manager  12 shared projects",
                        "1.8k followers",
                      ],
                      [
                        "Daniel Lee",
                        localImages.user2,
                        "Frontend Developer  8 shared projects",
                        "932 followers",
                      ],
                      [
                        "Emma Wilson",
                        localImages.user3,
                        "Product Designer  6 shared projects",
                        "1.4k followers",
                      ],
                      [
                        "Noah Williams",
                        localImages.user2,
                        "QA Engineer  5 shared projects",
                        "686 followers",
                      ],
                    ]
                  : tab === "Gallery"
                    ? [
                        ["Design system workshop", localImages.workspaceDashboard, "", ""],
                        ["Product planning board", localImages.productCatalog, "", ""],
                        ["Team collaboration", localImages.chatOnboardingFlow, "", ""],
                        ["Workspace review", productImages.auroraDeskLamp, "", ""],
                      ]
                    : [
                        ["Profile item", "Workspace", "", ""],
                        ["Profile item", "Workspace", "", ""],
                        ["Profile item", "Workspace", "", ""],
                      ]
            ).map((item, i) => (
              <div key={i} className="rounded-xl border bg-card text-sm">
                {tab === "Gallery" && (
                  <button
                    aria-label={`Open ${item[0]} preview`}
                    onClick={() => setGalleryImage(item[1])}
                    className="block w-full overflow-hidden"
                  >
                    <img
                      src={item[1]}
                      alt={item[0]}
                      className="h-40 w-full object-cover transition-transform hover:scale-105 rounded-xl"
                    />
                  </button>
                )}

                <div className="p-4">
                  <div className="flex items-center flex-wrap justify-between gap-3">
                    {(tab === "Followers" || tab === "Friends") && (
                      <img
                        src={item[1]}
                        alt={item[0]}
                        className="size-12 shrink-0 rounded-full border-2 border-primary/20 object-cover"
                      />
                    )}

                    <span className="flex-1">
                      <b className="block">{item[0]}</b>

                      {tab === "Followers" && (
                        <small className="block text-muted-foreground">{item[2]}</small>
                      )}

                      {tab === "Friends" && (
                        <small className="block text-muted-foreground">{item[2]}</small>
                      )}
                    </span>

                    {tab === "Followers" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Following ${item[0]}`)}
                      >
                        Follow
                      </Button>
                    )}

                    {item[3] && (
                      <Badge tone={item[3] === "At Risk" ? "warning" : "info"}>{item[3]}</Badge>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {tab === "Followers"
                      ? item[3]
                      : tab === "Friends"
                        ? "Mutual workspace connection"
                        : item[1]}
                  </p>

                  {tab === "Projects" && (
                    <>
                      <div className="mt-4 flex justify-between">
                        <span>Progress</span>
                        <b>{item[2]}</b>
                      </div>

                      <div className="mt-2 h-2 rounded bg-muted">
                        <div className="h-full rounded bg-primary" style={{ width: item[2] }} />
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        Your role: Operations Lead Updated today
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <main className="space-y-5 xl:col-span-2">
            <Card
              title="Profile strength"
              description="Complete these items to make your workspace profile more useful."
            >
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-full border-4 border-primary/20 text-lg font-semibold text-primary">
                  86%
                </div>

                <div className="flex-1">
                  <b>Strong professional profile</b>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a public bio and verify your contact details to finish setup.
                  </p>

                  <div className="mt-3 h-2 rounded bg-muted">
                    <div className="h-full w-[86%] rounded bg-primary" />
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Assigned projects"
              action={
                <Button size="sm" variant="ghost" onClick={() => location.assign("/projects/list")}>
                  View all
                </Button>
              }
            >
              <div className="space-y-3">
                {projects.map((x) => (
                  <div key={x[0]} className="rounded-lg border p-3">
                    <div className="flex justify-between">
                      <b>{x[0]}</b>
                      <Badge tone={x[2] === "At Risk" ? "warning" : "info"}>{x[2]}</Badge>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="font-semibold">{x[1]}</span>

                      <div className="h-1.5 flex-1 rounded bg-muted">
                        <div className="h-full rounded bg-primary" style={{ width: x[1] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Recent activity">
              <div className="space-y-4 text-sm">
                {[
                  ["Updated the Website Redesign timeline", "12 min ago"],
                  ["Completed the delivery health review", "2 hrs ago"],
                  ["Added feedback to CRM Migration", "Yesterday"],
                  ["Joined Marketing Automation planning", "Aug 21"],
                ].map((x) => (
                  <div key={x[0]} className="flex gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icons.Activity className="size-4" />
                    </span>

                    <p>
                      <b>{x[0]}</b>
                      <small className="block text-muted-foreground">{x[1]}</small>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </main>

          <aside className="space-y-4">
            <Card title="Workspace details">
              <div className="space-y-3 text-sm">
                <p className="flex gap-2">
                  <Icons.Mail className="size-4 text-muted-foreground" />
                  avery@vexuiadmin.com
                </p>

                <p className="flex gap-2">
                  <Icons.MapPin className="size-4 text-muted-foreground" />
                  San Francisco, CA
                </p>

                <p className="flex gap-2">
                  <Icons.Clock3 className="size-4 text-muted-foreground" />
                  UTC -08:00 Working now
                </p>

                <p className="flex gap-2">
                  <Icons.Building2 className="size-4 text-muted-foreground" />
                  Product Operations
                </p>
              </div>
            </Card>

            <Card title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((x) => (
                  <Badge key={x}>{x}</Badge>
                ))}
              </div>
            </Card>

            <Card title="Team context">
              <div className="space-y-3 text-sm">
                {[
                  ["SC", "Sophia Carter", "Project Manager"],
                  ["DL", "Daniel Lee", "Frontend Developer"],
                  ["EW", "Emma Wilson", "Product Designer"],
                ].map((x) => (
                  <div key={x[1]} className="flex items-center gap-2">
                    <img
                      src={getUserImage(x[1])}
                      alt={x[1]}
                      className="size-9 rounded-full object-cover"
                    />

                    <span>
                      <b>{x[1]}</b>
                      <small className="block text-muted-foreground">{x[2]}</small>
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Account">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => location.assign("/pages/settings")}
              >
                Security & settings
              </Button>
            </Card>
          </aside>
        </div>
      )}

      <Dialog open={!!galleryImage} onOpenChange={(open) => !open && setGalleryImage(null)}>
        <DialogContent className="max-w-4xl p-2">
          <img
            src={galleryImage ?? ""}
            alt="Gallery preview"
            className="max-h-[80vh] w-full rounded-md object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
