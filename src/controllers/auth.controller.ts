import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import User from "@/models/user.model";

import { createToken, verifyToken } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";

const COOKIE_NAME = "orbit_token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function validationErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

// Register a new user
export async function registerController(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration details.",
          errors: validationErrors(result.error.issues),
        },
        { status: 400 },
      );
    }

    const { username, email, password } = result.data;

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";

      return NextResponse.json(
        {
          success: false,
          message:
            field === "email"
              ? "An account with this email already exists."
              : "This username is already taken.",
          field,
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return the newly created account without authenticating the user
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please log in.",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "Username or email is already registered.",
        },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account.",
      },
      { status: 500 },
    );
  }
}

// Log in an existing user
export async function loginController(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid login details.",
          errors: validationErrors(result.error.issues),
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    await connectDB();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // Create a JWT and authenticate the user
    const token = await createToken(user._id.toString());

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
      },
      { status: 500 },
    );
  }
}

// Log out the current user
export async function logoutController() {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging out.",
      },
      { status: 500 },
    );
  }
}

// Get the currently authenticated user
export async function getCurrentUserController() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    // Check whether an authentication cookie exists
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    // Verify the JWT and retrieve the user ID
    const payload = await verifyToken(token);

    if (!payload) {
      await clearAuthCookie();

      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired authentication token.",
        },
        { status: 401 },
      );
    }

    await connectDB();

    // Retrieve the authenticated user
    const user = await User.findById(payload.userId);

    if (!user) {
      await clearAuthCookie();

      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
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
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get current user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while retrieving your account.",
      },
      { status: 500 },
    );
  }
}
