import { Shield, ShieldUser, SquareUserRound, UsersRound } from "lucide-react";

export const callTypes = new Map<string, string>([
  [
    "accepted",
    "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  ],
  ["pending", "bg-neutral-300/40 border-neutral-300"],
  ["invited", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  [
    "suspended",
    "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  ],
]);

export const userTypes = [
  {
    label: "Owner",
    value: "owner",
    icon: Shield,
  },
  {
    label: "Admin",
    value: "admin",
    icon: ShieldUser,
  },
  {
    label: "Teacher",
    value: "teacher",
    icon: UsersRound,
  },
  {
    label: "Guardian",
    value: "guardian",
    icon: SquareUserRound,
  },
] as const;
