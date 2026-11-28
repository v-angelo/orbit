import {
  getUserProfileController,
  updateUserProfileController,
} from "@/controllers/user.controller";

export const runtime = "nodejs";

// GET /api/users/me
export async function GET() {
  return getUserProfileController();
}

// PATCH /api/users/me
export async function PATCH(request: Request) {
  return updateUserProfileController(request);
}
