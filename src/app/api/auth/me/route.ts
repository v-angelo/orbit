import { getCurrentUserController } from "@/controllers/auth.controller";

export const runtime = "nodejs";

export async function GET() {
  return getCurrentUserController();
}
