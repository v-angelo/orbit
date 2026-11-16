import type { MockReply } from "@/constants/mock-data";

interface MessageReplyPreviewProps {
  replyTo: MockReply;
}

export default function MessageReplyPreview({ replyTo }: MessageReplyPreviewProps) {
  return (
    <div className="mb-2 flex min-w-0 items-start gap-2 border-l-2 border-accent/50 pl-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-accent">{replyTo.author}</p>
        <p className="line-clamp-2 text-xs text-muted">{replyTo.content}</p>
      </div>
    </div>
  );
}
