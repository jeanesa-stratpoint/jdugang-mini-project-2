"use client";

import { useState, useEffect } from "react";
import { Bell, MessageSquare, Heart, Circle } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
} from "@/actions/notification.actions";
import { formatDate } from "@/lib/utils/formatdate";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    name: string;
    profileImg: string | null;
  } | null;
  blog: {
    slug: string;
    title: string;
  } | null;
}

export default function NotificationDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshNotifications = async () => {
    if (!userId) return;
    try {
      const data = await getNotifications(userId);
      const typedData = data as unknown as Notification[];
      setNotifications(typedData);
      setUnreadCount(typedData.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initialFetch = async () => {
      if (!userId) return;
      try {
        const data = await getNotifications(userId);
        if (isMounted) {
          const typedData = data as unknown as Notification[];
          setNotifications(typedData);
          setUnreadCount(typedData.filter((n) => !n.isRead).length);
        }
      } catch (error) {
        console.error("Initial fetch failed:", error);
      }
    };
    initialFetch();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) refreshNotifications();
  };

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false);
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markNotificationRead(notification.id, true);
    }
  };

  const toggleReadStatus = async (
    e: React.MouseEvent,
    notification: Notification,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = !notification.isRead;
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: newStatus } : n,
      ),
    );
    setUnreadCount((prev) => (newStatus ? prev - 1 : prev + 1));
    await markNotificationRead(notification.id, newStatus);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="focus:outline-none relative p-2 text-[#1F4F46] hover:bg-black/5 rounded-full transition-colors">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#E9EEE8]"></span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[90vw] md:w-96 rounded-xl p-0 shadow-xl border-gray-100 bg-white"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-[#1F4F46] text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-[#85BFBB] font-medium">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((note) => {
              if (!note.sender || !note.blog) return null;
              const isComment = note.type === "COMMENT";
              const linkHref = `/journal/${note.blog.slug}${isComment ? "#comments" : ""}`;

              return (
                <DropdownMenuItem
                  key={note.id}
                  className={`cursor-pointer p-0 focus:bg-gray-50 ${
                    !note.isRead ? "bg-[#F5F3EF]/60" : "bg-white"
                  }`}
                  asChild
                >
                  <div className="relative flex items-start gap-3 p-4 border-b border-gray-50 last:border-0">
                    <Link
                      href={linkHref}
                      className="flex items-start gap-3 flex-1"
                      onClick={() => handleNotificationClick(note)}
                    >
                      <div className="relative shrink-0 mt-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                          {note.sender.profileImg ? (
                            <Image
                              src={note.sender.profileImg}
                              alt={note.sender.name}
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#1F4F46] text-white flex items-center justify-center font-bold text-xs">
                              {note.sender.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          {note.type === "LIKE" ? (
                            <Heart
                              size={10}
                              className="fill-red-400 text-red-400"
                            />
                          ) : (
                            <MessageSquare
                              size={10}
                              className="fill-[#85BFBB] text-[#85BFBB]"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-gray-700 leading-snug">
                          <span className="font-bold text-[#1F4F46]">
                            {note.sender.name}
                          </span>{" "}
                          <span className="text-gray-500">
                            {note.type === "LIKE"
                              ? "liked your blog"
                              : "commented on"}
                          </span>
                          <span className="font-medium text-[#1F4F46] block truncate max-w-45">
                            &quot;{note.blog.title}&quot;
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={(e) => toggleReadStatus(e, note)}
                      className="text-gray-300 hover:text-[#1F4F46] p-2 -mr-2"
                      title={note.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      <Circle
                        size={10}
                        fill={!note.isRead ? "#1F4F46" : "transparent"}
                      />
                    </button>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
