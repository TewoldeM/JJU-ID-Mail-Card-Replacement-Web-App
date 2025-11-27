"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Notification {
  id: string;
  StudentId: string; // Updated to uppercase
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  StudentId: string; // Updated to uppercase
}

export default function Notifications({ StudentId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const isMounted = useRef(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const isFetching = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    console.log("fetchNotifications - Checking conditions:", {
      token: !!token,
      StudentId,
      isAuthenticated,
      isFetching: isFetching.current,
    });

    if (!token || !StudentId || !isAuthenticated || isFetching.current) {
      if (!token || !isAuthenticated) {
        console.log(
          "fetchNotifications - No token or not authenticated, redirecting"
        );
        toast.error("Please log in to view notifications", {
          id: "auth-error",
        });
        router.push("/sign-in");
      }
      return;
    }

    isFetching.current = true;
    console.log(
      `Fetching notifications for StudentId: ${StudentId}, lastFetched: ${lastFetched?.toISOString() || "none"}`
    );

    try {
      const res = await fetch(
        `/api/notifications/${StudentId}?lastFetched=${lastFetched?.toISOString() || ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch notifications");
      }
      const data: Notification[] = await res.json();
      if (isMounted.current) {
        setNotifications(data);
        setLastFetched(new Date());
      }
    } catch  {
      console.error("Error fetching notifications:");
      toast.error("Failed to load notifications", { id: "fetch-error" });
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        isFetching.current = false;
      }
    }
  }, [StudentId, token, isAuthenticated, router, lastFetched]);

  useEffect(() => {
    isMounted.current = true;
    fetchNotifications();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPageVisible && isAuthenticated) {
      console.log("Starting polling interval");
      intervalRef.current = setInterval(() => {
        if (!isFetching.current) {
          console.log("Polling fetch triggered");
          fetchNotifications();
        }
      }, 30000);
    }

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        console.log("Clearing polling interval");
        clearInterval(intervalRef.current);
      }
    };
  }, [isPageVisible, isAuthenticated, fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!token || !isAuthenticated) {
        toast.error("Please log in to mark notifications as read", {
          id: "auth-error",
        });
        router.push("/sign-in");
        return;
      }

      const originalNotifications = [...notifications];
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

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
            errorData.error ||
              `Failed to mark notification as read: ${res.statusText}`
          );
        }

        setNotifications((prev) =>
          prev.filter((notif) => !(notif.id === notificationId && notif.read))
        );
        toast.success("Notification marked as read", { id: "read-success" });
      } catch {
        console.error("Error marking notification as read:");
        toast.error("Failed to mark notification as read", {
          id: "read-error",
        });
        setNotifications(originalNotifications);
      }
    },
    [token, isAuthenticated, router, notifications]
  );

  const renderStyledMessage = useCallback((message: string) => {
    if (message.includes("submitted successfully")) {
      const match = message.match(/Your (\w+\s+\w+) application/);
      const applicationType = match ? match[1] : "unknown";
      return (
        <>
          Your <strong className="font-bold">{applicationType}</strong>{" "}
          application has been successfully submitted. It is currently pending
          review by an administrator. Please wait for further updates.
        </>
      );
    } else if (message.includes("accepted")) {
      const match = message.match(/Your (\w+) request was accepted/);
      const applicationType = match ? match[1] : "unknown";
      const approvalCodeMatch = message.match(/Approval Code: (\S+)/);
      if (approvalCodeMatch) {
        const approvalCode = approvalCodeMatch[1];
        return (
          <>
            Your <strong className="font-bold">{applicationType}</strong>{" "}
            request was <span className="text-green-600">accepted</span>.{" "}
            <span>Approval Code:</span>{" "}
            <span className="text-green-600 font-semibold">{approvalCode}</span>
          </>
        );
      }
    } else if (message.includes("rejected")) {
      const match = message.match(/Your (\w+) request was rejected: (.+)/);
      const applicationType = match ? match[1] : "unknown";
      const reason = match ? match[2] : "";
      return (
        <>
          Your <strong className="font-bold">{applicationType}</strong> request
          was <span className="text-red-600">rejected</span>: {reason}
        </>
      );
    }
    return <>{message}</>;
  }, []);

  const formatTimestamp = useCallback((createdAt: string) => {
    return new Date(createdAt).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const getRelativeTime = useCallback((createdAt: string) => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen justify-center items-center text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading notifications...
      </div>
    );
  }

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
                          (!token || notif.read) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => markAsRead(notif.id)}
                        disabled={!token || notif.read}
                      >
                        {notif.read ? "Read" : "Mark as Read"}
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
