import { z } from "zod";
import { guardianCreateSchema } from "./guardian.schema";

export type GuardianStatus = "not_invited" | "invited" | "signed_up";

export type GuardianOption = {
  memberId: string;
  name: string;
  email: string;
};

export interface GuardianFilterOptions {
  status?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export type GuardianInviteData = z.infer<typeof guardianCreateSchema> & {
  studentId: string;
  organizationId: string;
};

export type GuardianWithStatus = {
  id: string; // invitationId or memberId
  name: string;
  email: string;
  phone?: string;
  status: GuardianStatus;
  studentId?: string;
  relationship?: string;
  created_at: Date;
  type: "member" | "invitation";
};
