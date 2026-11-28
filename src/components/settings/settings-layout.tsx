"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import SettingsHeader from "./settings-header";
import SettingsSidebar from "./settings-sidebar";

import { settingsSections, type SettingsSectionId } from "./settings-config";

import AppearanceSettings from "./sections/appearance";

export default function SettingsLayout() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("account");
  const [isExiting, setIsExiting] = useState(false);

  const router = useRouter();

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
      <SettingsHeader />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

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
                  {/* Section Heading */}
                  <div className="mb-7 border-b border-border pb-5">
                    <div className="mb-2 flex items-center gap-3">
                      <activeSettings.icon size={22} className="text-accent" />

                      <h2 className="text-xl font-semibold text-foreground">
                        {activeSettings.label}
                      </h2>
                    </div>

                    <p className="text-sm text-muted">{activeSettings.description}</p>
                  </div>

                  {/* Section Content */}
                  {activeSettings.id === "appearance" ? (
                    <AppearanceSettings />
                  ) : (
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
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
