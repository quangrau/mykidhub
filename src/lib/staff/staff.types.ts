import { z } from "zod";
import { staffCreateUpdateSchema } from "./staff.schema";

export type StaffCreateUpdateData = z.infer<typeof staffCreateUpdateSchema>;

export type StaffInviteData = StaffCreateUpdateData & {
  schoolId: string;
};

export type StaffRole = "owner" | "admin" | "teacher";

export type StaffStatus = "invited" | "signed_up";

export type StaffWithStatus = {
  id: string; // invitationId or memberId
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  status: StaffStatus;
  role: StaffRole;
  created_at: Date;
  type: "member" | "invitation";
};

export type GetStaffsWithStatusOptions = {
  status?: string;
  active?: number;
  orderBy?: string;
  order?: "asc" | "desc";
};
