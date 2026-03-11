import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  FileText,
  Layers,
  MessageSquare,
  Palette,
  TrendingUp,
  Users,
  Video,
  Wrench,
  Zap,
} from "lucide-react";

export type NavLink = "Dashboard" | "Tools" | "Analytics" | "Settings";
export type ToolStatus = "Active" | "Expiring" | "Unused";
export type ToolApiStatus = "active" | "expiring" | "unused";

export const navPathMap: Record<NavLink, string> = {
  Dashboard: "/",
  Tools: "/tools",
  Analytics: "/analytics",
  Settings: "/settings",
};

export interface StatItem {
  label: string;
  value: string;
  valueAccent?: string;
  badge: string;
  progress?: number;
  badgeClass: string;
  icon: LucideIcon;
  iconClass: string;
}

export interface ToolItem {
  name: string;
  department: string;
  users: number;
  monthlyCost: string;
  status: ToolStatus;
  icon: LucideIcon;
  iconColorClass: string;
}

export const navLinks: NavLink[] = ["Dashboard", "Tools", "Analytics", "Settings"];

export const statsData: StatItem[] = [
  {
    label: "Monthly Budget",
    value: "€28,750",
    valueAccent: "/€30k",
    badge: "+12%",
    progress: 95.8,
    badgeClass: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
    icon: TrendingUp,
    iconClass: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
  },
  {
    label: "Active Tools",
    value: "147",
    badge: "+8",
    badgeClass: "bg-gradient-to-r from-violet-400 to-indigo-600 text-white",
    icon: Wrench,
    iconClass: "bg-gradient-to-br from-violet-400 to-indigo-600 text-white",
  },
  {
    label: "Departments",
    value: "8",
    badge: "+2",
    badgeClass: "bg-gradient-to-r from-orange-400 to-rose-500 text-white",
    icon: Building2,
    iconClass: "bg-gradient-to-br from-orange-400 to-rose-500 text-white",
  },
  {
    label: "Cost/User",
    value: "€156",
    badge: "+€10",
    badgeClass: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
    icon: Users,
    iconClass: "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
  },
];

export const toolsData: ToolItem[] = [
  {
    name: "Slack",
    department: "Communication",
    users: 245,
    monthlyCost: "€2,450",
    status: "Active",
    icon: MessageSquare,
    iconColorClass: "text-violet-500",
  },
  {
    name: "Figma",
    department: "Design",
    users: 32,
    monthlyCost: "€480",
    status: "Active",
    icon: Palette,
    iconColorClass: "text-pink-500",
  },
  {
    name: "GitHub",
    department: "Engineering",
    users: 89,
    monthlyCost: "€890",
    status: "Active",
    icon: Zap,
    iconColorClass: "text-amber-500",
  },
  {
    name: "Notion",
    department: "Operations",
    users: 156,
    monthlyCost: "€780",
    status: "Expiring",
    icon: FileText,
    iconColorClass: "text-zinc-400",
  },
  {
    name: "Adobe CC",
    department: "Marketing",
    users: 12,
    monthlyCost: "€720",
    status: "Unused",
    icon: Layers,
    iconColorClass: "text-rose-500",
  },
  {
    name: "Zoom",
    department: "Communication",
    users: 198,
    monthlyCost: "€1,980",
    status: "Active",
    icon: Video,
    iconColorClass: "text-sky-500",
  },
  {
    name: "Jira",
    department: "Engineering",
    users: 67,
    monthlyCost: "€670",
    status: "Expiring",
    icon: Wrench,
    iconColorClass: "text-cyan-500",
  },
  {
    name: "Salesforce",
    department: "Sales",
    users: 45,
    monthlyCost: "€4,500",
    status: "Active",
    icon: Briefcase,
    iconColorClass: "text-indigo-500",
  },
  {
    name: "Asana",
    department: "Operations",
    users: 74,
    monthlyCost: "€610",
    status: "Active",
    icon: Layers,
    iconColorClass: "text-violet-500",
  },
  {
    name: "Miro",
    department: "Design",
    users: 28,
    monthlyCost: "€390",
    status: "Expiring",
    icon: Palette,
    iconColorClass: "text-orange-500",
  },
  {
    name: "Confluence",
    department: "Engineering",
    users: 102,
    monthlyCost: "€1,120",
    status: "Active",
    icon: FileText,
    iconColorClass: "text-blue-500",
  },
  {
    name: "HubSpot",
    department: "Marketing",
    users: 39,
    monthlyCost: "€2,050",
    status: "Unused",
    icon: Briefcase,
    iconColorClass: "text-rose-500",
  },
];
