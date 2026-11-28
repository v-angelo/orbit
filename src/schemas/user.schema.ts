import { z } from "zod";

export const updateUserProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must contain at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .optional(),

    displayName: z
      .string()
      .trim()
      .min(1, "Display name cannot be empty")
      .max(50, "Display name cannot exceed 50 characters")
      .optional(),
  })
  .refine((data) => data.username !== undefined || data.displayName !== undefined, {
    message: "Please provide at least one field to update.",
  });

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
