"use client";

import { Hash, Inbox, Menu, Pin, Search, UsersRound } from "lucide-react";

import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function ChatHeader() {
  const {
    selectedCommunityId,
    selectedChannelId,
    openDrawer,
    isMemberSidebarOpen,
    toggleMemberSidebar,
  } = useCommunity();

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  const selectedChannel = selectedCommunity?.channels.find(
    (channel) => channel.id === selectedChannelId,
  );

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

        <Search size={19} className="cursor-pointer transition-colors hover:text-foreground" />

        <Inbox size={19} className="cursor-pointer transition-colors hover:text-foreground" />
      </div>
    </header>
  );
}
