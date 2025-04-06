import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Roouteproviders from "@/components/collection/layouts/RooutProvider";
import Footer from "@/components/collection/layouts/Footer";
import ServerNavbar from "./UserProfile/Navbarfetchuser/page";
import Providers from "@/components/collection/Providers/Providers";

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
            {children}
            <Footer />
          </Roouteproviders>
        </Providers>
      </body>
    </html>
  );
}
