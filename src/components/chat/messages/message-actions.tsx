"use client";

import { useState } from "react";
import { MoreHorizontal, Copy, Pencil, Trash2, Check, Reply } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { MockMessage } from "@/constants/mock-data";

const availableEmojis = ["👍", "❤️", "😂", "🎉", "🔥", "👀"];

interface MessageActionsProps {
  message: MockMessage;
  isOpen: boolean;
  menuPlacement: "above" | "below";
  onToggle: (button: HTMLButtonElement) => void;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MessageActions({
  message,
  isOpen,
  menuPlacement,
  onToggle,
  onClose,
  onReact,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      onClose();
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleReaction = (emoji: string) => {
    onReact(emoji);
    onClose();
  };

  const handleReply = () => {
    onReply();
    onClose();
  };

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="absolute top-1 right-2" data-message-actions>
      <button
        type="button"
        onClick={(event) => onToggle(event.currentTarget)}
        aria-label="Message actions"
        aria-expanded={isOpen}
        className="text-muted-foreground flex size-8 items-center justify-center rounded-lg border border-transparent opacity-100 transition-all hover:border-border hover:bg-background hover:text-foreground sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
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
                    onClick={() => handleReaction(emoji)}
                    aria-label={`React with ${emoji}`}
                    className="flex size-7 items-center justify-center rounded-md text-base transition-colors hover:bg-surface-hover"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-1 h-px bg-border" />

            {/* Reply */}
            <button
              type="button"
              onClick={handleReply}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
            >
              <Reply size={15} />
              Reply
            </button>

            {/* Copy */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy message"}
            </button>

            {/* Own Message Actions */}
            {message.isOwn && (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                >
                  <Pencil size={15} />
                  Edit message
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
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
  );
}
