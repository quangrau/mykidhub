"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PostType } from "@prisma/client";
import { Megaphone } from "lucide-react";

type PostTypeIconProps = {
  type: PostType;
};

export function PostTypeAvatar({ type }: PostTypeIconProps) {
  let icon;

  switch (type) {
    case PostType.ANNOUNCEMENT:
    default:
      icon = <Megaphone className="h-6 w-6" />;
      break;
  }

  return (
    <Avatar className="h-12 w-12">
      <AvatarFallback>{icon}</AvatarFallback>
    </Avatar>
  );
}
