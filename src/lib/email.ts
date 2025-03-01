import { Resend } from "resend";

import { EmailTeacherInvitationTemplate } from "@/components/email/teacher-invitation-template";
const resend = new Resend(process.env.RESEND_API_KEY);

export interface TeacherInvitationData {
  email: string;
  schoolName: string;
  inviteLink: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
}

export async function sendTeacherInvitation(data: TeacherInvitationData) {
  try {
    const emailTemplate = await EmailTeacherInvitationTemplate({
      schoolName: data.schoolName,
      inviteLink: data.inviteLink,
    });

    const response = await resend.emails.send({
      from: "MyKidHub <onboarding@resend.dev>",
      to: ["lethanhquang910@gmail.com"],
      subject: "Hello world",
      react: emailTemplate,
    });

    console.log("sendTeacherInvitation", response);
  } catch (error) {
    console.log(error);
  }
}
