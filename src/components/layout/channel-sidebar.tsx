import { ChevronDown, Hash, Headphones, Plus, Settings } from "lucide-react";

const textChannels = ["general", "introductions", "announcements", "share-projects"];

const voiceChannels = ["Lounge", "Gaming"];

export default function ChannelSidebar() {
  return (
    <aside className="flex min-h-screen flex-col border-r border-border bg-surface">
      {/* Community Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Gaming</span>
          <ChevronDown size={16} className="text-muted" />
        </div>

        <Settings
          size={17}
          className="cursor-pointer text-muted transition-colors hover:text-foreground"
        />
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-3">
        {/* Text Channels */}
        <section>
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-xs font-semibold tracking-wider text-muted">TEXT CHANNELS</h2>

            <Plus size={15} className="cursor-pointer text-muted" />
          </div>

          <div className="space-y-1">
            {textChannels.map((channel, index) => (
              <div
                key={channel}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  index === 0
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Hash size={17} />
                <span>{channel}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Voice Channels */}
        <section>
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-xs font-semibold tracking-wider text-muted">VOICE CHANNELS</h2>

            <Plus size={15} className="cursor-pointer text-muted" />
          </div>

          <div className="space-y-1">
            {voiceChannels.map((channel) => (
              <div
                key={channel}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <Headphones size={17} />
                <span>{channel}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Current User */}
      <div className="flex items-center gap-3 border-t border-border p-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          U
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">Username</p>
          <p className="text-xs text-muted">Online</p>
        </div>

        <Settings size={17} className="text-muted" />
      </div>
    </aside>
  );
}
