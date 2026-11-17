"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hash } from "lucide-react";

import { useCommunity } from "@/context/community-context";
import MessageItem from "./messages/message-item";

export default function MessageList() {
  const { selectedChannelId, messages } = useCommunity();

  const channelMessages = messages[selectedChannelId] ?? [];

  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<"above" | "below">("below");

  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (channelMessages.length === 0) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selectedChannelId, channelMessages.length]);

  useEffect(() => {
    if (!activeMenuMessageId) return;

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Element && !target.closest("[data-message-actions]")) {
        setActiveMenuMessageId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenuMessageId(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeMenuMessageId]);

  useEffect(() => {
    if (!highlightedMessageId) return;

    const timeout = window.setTimeout(() => {
      setHighlightedMessageId(null);
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [highlightedMessageId]);

  useEffect(() => {
    setHighlightedMessageId(null);
  }, [selectedChannelId]);

  const handleToggleMenu = (messageId: string, button: HTMLButtonElement) => {
    if (activeMenuMessageId === messageId) {
      setActiveMenuMessageId(null);
      return;
    }

    const containerRect = messageListRef.current?.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    if (containerRect) {
      const estimatedMenuHeight = 260;

      const spaceAbove = buttonRect.top - containerRect.top;
      const spaceBelow = containerRect.bottom - buttonRect.bottom;

      setMenuPlacement(
        spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "above" : "below",
      );
    }

    setActiveMenuMessageId(messageId);
  };

  const handleJumpToMessage = (messageId: string) => {
    const originalMessage = channelMessages.find((message) => message.id === messageId);

    if (!originalMessage) return;

    setHighlightedMessageId(messageId);

    requestAnimationFrame(() => {
      const messageElement = document.getElementById(`message-${messageId}`);

      messageElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  return (
    <div ref={messageListRef} className="min-h-0 flex-1 overflow-y-auto px-5">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedChannelId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex min-h-full flex-col"
        >
          {channelMessages.length > 0 ? (
            <div className="space-y-3">
              {/* Date Divider */}
              <div className="my-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">Today</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Messages */}
              {channelMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isMenuOpen={activeMenuMessageId === message.id}
                  menuPlacement={menuPlacement}
                  isHighlighted={highlightedMessageId === message.id}
                  isOriginalAvailable={
                    message.replyTo
                      ? channelMessages.some((item) => item.id === message.replyTo?.messageId)
                      : false
                  }
                  onToggleMenu={(button) => handleToggleMenu(message.id, button)}
                  onCloseMenu={() => setActiveMenuMessageId(null)}
                  onJumpToMessage={handleJumpToMessage}
                />
              ))}

              {/* Scroll Target */}
              <div ref={messageEndRef} className="h-0" />
            </div>
          ) : (
            /* Empty Channel State */
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Hash size={26} />
              </div>

              <h2 className="text-lg font-semibold text-foreground">
                Welcome to the beginning of this channel!
              </h2>

              <p className="mt-2 max-w-sm text-sm text-muted">
                This is the start of the conversation. Send a message to get things going.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
