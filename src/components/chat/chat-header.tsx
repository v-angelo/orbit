"use client";

import { Hash, Inbox, Pin, Search } from "lucide-react";

import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function ChatHeader() {
  const { selectedCommunityId, selectedChannelId } = useCommunity();

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  const selectedChannel = selectedCommunity?.channels.find(
    (channel) => channel.id === selectedChannelId,
  );

  if (!selectedChannel) return null;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
      <div className="flex min-w-0 items-center gap-2">
        <Hash size={21} className="shrink-0 text-muted" />

        <h1 className="font-semibold text-foreground">{selectedChannel.name}</h1>

        <span className="ml-2 hidden truncate text-sm text-muted sm:block">
          Welcome to the community!
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-muted">
        <Pin size={18} className="cursor-pointer transition-colors hover:text-foreground" />

        <Search size={19} className="cursor-pointer transition-colors hover:text-foreground" />

        <Inbox size={19} className="cursor-pointer transition-colors hover:text-foreground" />
      </div>
    </header>
  );
}
