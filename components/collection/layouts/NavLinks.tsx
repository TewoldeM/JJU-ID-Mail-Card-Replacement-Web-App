"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string; // Next.js does not have pending state, but kept for compatibility
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    { href, className, activeClassName, pendingClassName, children, ...props },
    ref
  ) => {
    const pathname = usePathname();

    const isActive = pathname === href;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          className,
          isActive && activeClassName
          // pendingClassName intentionally not used (Next.js has no pending state)
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
