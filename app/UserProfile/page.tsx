"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// Lazy-load ProfileForm to reduce initial bundle size
const ProfileForm = dynamic(
  () => import("@/components/collection/user-profile"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading form...
      </div>
    ),
  }
);

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [initialData, setInitialData] = useState({
    Email: user?.Email || "",
    PhoneNumber: user?.PhoneNumber || "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Memoize fetchProfile to prevent redefinition
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" }, // Prevent stale cache
      });
      if (response.ok) {
        const data = await response.json();
        setInitialData({
          Email: data.Email || "",
          PhoneNumber: data.PhoneNumber || "",
        });
      } else {
        throw new Error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile data", { id: "profile-error" });
      router.push("/sign-in");
    }
  }, [router]);

  // Memoize fetchProfilePicture to prevent redefinition
  const fetchProfilePicture = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/profile-picture", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePicture || null);
      } else {
        throw new Error("Failed to fetch profile picture");
      }
    } catch (error) {
      console.error("Fetch profile picture error:", error);
      toast.error("Failed to load profile picture", { id: "picture-error" });
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted || loading || !isAuthenticated) {
      if (!loading && !isAuthenticated) {
        router.push("/sign-in");
      }
      return;
    }

    const loadData = async () => {
      setFetching(true);
      try {
        await Promise.all([fetchProfile(), fetchProfilePicture()]);
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    loadData();
  }, [
    isAuthenticated,
    loading,
    fetchProfile,
    fetchProfilePicture,
    isMounted,
    router,
  ]);

  if (loading || fetching) {
    return (
      <div className="flex h-screen justify-center items-center text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <ProfileForm
        user={user}
        initialData={initialData}
        profilePicture={profilePicture}
        fetchProfilePicture={fetchProfilePicture}
      />
    </div>
  );
}
