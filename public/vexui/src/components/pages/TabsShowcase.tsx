import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const values = ["overview", "activity", "settings"];

const labels: Record<string, string> = {
  overview: "Overview",
  activity: "Activity",
  settings: "Settings",
};

const message = "A birds-eye view of your workspace  recent activity, usage and quick links.";

function CodeCard({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <Card
      title={title}
      description={description}
      action={
        <Button size="sm" variant="ghost" onClick={() => setShow(!show)}>
          <Icons.Code2 className="me-1 size-4" />
          {show ? "Hide code" : "Show code"}
        </Button>
      }
    >
      {children}

      {show && (
        <pre className="mt-5 overflow-x-auto rounded-xl border bg-muted/45 p-4 text-xs leading-6 text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </Card>
  );
}

function Content() {
  return (
    <>
      <TabsContent
        value="overview"
        className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
      >
        A birds-eye view of your workspace recent activity, usage and quick links.
      </TabsContent>

      <TabsContent
        value="activity"
        className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
      >
        Recent updates and changes from your workspace appear here.
      </TabsContent>

      <TabsContent
        value="settings"
        className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
      >
        Manage your workspace preferences and notification settings here.
      </TabsContent>
    </>
  );
}

export function TabsShowcase() {
  const [controlled, setControlled] = useState("overview");

  return (
    <>
      <PageHeader
        title="Tabs"
        subtitle="Reusable navigation patterns with shared content and accessible state management."
        breadcrumb={["Components", "UI Elements", "Tabs"]}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Icons.Download className="me-2 size-4" />
              Export
            </Button>

            <Button>
              <Icons.FilePlus2 className="me-2 size-4" />
              Create report
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <CodeCard
          title="Underline"
          description="Sliding indicator via shared layout  default."
          code={
            '<Tabs defaultValue="overview">\n  <TabsList variant="underline"></TabsList>\n</Tabs>'
          }
        >
          <Tabs defaultValue="overview">
            <TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Activity
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <Content />
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Pills"
          description="Solid capsule slides between tabs via variant=pills."
          code={
            '<TabsList variant="pills">\n  <TabsTrigger value="overview">Overview</TabsTrigger>\n</TabsList>'
          }
        >
          <Tabs defaultValue="overview">
            <TabsList className="h-auto rounded-full bg-primary/10 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Activity
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <Content />
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Segmented"
          description="iOS-style control on a muted track via variant=segmented."
          code={
            '<TabsList variant="segmented">\n  <TabsTrigger value="overview">Overview</TabsTrigger>\n</TabsList>'
          }
        >
          <Tabs defaultValue="overview">
            <TabsList className="h-10 rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="px-4 data-[state=active]:bg-card">
                Overview
              </TabsTrigger>

              <TabsTrigger value="activity" className="px-4 data-[state=active]:bg-card">
                Activity
              </TabsTrigger>

              <TabsTrigger value="settings" className="px-4 data-[state=active]:bg-card">
                Settings
              </TabsTrigger>
            </TabsList>

            <Content />
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Boxed"
          description="Card-top tabs merge into the content panel via variant=boxed."
          code={
            '<TabsList variant="boxed">\n  <TabsTrigger value="overview">Overview</TabsTrigger>\n</TabsList>'
          }
        >
          <Tabs defaultValue="overview">
            <TabsList className="h-auto gap-1 rounded-b-none rounded-t-xl border border-b-0 bg-muted/35 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-b-none border border-transparent px-4 py-2 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="rounded-b-none border border-transparent px-4 py-2 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-none"
              >
                Activity
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="rounded-b-none border border-transparent px-4 py-2 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-none"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {values.map((value) => (
              <TabsContent
                key={value}
                value={value}
                className="m-0 rounded-t-none rounded-b-xl border bg-card p-4 text-sm text-muted-foreground"
              >
                {value === "overview"
                  ? message
                  : value === "activity"
                    ? "The activity panel is selected."
                    : "The settings panel is selected."}
              </TabsContent>
            ))}
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Vertical"
          description="Column TabList beside the panel  pills variant."
          code={
            '<Tabs className="grid grid-cols-[140px_1fr] gap-4">\n  <TabsList variant="pills" className="flex-col"></TabsList>\n</Tabs>'
          }
        >
          <Tabs defaultValue="overview" className="grid grid-cols-[132px_minmax(0,1fr)] gap-4">
            <TabsList className="h-auto flex-col items-stretch justify-start rounded-xl bg-primary/10 p-1">
              <TabsTrigger
                value="overview"
                className="w-full justify-start rounded-lg px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="w-full justify-start rounded-lg px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Activity
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="w-full justify-start rounded-lg px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <Content />
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Icons & badges"
          description="Tabs accept any children  glyphs and counts."
          code={'<TabsTrigger value="alerts"><Bell /> Alerts <Badge>3</Badge></TabsTrigger>'}
        >
          <Tabs defaultValue="account">
            <TabsList className="h-auto gap-1">
              <TabsTrigger value="account">
                <Icons.UserRound className="size-4 me-2" />
                Account
              </TabsTrigger>

              <TabsTrigger value="billing">
                <Icons.CreditCard className="size-4 me-2" />
                Billing
              </TabsTrigger>

              <TabsTrigger value="alerts">
                <Icons.Bell className="size-4 me-2" />
                Alerts
                <Badge tone="danger" size="sm">
                  3
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="account"
              className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
            >
              Profile, sign-in methods and connected devices.
            </TabsContent>

            <TabsContent
              value="billing"
              className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
            >
              Plans, billing details and payment methods.
            </TabsContent>

            <TabsContent
              value="alerts"
              className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
            >
              Three alerts require attention.
            </TabsContent>
          </Tabs>
        </CodeCard>

        <CodeCard
          title="Controlled"
          description="External state drives value / onValueChange."
          code={
            'const [value, setValue] = useState("overview")\n<Tabs value={value} onValueChange={setValue}></Tabs>'
          }
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">External controls</span>

              {values.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={controlled === value ? "default" : "outline"}
                  onClick={() => setControlled(value)}
                >
                  {labels[value]}
                </Button>
              ))}

              <span className="text-muted-foreground">
                these buttons and the tabs share one state
              </span>
            </div>

            <Tabs value={controlled} onValueChange={setControlled}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <Content />
            </Tabs>
          </div>
        </CodeCard>
      </div>
    </>
  );
}
