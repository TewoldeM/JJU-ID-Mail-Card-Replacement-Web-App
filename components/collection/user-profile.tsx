"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Phone, Lock, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProfileFormProps {
  user: { Email: string } | null;
  initialData: { Email: string; PhoneNumber: string };
  profilePicture: string | null;
  fetchProfilePicture: () => Promise<void>;
}

export default function ProfileForm({
  user,
  initialData,
  profilePicture,
  fetchProfilePicture,
}: ProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Email: initialData.Email,
    PhoneNumber: initialData.PhoneNumber,
    Password: "",
    ConfirmPassword: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      toast.error("You haven't made any changes");
      return;
    }

    setLoading(true);

    if (formData.Password && formData.Password !== formData.ConfirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!user) {
      toast.error("Failed to load profile data");
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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

       await response.json();
      toast.success("Profile updated successfully");

      setFormData((prev) => ({
        ...prev,
        Password: "",
        ConfirmPassword: "",
      }));

      if (formData.Email !== user.Email) {
        router.push("/sign-in");
      }
    } catch (errors) {
      toast.error("Something went wrong");
      console.log(errors);
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
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/auth/upload-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload profile picture");
      }

      toast.success("Profile picture uploaded successfully");

      setFile(null);
      await fetchProfilePicture();
    } catch (errors) {
      console.error("Upload error:", errors);
      toast.error("field to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
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
        </div>
      </CardContent>
    </Card>
  );
}
