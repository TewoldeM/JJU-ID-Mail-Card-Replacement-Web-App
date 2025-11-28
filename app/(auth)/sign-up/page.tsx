"use client";

import Auth from "@/components/collection/Auth/auth";


export default function SignupPage() {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <Auth defaultMode="signup" />;
    </div>
  );
}
