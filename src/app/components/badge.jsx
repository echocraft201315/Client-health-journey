"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { unreadCount } from "@/app/store";
// import { useNotifications } from "@/app/notification";

export default function NotificationBadge({ isMessage, email }) {
  const [unread, setUnread] = useAtom(unreadCount);
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    function showNotification(title, body) {
      if (Notification.permission === "granted" && !document.hasFocus()) {
        const notification = new Notification(title, {
          body,
          icon: "/chat-icon.png",
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
    const number = async (email) => {
      try {
        const response = await fetch("/api/message/notification", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setUnread(data?.getNumber || 0);
      } catch (error) {
        toast.error("Unable to get number");
      }
    };
    number(email);
    console.log("unread", unread);
    socket.on("msg-recieve", (data) => {
      if (!isMessage) {
        setUnread((prev) => Number(prev) + 1);
        toast.success("new message");
        showNotification("New Message", "You have a new message");
      }
    });
    return () => {
      socket.off("msg-recieve");
    };
  }, [email]);
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    function showNotification(title, body) {
      if (Notification.permission === "granted" && !document.hasFocus()) {
        const notification = new Notification(title, {
          body,
          icon: "/chat-icon.png",
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
    if (unread == 1) {
      toast.success(`You have ${unread} new message.`);
      showNotification("New Message", `You have ${unread} new message.`);
    }
    if (unread > 1) {
      toast.success(`You have ${unread} new messages.`);
      showNotification("New Message", `You have ${unread} new messages.`);
    }
  }, [unread]);
  return unread > 0 ? (
    <div className="w-[20px] h-[20px] rounded-full bg-red-500 text-white text-center">
      {unread}
    </div>
  ) : null;
}
