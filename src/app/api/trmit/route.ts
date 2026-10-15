import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    const backendUrl = process.env.PUBLIC_API_URL || "https://trmit.site/api";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${backendUrl}/v1/trimit`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {

    console.log(error);
    
    return NextResponse.json(
      { message: "Error interno al acortar el enlace" },
      { status: 500 },
    );
  }
}
