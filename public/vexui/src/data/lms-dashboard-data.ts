export const LMS_CATEGORIES = ["Development", "Design", "Data Science", "Marketing"] as const;
export const LMS_INSTRUCTORS = [
  {
    id: "sophia",
    name: "Sophia Carter",
    specialty: "Design & creative thinking",
    rating: "4.9",
    imageName: "sophia carter",
  },
  {
    id: "daniel",
    name: "Daniel Lee",
    specialty: "Software & data science",
    rating: "4.8",
    imageName: "daniel lee",
  },
  {
    id: "olivia",
    name: "Olivia Smith",
    specialty: "Digital marketing",
    rating: "4.9",
    imageName: "olivia smith",
  },
] as const;

export interface LmsCourse {
  id: string;
  title: string;
  category: string;
  instructorId: string;
  lessons: number;
  students: number;
  completed: number;
  price: number;
  status: "Published" | "Draft";
  color: string;
}
export const LMS_COURSES: LmsCourse[] = [
  {
    id: "CRS-101",
    title: "React & TypeScript Masterclass",
    category: "Development",
    instructorId: "daniel",
    lessons: 32,
    students: 428,
    completed: 296,
    price: 79,
    status: "Published",
    color: "--primary",
  },
  {
    id: "CRS-102",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    instructorId: "sophia",
    lessons: 24,
    students: 356,
    completed: 264,
    price: 69,
    status: "Published",
    color: "--chart-2",
  },
  {
    id: "CRS-103",
    title: "Python for Data Analysis",
    category: "Data Science",
    instructorId: "daniel",
    lessons: 28,
    students: 284,
    completed: 188,
    price: 89,
    status: "Published",
    color: "--chart-3",
  },
  {
    id: "CRS-104",
    title: "Digital Marketing Essentials",
    category: "Marketing",
    instructorId: "olivia",
    lessons: 18,
    students: 216,
    completed: 168,
    price: 49,
    status: "Published",
    color: "--chart-4",
  },
  {
    id: "CRS-105",
    title: "Advanced Design Systems",
    category: "Design",
    instructorId: "sophia",
    lessons: 20,
    students: 0,
    completed: 0,
    price: 99,
    status: "Draft",
    color: "--chart-5",
  },
  {
    id: "CRS-106",
    title: "Building Production APIs",
    category: "Development",
    instructorId: "daniel",
    lessons: 26,
    students: 0,
    completed: 0,
    price: 89,
    status: "Draft",
    color: "--primary",
  },
];
export interface LmsLearner {
  id: string;
  name: string;
  courseId: string;
  finished: number;
  lastActive: string;
}
export const LMS_LEARNERS: LmsLearner[] = [
  {
    id: "STU-201",
    name: "Amara Okafor",
    courseId: "CRS-101",
    finished: 24,
    lastActive: "Oct 9, 10:42",
  },
  {
    id: "STU-202",
    name: "Daniel Reyes",
    courseId: "CRS-102",
    finished: 18,
    lastActive: "Oct 9, 10:35",
  },
  {
    id: "STU-203",
    name: "Priya Raman",
    courseId: "CRS-103",
    finished: 27,
    lastActive: "Oct 9, 10:28",
  },
  {
    id: "STU-204",
    name: "Noah Williams",
    courseId: "CRS-104",
    finished: 18,
    lastActive: "Oct 9, 09:55",
  },
];
export const LMS_SESSIONS = [
  {
    id: "session-1",
    title: "Design critique workshop",
    instructorId: "sophia",
    category: "Design",
    date: "October 10, 2026",
    time: "10:00–11:00 IST",
    duration: "60 minutes",
    day: "10",
    month: "OCT",
    description:
      "Review sample interface designs and discuss visual hierarchy, spacing, and accessibility.",
  },
  {
    id: "session-2",
    title: "React patterns Q&A",
    instructorId: "daniel",
    category: "Development",
    date: "October 12, 2026",
    time: "14:00–14:45 IST",
    duration: "45 minutes",
    day: "12",
    month: "OCT",
    description:
      "Explore component composition, typed props, and practical application architecture.",
  },
  {
    id: "session-3",
    title: "Campaign planning lab",
    instructorId: "olivia",
    category: "Marketing",
    date: "October 14, 2026",
    time: "11:00–12:00 IST",
    duration: "60 minutes",
    day: "14",
    month: "OCT",
    description: "Practice setting campaign objectives, choosing channels, and measuring outcomes.",
  },
] as const;
export function lmsMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
export function getLmsOverview(courses: LmsCourse[], period: "7" | "30", category: string) {
  const selected = courses.filter((course) => category === "all" || course.category === category);
  const enrollments = selected.reduce(
    (sum, course) => sum + Math.round((course.students * Number(period)) / 30),
    0,
  );
  const completions = selected.reduce(
    (sum, course) => sum + Math.round((course.completed * Number(period)) / 30),
    0,
  );
  const revenue = selected.reduce(
    (sum, course) => sum + Math.round((course.students * Number(period)) / 30) * course.price,
    0,
  );
  const distribute = (total: number) => {
    const weights = [0.7, 0.86, 1.04, 0.92, 1.16, 1.08, 1.24];
    const sum = weights.reduce((a, b) => a + b, 0);
    const values = weights.map((value) => Math.floor((total * value) / sum));
    values[6] = (values[6] ?? 0) + total - values.reduce((a, b) => a + b, 0);
    return values;
  };
  const labels = Array.from({ length: 7 }, (_, index) =>
    new Date(
      Date.UTC(2026, 9, 9 - Math.round(((6 - index) * (Number(period) - 1)) / 6)),
    ).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
  );
  return {
    selected,
    enrollments,
    completions,
    revenue,
    completionRate: enrollments ? (completions / enrollments) * 100 : 0,
    enrollmentSeries: distribute(enrollments),
    completionSeries: distribute(completions),
    labels,
  };
}
