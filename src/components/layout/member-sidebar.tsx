"use client";

import { ChevronRight } from "lucide-react";

import { membersByCommunity } from "@/constants/mock-data";
import { useCommunity } from "@/context/community-context";

export default function MemberSidebar() {
  const { selectedCommunityId, toggleMemberSidebar } = useCommunity();

  const members = membersByCommunity[selectedCommunityId] ?? [];

  const onlineMembers = members.filter((member) => member.status === "online");

  const offlineMembers = members.filter((member) => member.status === "offline");

  return (
    <aside className="flex h-full min-h-0 w-60 flex-col border-l border-border bg-surface p-4">
      {/* Header */}
      <div className="mb-5 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Members — {members.length}</h2>

        <button
          type="button"
          onClick={toggleMemberSidebar}
          aria-label="Hide member panel"
          title="Hide member panel"
          className="hidden rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground xl:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto">
        {/* Online Members */}
        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted">
            ONLINE — {onlineMembers.length}
          </h3>

          <div className="space-y-3">
            {onlineMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {member.name.charAt(0)}

                  <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-surface bg-success" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{member.name}</p>

                  <p className="text-xs text-muted capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offline Members */}
        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted">
            OFFLINE — {offlineMembers.length}
          </h3>

          <div className="space-y-3">
            {offlineMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 opacity-50">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-hover text-sm font-semibold text-muted">
                  {member.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{member.name}</p>

                  <p className="text-xs text-muted capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
