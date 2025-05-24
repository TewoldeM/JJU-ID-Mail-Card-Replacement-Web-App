"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";

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

interface FooterProps {
  userRole: string | null;
}

const Footer: React.FC<FooterProps> = ({ userRole }) => {
  const { isAuthenticated, loading } = useAuth();
  const quickLinks = userRole === "ADMIN" ? adminItems : studentItems;

  // Prevent rendering until auth state is resolved
  if (loading) {
    return null;
  }

  return (
    <footer className="bg-white dark:bg-gray-950  text-gray-900 dark:text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.link}
                    className="text-gray-600 dark:text-white hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-white hover:text-gray-900 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-white hover:text-gray-900 transition-colors"
                aria-label="X"
              >
                <Twitter size={24} />
              </Link>
              <Link
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-white hover:text-gray-900 transition-colors"
                aria-label="Telegram"
              >
                <Send size={24} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-white hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </Link>
            </div>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-white">
              Email:{" "}
              <a
                href="mailto:support@example.com"
                className="hover:text-gray-900 transition-colors"
              >
                support@example.com
              </a>
            </p>
            <p className="text-gray-600 dark:text-white">
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="hover:text-gray-900 transition-colors"
              >
                +1 (234) 567-890
              </a>
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 dark:text-white">
            © {new Date().getFullYear()} JJU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
