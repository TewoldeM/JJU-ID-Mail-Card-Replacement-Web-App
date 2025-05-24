"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, LogOutIcon, Menu, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Logo from "./Logo";
import { ThemeSwicherButton } from "./ThemeSwicherButton";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// Navigation items for students
const studentItems = [
  { label: "Card Replacement", link: "/applications/IdandMailCardReplacement" },
  { label: "Dashboard", link: "/StudentDashboard" },
  { label: "About", link: "/About" },
  { label: "Contact", link: "/Contact" },
];

// Navigation items for admins
const adminItems = [
  { label: "Admin Dashboard", link: "/Admin/AdminDashboard" },
  { label: "Manage Student", link: "/Admin/AdminDashboard/ManageStudents" },
  { label: "Applications", link: "/Admin/Applications-Data-Table" },
];

interface NavbarProps {
  userRole: string | null;
}

const Navbar = ({ userRole }: NavbarProps) => {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Fetch profile picture when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfilePicture = async () => {
        try {
          const response = await fetch("/api/auth/profile-picture", {
            credentials: "include", // Send cookies
          });
          if (response.ok) {
            const data = await response.json();
            setProfilePicture(data.profilePicture || null);
          }
        } catch (error) {
          console.error("Fetch profile picture error:", error);
        }
      };
      fetchProfilePicture();
    }
  }, [isAuthenticated]);

  // Prevent rendering until auth state is resolved
  if (loading) {
    return null; // Or a loading spinner: <div>Loading...</div>
  }

  return (
    <>
      <DesktopNavBar
        isAuthenticated={isAuthenticated}
        logout={logout}
        userRole={userRole}
        profilePicture={profilePicture}
      />
      <MobileNavBar
        isAuthenticated={isAuthenticated}
        logout={logout}
        userRole={userRole}
        profilePicture={profilePicture}
      />
    </>
  );
};

// Mobile Navbar Component
function MobileNavBar({
  isAuthenticated,
  logout,
  userRole,
  profilePicture,
}: {
  isAuthenticated: boolean;
  logout: () => void;
  userRole: string | null;
  profilePicture: string | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const items = userRole === "ADMIN" ? adminItems : studentItems;

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-2 gap-0 py-4">
        {/* Logo */}
        <div className="flex h-[80px] min-h-[60px] items-center justify-center">
          <Logo />
        </div>
        <div className="flex flex-row gap-2 justify-center items-center">
          {/* Authentication Buttons */}
          <div className="flex flex-col gap-0">
            {isAuthenticated ? (
              <>
                {userRole === "STUDENT" && <BellRing className="" size={20} />}
              </>
            ) : (
              <div className="flex flex-row gap-1">
                <Link
                  href="/sign-in"
                  className={cn("text-lg font-medium dark:text-white")}
                >
                  <Button
                    className={cn(
                      "dark:bg-green-900 dark:hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md dark:border-green-800 border-green-600 hover:border-2 bg-green-800 hover:bg-green-900"
                    )}
                  >
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <ThemeSwicherButton />
          {/* Sidebar Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-gray-500">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[400px] sm:w-[540px] flex flex-col items-start"
              side="left"
            >
              <VisuallyHidden>
                <DialogTitle>Navigation Menu</DialogTitle>
              </VisuallyHidden>
              <SheetDescription>
                {/* Empty description to satisfy accessibility */}
              </SheetDescription>
              <div className="flex flex-col gap-4 pt-4 w-full">
                {items.map((item) => (
                  <NavbarItems
                    key={item.label}
                    label={item.label}
                    link={item.link}
                  />
                ))}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4 w-full">
                    <Link
                      href="/UserProfile"
                      className={cn(
                        "text-lg text-muted-foreground hover:text-foreground rounded-md",
                        usePathname() === "/UserProfile" &&
                          "text-foreground font-medium"
                      )}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className={cn(
                        "text-lg text-muted-foreground hover:text-foreground rounded-md text-left"
                      )}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className={cn(
                      "text-lg text-muted-foreground hover:text-foreground rounded-md"
                    )}
                  >
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}

// Desktop Navbar Component
function DesktopNavBar({
  isAuthenticated,
  logout,
  userRole,
  profilePicture,
}: {
  isAuthenticated: boolean;
  logout: () => void;
  userRole: string | null;
  profilePicture: string | null;
}) {
  const router = useRouter();
  const items = userRole === "ADMIN" ? adminItems : studentItems;

  return (
    <div className="hidden border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8 py-4">
        {/* Left Side: Logo and Navigation Items */}
        <div className="flex h-[100px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex gap-4">
            {items.map((item) => (
              <NavbarItems
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Authentication Buttons */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {userRole === "STUDENT" && (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/StudentDashboard/Notfications")}
                  className="rounded-md shadow-md border-2 dark:border-gray-700"
                >
                  <BellRing className="dark:bg-gray-900" size={25} />
                </Button>
              )}
              <Link href="/UserProfile">
                {profilePicture ? (
                  <div className="relative w-12 h-9">
                    <Image
                      src={profilePicture}
                      alt="Profile Picture"
                      fill
                      className="rounded-sm object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <User size={25} />
                )}
              </Link>
              <Button
                onClick={logout}
                className="border-red-500 bg-red-500 text-white hover:bg-red-900 dark:hover:bg-red-700 hover:text-white"
              >
                <LogOutIcon size={25} />
              </Button>
            </>
          ) : (
            <div className="flex flex-row gap-4">
              <Button
                variant={"outline"}
                className={cn(
                  "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
                )}
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                variant={"outline"}
                className={cn(
                  "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
                )}
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Theme Switcher */}
          <ThemeSwicherButton />
        </div>
      </nav>
    </div>
  );
}

// Navbar Item Component
function NavbarItems({ label, link }: { label: string; link: string }) {
  const pathname = usePathname();

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          "text-lg text-muted-foreground hover:text-foreground rounded-md",
          pathname === link && "text-foreground font-medium"
        )}
      >
        {label}
      </Link>
    </div>
  );
}

export default Navbar;
