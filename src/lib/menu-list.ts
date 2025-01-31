import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Plus,
  Bot,
  MessageSquareMore,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Chat",
      menus: [
        {
          href: "/chat",
          label: "New Chat",
          icon: Plus,
        },
      ],
    },
    {
      groupLabel: "Dashboard",
      menus: [
        {
          href: "/home",
          label: "Home",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Chat History",
      menus: [
        {
          href: "/chat-history",
          label: "Hi",
          icon: MessageSquareMore,
        },
      ],
    },
  ];
}
