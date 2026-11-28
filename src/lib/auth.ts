import { SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/models/user.model";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Please define JWT_SECRET environment variable!");
  }

  return new TextEncoder().encode(secret);
}

// Generate a JWT for an authenticated user
export async function createToken(userId: string): Promise<string> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getJwtSecret());

  return token;
}

// Verify a JWT and retrieve the authenticated user's ID
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    if (!payload.sub) {
      return null;
    }

    return {
      userId: payload.sub,
    };
  } catch {
    return null;
  }
}

// Retrieve the currently authenticated user
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("orbit_token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    await connectDB();

    const user = await User.findById(payload.userId).select(
      "_id username email displayName avatar",
    );

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      avatar: user.avatar || "",
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
