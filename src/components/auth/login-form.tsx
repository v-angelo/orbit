"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Orbit } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const initialValues: LoginFormData = {
  email: "",
  password: "",
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

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setIsSubmitted(false);
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    const email = formData.email.trim().toLowerCase();

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    // API integration here.
    setIsSubmitted(true);
  };

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

        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

        <p className="mt-2 text-sm text-muted">
          Sign in to continue connecting with your community.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/15 transition-colors hover:bg-accent-hover"
            >
              Sign in
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Validation Success - Temporary */}
          {isSubmitted && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-success"
            >
              Form validation passed! Ready for API integration.
            </motion.p>
          )}
        </form>
      </motion.div>

      {/* Register Link */}
      <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          Create an account
        </Link>
      </motion.p>
    </motion.div>
  );
}
