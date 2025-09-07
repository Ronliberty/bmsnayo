// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const app_uuid = process.env.NEXT_PUBLIC_APP_UUID; // identify app to Django

    // forward credentials to Django login endpoint
    const res = await fetch(`${process.env.DJANGO_API_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, app_uuid }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || data || "Login failed" },
        { status: res.status }
      );
    }

    // Build the outgoing response
    const response = NextResponse.json({
      access: data.access,
      user: data.user ?? null,
      app_name: data.app_name ?? null,
    });

    // If Django returned "refresh" in JSON (legacy), move it to HttpOnly cookie
    if (data.refresh) {
      response.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/", // make cookie available app-wide
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    // If Django already set Set-Cookie, browser will handle it automatically

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
