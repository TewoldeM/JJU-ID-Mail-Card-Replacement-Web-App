"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
          const profileData = {
            Email: data.Email || "",
            PhoneNumber: data.PhoneNumber || "",
            Password: "",
            ConfirmPassword: "",
          };
          setFormData(profileData);
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
        console.error("Error fetching profile:", error);
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

  const hasChanges = () => {
    return (
      formData.Email !== initialData.Email ||
      formData.PhoneNumber !== initialData.PhoneNumber ||
      formData.Password !== "" ||
      formData.ConfirmPassword !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast({
        title: "No Changes",
        description: "You haven't made any changes to your profile",
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
        description: "User data not available. Please sign in again.",
        variant: "destructive",
      });
      logout();
      router.push("/sign-in");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        Password: formData.Password || undefined,
      };

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Failed to update profile";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.error("Response is not JSON:", text);
          if (response.status === 404) {
            errorMessage = "Profile update endpoint not found";
          }
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      toast({
        title: "Success",
        description: data.message || "Profile updated successfully",
      });

      // Update initialData with the new values after successful update
      setInitialData({
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
      });

      // If Email changed, log out and redirect
      if (formData.Email !== user.Email) {
        logout();
        router.push("/sign-in");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
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
      <div className="flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="Email">Email</Label>
              <Input
                id="Email"
                name="Email"
                type="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="PhoneNumber">Phone Number</Label>
              <Input
                id="PhoneNumber"
                name="PhoneNumber"
                type="tel"
                value={formData.PhoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="Password">
                New Password (leave blank to keep current)
              </Label>
              <Input
                id="Password"
                name="Password"
                type="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Enter new Password"
              />
            </div>
            <div>
              <Label htmlFor="ConfirmPassword">Confirm New Password</Label>
              <Input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type="Password"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                placeholder="Confirm new Password"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
