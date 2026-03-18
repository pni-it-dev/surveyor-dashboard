import { NextRequest, NextResponse } from "next/server";
import { validatePasswordResetToken, resetPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate input
    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid token or password" },
        { status: 400 },
      );
    }

    // Validate token and get user ID
    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Reset password
    await resetPassword(userId, password);

    console.log("[AUTH] Password reset successful for user:", userId);

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[AUTH RESET PASSWORD]", error);
    return NextResponse.json(
      { error: "An error occurred during password reset" },
      { status: 500 },
    );
  }
}
