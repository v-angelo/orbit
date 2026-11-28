"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Hash, Headphones, Plus, Power } from "lucide-react";
import { toast } from "sonner";

import { communities } from "@/constants/mock-data";
import { useAuth } from "@/context/auth-context";
import { useCommunity } from "@/context/community-context";

type UserStatus = "online" | "idle" | "busy" | "invisible";

const statusOptions: {
  id: UserStatus;
  label: string;
  color: string;
}[] = [
  { id: "online", label: "Online", color: "bg-success" },
  { id: "idle", label: "Idle", color: "bg-warning" },
  { id: "busy", label: "Don't Disturb", color: "bg-danger" },
  { id: "invisible", label: "Invisible", color: "bg-muted" },
];

export default function ChannelSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, signOut, isSigningOut } = useAuth();

  const { selectedCommunityId, selectedChannelId, selectChannel } = useCommunity();

  const [status, setStatus] = useState<UserStatus>("online");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

  if (!selectedCommunity) return null;

  const textChannels = selectedCommunity.channels.filter((channel) => channel.type === "text");

  const voiceChannels = selectedCommunity.channels.filter((channel) => channel.type === "voice");

  const currentStatus = statusOptions.find((option) => option.id === status)!;

  const displayName = user?.displayName || user?.username || "User";

  // Handle channel selection and navigation
  const handleChannelSelect = (channelId: string) => {
    selectChannel(channelId);

    if (pathname === "/settings") {
      window.dispatchEvent(new Event("orbit:settings-exit"));
    }
  };

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
                  onClick={() => handleChannelSelect(channel.id)}
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
              <button
                key={channel.id}
                type="button"
                onClick={() => handleChannelSelect(channel.id)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <Headphones size={17} />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Current User */}
      <div className="flex shrink-0 items-center gap-2 border-t border-border p-3">
        {/* Avatar */}
        <div className="relative flex size-15 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-accent-soft text-sm font-semibold text-accent">
          {user?.avatar && !hasAvatarError ? (
            <img
              key={user.avatar}
              src={user.avatar}
              alt={`${displayName}'s avatar`}
              className="size-full object-cover"
              onError={() => setHasAvatarError(true)}
            />
          ) : (
            (user?.username?.charAt(0).toUpperCase() ?? "U")
          )}

          {/* Status Indicator */}
          <span
            className={`absolute right-0 bottom-0 size-3 rounded-full border-2 border-surface ${currentStatus.color}`}
            title={currentStatus.label}
          />
        </div>

        {/* User Information */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>

          <p className="truncate text-xs text-muted">@{user?.username ?? "username"}</p>

          {/* Status Selector */}
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen((current) => !current)}
              aria-expanded={isStatusMenuOpen}
              aria-haspopup="true"
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
            >
              <span className={`size-2 rounded-full ${currentStatus.color}`} />
              <span>{currentStatus.label}</span>
              <ChevronDown
                size={12}
                className={`transition-transform ${isStatusMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStatusMenuOpen && (
              <div className="absolute bottom-full left-0 z-30 mb-2 w-44 rounded-lg border border-border bg-surface-elevated p-1.5 shadow-xl">
                <p className="px-2.5 py-2 text-[10px] font-semibold tracking-wider text-muted">
                  SET YOUR STATUS
                </p>

                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setStatus(option.id);
                      setIsStatusMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                      status === option.id
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    <span className={`size-2.5 rounded-full ${option.color}`} />
                    <span>{option.label}</span>

                    {status === option.id && <span className="ml-auto text-accent">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isSigningOut}
          aria-label="Log out"
          title="Log out"
          className="shrink-0 cursor-pointer rounded-md p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Power size={17} />
        </button>
      </div>
    </aside>
  );
}
