"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Role, User } from "@prisma/client";
import Cookies from "js-cookie";
import HeroImageslaider from "@/components/collection/layouts/HeroImageslaider";
import AboutTheWebApp from "@/components/collection/layouts/About";
import GuideSteps from "@/components/collection/GuideSteps";
import { Separator } from "@/components/ui/separator";
import { SpotlightPreview } from "@/components/collection/Acentry/SpotLight";
// import { SpotlightPreview } from "@/components/collection/Acentry/SpotLight";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Use fetch to get the token from server-side API
      const res = await fetch("/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/sign-in");
        } else {
          setError(`Failed to fetch user data. Status code: ${res.status}`);
        }
        return;
      }
      const userData = await res.json();
      console.log("userData", userData);
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [router, token]); // Fetch user data only when token changes 0933 47 24 10

  useEffect(() => {
    const fetchToken = async () => {
      const token = await Cookies.get("token");
      setToken(token || null);
    };
    fetchToken();
  }, []); // Fetch token only once on mount

  if (loading)
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <div>
          {/* <img src="/wait.jpg" alt="Loading" width="300" height="300" /> */}
          <div>Please wait...</div>
          <h1 className="animate-accordion-up rotate-1"></h1>
        </div>
      </div>
    ); // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <>
      <SpotlightPreview />
      <Separator />
      <GuideSteps />
      <Separator />
      <AboutTheWebApp />
      <Separator />
    </>
  );
}
{
  /* <div>Welcome, {user?.FirstName}</div>
      <div>Student ID: {user?.studentId}</div>
      <div>Email: {user?.email}</div> */
}
