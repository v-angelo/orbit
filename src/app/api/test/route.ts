import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB!",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB.",
      },
      { status: 500 },
    );
  }
}
