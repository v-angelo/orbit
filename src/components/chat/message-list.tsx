"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hash, MoreHorizontal, Copy, Pencil, Trash2, Check } from "lucide-react";

import { useCommunity } from "@/context/community-context";

const availableEmojis = ["👍", "❤️", "😂", "🎉", "🔥", "👀"];

export default function MessageList() {
  const { selectedChannelId, messages, toggleReaction, editMessage, deleteMessage } =
    useCommunity();

  const channelMessages = messages[selectedChannelId] ?? [];

  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [confirmDeleteMessageId, setConfirmDeleteMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<"above" | "below">("below");

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
    const activeMessageId = editingMessageId || confirmDeleteMessageId;

    if (!activeMessageId) return;

    const messageElement = document.getElementById(`message-${activeMessageId}`);

    messageElement?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [editingMessageId, confirmDeleteMessageId]);

  const handleReaction = (messageId: string, emoji: string) => {
    toggleReaction(messageId, emoji);
    setActiveMenuMessageId(null);
  };

  const handleToggleMenu = (messageId: string, button: HTMLButtonElement) => {
    if (activeMenuMessageId === messageId) {
      setActiveMenuMessageId(null);
      return;
    }

    const containerRect = messageListRef.current?.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    if (containerRect) {
      const estimatedMenuHeight = 220;

      const spaceAbove = buttonRect.top - containerRect.top;
      const spaceBelow = containerRect.bottom - buttonRect.bottom;

      setMenuPlacement(
        spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "above" : "below",
      );
    }

    setActiveMenuMessageId(messageId);
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setActiveMenuMessageId(null);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = channelMessages.find((item) => item.id === messageId);

    if (!message || !message.isOwn) return;

    setEditingMessageId(messageId);
    setEditContent(message.content);
    setActiveMenuMessageId(null);
    setConfirmDeleteMessageId(null);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editContent.trim()) return;

    editMessage(messageId, editContent);
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    setConfirmDeleteMessageId(null);
    setActiveMenuMessageId(null);
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
                <article
                  key={message.id}
                  id={`message-${message.id}`}
                  className="group relative flex scroll-mb-32 gap-3 rounded-xl p-3 transition-colors hover:bg-surface-hover"
                >
                  {/* Avatar */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      message.avatar === "accent"
                        ? "bg-accent-soft text-accent"
                        : "bg-surface-hover text-foreground"
                    }`}
                  >
                    {message.initials}
                  </div>

                  {/* Message Content */}
                  <div className="min-w-0 flex-1 pr-8">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {message.author}
                      </span>

                      <span className="text-xs text-muted">{message.timestamp}</span>
                    </div>

                    {editingMessageId === message.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(event) => setEditContent(event.target.value)}
                          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-accent"
                          rows={3}
                          autoFocus
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(message.id)}
                            disabled={!editContent.trim()}
                            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-muted-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {message.content}
                      </p>
                    )}

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {message.reactions.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            type="button"
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            aria-label={`${reaction.emoji} reaction, ${reaction.count} ${
                              reaction.count === 1 ? "reaction" : "reactions"
                            }`}
                            aria-pressed={reaction.reacted}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                              reaction.reacted
                                ? "border-accent/40 bg-accent-soft text-accent"
                                : "border-border bg-surface-hover text-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="font-medium tabular-nums">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Delete Confirmation */}
                    {confirmDeleteMessageId === message.id && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                        <span className="text-muted-foreground mr-auto text-xs">
                          Delete this message?
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(message.id)}
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteMessageId(null)}
                          className="text-muted-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {editingMessageId !== message.id && (
                    <div className="absolute top-1 right-2" data-message-actions>
                      <button
                        type="button"
                        onClick={(event) => handleToggleMenu(message.id, event.currentTarget)}
                        aria-label="Message actions"
                        aria-expanded={activeMenuMessageId === message.id}
                        className="text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-transparent opacity-100 transition-all hover:border-border hover:bg-background hover:text-foreground sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Actions Dropdown */}
                      <AnimatePresence>
                        {activeMenuMessageId === message.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className={`absolute right-0 z-30 w-52 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-xl ${
                              menuPlacement === "above" ? "bottom-9" : "top-9"
                            }`}
                          >
                            {/* Reactions */}
                            <div className="px-2 py-2">
                              <p className="mb-2 text-xs font-medium text-muted">Add reaction</p>

                              <div className="flex items-center justify-between gap-1">
                                {availableEmojis.map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleReaction(message.id, emoji)}
                                    aria-label={`React with ${emoji}`}
                                    className="flex size-7 items-center justify-center rounded-md text-base transition-colors hover:bg-surface-hover"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="my-1 h-px bg-border" />

                            {/* Copy */}
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(message.id, message.content)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                            >
                              {copiedMessageId === message.id ? (
                                <Check size={15} className="text-green-500" />
                              ) : (
                                <Copy size={15} />
                              )}
                              {copiedMessageId === message.id ? "Copied" : "Copy message"}
                            </button>

                            {/* Own Message Actions */}
                            {message.isOwn && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditMessage(message.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                                >
                                  <Pencil size={15} />
                                  Edit message
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmDeleteMessageId(message.id);
                                    setActiveMenuMessageId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                                >
                                  <Trash2 size={15} />
                                  Delete message
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </article>
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
