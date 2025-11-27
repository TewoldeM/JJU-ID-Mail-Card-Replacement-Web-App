import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the token cookie by setting it to an empty value with an immediate expiration
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error in POST /api/auth/logout:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
