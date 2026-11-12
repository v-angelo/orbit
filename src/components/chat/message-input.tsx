"use client";

import { type SyntheticEvent, useRef, useState } from "react";
import { Image, Plus, Send, Smile } from "lucide-react";

import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function MessageInput() {
  const { selectedCommunityId, selectedChannelId, sendMessage } = useCommunity();

  const [message, setMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  const selectedChannel = selectedCommunity?.channels.find(
    (channel) => channel.id === selectedChannelId,
  );

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    sendMessage(message);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (message.trim()) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);

    const textarea = event.target;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  };

  return (
    <div className="shrink-0 px-5 pb-5">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors focus-within:border-accent"
      >
        <button
          type="button"
          aria-label="More message options"
          className="shrink-0 pb-1 text-muted transition-colors hover:text-foreground"
        >
          <Plus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${selectedChannel?.name ?? "channel"}`}
          aria-label="Write a message"
          autoComplete="off"
          rows={1}
          className="max-h-36 min-h-6 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted"
        />

        <div className="flex shrink-0 items-center gap-3 pb-1">
          <button
            type="button"
            aria-label="Attach an image"
            className="text-muted transition-colors hover:text-foreground"
          >
            <Image size={19} />
          </button>

          <button
            type="button"
            aria-label="Open emoji picker"
            className="text-muted transition-colors hover:text-foreground"
          >
            <Smile size={19} />
          </button>

          <button
            type="submit"
            aria-label="Send message"
            disabled={!message.trim()}
            className="flex size-8 items-center justify-center rounded-lg bg-accent text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
