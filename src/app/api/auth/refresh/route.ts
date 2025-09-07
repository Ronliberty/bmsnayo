// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = req.cookies; // read cookies
    const refresh = cookieStore.get("refresh_token")?.value;

    if (!refresh) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
    }

    // call Django refresh endpoint
    const res = await fetch(`${process.env.DJANGO_API_URL}/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Prepare response
    const response = NextResponse.json(
      res.ok ? { access: data.access } : { error: data.detail || "Refresh failed" },
      { status: res.status }
    );

    if (!res.ok) {
      // Clear cookie if refresh failed
      response.cookies.set("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh",
        maxAge: 0,
      });
      return response;
    }

    // If Django rotated refresh token, update it
    if (data.refresh) {
      response.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60,
      });
      delete data.refresh;
    }

    return response;
  } catch (err: any) {
    console.error("Refresh error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
