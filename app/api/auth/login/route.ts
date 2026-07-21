import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  constantTimeEqual,
  createAccessToken,
} from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const configuredPassword = process.env.SITE_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json(
      { error: "홈페이지 비밀번호가 아직 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const submittedPassword = typeof body?.password === "string" ? body.password : "";

  if (!submittedPassword || !constantTimeEqual(submittedPassword, configuredPassword)) {
    return NextResponse.json({ error: "비밀번호가 맞지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: await createAccessToken(configuredPassword),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
  return response;
}
