import { Hash, Inbox, Pin, Search } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
      <div className="flex items-center gap-2">
        <Hash size={21} className="text-muted" />

        <h1 className="font-semibold text-foreground">general</h1>

        <span className="ml-2 hidden text-sm text-muted sm:block">Welcome to the community!</span>
      </div>

      <div className="flex items-center gap-4 text-muted">
        <Pin size={18} className="cursor-pointer transition-colors hover:text-foreground" />
        <Search size={19} className="cursor-pointer transition-colors hover:text-foreground" />
        <Inbox size={19} className="cursor-pointer transition-colors hover:text-foreground" />
      </div>
    </header>
  );
}
