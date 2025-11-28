import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";


interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={null} />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
     <Footer />
    </div>
  );
}
