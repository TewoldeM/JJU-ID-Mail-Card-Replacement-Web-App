"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  studentId: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  studentId: string; // 4-digit User.StudentId
}

export default function Notifications({ studentId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data: Notification[] = await res.json();
        setNotifications(data);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [studentId]);

  return (
    <div className="flex flex-col justify-center items-center p-24">
      <h3 className="text-2xl text-green-600">
        Notifications ({notifications.length})
      </h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="list-none">
          <Card className={cn("p-6 mt-2")}>
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="mb-3 border-b-2 border-gray-400"
              >
                <div className="flex justify-center items-center flex-col gap-4">
                  {notif.message}
                  {notif.link && (
                    <div className="flex flex-row gap-2 p-4">
                      <Button>
                        <Link href={notif.link}>
                          View
                        </Link>
                      </Button>
                      <Button>
                        <Link href={notif.link}>
                          Mark as Read
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </Card>
        </ul>
      )}
    </div>
  );
}
