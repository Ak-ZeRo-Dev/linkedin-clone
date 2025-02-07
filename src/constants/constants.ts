import { Briefcase, HomeIcon, MessageSquareIcon, UserIcon } from "lucide-react";

export const COMMENTS_LIMIT = 10;
export const POSTS_LIMIT = 20;

export const NAV_LINKS = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/", icon: UserIcon, label: "Network", hiddenOnMobile: true },
  { href: "/", icon: Briefcase, label: "Jobs", hiddenOnMobile: true },
  { href: "/", icon: MessageSquareIcon, label: "Messaging" },
];
