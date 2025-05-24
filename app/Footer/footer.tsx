"use client";
import Footer from "@/components/collection/layouts/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Footerpage() {
  const { user } = useAuth(); // assuming user object contains role

  return (
    <>
      {/* other page content */}
      <Footer userRole={user?.role ?? null} />
    </>
  );
}
