// app/profile/UploadProfilePicture.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function UploadProfilePicture() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { user, token } = useAuth();

  const { startUpload, isUploading } = useUploadThing(
    "profilePictureUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("Profile picture upload completed:", res);
        setFile(null);
        // Optionally refresh the profile page or update UI
      },
      onUploadError: (error) => {
        console.error("Profile picture upload error:", error);
        setError("Failed to upload profile picture");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    if (!user || !token) {
      setError("You must be logged in to upload a profile picture");
      return;
    }

    try {
      await startUpload([file]);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the profile picture"
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Profile Picture</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Profile Picture"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
