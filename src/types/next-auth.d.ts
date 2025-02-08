import { UserWithSchool } from "@/services/user";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & UserWithSchool;
  }
}
