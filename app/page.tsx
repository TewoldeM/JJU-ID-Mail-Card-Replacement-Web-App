"use client";
import { useEffect, useState,} from "react";
import { useRouter } from "next/navigation";
import {User } from "@prisma/client";
import Cookies from "js-cookie";
import { HeroSection } from "@/components/collection/layouts/Hero";
import { AboutSection } from "@/components/collection/layouts/sections/About";
import { FeaturesSection } from "@/components/collection/layouts/sections/FeaturesSection";
import { StepsSection } from "@/components/collection/layouts/sections/StepsSection";
import { TestimonialsSection } from "@/components/collection/layouts/sections/TestmonialSection";
import { FAQSection } from "@/components/collection/layouts/sections/FAQSection";
import { CTASection } from "@/components/collection/layouts/sections/CTASection";
import { WhyChooseSection } from "@/components/collection/layouts/sections/WhyChooseSection";
import { Footer } from "@/components/collection/layouts/Footer";

export default function UserProfile() {
  const router = useRouter();
  const [, setUser] = useState<User | null>(null);
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
      // if (!res.ok) {
      //   if (res.status === 401) {
      //     router.push("/sign-in");
      //   } else {
      //     setError(`Failed to fetch user data. Status code: ${res.status}`);
      //   }
      //   return;
      // }
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
          <div>Please wait...</div>
          <h1 className="animate-accordion-up rotate-1"></h1>
        </div>
      </div>
    ); // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error message

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StepsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}

