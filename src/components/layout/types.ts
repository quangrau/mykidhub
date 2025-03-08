interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & {
    url: string;
  })[];
  url?: never;
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

interface NavGroup {
  title?: string;
  groupKey: string;
  items: NavItem[];
}

type NavItem = NavCollapsible | NavLink;

export type { NavCollapsible, NavGroup, NavItem, NavLink };
