import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createPasswordResetToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Always return success for security (don't reveal if email exists)
    if (userList.length === 0) {
      console.log(
        "[AUTH] Password reset requested for non-existent email:",
        email,
      );
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists, a reset link will be sent.",
        },
        { status: 200 },
      );
    }

    const user = userList[0];

    // Create password reset token
    const resetToken = await createPasswordResetToken(user.id);

    // Send email
    const emailSent = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.name ?? undefined,
    );

    console.log("[AUTH] Password reset email sent to:", user.email);

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Password reset link sent to your email."
          : "If you have email configured, a reset link will be sent. For now, contact support.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[AUTH FORGOT PASSWORD]", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
