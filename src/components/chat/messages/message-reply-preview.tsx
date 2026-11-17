import type { MockReply } from "@/constants/mock-data";

interface MessageReplyPreviewProps {
  replyTo: MockReply;
  isOriginalAvailable: boolean;
  onClick: () => void;
}

export default function MessageReplyPreview({
  replyTo,
  isOriginalAvailable,
  onClick,
}: MessageReplyPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isOriginalAvailable}
      aria-label={
        isOriginalAvailable
          ? `Jump to ${replyTo.author}'s original message`
          : "Original message is no longer available"
      }
      className="mb-2 flex max-w-full min-w-0 cursor-pointer items-start gap-2 border-l-2 border-accent/50 pl-3 text-left transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold text-accent">{replyTo.author}</p>

        <p className="line-clamp-2 text-xs text-muted">{replyTo.content}</p>

        {!isOriginalAvailable && (
          <p className="mt-1 text-[11px] text-muted">Original message unavailable</p>
        )}
      </div>
    </button>
  );
}
