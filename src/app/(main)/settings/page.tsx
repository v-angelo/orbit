"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  UserRound,
  Palette,
  Bell,
  Users,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

const settingsSections = [
  {
    id: "account",
    label: "My Account",
    description: "Manage your profile information",
    icon: UserRound,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize how Orbit looks",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage notification preferences",
    icon: Bell,
  },
  {
    id: "community",
    label: "Community Preferences",
    description: "Manage your community experience",
    icon: Users,
  },
  {
    id: "security",
    label: "Privacy & Security",
    description: "Manage your password and security",
    icon: ShieldCheck,
  },
  {
    id: "management",
    label: "Account Management",
    description: "Deactivate or delete your account",
    icon: AlertTriangle,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");

  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleSettingsExit = () => {
      setIsExiting(true);
    };

    window.addEventListener("orbit:settings-exit", handleSettingsExit);

    return () => {
      window.removeEventListener("orbit:settings-exit", handleSettingsExit);
    };
  }, []);

  const activeSettings = settingsSections.find((section) => section.id === activeSection);

  return (
    <motion.div
      initial={false}
      animate={isExiting ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (isExiting) {
          router.push("/chat");
        }
      }}
      className="flex h-full min-h-0 flex-col bg-background"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5 md:px-8"
      >
        <Link
          href="/chat"
          aria-label="Back to chat"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-xs text-muted">Manage your Orbit experience</p>
        </div>
      </motion.header>

      {/* Settings Content */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Settings Navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="w-full shrink-0 border-b border-border p-4 md:w-64 md:border-r md:border-b-0 md:p-5"
        >
          <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted">USER SETTINGS</p>

          <nav className="space-y-1">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  aria-current={isActive ? "page" : undefined}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15 + index * 0.05,
                  }}
                  className={`relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-settings"
                      className="absolute inset-0 rounded-lg bg-accent-soft"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon size={18} className="relative z-10 shrink-0" />

                  <span className="relative z-10 min-w-0 flex-1 truncate text-sm font-medium">
                    {section.label}
                  </span>

                  <ChevronRight
                    size={15}
                    className={`relative z-10 shrink-0 ${
                      isActive ? "text-accent" : "text-muted/50"
                    }`}
                  />
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Settings Panel */}
        <main className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              {activeSettings && (
                <motion.div
                  key={activeSettings.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="mb-7 border-b border-border pb-5">
                    <div className="mb-2 flex items-center gap-3">
                      <activeSettings.icon size={22} className="text-accent" />

                      <h2 className="text-xl font-semibold text-foreground">
                        {activeSettings.label}
                      </h2>
                    </div>

                    <p className="text-sm text-muted">{activeSettings.description}</p>
                  </div>

                  {/* Placeholder Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                    className="rounded-xl border border-border bg-surface p-6"
                  >
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-soft">
                        <activeSettings.icon size={26} className="text-accent" />
                      </div>

                      <h3 className="mb-2 text-base font-semibold text-foreground">
                        {activeSettings.label}
                      </h3>

                      <p className="max-w-sm text-sm leading-relaxed text-muted">
                        This section is currently under development. We'll add its settings and
                        functionality here.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
