import {
  Tag,
  Users,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Settings
} from "lucide-react";
import { GearIcon } from "@radix-ui/react-icons";

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
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Betting System",
      menus: [
        {
          href: "/daily",
          label: "Daily Tips",
          icon: SquarePen,
        },
        {
          href: "/ai",
          label: "AI Tips",
          icon: Bookmark
        },
        {
          href: "/bet-tracker",
          label: "Bet Tracker",
          icon: Tag
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/subscription",
          label: "Subscription",
          icon: Users
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Users
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
