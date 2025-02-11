import { StaffRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

type ExtendedUser = {
  id: string;
  role?: StaffRole;
  schoolId?: unknown;
  schoolName?: unknown;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
