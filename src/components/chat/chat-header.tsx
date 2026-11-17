"use client";

import { useEffect, useState } from "react";
import { Hash, Inbox, Menu, Pin, Search, UsersRound, X } from "lucide-react";

import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

import { AnimatePresence, motion } from "motion/react";

export default function ChatHeader() {
  const {
    selectedCommunityId,
    selectedChannelId,
    openDrawer,
    isMemberSidebarOpen,
    toggleMemberSidebar,
    searchQuery,
    setSearchQuery,
    requestSearchNavigation,
  } = useCommunity();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  const selectedChannel = selectedCommunity?.channels.find(
    (channel) => channel.id === selectedChannelId,
  );

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setSearchQuery]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchQuery.trim()) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      requestSearchNavigation("next");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      requestSearchNavigation("previous");
    }
  };

  if (!selectedChannel) return null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        {/* Mobile Channel Menu */}
        <button
          type="button"
          onClick={() => openDrawer("channels")}
          aria-label="Open channels"
          className="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
        >
          <Menu size={20} />
        </button>

        <Hash size={21} className="shrink-0 text-muted" />

        <h1 className="truncate font-semibold text-foreground">{selectedChannel.name}</h1>

        <span className="ml-2 hidden truncate text-sm text-muted lg:block">
          Welcome to the community!
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-muted sm:gap-4">
        {/* Search */}
        <AnimatePresence mode="wait" initial={false}>
          {isSearchOpen ? (
            <motion.div
              key="search-input"
              initial={{ opacity: 0, width: 0, x: 8 }}
              animate={{ opacity: 1, width: 208, x: 0 }}
              exit={{ opacity: 0, width: 0, x: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex shrink-0 items-center gap-2 overflow-hidden rounded-lg border border-border bg-background px-2.5 py-2 sm:w-52"
            >
              <Search size={16} className="shrink-0 text-muted" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search messages..."
                aria-label="Search messages in this channel"
                aria-keyshortcuts="ArrowUp ArrowDown"
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted sm:text-sm"
              />

              <button
                type="button"
                onClick={handleCloseSearch}
                aria-label="Close search"
                className="shrink-0 rounded p-0.5 transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <X size={15} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-button"
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search messages"
              title="Search messages"
              className="rounded-md p-2 transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Search size={19} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile and Tablet Member List */}
        <button
          type="button"
          onClick={() => openDrawer("members")}
          aria-label="Open members"
          className="rounded-md p-2 transition-colors hover:bg-surface-hover hover:text-foreground xl:hidden"
        >
          <UsersRound size={19} />
        </button>

        {/* Desktop Member Panel Toggle */}
        {!isMemberSidebarOpen && (
          <button
            type="button"
            onClick={toggleMemberSidebar}
            aria-label="Show member panel"
            title="Show member panel"
            className="hidden rounded-md p-2 transition-colors hover:bg-surface-hover hover:text-foreground xl:flex"
          >
            <UsersRound size={19} />
          </button>
        )}

        <Pin
          size={18}
          className="hidden cursor-pointer transition-colors hover:text-foreground sm:block"
        />

        <Inbox size={19} className="cursor-pointer transition-colors hover:text-foreground" />
      </div>
    </header>
  );
}
