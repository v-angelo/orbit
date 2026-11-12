"use client";

import { Compass, Plus, Settings } from "lucide-react";
import { communities } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function ServerSidebar() {
  const { selectedCommunityId, selectCommunity } = useCommunity();

  return (
    <aside className="flex h-dvh flex-col items-center gap-4 overflow-y-auto border-r border-border bg-surface py-4">
      <div
        title="Orbit"
        className="flex size-11 items-center justify-center rounded-2xl bg-accent text-background"
      >
        <Compass size={25} />
      </div>

      <div className="h-px w-8 bg-border" />

      {communities.map((community) => {
        const Icon = community.icon;
        const isActive = selectedCommunityId === community.id;

        return (
          <button
            key={community.id}
            type="button"
            title={community.name}
            onClick={() => selectCommunity(community.id)}
            className={`relative flex size-11 items-center justify-center rounded-2xl transition-all duration-200 ${
              isActive ? "rounded-xl bg-accent-soft" : "hover:rounded-xl hover:bg-surface-hover"
            }`}
            style={{ color: community.color }}
          >
            {isActive && <span className="absolute -left-4.5 h-6 w-1 rounded-r-full bg-accent" />}

            <Icon size={22} />
          </button>
        );
      })}

      <button
        type="button"
        title="Add a community"
        className="flex size-11 items-center justify-center rounded-2xl text-success transition-colors hover:bg-surface-hover"
      >
        <Plus size={23} />
      </button>

      <button
        type="button"
        title="Settings"
        className="mt-auto flex size-11 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <Settings size={21} />
      </button>
    </aside>
  );
}
