import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                {message: "No hay sesion activa"},
                {status: 401}
            )
        }

        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://trmit.site/api";

        const response = await fetch(`${backendUrl}/v1/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });        

        if (!response.ok) {
            return NextResponse.json(
                {message: "Sesion invalida o expirada"},
                {status: 401}
            )
        }

        const data = await response.json();
        return NextResponse.json(data, {status: 200})
    } catch (error) {
        return NextResponse.json(
            {message: "Error interno al validar la sesion"},
            {status: 500}
        )
    }
    
}