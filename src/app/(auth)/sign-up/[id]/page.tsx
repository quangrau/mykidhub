import { redirect } from "next/navigation";

import { AuthService } from "@/lib/auth/auth.service";
import { CreateAccountForm } from "./_components/create-account-form";
import { ErrorMessage } from "./_components/error-message";

interface AcceptInvitationPageProps {
  params: {
    id: string;
  };
}

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const { id } = await params;
  const invitation = await AuthService.getInvitationById(id);

  // Check if invitation exists
  if (!invitation) {
    redirect("/sign-up");
  }

  // Check if invitation is accepted
  if (invitation.status === "accepted") {
    return <ErrorMessage type="accepted" />;
  }

  // Check if invitation expired
  if (invitation.expiresAt < new Date()) {
    return <ErrorMessage type="expired" />;
  }

  const invitee = await AuthService.getUserByEmail(invitation.email!);
  if (!invitee) {
    return (
      <CreateAccountForm
        name={invitation.name}
        phone={invitation.phone}
        email={invitation.email!}
        organization={invitation.organization}
        invitationId={invitation.id}
      />
    );
  }

  return <p>Render link account form</p>;
}
