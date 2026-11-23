"use client";

import { useState, type SubmitEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Orbit, UserRound } from "lucide-react";

import { useRouter } from "next/navigation";
import { AuthApiError, register } from "@/services/auth.service";

import { toast } from "sonner";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const initialValues: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>(initialValues);

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    const username = formData.username.trim().toLowerCase();
    const email = formData.email.trim().toLowerCase();

    if (username.length < 3) {
      newErrors.username = "Username must contain at least 3 characters.";
    } else if (username.length > 30) {
      newErrors.username = "Username cannot exceed 30 characters.";
    } else if (!/^[a-z0-9_]+$/.test(username)) {
      newErrors.username = "Use only lowercase letters, numbers, and underscores.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);

      toast.success(result.message);

      await new Promise((resolve) => setTimeout(resolve, 800));

      router.replace("/login");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.errors?.length) {
          // Backend validation errors
          const backendErrors: RegisterFormErrors = {};

          for (const issue of error.errors) {
            if (
              issue.field === "username" ||
              issue.field === "email" ||
              issue.field === "password"
            ) {
              backendErrors[issue.field] = issue.message;
            }
          }

          setErrors((prev) => ({
            ...prev,
            ...backendErrors,
          }));
        } else if (error.field === "username" || error.field === "email") {
          // Duplicate username or email
          toast.error(error.message);
        } else {
          // Other API errors
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    {
      label: "At least 6 characters",
      met: formData.password.length >= 6,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
            <Orbit size={25} strokeWidth={2.2} />
          </div>

          <span className="text-3xl font-bold tracking-tight text-accent">Orbit</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>

        <p className="mt-2 text-sm text-muted">
          Join Orbit and start connecting with your community.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
              Username
            </label>

            <div className="group relative">
              <UserRound
                size={18}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
              />

              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => updateField("username", e.target.value)}
                className={`w-full rounded-xl border bg-background py-3 pr-4 pl-11 text-sm transition-all outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15 ${
                  errors.username ? "border-danger" : "border-border"
                }`}
              />
            </div>

            {errors.username && <p className="mt-1.5 text-xs text-danger">{errors.username}</p>}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>

            <div className="group relative">
              <Mail
                size={18}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={`w-full rounded-xl border bg-background py-3 pr-4 pl-11 text-sm transition-all outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15 ${
                  errors.email ? "border-danger" : "border-border"
                }`}
              />
            </div>

            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="group relative">
              <LockKeyhole
                size={18}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`w-full rounded-xl border bg-background py-3 pr-12 pl-11 text-sm transition-all outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15 ${
                  errors.password ? "border-danger" : "border-border"
                }`}
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password}</p>}

            <div className="mt-2 space-y-1">
              {passwordRequirements.map((requirement) => (
                <div
                  key={requirement.label}
                  className={`flex items-center gap-2 text-xs ${
                    requirement.met ? "text-success" : "text-muted"
                  }`}
                >
                  <Check size={13} />
                  {requirement.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants}>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
              Confirm password
            </label>

            <div className="group relative">
              <LockKeyhole
                size={18}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-accent"
              />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={`w-full rounded-xl border bg-background py-3 pr-12 pl-11 text-sm transition-all outline-none placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15 ${
                  errors.confirmPassword ? "border-danger" : "border-border"
                }`}
              />

              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.015 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/15 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}

              {!isLoading && (
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Login Link */}
      <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Log in
        </a>
      </motion.p>

      <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-muted/70">
        By creating an account, you agree to Orbit&apos;s Terms of Service and Privacy Policy.
      </motion.p>
    </motion.div>
  );
}
