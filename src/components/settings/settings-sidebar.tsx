import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { settingsSections, type SettingsSectionId } from "./settings-config";

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSectionChange: (section: SettingsSectionId) => void;
}

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
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
              onClick={() => onSectionChange(section.id)}
              aria-current={isActive ? "page" : undefined}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.25,
                delay: 0.15 + index * 0.05,
              }}
              className={`relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors ${
                isActive ? "text-accent" : "text-muted hover:bg-surface-hover hover:text-foreground"
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
                className={`relative z-10 shrink-0 ${isActive ? "text-accent" : "text-muted/50"}`}
              />
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
