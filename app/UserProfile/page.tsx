"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Lock } from "lucide-react"; // lucide icons

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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
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
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
          router.push("/sign-in");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        router.push("/sign-in");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router, toast]);

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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
              <Label htmlFor="PhoneNumber" className="flex items-center gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
