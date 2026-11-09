import { Image, Plus, Send, Smile } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="shrink-0 px-5 pb-5">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors focus-within:border-accent">
        <Plus size={20} className="shrink-0 cursor-pointer text-muted hover:text-foreground" />

        <span className="flex-1 text-sm text-muted">Message #general</span>

        <Image size={19} className="shrink-0 cursor-pointer text-muted hover:text-foreground" />

        <Smile size={19} className="shrink-0 cursor-pointer text-muted hover:text-foreground" />

        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-background">
          <Send size={16} />
        </div>
      </div>
    </div>
  );
}
