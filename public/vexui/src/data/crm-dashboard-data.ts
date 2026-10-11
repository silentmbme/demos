export const pipelineStages = [
  ["New leads", "184", "$420K", 100, "primary"],
  ["Qualified", "126", "$318K", 76, "info"],
  ["Proposal", "74", "$246K", 59, "warning"],
  ["Negotiation", "38", "$164K", 39, "warning"],
  ["Won", "29", "$128K", 30, "success"],
] as const;

export const leadSources = [
  ["Website", "82 leads", "24% conversion", 82],
  ["Referral", "46 leads", "31% conversion", 61],
  ["LinkedIn", "34 leads", "18% conversion", 47],
  ["Email campaign", "28 leads", "16% conversion", 38],
  ["Events", "22 leads", "28% conversion", 31],
  ["Partner", "18 leads", "34% conversion", 25],
] as const;

export const salesReps = [
  ["Sophia Williams", "SW", "18 deals", "$128K", 92],
  ["Daniel Carter", "DC", "15 deals", "$112K", 84],
  ["Olivia Smith", "OS", "13 deals", "$96K", 79],
  ["Noah Anderson", "NA", "11 deals", "$84K", 71],
] as const;

export const recentLeads = [
  ["Ava Thompson", "AT", "CloudAxis", "LinkedIn", "86", "Sophia", "Qualified"],
  ["Liam Morgan", "LM", "Vertex Labs", "Website", "74", "Daniel", "Contacted"],
  ["Mia Rodriguez", "MR", "Vexui Labs", "Referral", "92", "Olivia", "Proposal"],
  ["Ethan Clark", "EC", "Aster Group", "Events", "61", "Noah", "New"],
] as const;

export const opportunities = [
  ["Vertex Labs", "Enterprise expansion", "$84,500", 76, "Sep 12", "Daniel"],
  ["CloudAxis", "Platform renewal", "$62,000", 68, "Sep 18", "Sophia"],
  ["Vexui Labs", "Growth suite", "$48,800", 54, "Oct 02", "Olivia"],
] as const;

export const meetings = [
  ["10:30", "AM", "Acme Inc.", "Quarterly sales review", "3 participants", "Video call"],
  ["12:00", "PM", "Vexui Labs", "Product demo", "2 participants", "Video call"],
  ["03:30", "PM", "Vertex Labs", "Commercial review", "4 participants", "In person"],
] as const;

export const salesTasks = [
  ["Follow up with Acme Inc.", "High", "Today", "SW", false],
  ["Prepare proposal for Vexui Labs", "High", "Tomorrow", "DC", false],
  ["Schedule demo with Vertex", "Medium", "Sep 09", "OS", false],
  ["Review enterprise renewal", "Low", "Sep 12", "NA", true],
] as const;
