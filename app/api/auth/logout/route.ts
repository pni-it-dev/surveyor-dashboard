import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await logout();
    console.log("[AUTH] User logged out");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[AUTH LOGOUT]", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 },
    );
  }
}
