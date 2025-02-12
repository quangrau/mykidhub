import { StaffRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: StaffRole;
  schoolId?: string;
  schoolName?: string;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
