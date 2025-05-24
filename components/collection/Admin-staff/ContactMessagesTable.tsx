"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import * as Dialog from "@radix-ui/react-dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "PENDING" | "READ" | "RESOLVED";
  createdAt: string;
}

interface ApiResponse {
  messages: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ContactMessagesTable() {
  const [data, setData] = useState<ApiResponse>({
    messages: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const { token, isAuthenticated, login } = useAuth();

  const refetchToken = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Refetched token:", data.token); // Debug
        login(data.token, data.refreshToken);
        return data.token;
      } else {
        throw new Error("Failed to refetch token");
      }
    } catch (err) {
      console.error("Error refetching token:", err);
      setError("Failed to authenticate. Please log in again.");
      return null;
    }
  };

  useEffect(() => {
    console.log("Auth token:", token, "isAuthenticated:", isAuthenticated); // Debug
    if (isAuthenticated && !token) {
      console.log("Token undefined, attempting to refetch"); // Debug
      refetchToken().then((newToken) => {
        if (newToken) {
          setAuthLoading(false);
        } else {
          setAuthLoading(false);
          setError("You must be logged in to view messages.");
        }
      });
    } else if (isAuthenticated && token) {
      setAuthLoading(false);
    } else {
      setAuthLoading(false);
      setError("You must be logged in to view messages.");
    }
  }, [token, isAuthenticated, login]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        limit: data.limit.toString(),
      });
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const response = await fetch(
        `/api/auth/admin/contact-messages?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        }
        throw new Error(errorData.error || "Failed to fetch messages");
      }
      const result: ApiResponse = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load messages. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: "READ" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mark as read");
      }
      setData((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === id ? { ...msg, status: "READ" } : msg
        ),
      }));
    } catch (err: any) {
      setError(err.message || "Failed to mark message as read.");
      console.error("Mark as read error:", err);
    }
  };

  const sendResponse = async (id: string, message: string) => {
    setResponseLoading(true);
    setResponseError(null);
    try {
      const response = await fetch(
        `/api/auth/admin/contact-messages/${id}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ message }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send response");
      }
      setSelectedMessage(null);
      setResponseMessage("");
      fetchMessages();
    } catch (err: any) {
      setResponseError(err.message || "Failed to send response.");
      console.error("Send response error:", err);
    } finally {
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token && !authLoading) {
      fetchMessages();
    }
  }, [data.page, statusFilter, token, isAuthenticated, authLoading]);

  const handlePageChange = (newPage: number) => {
    setData((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <div className="mb-4">
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="READ">Read</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {authLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-mono">
                    {message.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {message.message}
                  </TableCell>
                  <TableCell>{message.status}</TableCell>
                  <TableCell>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {message.status !== "READ" &&
                      message.status !== "RESOLVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(message.id)}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                      disabled={loading}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button
              disabled={data.page === 1 || loading}
              onClick={() => handlePageChange(data.page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {data.page} of {data.totalPages}
            </span>
            <Button
              disabled={data.page === data.totalPages || loading}
              onClick={() => handlePageChange(data.page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Dialog.Root
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-bold">
              Respond to
              <span className="text-green-300 font-semibold  ml-2">
                {selectedMessage?.name}
              </span>
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-lg">
              Send a response to <span className="dark:text-gray-300 font-semibold">{selectedMessage?.email}</span>
            </Dialog.Description>
            <div className="mt-4">
              <textarea
                className="w-full h-32 border rounded p-2 dark:bg-gray-950 dark:text-white"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response here..."
              />
              {responseError && (
                <p className="text-red-500 mt-2">{responseError}</p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline" disabled={responseLoading}>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  onClick={() =>
                    selectedMessage &&
                    sendResponse(selectedMessage.id, responseMessage)
                  }
                  disabled={responseLoading || !responseMessage.trim()}
                >
                  {responseLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Sending...
                    </div>
                  ) : (
                    "Send Response"
                  )}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
