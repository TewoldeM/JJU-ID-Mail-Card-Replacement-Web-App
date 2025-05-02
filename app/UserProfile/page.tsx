"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Lock, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    Email: "",
    PhoneNumber: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [initialData, setInitialData] = useState({
    Email: "",
    PhoneNumber: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Send cookies
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          Email: data.Email || "",
          PhoneNumber: data.PhoneNumber || "",
          Password: "",
          ConfirmPassword: "",
        });
        setInitialData({
          Email: data.Email || "",
          PhoneNumber: data.PhoneNumber || "",
        });
      } else {
        throw new Error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
      router.push("/sign-in");
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch("/api/auth/profile-picture", {
        credentials: "include", // Send cookies
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () =>
    formData.Email !== initialData.Email ||
    formData.PhoneNumber !== initialData.PhoneNumber ||
    formData.Password !== "" ||
    formData.ConfirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges()) {
      toast({
        title: "No Changes",
        description: "You haven't made any changes",
        variant: "default",
      });
      return;
    }

    setLoading(true);

    if (formData.Password && formData.Password !== formData.ConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please sign in again.",
        variant: "destructive",
      });
      logout();
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies
        body: JSON.stringify({
          Email: formData.Email,
          PhoneNumber: formData.PhoneNumber,
          Password: formData.Password || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Profile update failed");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: data.message || "Profile updated successfully",
      });

      setInitialData({
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
      });

      if (formData.Email !== user.Email) {
        logout();
        router.push("/sign-in");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in to upload a profile picture",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/auth/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include", // Send cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload profile picture");
      }

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
      setFile(null);
      await fetchProfilePicture(); // Refresh profile picture
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-screen justify-center items-center text-gray-500 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col space-y-4">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Profile Picture
              </Label>
              {profilePicture ? (
                <div className="relative w-32 h-32">
                  <Image
                    src={profilePicture}
                    alt="Profile Picture"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image
                  </span>
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="dark:text-gray-100 border border-gray-500"
                />
                <Button
                  onClick={handleFileUpload}
                  disabled={uploading || !file}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : null}
                  {uploading ? "Uploading..." : "Upload Profile Picture"}
                </Button>
              </div>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  id="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="PhoneNumber"
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Phone Number
                </Label>
                <Input
                  id="PhoneNumber"
                  name="PhoneNumber"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="Password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> New Password
                </Label>
                <Input
                  id="Password"
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                <Input
                  id="ConfirmPassword"
                  name="ConfirmPassword"
                  type="password"
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
