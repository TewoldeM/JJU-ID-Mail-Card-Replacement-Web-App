"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function VerifyApplication() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Adjust for query params

  useEffect(() => {
    if (token) {
      fetch("/api/applications/ApplicationVerify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            toast.success("Application submitted successfully!");
            router.push(`/applicationsDetail/${data.id}/Detail`);
          } else {
            toast.error(data.error || "Verification failed.");
            router.push("/dashboard");
          }
        })
        .catch(() => {
          toast.error("An error occurred during verification.");
          router.push("/dashboard");
        });
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl">Application submitted successfully</h1>
      <Button
        variant="outline"
        className={cn(
          "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
        )}
      >
        <Link href="/StudentDashboard">Go To DashBoard</Link>
      </Button>
    </div>
  );
}
