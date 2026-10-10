import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await authService.register(body);

    return NextResponse.json(
      { message: "Registro exitoso", data: response.data },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error en el registro";
    return NextResponse.json({ message }, { status: 400 });
  }
}
