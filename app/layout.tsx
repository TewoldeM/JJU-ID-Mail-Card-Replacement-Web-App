import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Roouteproviders from "@/components/collection/layouts/RooutProvider";
import Footer from "@/components/collection/layouts/Footer";
import ServerNavbar from "./UserProfile/Navbarfetchuser/page";
import Providers from "@/components/collection/Providers/Providers";
import { Toaster } from "react-hot-toast";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the app
export const metadata: Metadata = {
  title: "JJU Id-Mail Card Management System",
  description: "Developed by Tewolde Marie",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ServerNavbar />
          <Roouteproviders>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 5000,
                style: {
                  borderRadius: "8px",
                  padding: "16px",
                  fontSize: "16px",
                },
                success: {
                  style: {
                    background: "#10B981", // Original green background
                    color: "#BBF7D0", // Light green text
                    border: "1px solid #059669",
                  },
                  iconTheme: {
                    primary: "#FFFFFF", // White icon for success
                    secondary: "#10B981",
                  },
                },
                error: {
                  style: {
                    background: "#EF4444", // Original red background
                    color: "#FECACA", // Light red text
                    border: "1px solid #DC2626",
                  },
                  iconTheme: {
                    primary: "#FCA5A5", // Light red icon (red-300)
                    secondary: "#EF4444", // Matches the background
                  },
                  className: "error-toast",
                },
              }}
            />

            {children}
            <Footer />
          </Roouteproviders>
        </Providers>
      </body>
    </html>
  );
}
