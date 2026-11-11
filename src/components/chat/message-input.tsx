"use client";

import { type SyntheticEvent, useState } from "react";
import { Image, Plus, Send, Smile } from "lucide-react";

import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function MessageInput() {
  const { selectedCommunityId, selectedChannelId, sendMessage } = useCommunity();

  const [message, setMessage] = useState("");

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  const selectedChannel = selectedCommunity?.channels.find(
    (channel) => channel.id === selectedChannelId,
  );

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="shrink-0 px-5 pb-5">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors focus-within:border-accent"
      >
        <button
          type="button"
          aria-label="More message options"
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <Plus size={20} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={`Message #${selectedChannel?.name ?? "channel"}`}
          aria-label="Write a message"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />

        <button
          type="button"
          aria-label="Attach an image"
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <Image size={19} />
        </button>

        <button
          type="button"
          aria-label="Open emoji picker"
          className="shrink-0 text-muted transition-colors hover:text-foreground"
        >
          <Smile size={19} />
        </button>

        <button
          type="submit"
          aria-label="Send message"
          disabled={!message.trim()}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
