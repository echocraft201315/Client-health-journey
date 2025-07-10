"use client";

import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { BookMarked, User } from "lucide-react";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import {
  adminNavItems,
  clinicAdminNavItems,
  coachNavItems,
  clientNavItems,
} from "./sidebardata";
import { useAuth } from "@/app/context/AuthContext";
import { Loader2 } from "lucide-react";

export function Sidebar({ mobileOpen = false, onClose }) {
  const { user } = useAuth();

  // Sidebar content
  const sidebarContent = !user ? (
    <div className="flex items-center justify-center h-screen w-full bg-background border-r">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ) : (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-background w-full sm:w-72 w-64 transition-transform duration-300 ease-in-out",
        mobileOpen
          ? "fixed z-50 top-0 left-0 h-screen w-[80vw] max-w-[320px] bg-white shadow-lg translate-x-0 sm:static sm:translate-x-0 block"
          : "-translate-x-full sm:translate-x-0 sm:static hidden sm:flex"
      )}
      style={mobileOpen ? {} : {}}>
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <span className="font-semibold">Client Health Tracker™</span>
        </Link>
        {/* Close button for mobile drawer */}
        {mobileOpen && (
          <button onClick={onClose} className="sm:hidden ml-auto p-2 rounded hover:bg-gray-100">
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <SidebarNav
        items={
          user.role === "admin"
            ? adminNavItems
            : user.role === "clinic_admin"
            ? clinicAdminNavItems
            : user.role === "coach"
            ? coachNavItems
            : clientNavItems
        }
      />
      <SidebarProfile
        user={user}
        userRole={user.role}
        roleIcon={User}
      />
    </div>
  );

  return sidebarContent;
}
