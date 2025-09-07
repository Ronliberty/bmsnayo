// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies(); // 👈 await here
    const refresh = cookieStore.get("refresh_token")?.value;

    // attempt to revoke / blacklist refresh token on Django
    if (refresh) {
      await fetch(`${process.env.DJANGO_API_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }).catch(() => {
        /* ignore network errors, we'll clear cookie anyway */
      });
    }

    // prepare response and clear cookie
    const res = NextResponse.json({ ok: true });
    res.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // clear everywhere
      maxAge: 0,
    });

    return res;
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
