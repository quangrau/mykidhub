import { capitalize } from "@/lib/utils";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter((item) => item !== "");

  if (segments.length === 0) {
    return [{ label: "Dashboard" }];
  }

  return segments.map((segment, index) => {
    // Convert kebab-case or snake_case to readable text
    const label = capitalize(segment.replace(/[-_]/g, " "));

    // For all segments except the last one, create a link
    const href =
      index < segments.length - 1
        ? `/${segments.slice(0, index + 1).join("/")}`
        : undefined;

    return { label, href };
  });
}
