"use client";

import { motion } from "motion/react";
import { Check, Moon, Sun } from "lucide-react";

import { useTheme, themeOptions } from "@/context/theme-context";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const darkThemes = themeOptions.filter((option) => option.mode === "dark");
  const lightThemes = themeOptions.filter((option) => option.mode === "light");

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <section>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Color Theme</h3>
          <p className="mt-1 text-sm text-muted">
            Choose a theme that feels right for your Orbit experience.
          </p>
        </div>

        {/* Dark Themes */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Moon size={16} className="text-muted" />
            <h4 className="text-sm font-medium text-foreground">Dark Themes</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {darkThemes.map((option) => {
              const isActive = theme === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={isActive}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-xl border p-3 text-left transition-colors ${
                    isActive
                      ? "border-accent bg-accent-soft/30"
                      : "border-border bg-surface hover:border-muted"
                  }`}
                >
                  {/* Theme Preview */}
                  <div
                    data-theme={option.id}
                    className="overflow-hidden rounded-lg border border-border bg-background p-3"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="flex size-6 items-center justify-center rounded-md"
                        style={{ backgroundColor: "var(--accent-soft)" }}
                      >
                        <div
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      </div>

                      <div
                        className="h-2 w-20 rounded-full"
                        style={{ backgroundColor: "var(--foreground)", opacity: 0.8 }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div
                        className="w-1/3 space-y-2 rounded-md p-2"
                        style={{ backgroundColor: "var(--surface)" }}
                      >
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "var(--muted)", opacity: 0.5 }}
                        />
                        <div
                          className="h-1.5 w-3/4 rounded-full"
                          style={{ backgroundColor: "var(--muted)", opacity: 0.5 }}
                        />
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      </div>

                      <div className="flex-1 space-y-2 rounded-md p-2">
                        <div
                          className="h-5 w-3/4 rounded-md"
                          style={{ backgroundColor: "var(--surface)" }}
                        />
                        <div
                          className="h-5 w-full rounded-md"
                          style={{ backgroundColor: "var(--surface-hover)" }}
                        />
                        <div
                          className="ml-auto h-5 w-2/3 rounded-md"
                          style={{ backgroundColor: "var(--accent-soft)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Details */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{option.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{option.description}</p>
                    </div>

                    {isActive && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-background">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Light Themes */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sun size={16} className="text-muted" />
            <h4 className="text-sm font-medium text-foreground">Light Themes</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {lightThemes.map((option) => {
              const isActive = theme === option.id;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={isActive}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-xl border p-3 text-left transition-colors ${
                    isActive
                      ? "border-accent bg-accent-soft/30"
                      : "border-border bg-surface hover:border-muted"
                  }`}
                >
                  {/* Theme Preview */}
                  <div
                    data-theme={option.id}
                    className="overflow-hidden rounded-lg border border-border bg-background p-3"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="flex size-6 items-center justify-center rounded-md"
                        style={{ backgroundColor: "var(--accent-soft)" }}
                      >
                        <div
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      </div>

                      <div
                        className="h-2 w-20 rounded-full"
                        style={{ backgroundColor: "var(--foreground)", opacity: 0.8 }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div
                        className="w-1/3 space-y-2 rounded-md p-2"
                        style={{ backgroundColor: "var(--surface)" }}
                      >
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "var(--muted)", opacity: 0.5 }}
                        />
                        <div
                          className="h-1.5 w-3/4 rounded-full"
                          style={{ backgroundColor: "var(--muted)", opacity: 0.5 }}
                        />
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      </div>

                      <div className="flex-1 space-y-2 rounded-md p-2">
                        <div
                          className="h-5 w-3/4 rounded-md"
                          style={{ backgroundColor: "var(--surface)" }}
                        />
                        <div
                          className="h-5 w-full rounded-md"
                          style={{ backgroundColor: "var(--surface-hover)" }}
                        />
                        <div
                          className="ml-auto h-5 w-2/3 rounded-md"
                          style={{ backgroundColor: "var(--accent-soft)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Details */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{option.name}</p>
                      <p className="mt-0.5 text-xs text-muted">{option.description}</p>
                    </div>

                    {isActive && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-background">
                        <Check size={14} strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
