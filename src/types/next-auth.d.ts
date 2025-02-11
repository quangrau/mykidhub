import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

type ExtendedUser = {
  id: string;
  role?: UserRole;
  schoolId?: string;
  schoolName?: string;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
