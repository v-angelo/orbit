import { AuthApiError, type AuthUser } from "@/services/auth.service";

export interface UserProfile extends AuthUser {
  displayName: string;
  avatar: string;
}

export interface UpdateUserProfileInput {
  username?: string;
  displayName?: string;
  avatar?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  errors?: {
    field: string;
    message: string;
  }[];
  field?: string;
}

async function userRequest(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers,
  });

  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new AuthApiError(
      data.message || "Something went wrong.",
      response.status,
      data.field,
      data.errors,
    );
  }

  return data;
}

// Retrieve the current user's profile
export async function getUserProfile(): Promise<UserProfile> {
  const data = await userRequest("/api/users/me", {
    method: "GET",
  });

  if (!data.user) {
    throw new Error("Profile response did not include a user.");
  }

  return data.user;
}

// Update the current user's profile
export async function updateUserProfile(
  input: UpdateUserProfileInput,
): Promise<{ user: UserProfile; message: string }> {
  const data = await userRequest("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  if (!data.user) {
    throw new Error("Profile update response did not include a user.");
  }

  return {
    user: data.user,
    message: data.message,
  };
}
