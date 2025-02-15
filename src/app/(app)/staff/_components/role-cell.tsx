import { Badge } from "@/components/ui/badge";
import { UserRole } from "@prisma/client";

type Props = {
  role: UserRole;
};

export default function RoleCell({ role }: Props) {
  if (role === UserRole.SCHOOL_ADMIN) {
    return <Badge variant="destructive">Administrator</Badge>;
  }

  if (role === UserRole.TEACHER) {
    return <Badge>Teacher</Badge>;
  }

  return null;
}
