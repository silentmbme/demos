export const projects = [
  ["Website Redesign", "Nexora", "82", "Sep 10", "On Track", "SC"],
  ["Mobile App v2", "Helix", "64", "Sep 22", "At Risk", "DL"],
  ["CRM Migration", "Northstar", "46", "Oct 02", "Delayed", "OS"],
  ["Marketing Automation", "Aurora", "71", "Sep 18", "On Track", "EB"],
] as const;
export const workload = [
  ["Sophia Carter", "SC", 18, 82],
  ["Daniel Lee", "DL", 14, 68],
  ["Olivia Smith", "OS", 21, 94],
  ["Ethan Brown", "EB", 11, 54],
] as const;
export const deadlines = [
  ["AUG", "26", "Website Redesign", "Homepage approval", "High"],
  ["AUG", "29", "Mobile App v2", "Beta release", "Critical"],
  ["SEP", "02", "CRM Migration", "Data validation", "High"],
  ["SEP", "05", "Marketing Automation", "Campaign launch", "Medium"],
] as const;
export const tasks = [
  ["Finalize payment flow", "Mobile App v2", "High", "SC", "Today", false],
  ["Validate migrated customer data", "CRM Migration", "Critical", "DL", "Tomorrow", false],
  ["Review launch campaign", "Marketing Automation", "Medium", "OS", "Sep 05", false],
  ["Approve design system", "Website Redesign", "Low", "EB", "Sep 08", true],
] as const;
