import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "A5xj97s5GiJHD0518ZI02XjZPQU328";

const adminRoutes = [
  "/Admin/add-student",
  "/Admin/students",
  "/Admin/adminlandingpage",
  "/Admin/AdminDashboard",
  "/Admin/applications",
];

const studentRoutes = [
  "/applications/IdCardReplacement",
  "/applications/MailCardReplacement",
  "/StudentDashboard",
  "/applications/:path*",
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const unprotectedRoutes = ["/sign-in", "/sign-up"];
  if (
    unprotectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  if (!token) {
    console.warn("No token found, redirecting to /sign-in");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 1 });
    const userRoles = (payload as JWTPayload & { Roles: string[] }).Roles || [];
    const isAdmin = userRoles.includes("ADMIN");
    const isAdminRoute = adminRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route.replace(":path*", ""))
    );
    const isStudentRoute = studentRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route.replace(":path*", ""))
    );


    if (isAdminRoute) {
      if (isAdmin) return NextResponse.next();
      console.warn("Non-admin tried to access admin route");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isStudentRoute) {
      if (!isAdmin) return NextResponse.next();
      console.warn("Admin tried to access student route");
      return NextResponse.redirect(new URL("/Admin/AdminDashboard", req.url));
    }

    return NextResponse.next();
  } catch (jwtError) {
    console.error("JWT verification failed:", jwtError);
    // Fallback to /api/auth/me
    const response = await fetch(`${req.nextUrl.origin}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.warn("Token validation failed via /api/auth/me");
      // Instead of redirecting, let AuthContext handle it
      return NextResponse.next();
    }

    const userData = await response.json();
    const isAdmin = userData.Roles?.some(
      (role: { name: string }) => role.name === "ADMIN"
    );
    const isAdminRoute = adminRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route.replace(":path*", ""))
    );
    const isStudentRoute = studentRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route.replace(":path*", ""))
    );

    console.log(
      "Fallback - isAdmin:",
      isAdmin,
      "isAdminRoute:",
      isAdminRoute,
      "isStudentRoute:",
      isStudentRoute
    );

    if (isAdminRoute) {
      if (isAdmin) return NextResponse.next();
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isStudentRoute) {
      if (!isAdmin) return NextResponse.next();
      return NextResponse.redirect(new URL("/Admin/AdminDashboard", req.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/Admin/:path*", "/AdminDashboard/:path*", "/applications/:path*"],
};
