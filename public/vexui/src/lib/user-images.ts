import user1 from "@/assets/images/users/user-1.jpg";
import user2 from "@/assets/images/users/user-2.jpg";
import user3 from "@/assets/images/users/user-3.jpg";
import user4 from "@/assets/images/users/user-4.jpg";
import sophiaCarter from "@/assets/images/users/sophia-carter.jpg";

export const userImages = {
  user1,
  user2,
  user3,
  user4,
} as const;

const userImageMap: Record<string, string> = {
  "sophia carter": sophiaCarter,
  sc: sophiaCarter,
  "olivia smith": user1,
  os: user1,
  "amara okafor": user1,
  ao: user1,
  "priya raman": user1,
  pr: user1,
  "maya adams": user1,
  ma: user1,
  "mia johnson": user1,
  mj: user1,
  am: user1,
  at: user1,
  ca: user1,
  "noah williams": user2,
  nw: user2,
  "daniel reyes": user2,
  dr: user2,
  "marcus parker": user2,
  mp: user2,
  "john bell": user2,
  jb: user2,
  pt: user2,
  mo: user2,
  nb: user2,
  jc: user2,
  "emma wilson": user3,
  ew: user3,
  "emma brooks": user3,
  eb: user3,
  ed: user3,
  bw: user3,
  "daniel lee": user4,
  dl: user4,
  you: user4,
  "liam walker": user4,
  lw: user4,
  "lukas meyer": user4,
  lm: user4,
  dc: user4,
  lb: user4,
  vl: user4,
  ns: user4,
  ai: user4,
  "sophie turner": user3,
  st: user3,
};

export function getUserImage(person?: string) {
  const key = person?.trim().toLowerCase() ?? "";
  return userImageMap[key] ?? user1;
}
