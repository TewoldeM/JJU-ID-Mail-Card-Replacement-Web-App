"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function VerifyApplication() {
  const router = useRouter();
  const { token } = router.query;

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
      <h1 className="text-2xl">Verifying your application...</h1>
      <p>Please wait while we process your verification.</p>
    </div>
  );
}
