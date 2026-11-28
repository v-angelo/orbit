"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { motion } from "motion/react";
import { Camera, LoaderCircle, Mail, Save, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { getUserProfile, updateUserProfile, type UserProfile } from "@/services/user.service";
import { AuthApiError } from "@/services/auth.service";

interface ProfileFormData {
  username: string;
  displayName: string;
  avatar: string;
}

type ProfileField = keyof ProfileFormData;

export default function MyAccountSettings() {
  const { setUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    displayName: "",
    avatar: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfileField, string>>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAvatarPreviewError, setHasAvatarPreviewError] = useState(false);

  // Load the current user's profile
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const user = await getUserProfile();

        if (!isMounted) return;

        setProfile(user);
        setFormData({
          username: user.username,
          displayName: user.displayName || user.username,
          avatar: user.avatar || "",
        });

        setUser(user);
      } catch (error) {
        if (!isMounted) return;

        toast.error(error instanceof Error ? error.message : "Unable to load your profile.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Reset the preview error whenever the avatar URL changes
  useEffect(() => {
    setHasAvatarPreviewError(false);
  }, [formData.avatar]);

  // Update a form field
  function handleChange(field: ProfileField, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  // Save profile changes
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setIsSaving(true);

    try {
      const { user, message } = await updateUserProfile({
        username: formData.username,
        displayName: formData.displayName,
        avatar: formData.avatar.trim(),
      });

      setProfile(user);
      setFormData({
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar || "",
      });

      // Keep the sidebar and other components in sync
      setUser(user);

      toast.success(message);
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.errors?.length) {
          const errors: Partial<Record<ProfileField, string>> = {};

          error.errors.forEach(({ field, message }) => {
            if (field === "username" || field === "displayName" || field === "avatar") {
              errors[field] = message;
            }
          });

          setFieldErrors(errors);
        } else if (
          error.field === "username" ||
          error.field === "displayName" ||
          error.field === "avatar"
        ) {
          setFieldErrors({
            [error.field]: error.message,
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(error instanceof Error ? error.message : "Unable to update your profile.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const avatarUrl = formData.avatar.trim();

  const hasChanges =
    !!profile &&
    (formData.username !== profile.username ||
      formData.displayName !== profile.displayName ||
      formData.avatar !== (profile.avatar || ""));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface py-16">
        <LoaderCircle size={22} className="animate-spin text-accent" />
        <span className="ml-3 text-sm text-muted">Loading your profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">
          We couldn't load your profile. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Profile Information */}
      <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground">Profile Information</h3>
          <p className="mt-1 text-sm text-muted">Update your public profile information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-accent-soft">
                {avatarUrl && !hasAvatarPreviewError ? (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt="Your profile avatar preview"
                    className="size-full object-cover"
                    onError={() => setHasAvatarPreviewError(true)}
                  />
                ) : (
                  <UserRound size={34} className="text-accent" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Profile Picture</p>
                <p className="mt-1 text-xs text-muted">
                  Your avatar is visible to other Orbit users.
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <Camera size={13} />
                  Preview updates as you enter a URL.
                </p>
              </div>
            </div>

            <label htmlFor="avatar" className="mb-2 block text-sm font-medium text-foreground">
              Avatar Image URL
            </label>

            <div
              className={`flex items-center overflow-hidden rounded-lg border bg-background transition-colors focus-within:border-accent ${
                fieldErrors.avatar ? "border-danger" : "border-border"
              }`}
            >
              <input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(event) => handleChange("avatar", event.target.value)}
                aria-invalid={!!fieldErrors.avatar}
                className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted"
                placeholder="https://example.com/avatar.jpg"
              />

              {formData.avatar && (
                <button
                  type="button"
                  onClick={() => handleChange("avatar", "")}
                  aria-label="Remove avatar URL"
                  title="Remove avatar"
                  className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {fieldErrors.avatar && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.avatar}</p>
            )}

            {!fieldErrors.avatar && hasAvatarPreviewError && avatarUrl && (
              <p className="mt-1.5 text-xs text-warning">
                This image couldn't be loaded. Check the URL before saving.
              </p>
            )}

            <p className="mt-1.5 text-xs text-muted">
              Enter a direct image URL beginning with http:// or https://. Leave it empty to use the
              default avatar.
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-foreground">
              Display Name
            </label>

            <input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(event) => handleChange("displayName", event.target.value)}
              maxLength={50}
              aria-invalid={!!fieldErrors.displayName}
              className={`w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted focus:border-accent ${
                fieldErrors.displayName ? "border-danger" : "border-border"
              }`}
              placeholder="Enter your display name"
            />

            {fieldErrors.displayName && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.displayName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
              Username
            </label>

            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-background transition-colors focus-within:border-accent">
              <span className="border-r border-border px-3.5 py-2.5 text-sm text-muted">@</span>

              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(event) => handleChange("username", event.target.value)}
                minLength={3}
                maxLength={30}
                aria-invalid={!!fieldErrors.username}
                className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted"
                placeholder="username"
              />
            </div>

            {fieldErrors.username && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.username}</p>
            )}

            <p className="mt-1.5 text-xs text-muted">
              Usernames must be 3–30 characters and can contain lowercase letters, numbers, and
              underscores.
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
              Email Address
            </label>

            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-surface-hover/50">
              <Mail size={16} className="ml-3.5 shrink-0 text-muted" />

              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-muted outline-none"
              />
            </div>

            <p className="mt-1.5 text-xs text-muted">Email changes are not available yet.</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-border pt-5">
            <button
              type="submit"
              disabled={isSaving || !hasChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}

              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </motion.div>
  );
}
