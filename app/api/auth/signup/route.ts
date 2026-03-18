import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid email or password (min 8 characters)" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || undefined,
      })
      .returning();

    console.log("[AUTH] User created:", newUser.email);

    // Send welcome email
    await sendWelcomeEmail(newUser.email, newUser.name);

    // Create session
    const sessionToken = await createSession(newUser.id);

    // Set session cookie
    await setSessionCookie(sessionToken);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[AUTH SIGNUP]", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 },
    );
  }
}
