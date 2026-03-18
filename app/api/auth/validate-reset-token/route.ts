import { NextRequest, NextResponse } from "next/server";
import { validatePasswordResetToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, userId }, { status: 200 });
  } catch (error) {
    console.error("[AUTH VALIDATE TOKEN]", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
