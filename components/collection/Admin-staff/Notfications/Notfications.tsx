"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  StudentId: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  StudentId: string;
}

export default function Notifications({ StudentId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token || !StudentId) {
        toast.error("Please log in to view notifications");
        router.push("/sign-in");
        return;
      }

      try {
        const res = await fetch(`/api/notifications/${StudentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch notifications");
        }
        const data: Notification[] = await res.json();
        setNotifications(data);
      } catch (error: any) {
        console.error("Error fetching notifications:", error.message);
        toast.error("Failed to load notifications");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refreshes every 10 seconds
    return () => clearInterval(interval);
  }, [StudentId, token, router]);

  const markAsRead = async (notificationId: string) => {
    if (!token) {
      toast.error("Please log in to mark notifications as read");
      router.push("/sign-in");
      return;
    }

    try {
      const res = await fetch(
        `/api/notifications/notificationRead/${notificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ read: true }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to mark notification as read: ${
            errorData.error || res.statusText
          } (Status: ${res.status})`
        );
      }

      setNotifications((prevNotifications) =>
        prevNotifications
          .map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
          .filter((notif) => !notif.read)
      );
      toast.success("Notification marked as read");
    } catch (error: any) {
      console.error("Error marking notification as read:", error.message);
      toast.error("Failed to mark notification as read");
    }
  };

  // Function to render styled notification message
  const renderStyledMessage = (message: string) => {
    const parts = message.split(" ");
    const isSubmission = message.includes("submitted successfully");
    const isAcceptance = message.includes("accepted");
    const isRejection = message.includes("rejected");

    if (isSubmission) {
      const applicationTypeIndex = parts.indexOf("application") - 1;
      const applicationType = parts
        .slice(1, applicationTypeIndex + 1)
        .join(" ");
      return (
        <>
          Your <strong className="font-bold">{applicationType}</strong>{" "}
          application has been successfully submitted. It is currently pending
          review by an administrator. Please wait for further updates.
        </>
      );
    } else if (isAcceptance) {
      const applicationTypeIndex = parts.indexOf("request") - 1;
      const applicationType = parts[applicationTypeIndex];
      const status = parts[parts.indexOf("was") + 1];
      const hasApprovalCode = message.includes("Approval Code:");
      if (hasApprovalCode) {
        const approvalCodeMatch = message.match(/Approval Code: (\S+)/);
        const approvalCode = approvalCodeMatch ? approvalCodeMatch[1] : "";
        const baseMessage = message.split(". Approval Code:")[0];
        return (
          <>
            Your <strong className="font-bold">{applicationType}</strong>{" "}
            request was <span className="text-green-600">{status}</span>{" "}
            {baseMessage.split(" ").slice(5).join(" ")}.{" "}
            <span>Approval Code:</span>{" "}
            <span className="text-green-600 font-semibold">{approvalCode}</span>
          </>
        );
      }
    } else if (isRejection) {
      const applicationTypeIndex = parts.indexOf("request") - 1;
      const applicationType = parts[applicationTypeIndex];
      const status = parts[parts.indexOf("was") + 1];
      const reason = message.split(":")[1]?.trim() || "";
      return (
        <>
          Your <strong className="font-bold">{applicationType}</strong> request
          was <span className="text-red-600">{status}</span>: {reason}
        </>
      );
    }
    return <>{message}</>;
  };

  // Function to format the full timestamp
  const formatTimestamp = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // e.g., "April 7, 2025, 12:34 PM"
  };

  // Function to calculate relative time
  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffMs = now.getTime() - notificationTime.getTime(); // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "Now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-2 min-h-screen -mt-14 md:-mt-32">
      <h3 className="text-2xl text-green-600 mb-4">
        Notifications ({notifications.length})
      </h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul
          className={cn(
            "list-none w-full max-w-lg",
            notifications.length > 2 && "max-h-[400px] overflow-y-auto"
          )}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            {notifications.map((notif) => (
              <li key={notif.id} className="mb-3 w-full">
                <Card className="flex justify-center items-center flex-col gap-4 px-4 py-4">
                  <div className="text-center">
                    <h1 className="text-muted-foreground w-96">
                      {renderStyledMessage(notif.message)}
                    </h1>
                    <p className="text-foreground font-semibold mt-1">
                      {formatTimestamp(notif.createdAt)} (
                      {getRelativeTime(notif.createdAt)})
                    </p>
                  </div>
                  {notif.link && (
                    <div className="flex flex-row gap-2 p-4">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
                        )}
                      >
                        <Link href={notif.link}>View</Link>
                      </Button>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md",
                          !token && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => markAsRead(notif.id)}
                        disabled={!token}
                      >
                        Mark as Read
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}
