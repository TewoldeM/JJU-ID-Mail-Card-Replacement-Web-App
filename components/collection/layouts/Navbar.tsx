"use client";
import { useState } from "react";
import { Menu, X, Sun, Moon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/About" },
  { name: "Features", path: "/Features" },
  { name: "Steps", path: "/Steps" },
  { name: "Track Status", path: "/Status" },
  { name: "Contact", path: "/Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const pathname= usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 md:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-3xl text-foreground">
                JJU
              </span>
              <span className="font-heading text-sm text-muted-foreground block -mt-1">
                Card System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "px-6 py-2 rounded-lg text-lg font-medium transition-all duration-200",
                  pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button className="hidden md:flex" size="lg">
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="mt-4" size="lg">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
