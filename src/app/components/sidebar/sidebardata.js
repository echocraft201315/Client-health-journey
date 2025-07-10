
import {
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  Users,
  FileText,
  Settings,
  Activity,
  Folders,
  UserCog,
  Palette,
  Home,
  CalendarCheck,
  Package,
  MessageSquare,
  BookOpen,
  UserCircle,
  Utensils,
  MessageCircle,
} from "lucide-react";

// Navigation items for system administrators (admin, super_admin)
// CRITICAL: These items are ONLY for system admins, never clinic admins
export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Clinics",
    href: "/admin/clinics",
    icon: Building2,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: Users,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Check-ins",
    href: "/admin/check-ins",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: Folders,
  },
  {
    title: "Admin Users",
    href: "/admin/adminUsers",
    icon: UserCog,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: ClipboardList,
  },
  {
    title: "Templates",
    href: "/admin/templates",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Navigation items for clinic administrators - SPECIFICALLY different from system admins
// IMPORTANT: Clinic admins should NEVER see Clinics or Admin Users
export const clinicAdminNavItems = [
  {
    title: "Dashboard",
    href: "/clinic/dashboard",
    icon: BarChart3,
  },
  {
    title: "Coaches",
    href: "/clinic/coaches",
    icon: Users,
  },
  {
    title: "Clients",
    href: "/clinic/clients",
    icon: Users,
  },
  {
    title: "Programs",
    href: "/clinic/programs",
    icon: ClipboardList,
  },
  {
    title: "Check-ins",
    href: "/clinic/check-ins",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/clinic/reports",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/clinic/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/clinic/resources",
    icon: Folders,
  },
  // {
  //   title: "Clinic Customization",
  //   href: "/admin/clinic-customization",
  //   icon: Palette,
  // },

  {
    title: "Messages",
    href: "/clinic/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/clinic/settings",
    icon: Settings,
  },
];


export const clientNavItems = [
  {
    title: "Dashboard",
    href: "/client/dashboard",
    icon: Home,
  },
  {
    title: "Check-in",
    href: "/client/check-in",
    icon: CalendarCheck,
  },
  {
    title: "Progress",
    href: "/client/progress",
    icon: BarChart3,
  },
  {
    title: "My Program",
    href: "/client/program",
    icon: Package,
  },
  {
    title: "Messages",
    href: "/client/messages",
    icon: MessageSquare,
  },
  {
    title: "Resources",
    href: "/client/resources",
    icon: BookOpen,
  },
  // {
  //   title: "Meal Plan Generator",
  //   href: "/client/meal-plan-generator",
  //   icon: Utensils,
  // },
  {
    title: "Profile",
    href: "/client/profile",
    icon: UserCircle,
  },
];

export const coachNavItems = [
  {
    title: "Dashboard",
    href: "/coach/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/coach/clients",
    icon: Users,
  },
  {
    title: "Check-ins",
    href: "/coach/check-ins",
    icon: CalendarCheck,
  },
  {
    title: "Reports",
    href: "/coach/reports",
    icon: BarChart3,
  },
  {
    title: "Resources",
    href: "/coach/resources",
    icon: BookOpen,
  },
  {
    title: "Messages",
    href: "/coach/messages",
    icon: MessageCircle,
  },
  {
    title: "Programs",
    href: "/coach/programs",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/coach/settings",
    icon: Settings,
  },
];

