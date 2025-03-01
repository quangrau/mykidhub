interface EmailTeacherInvitationTemplateProps {
  schoolName: string;
  inviteLink: string;
}

export const EmailTeacherInvitationTemplate: React.FC<
  Readonly<EmailTeacherInvitationTemplateProps>
> = ({ schoolName, inviteLink }) => (
  <div>
    <h1>Get Ready to {schoolName} Nest on MyKidHub</h1>
    <p>This link will expire in 7 days.</p>
    <p>{inviteLink}</p>
  </div>
);
