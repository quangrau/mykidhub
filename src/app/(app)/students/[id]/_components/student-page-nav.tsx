"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const items = [
  {
    name: "Overview",
    href: "/students/{id}",
  },
  {
    name: "Feed",
    href: "/students/{id}/feed",
  },
  {
    name: "Immunizations",
    href: "/students/{id}/immunizations",
  },
  {
    name: "Settings",
    href: "/students/{id}/settings",
  },
];

interface StudentPageNavProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  className?: string;
}

export function StudentPageNav({
  className,
  id,
  ...props
}: StudentPageNavProps) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          {items.map((item) => {
            const href = item.href.replace(/{id}/g, id);

            return (
              <NavLink
                key={href}
                href={href}
                name={item.name}
                isActive={
                  item.name === "Overview"
                    ? pathname === href
                    : pathname?.startsWith(href) ?? false
                }
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}

function NavLink({
  href,
  name,
  isActive,
}: {
  href: string;
  name: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      key={href}
      className="flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary"
      data-active={isActive}
    >
      {name}
    </Link>
  );
}
