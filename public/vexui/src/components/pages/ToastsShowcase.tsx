import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/dashboard/widgets";

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

export function ToastsShowcase() {
  const [loading, setLoading] = useState(false);

  const showPromise = () => {
    const request = new Promise((resolve) => setTimeout(resolve, 1400));

    toast.promise(request, {
      loading: "Publishing changes...",
      success: "Changes published successfully",
      error: "Unable to publish changes",
    });
  };

  const runLoading = () => {
    setLoading(true);

    const id = toast.loading("Export is being prepared...");

    setTimeout(() => {
      setLoading(false);
      toast.success("Export is ready to download", { id });
    }, 1500);
  };

  return (
    <>
      <PageHeader
        title="Toasts"
        subtitle="Non-blocking feedback for completed actions, errors, background work and timely updates."
        breadcrumb={["Components", "UI Elements", "Toasts"]}
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
          title="Status toasts"
          description="Use a clear tone that matches the outcome of an action."
          code={'toast.success("Project created")\ntoast.error("Payment failed")'}
        >
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success("Project created successfully")}>Success</Button>

            <Button
              variant="outline"
              onClick={() => toast.info("A new workspace update is available")}
            >
              Info
            </Button>

            <Button variant="outline" onClick={() => toast.warning("Storage is nearly full")}>
              Warning
            </Button>

            <Button
              variant="destructive"
              onClick={() => toast.error("Payment could not be processed")}
            >
              Error
            </Button>
          </div>
        </CodeCard>

        <CodeCard
          title="With description"
          description="Add a short next step when a title alone is not enough."
          code={'toast("Invoice sent", { description: "A copy was emailed to Olivia." })'}
        >
          <Button
            variant="soft"
            onClick={() =>
              toast("Invoice sent", {
                description: "A copy was emailed to Olivia Hayes.",
              })
            }
          >
            <Icons.Send className="me-2 size-4" />
            Send invoice
          </Button>
        </CodeCard>

        <CodeCard
          title="Action toast"
          description="Offer one useful, reversible action without forcing a modal."
          code={'toast("Project archived", { action: { label: "Undo", onClick: restore } })'}
        >
          <Button
            variant="outline"
            onClick={() =>
              toast("Project archived", {
                description: "Website Redesign was moved to archive.",
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Project restored"),
                },
              })
            }
          >
            <Icons.Archive className="me-2 size-4" />
            Archive project
          </Button>
        </CodeCard>

        <CodeCard
          title="Loading toast"
          description="Keep users informed while a background action is in progress."
          code={'const id = toast.loading("Exporting...")\ntoast.success("Export ready", { id })'}
        >
          <Button disabled={loading} onClick={runLoading}>
            {loading ? (
              <Icons.LoaderCircle className="me-2 size-4 animate-spin" />
            ) : (
              <Icons.Download className="me-2 size-4" />
            )}

            {loading ? "Preparing export" : "Export report"}
          </Button>
        </CodeCard>

        <CodeCard
          title="Promise toast"
          description="Tie loading, success and error feedback to one asynchronous request."
          code={
            'toast.promise(saveProject(), {\n  loading: "Saving...",\n  success: "Saved",\n  error: "Save failed"\n})'
          }
        >
          <Button variant="gradient" onClick={showPromise}>
            <Icons.UploadCloud className="me-2 size-4" />
            Publish changes
          </Button>
        </CodeCard>

        <CodeCard
          title="Rich notification"
          description="Use an icon, description and action for an important workspace update."
          code={"toast.custom(() => <NotificationCard />)"}
        >
          <Button
            variant="outline"
            onClick={() =>
              toast.custom((id) => (
                <div className="flex w-[360px] max-w-[calc(100vw-2rem)] gap-3 rounded-2xl border bg-card p-4 shadow-xl">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icons.Sparkles className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <b className="block text-sm">AI summary is ready</b>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Review key decisions and actions from the Design review meeting.
                    </p>

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          toast.dismiss(id);
                          toast.success("Summary opened");
                        }}
                      >
                        Open summary
                      </Button>

                      <Button size="sm" variant="ghost" onClick={() => toast.dismiss(id)}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            }
          >
            <Icons.Bell className="me-2 size-4" />
            Show notification
          </Button>
        </CodeCard>

        <CodeCard
          title="Toast positions"
          description="Use a position based on your shell layout and notification density."
          code={'<Toaster position="top-right" />'}
        >
          <div className="grid max-w-sm grid-cols-3 gap-2">
            {[
              ["Top left", "top-left"],
              ["Top center", "top-center"],
              ["Top right", "top-right"],
              ["Bottom left", "bottom-left"],
              ["Bottom center", "bottom-center"],
              ["Bottom right", "bottom-right"],
            ].map(([label, position]) => (
              <button
                key={position}
                onClick={() =>
                  toast(`Preview: ${label}`, {
                    position: position as any,
                    description: "This toast uses a local position override.",
                  })
                }
                className="rounded-lg border px-2 py-2 text-xs hover:border-primary hover:bg-muted"
              >
                {label}
              </button>
            ))}
          </div>
        </CodeCard>

        <CodeCard
          title="Dismiss control"
          description="Give users an optional way to close persistent informational updates."
          code={
            'toast.info("Scheduled maintenance", { cancel: { label: "Dismiss", onClick: () => {} } })'
          }
        >
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Scheduled maintenance", {
                description: "The API will be read-only Sunday, 02:00-04:00 UTC.",
                cancel: {
                  label: "Dismiss",
                  onClick: () => {},
                },
              })
            }
          >
            <Icons.CalendarClock className="me-2 size-4" />
            Show maintenance notice
          </Button>
        </CodeCard>
      </div>
    </>
  );
}
