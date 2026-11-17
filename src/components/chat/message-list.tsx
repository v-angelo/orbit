"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";

import { useCommunity } from "@/context/community-context";
import MessageItem from "./messages/message-item";

export default function MessageList() {
  const { selectedChannelId, messages, searchQuery, searchNavigationRequest } = useCommunity();

  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const lastHandledSearchNavigationId = useRef<number | null>(null);

  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<"above" | "below">("below");

  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [activeSearchResultIndex, setActiveSearchResultIndex] = useState<number | null>(null);

  const channelMessages = messages[selectedChannelId] ?? [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMessages = normalizedQuery
    ? channelMessages.filter(
        (message) =>
          message.content.toLowerCase().includes(normalizedQuery) ||
          message.author.toLowerCase().includes(normalizedQuery),
      )
    : channelMessages;

  // Scroll to the bottom when switching channels or receiving messages.
  useEffect(() => {
    if (channelMessages.length === 0) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selectedChannelId, channelMessages.length]);

  // Reset search navigation when the channel or search query changes.
  useEffect(() => {
    setActiveSearchResultIndex(null);
  }, [selectedChannelId, normalizedQuery]);

  // Keep the active result index valid if messages are removed.
  useEffect(() => {
    if (activeSearchResultIndex !== null && activeSearchResultIndex >= filteredMessages.length) {
      setActiveSearchResultIndex(filteredMessages.length > 0 ? filteredMessages.length - 1 : null);
    }
  }, [activeSearchResultIndex, filteredMessages.length]);

  // Close the message menu when clicking outside or pressing Escape.
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

  // Remove the temporary message highlight after 1.6 seconds.
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

  // Scroll to a specific message and highlight it.
  const handleJumpToMessage = useCallback(
    (messageId: string) => {
      const originalMessage = filteredMessages.find((message) => message.id === messageId);

      if (!originalMessage) return;

      setHighlightedMessageId(messageId);

      requestAnimationFrame(() => {
        const messageElement = document.getElementById(`message-${messageId}`);

        messageElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    },
    [filteredMessages],
  );

  // Navigate between matching search results.
  const handleNavigateSearchResult = useCallback(
    (direction: "previous" | "next") => {
      if (filteredMessages.length === 0) return;

      let nextIndex: number;

      if (activeSearchResultIndex === null) {
        nextIndex = direction === "next" ? 0 : filteredMessages.length - 1;
      } else if (direction === "next") {
        nextIndex = (activeSearchResultIndex + 1) % filteredMessages.length;
      } else {
        nextIndex =
          (activeSearchResultIndex - 1 + filteredMessages.length) % filteredMessages.length;
      }

      setActiveSearchResultIndex(nextIndex);
      handleJumpToMessage(filteredMessages[nextIndex].id);
    },
    [activeSearchResultIndex, filteredMessages, handleJumpToMessage],
  );

  // Handle keyboard navigation requests from ChatHeader.
  useEffect(() => {
    if (!searchNavigationRequest) return;

    // Prevent the same request from being handled more than once.
    if (lastHandledSearchNavigationId.current === searchNavigationRequest.id) return;

    lastHandledSearchNavigationId.current = searchNavigationRequest.id;

    if (!normalizedQuery) return;

    handleNavigateSearchResult(searchNavigationRequest.direction);
  }, [searchNavigationRequest, normalizedQuery, handleNavigateSearchResult]);

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
          {filteredMessages.length > 0 ? (
            <div className="space-y-3">
              {/* Search Results Count and Navigation */}
              {normalizedQuery && (
                <div className="flex items-center justify-between gap-3 pt-3">
                  <span className="text-xs text-muted">
                    {filteredMessages.length}{" "}
                    {filteredMessages.length === 1 ? "message" : "messages"} found
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted tabular-nums">
                      {activeSearchResultIndex === null ? "—" : activeSearchResultIndex + 1} /{" "}
                      {filteredMessages.length}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleNavigateSearchResult("previous")}
                        aria-label="Previous search result"
                        title="Previous result"
                        className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <ChevronUp size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateSearchResult("next")}
                        aria-label="Next search result"
                        title="Next result"
                        className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!normalizedQuery && (
                /* Date Divider */
                <div className="my-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted">Today</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}

              {/* Messages */}
              <AnimatePresence initial={false}>
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <MessageItem
                      message={message}
                      searchQuery={searchQuery}
                      isMenuOpen={activeMenuMessageId === message.id}
                      menuPlacement={menuPlacement}
                      isHighlighted={highlightedMessageId === message.id}
                      isOriginalAvailable={
                        message.replyTo
                          ? filteredMessages.some((item) => item.id === message.replyTo?.messageId)
                          : false
                      }
                      onToggleMenu={(button) => handleToggleMenu(message.id, button)}
                      onCloseMenu={() => setActiveMenuMessageId(null)}
                      onJumpToMessage={handleJumpToMessage}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Scroll Target */}
              <div ref={messageEndRef} className="h-0" />
            </div>
          ) : normalizedQuery ? (
            /* No Search Results */
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-surface-hover text-muted">
                <Hash size={26} />
              </div>

              <h2 className="mt-3 text-lg font-semibold text-foreground">No messages found</h2>

              <p className="mt-2 max-w-sm text-sm text-muted">
                No messages match "{searchQuery.trim()}" in this channel. Try another search term.
              </p>
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
