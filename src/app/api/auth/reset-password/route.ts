// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // expects {uid, token, new_password, re_new_password}
    const res = await fetch(`${process.env.DJANGO_API_URL}/auth/users/reset_password_confirm/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500});
  }
}
