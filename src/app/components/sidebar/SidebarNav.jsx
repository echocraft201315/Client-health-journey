"use client";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";
import NotificationBadge from "../badge";
import { useState } from "react";

const SidebarNav = ({ items }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMessage, setIsMessage] = useState(false);
  
  const handleClick = async (item) => {
    // if (item.title == "Messages") {
    //   setIsMessage(true);
    //   const markAsRead = async () => {
    //     await fetch(`/api/message/mark`, {
    //       method: "POST",
    //       body: JSON.stringify({ email: user?.email }),
    //     });
    //   };
    //   markAsRead();
    // } else {
    //   setIsMessage(false);
    // }
  };
  
  return (
    <ScrollArea className="flex-1 py-2">
      <nav className="grid gap-1 px-2">
        {items.map((item, index) => (
          <Link
            onClick={() => handleClick(item)}
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href && "bg-accent text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
            {item.title == "Messages" ? (
              <NotificationBadge
                email={user?.email}
                isMessage={isMessage}
              />
            ) : (
              ""
            )}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNav;
