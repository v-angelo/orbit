"use client";

import { useEffect, useState } from "react";

import { useCommunity } from "@/context/community-context";
import type { MockMessage } from "@/constants/mock-data";

import MessageActions from "./message-actions";
import MessageReplyPreview from "./message-reply-preview";

interface MessageItemProps {
  message: MockMessage;
  isMenuOpen: boolean;
  menuPlacement: "above" | "below";
  onToggleMenu: (button: HTMLButtonElement) => void;
  onCloseMenu: () => void;
}

export default function MessageItem({
  message,
  isMenuOpen,
  menuPlacement,
  onToggleMenu,
  onCloseMenu,
}: MessageItemProps) {
  const { toggleReaction, editMessage, deleteMessage, startReply } = useCommunity();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!isEditing && !isConfirmingDelete) return;

    const messageElement = document.getElementById(`message-${message.id}`);

    messageElement?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isEditing, isConfirmingDelete, message.id]);

  const handleReaction = (emoji: string) => {
    toggleReaction(message.id, emoji);
  };

  const handleReply = () => {
    startReply(message.id);
  };

  const handleEdit = () => {
    if (!message.isOwn) return;

    setEditContent(message.content);
    setIsEditing(true);
    setIsConfirmingDelete(false);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    editMessage(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    setIsConfirmingDelete(false);
  };

  return (
    <article
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
          <span className="text-sm font-semibold text-foreground">{message.author}</span>

          <span className="text-xs text-muted">{message.timestamp}</span>
        </div>

        {/* Reply Preview */}
        {message.replyTo && <MessageReplyPreview replyTo={message.replyTo} />}

        {/* Message Body */}
        {isEditing ? (
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
                onClick={handleSaveEdit}
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
                onClick={() => handleReaction(reaction.emoji)}
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
        {isConfirmingDelete && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
            <span className="text-muted-foreground mr-auto text-xs">Delete this message?</span>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="text-muted-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Message Actions */}
      {!isEditing && (
        <MessageActions
          message={message}
          isOpen={isMenuOpen}
          menuPlacement={menuPlacement}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          onReact={handleReaction}
          onReply={handleReply}
          onEdit={handleEdit}
          onDelete={() => setIsConfirmingDelete(true)}
        />
      )}
    </article>
  );
}
