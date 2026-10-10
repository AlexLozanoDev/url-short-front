import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await authService.login(body);

    const responseNext = NextResponse.json(
      { user: response.data.user, message: "Autenticación exitosa" },
      { status: 200 },
    );

    responseNext.cookies.set("accessToken", response.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    if (response.data.refreshToken) {
      responseNext.cookies.set("refreshToken", response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return responseNext;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error de autenticación";
    return NextResponse.json({ message }, { status: 400 });
  }
}
