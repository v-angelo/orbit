import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/models/user.model";

import { verifyToken } from "@/lib/auth";
import { updateUserProfileSchema } from "@/schemas/user.schema";

const COOKIE_NAME = "orbit_token";

// Retrieve the authenticated user
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  await connectDB();

  const user = await User.findById(payload.userId);

  return user;
}

// Check for MongoDB duplicate key errors
function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

// Retrieve the current user's profile
export async function getUserProfileController() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          displayName: user.displayName || user.username,
          email: user.email,
          avatar: user.avatar || "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while retrieving your profile.",
      },
      { status: 500 },
    );
  }
}

// Update the current user's profile
export async function updateUserProfileController(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();

    const result = updateUserProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid profile details.",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { username, displayName } = result.data;

    // Check whether the requested username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "This username is already taken.",
            field: "username",
          },
          { status: 409 },
        );
      }
    }

    // Apply the profile updates
    if (username !== undefined) {
      user.username = username;
    }

    if (displayName !== undefined) {
      user.displayName = displayName;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: user._id.toString(),
          username: user.username,
          displayName: user.displayName || user.username,
          email: user.email,
          avatar: user.avatar || "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken.",
          field: "username",
        },
        { status: 409 },
      );
    }

    console.error("Update user profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating your profile.",
      },
      { status: 500 },
    );
  }
}
