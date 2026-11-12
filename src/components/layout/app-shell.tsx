"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

import ServerSidebar from "./server-sidebar";
import ChannelSidebar from "./channel-sidebar";
import MemberSidebar from "./member-sidebar";

import { CommunityProvider, useCommunity } from "@/context/community-context";

interface AppShellProps {
  children: ReactNode;
}

function AppLayout({ children }: AppShellProps) {
  const { activeDrawer, closeDrawer, isMemberSidebarOpen } = useCommunity();

  return (
    <div
      className={`grid h-dvh grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden bg-background transition-[grid-template-columns] duration-300 ease-in-out md:grid-cols-[4.5rem_15rem_minmax(0,1fr)] ${
        isMemberSidebarOpen
          ? "xl:grid-cols-[4.5rem_15rem_minmax(0,1fr)_15rem]"
          : "xl:grid-cols-[4.5rem_15rem_minmax(0,1fr)_0rem]"
      }`}
    >
      <ServerSidebar />

      {/* Desktop Channel Sidebar */}
      <div className="hidden min-h-0 md:block">
        <ChannelSidebar />
      </div>

      {/* Main Chat */}
      <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">{children}</main>

      {/* Desktop Member Sidebar */}
      <motion.div
        className="hidden min-h-0 overflow-hidden xl:block"
        animate={{
          width: isMemberSidebarOpen ? "15rem" : "0rem",
          opacity: isMemberSidebarOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <MemberSidebar />
      </motion.div>

      {/* Mobile and Tablet Drawers */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-0 z-50 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close sidebar"
              onClick={closeDrawer}
              className="absolute inset-0 cursor-default bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer Panel */}
            <motion.div
              className={`absolute inset-y-0 w-60 max-w-[85vw] shadow-xl ${
                activeDrawer === "members" ? "right-0" : "left-0"
              }`}
              initial={{
                x: activeDrawer === "members" ? "100%" : "-100%",
              }}
              animate={{ x: 0 }}
              exit={{
                x: activeDrawer === "members" ? "100%" : "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
            >
              {activeDrawer === "channels" && <ChannelSidebar />}
              {activeDrawer === "members" && <MemberSidebar />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <CommunityProvider>
      <AppLayout>{children}</AppLayout>
    </CommunityProvider>
  );
}
