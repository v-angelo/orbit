"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Hash, Headphones, Plus, Power, Settings } from "lucide-react";
import { toast } from "sonner";

import { communities } from "@/constants/mock-data";
import { useAuth } from "@/context/auth-context";
import { useCommunity } from "@/context/community-context";

export default function ChannelSidebar() {
  const router = useRouter();

  const { user, signOut, isSigningOut } = useAuth();

  const { selectedCommunityId, selectedChannelId, selectChannel } = useCommunity();

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  if (!selectedCommunity) return null;

  const textChannels = selectedCommunity.channels.filter((channel) => channel.type === "text");

  const voiceChannels = selectedCommunity.channels.filter((channel) => channel.type === "voice");

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut();

      toast.success("Logged out successfully.");

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(error instanceof Error ? error.message : "Unable to log out. Please try again.");
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-surface">
      {/* Community Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{selectedCommunity.name}</span>

          <ChevronDown size={16} className="text-muted" />
        </div>

        <Settings
          size={17}
          className="cursor-pointer text-muted transition-colors hover:text-foreground"
        />
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-3">
        {/* Text Channels */}
        <section>
          <div className="mb-2 flex items-center justify-between px-2">
            <h2 className="text-xs font-semibold tracking-wider text-muted">TEXT CHANNELS</h2>

            <Plus size={15} className="cursor-pointer text-muted" />
          </div>

          <div className="space-y-1">
            {textChannels.map((channel) => {
              const isActive = selectedChannelId === channel.id;

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel.id)}
                  aria-pressed={isActive}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <Hash size={17} />
                  <span className="truncate">{channel.name}</span>
                </button>
              );
            })}
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
                key={channel.id}
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted"
              >
                <Headphones size={17} />
                <span>{channel.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Current User */}
      <div className="flex shrink-0 items-center gap-3 border-t border-border p-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          {user?.username.charAt(0).toUpperCase() ?? "U"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{user?.username ?? "User"}</p>
          <p className="text-xs text-muted">Online</p>
        </div>

        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          className="cursor-pointer rounded-md p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <Settings size={17} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isSigningOut}
          aria-label="Log out"
          title="Log out"
          className="cursor-pointer rounded-md p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Power size={17} />
        </button>
      </div>
    </aside>
  );
}
