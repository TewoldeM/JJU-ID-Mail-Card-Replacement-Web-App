"use client";

import { ThemeProvider } from "next-themes";
import * as React from "react";
function Roouteproviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
export default Roouteproviders;
