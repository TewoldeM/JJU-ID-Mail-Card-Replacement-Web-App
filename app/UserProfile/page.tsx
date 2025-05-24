"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProfileForm from "@/components/collection/user-profile";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [initialData, setInitialData] = useState({
    Email: "",
    PhoneNumber: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
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
      toast.error("Failed to load profile data");
      router.push("/sign-in");
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch("/api/auth/profile-picture", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePicture || null);
      } else {
        throw new Error("Failed to fetch profile picture");
      }
    } catch (error) {
      console.error("Fetch profile picture error:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const loadData = async () => {
      setFetching(true);
      try {
        await Promise.all([fetchProfile(), fetchProfilePicture()]);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [isAuthenticated, router]);

  if (fetching) {
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
