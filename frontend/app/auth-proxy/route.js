import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8001";
  
  const res = await fetch(`${backend}/api/admin-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  if (res.ok) {
    const response = NextResponse.json({ ok: true });
    // Set the cookie on the frontend domain
    response.cookies.set({
      name: 'a2z_admin',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  } else {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
