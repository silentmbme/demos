import { useState, type FormEvent, type ReactNode } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  GraduationCap,
  Layers3,
  Palette,
  Plus,
  Search,
  Star,
  Target,
  TrendingUp,
  UsersRound,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { ApexChart } from "@/components/charts/ApexChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LMS_CATEGORIES,
  LMS_COURSES,
  LMS_INSTRUCTORS,
  LMS_LEARNERS,
  LMS_SESSIONS,
  getLmsOverview,
  lmsMoney,
  type LmsCourse,
} from "@/data/lms-dashboard-data";
import { getUserImage } from "@/lib/user-images";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";

function CategoryIcon({
  category,
  className = "size-6",
}: {
  category: string;
  className?: string;
}) {
  const Icon =
    category === "Development"
      ? Code2
      : category === "Design"
        ? Palette
        : category === "Data Science"
          ? Layers3
          : TrendingUp;
  return <Icon className={className} />;
}
function Metric({
  label,
  value,
  icon,
  tone,
  note,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: string;
  note: string;
}) {
  return (
    <section className="vexui-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>{icon}</span>
      </div>
      <p className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </section>
  );
}
export function LmsDashboard() {
  const [courses, setCourses] = useState(LMS_COURSES);
  const [learners, setLearners] = useState(LMS_LEARNERS);
  const [period, setPeriod] = useState<"7" | "30">("30");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [courseStatus, setCourseStatus] = useState("all");
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Development");
  const [instructorId, setInstructorId] = useState("daniel");
  const [lessons, setLessons] = useState("12");
  const [price, setPrice] = useState("49");
  const [formError, setFormError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<LmsCourse | null>(null);
  const [selectedSession, setSelectedSession] = useState<(typeof LMS_SESSIONS)[number] | null>(
    null,
  );
  const { base } = useChartTheme();
  const data = getLmsOverview(courses, period, category);
  const visibleCourses = data.selected.filter(
    (course) =>
      (courseStatus === "all" || course.status === courseStatus) &&
      `${course.title} ${course.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const visibleLearners = learners.filter((learner) =>
    data.selected.some((course) => course.id === learner.courseId),
  );
  const sessions = LMS_SESSIONS.filter(
    (session) => category === "all" || session.category === category,
  );
  const instructors = LMS_INSTRUCTORS.filter((instructor) =>
    data.selected.some((course) => course.instructorId === instructor.id),
  );
  const growthOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
    xaxis: { categories: data.labels },
    yaxis: { min: 0, labels: { formatter: (value: number) => Math.round(value).toString() } },
    legend: { horizontalAlign: "left", position: "top" },
    tooltip: {
      y: { formatter: (value: number) => Math.round(value).toLocaleString("en-US") + " learners" },
    },
  });
  const completionOptions = mergeOptions(base, {
    colors: [token("--success"), token("--primary")],
    labels: ["Completed", "In progress"],
    stroke: { width: 3, colors: [token("--card")] },
    legend: { show: false },
    dataLabels: { enabled: true, formatter: (value) => Number(value).toFixed(1) + "%" },
    tooltip: { y: { formatter: (value: number) => value.toLocaleString("en-US") + " learners" } },
  });
  const categoryOptions = mergeOptions(base, {
    colors: [token("--primary")],
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4 },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: token("--border"),
          connectorColors: token("--border"),
          fill: { colors: [token("--card"), token("--muted")] },
        },
      },
    },
    xaxis: { categories: [...LMS_CATEGORIES] },
    yaxis: { min: 0, labels: { show: false } },
    legend: { show: false },
    tooltip: {
      y: { formatter: (value: number) => value.toLocaleString("en-US") + " enrollments" },
    },
  });
  function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const count = Number(lessons),
      fee = Number(price);
    if (
      courseTitle.trim().length < 3 ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 200 ||
      !Number.isFinite(fee) ||
      fee < 0 ||
      fee > 10000
    ) {
      setFormError("Enter a course title, 1–200 lessons, and a price between $0 and $10,000.");
      return;
    }
    setCourses((current) => [
      {
        id: `CRS-${101 + current.length}`,
        title: courseTitle.trim(),
        category: newCategory,
        instructorId,
        lessons: count,
        price: fee,
        students: 0,
        completed: 0,
        status: "Draft",
        color: "--primary",
      },
      ...current,
    ]);
    setCategory("all");
    setCourseStatus("all");
    setQuery("");
    setNewCourseOpen(false);
    toast.success("Sample course saved as a draft");
  }
  function completeLesson(id: string) {
    const learner = learners.find((item) => item.id === id),
      course = courses.find((item) => item.id === learner?.courseId);
    if (!learner || !course || learner.finished >= course.lessons) return;
    setLearners((current) =>
      current.map((item) => (item.id === id ? { ...item, finished: item.finished + 1 } : item)),
    );
    if (learner.finished + 1 === course.lessons)
      setCourses((current) =>
        current.map((item) =>
          item.id === course.id ? { ...item, completed: item.completed + 1 } : item,
        ),
      );
    toast.success(
      learner.finished + 1 === course.lessons
        ? "Sample course completed"
        : "Sample lesson marked complete",
    );
  }
  function exportReport() {
    const rows = [
      [
        "Course",
        "Category",
        "Instructor",
        "Lessons",
        "Enrollments (30-day sample)",
        "Completed",
        "Price (USD)",
        "Status",
      ],
      ...visibleCourses.map((course) => [
        course.title,
        course.category,
        LMS_INSTRUCTORS.find((item) => item.id === course.instructorId)?.name ?? "",
        course.lessons,
        course.students,
        course.completed,
        course.price,
        course.status,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lms-course-report.csv";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="LMS Dashboard"
        subtitle="Track learning, manage courses, and help every student move forward."
        breadcrumb={["Dashboards", "LMS"]}
        actions={
          <>
            <Button variant="outline" onClick={exportReport}>
              <Download className="size-4" />
              Export report
            </Button>
            <Button
              onClick={() => {
                setCourseTitle("");
                setFormError("");
                setNewCourseOpen(true);
              }}
            >
              <Plus className="size-4" />
              Create course
            </Button>
          </>
        }
      />
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-sm">
            <GraduationCap className="size-7" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Build skills. Inspire progress.</h2>
              <Badge tone="primary" size="sm">
                Sample data
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Learning operations overview · Period ending October 9, 2026
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Learning category" className="w-[160px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {LMS_CATEGORIES.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(value) => setPeriod(value as "7" | "30")}>
            <SelectTrigger aria-label="Learning reporting period" className="w-[140px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Course enrollments"
          value={data.enrollments.toLocaleString("en-US")}
          icon={<UsersRound className="size-5" />}
          tone="bg-primary/10 text-primary"
          note={`Across the last ${period} days`}
        />
        <Metric
          label="Published courses"
          value={String(data.selected.filter((course) => course.status === "Published").length)}
          icon={<BookOpen className="size-5" />}
          tone="bg-info/10 text-info"
          note={`${data.selected.filter((course) => course.status === "Draft").length} draft courses in progress`}
        />
        <Metric
          label="Course completions"
          value={data.completions.toLocaleString("en-US")}
          icon={<Award className="size-5" />}
          tone="bg-success/10 text-success"
          note={`${data.completionRate.toFixed(1)}% completion rate`}
        />
        <Metric
          label="Sample course revenue"
          value={lmsMoney(data.revenue)}
          icon={<CircleDollarSign className="size-5" />}
          tone="bg-warning/10 text-warning"
          note={`Enrollment revenue over ${period} days`}
        />
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Learning journey"
          description={`Completed and continuing learners over ${period} days`}
          className="xl:col-span-2"
          bodyClassName="px-3 pb-2 pt-4"
          action={
            <Badge tone="primary">{data.enrollments.toLocaleString("en-US")} enrollments</Badge>
          }
        >
          <div className="mb-2 flex gap-6 px-3">
            <div>
              <p className="text-2xl font-semibold">{data.enrollments.toLocaleString("en-US")}</p>
              <p className="text-xs text-muted-foreground">Enrollments</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{data.completions.toLocaleString("en-US")}</p>
              <p className="text-xs text-muted-foreground">Completions</p>
            </div>
          </div>
          <ApexChart
            type="area"
            height={285}
            options={growthOptions}
            series={[
              { name: "Completed", data: data.completionSeries },
              {
                name: "In progress",
                data: data.enrollmentSeries.map(
                  (value, index) => value - (data.completionSeries[index] ?? 0),
                ),
              },
            ]}
          />
        </Card>
        <Card
          title="Learning outcomes"
          description="Completion across selected courses"
          bodyClassName="px-5 pb-5 pt-2"
        >
          <ApexChart
            type="pie"
            height={255}
            options={completionOptions}
            series={[data.completions, data.enrollments - data.completions]}
          />
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-success/5 p-3">
              <p className="text-lg font-semibold text-success">{data.completions}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Completed</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-lg font-semibold text-primary">
                {data.enrollments - data.completions}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">In progress</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">Course catalog</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Discover, review, and manage your learning content.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              aria-label="Search LMS courses"
              placeholder="Search courses..."
              className="w-[190px] ps-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Select value={courseStatus} onValueChange={setCourseStatus}>
            <SelectTrigger aria-label="Course status" className="w-[135px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleCourses.map((course) => (
          <section key={course.id} className="vexui-card overflow-hidden">
            <div
              className="relative flex h-28 items-center justify-between overflow-hidden p-5"
              style={{
                background: `linear-gradient(135deg, color-mix(in oklch, var(${course.color}) 7%, var(--card)), color-mix(in oklch, var(${course.color}) 2%, var(--card)))`,
              }}
            >
              <span
                className="absolute -end-5 -top-8 size-36 rounded-full border-[20px] opacity-5"
                style={{ borderColor: `var(${course.color})` }}
              />
              <span
                className="relative grid size-14 place-items-center rounded-xl bg-card/80 shadow-sm"
                style={{ color: `var(${course.color})` }}
              >
                <CategoryIcon category={course.category} className="size-8" />
              </span>
              <span className="relative self-start">
                <Badge size="sm" tone={course.status === "Published" ? "success" : "warning"}>
                  {course.status}
                </Badge>
              </span>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-medium text-primary">{course.category}</p>
              <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5">{course.title}</h3>
              <div className="mt-3 flex items-center gap-2">
                <img
                  src={getUserImage(
                    LMS_INSTRUCTORS.find((item) => item.id === course.instructorId)?.imageName,
                  )}
                  alt=""
                  className="size-6 rounded-full object-cover"
                />
                <p className="text-xs text-muted-foreground">
                  {LMS_INSTRUCTORS.find((item) => item.id === course.instructorId)?.name}
                </p>
              </div>
              <div className="my-4 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {course.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UsersRound className="size-3.5" />
                  {course.students} enrollments
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-base font-semibold">{lmsMoney(course.price)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCourse(course)}
                  aria-label={`View ${course.title}`}
                >
                  View course
                  <ChevronRight className="size-3.5 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </section>
        ))}
        {visibleCourses.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No courses match your filters.
          </p>
        )}
      </div>
      <Card
        title="Learner progress"
        description="Track sample students and mark their next lesson complete"
        bodyClassName="p-0"
        className="mb-6"
        action={<Badge tone="primary">{visibleLearners.length} learners</Badge>}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-5">Learner</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="pe-5">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleLearners.map((learner) => {
              const course = courses.find((item) => item.id === learner.courseId);
              if (!course) return null;
              const percent = Math.round((learner.finished / course.lessons) * 100);
              return (
                <TableRow key={learner.id}>
                  <TableCell className="ps-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getUserImage(learner.name)}
                        alt=""
                        className="size-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="whitespace-nowrap text-xs font-semibold">{learner.name}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{learner.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{course.title}</TableCell>
                  <TableCell>
                    <div className="min-w-[130px]">
                      <div className="mb-1.5 flex justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          {learner.finished}/{course.lessons} lessons
                        </span>
                        <span className="font-medium">{percent}%</span>
                      </div>
                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-label={`${learner.name} course progress`}
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full ${percent === 100 ? "bg-success" : "bg-primary"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {learner.lastActive}
                  </TableCell>
                  <TableCell className="pe-5">
                    {percent === 100 ? (
                      <Badge tone="success" size="sm">
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        variant="soft"
                        size="sm"
                        aria-label={`Complete next lesson for ${learner.name}`}
                        onClick={() => completeLesson(learner.id)}
                      >
                        <Check className="size-3.5" />
                        Complete lesson
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {visibleLearners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No learners in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Sample learner records · Changes stay in this page session
        </div>
      </Card>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Learning landscape"
          description={`Compare category enrollments over ${period} days`}
          bodyClassName="px-3 pb-2 pt-3"
        >
          <ApexChart
            type="radar"
            height={265}
            options={categoryOptions}
            series={[
              {
                name: "Enrollments",
                data: LMS_CATEGORIES.map((name) =>
                  data.selected
                    .filter((course) => course.category === name)
                    .reduce(
                      (sum, course) => sum + Math.round((course.students * Number(period)) / 30),
                      0,
                    ),
                ),
              },
            ]}
          />
        </Card>
        <Card
          title="Upcoming live sessions"
          description="Sample workshop schedule · Times in IST"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="grid w-12 shrink-0 place-items-center rounded-lg bg-primary/5 py-2 text-primary">
                  <span className="text-[10px] font-semibold">{session.month}</span>
                  <span className="text-xl font-semibold">{session.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold">{session.title}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {LMS_INSTRUCTORS.find((item) => item.id === session.instructorId)?.name}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{session.time}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${session.title} session`}
                  onClick={() => setSelectedSession(session)}
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No upcoming sample sessions for this category.
              </p>
            )}
          </div>
        </Card>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <GraduationCap className="size-4 text-primary" />
        <h2 className="text-[15px] font-semibold">Meet your instructors</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {instructors.map((instructor) => (
          <section className="vexui-card p-5" key={instructor.id}>
            <div className="flex items-center gap-3">
              <img
                src={getUserImage(instructor.imageName)}
                alt={instructor.name}
                loading="lazy"
                className="size-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{instructor.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{instructor.specialty}</p>
              </div>
              <span className="ms-auto inline-flex items-center gap-1 text-xs font-semibold">
                <Star className="size-3.5 fill-warning text-warning" />
                {instructor.rating}
              </span>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>
                {data.selected.filter((course) => course.instructorId === instructor.id).length}{" "}
                courses
              </span>
              <span>
                {data.selected
                  .filter((course) => course.instructorId === instructor.id)
                  .reduce((sum, course) => sum + course.students, 0)}{" "}
                enrollments
              </span>
            </div>
          </section>
        ))}
      </div>
      <Dialog open={newCourseOpen} onOpenChange={setNewCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create course</DialogTitle>
            <DialogDescription>
              Add a draft to the sample catalog. Changes are kept for this page session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createCourse} className="space-y-4">
            <div>
              <Label htmlFor="lms-course-title">Course title</Label>
              <Input
                id="lms-course-title"
                className="mt-2"
                value={courseTitle}
                onChange={(event) => setCourseTitle(event.target.value)}
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter course title"
              />
            </div>
            <div>
              <Label htmlFor="lms-new-category">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger id="lms-new-category" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LMS_CATEGORIES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lms-instructor">Instructor</Label>
              <Select value={instructorId} onValueChange={setInstructorId}>
                <SelectTrigger id="lms-instructor" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LMS_INSTRUCTORS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lms-lessons">Lessons</Label>
                <Input
                  id="lms-lessons"
                  type="number"
                  min="1"
                  max="200"
                  step="1"
                  required
                  className="mt-2"
                  value={lessons}
                  onChange={(event) => setLessons(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lms-price">Price (USD)</Label>
                <Input
                  id="lms-price"
                  type="number"
                  min="0"
                  max="10000"
                  step="0.01"
                  required
                  className="mt-2"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </div>
            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setNewCourseOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save draft</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={selectedCourse !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>Sample course details and learning outcomes.</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge tone="primary">{selectedCourse.category}</Badge>
                <Badge tone={selectedCourse.status === "Published" ? "success" : "warning"}>
                  {selectedCourse.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  [
                    "Instructor",
                    LMS_INSTRUCTORS.find((item) => item.id === selectedCourse.instructorId)?.name ??
                      "",
                  ],
                  ["Lessons", selectedCourse.lessons],
                  ["Enrollments", selectedCourse.students],
                  ["Price", lmsMoney(selectedCourse.price)],
                ].map(([label, value]) => (
                  <div className="rounded-lg border bg-muted/30 p-4" key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="size-4 text-primary" />
                {selectedCourse.completed} learners have completed this course.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={selectedSession !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSession(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>Sample live session information.</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <>
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  {selectedSession.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-primary" />
                  {selectedSession.time} · {selectedSession.duration}
                </p>
                <p className="flex items-center gap-2">
                  <UsersRound className="size-4 text-primary" />
                  {LMS_INSTRUCTORS.find((item) => item.id === selectedSession.instructorId)?.name}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {selectedSession.description}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
