"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hash } from "lucide-react";

import { useCommunity } from "@/context/community-context";

export default function MessageList() {
  const { selectedChannelId, messages } = useCommunity();

  const channelMessages = messages[selectedChannelId] ?? [];

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (channelMessages.length === 0) return;

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [selectedChannelId, channelMessages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5">
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
            <div className="space-y-6">
              {/* Date Divider */}
              <div className="my-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">Today</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Messages */}
              {channelMessages.map((message) => (
                <article key={message.id} className="flex gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      message.avatar === "accent"
                        ? "bg-accent-soft text-accent"
                        : "bg-surface-hover text-foreground"
                    }`}
                  >
                    {message.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {message.author}
                      </span>

                      <span className="text-xs text-muted">{message.timestamp}</span>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted">
                      {message.content}
                    </p>
                  </div>
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
