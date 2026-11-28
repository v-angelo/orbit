export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
}

interface ApiValidationError {
  field: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: ApiValidationError[];
  field?: string;
}

export class AuthApiError extends Error {
  status: number;
  field?: string;
  errors?: ApiValidationError[];

  constructor(message: string, status: number, field?: string, errors?: ApiValidationError[]) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.field = field;
    this.errors = errors;
  }
}

async function authRequest(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
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

// Register a new user
export async function register(
  username: string,
  email: string,
  password: string,
): Promise<{ user: AuthUser; message: string }> {
  const data = await authRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  if (!data.user) {
    throw new Error("Registration response did not include a user.");
  }

  return {
    user: data.user,
    message: data.message,
  };
}

// Log in an existing user
export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; message: string }> {
  const data = await authRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data.user) {
    throw new Error("Login response did not include a user.");
  }

  return {
    user: data.user,
    message: data.message,
  };
}

// Log out the current user
export async function logout(): Promise<void> {
  await authRequest("/api/auth/logout", {
    method: "POST",
  });
}

// Retrieve the currently authenticated user
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = await authRequest("/api/auth/me", {
      method: "GET",
    });

    return data.user ?? null;
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}
