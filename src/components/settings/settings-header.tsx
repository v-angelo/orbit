import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function SettingsHeader() {
  return (
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
  );
}
