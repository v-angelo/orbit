import { z } from "zod";

const avatarSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Please enter a valid HTTP or HTTPS image URL")
  .optional();

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

    avatar: avatarSchema,
  })
  .refine(
    (data) =>
      data.username !== undefined || data.displayName !== undefined || data.avatar !== undefined,
    {
      message: "Please provide at least one field to update.",
    },
  );

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
