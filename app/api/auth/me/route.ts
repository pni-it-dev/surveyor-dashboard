import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isDBInitialized } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Check if database is initialized
    if (!isDBInitialized()) {
      console.warn("[AUTH ME] Database not initialized");
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[AUTH ME]", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
