import type { ReactNode } from "react";

import ServerSidebar from "./server-sidebar";
import ChannelSidebar from "./channel-sidebar";
import MemberSidebar from "./member-sidebar";

import { CommunityProvider } from "@/context/community-context";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <CommunityProvider>
      <div className="grid h-dvh grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden bg-background md:grid-cols-[4.5rem_15rem_minmax(0,1fr)] xl:grid-cols-[4.5rem_15rem_minmax(0,1fr)_15rem]">
        <ServerSidebar />

        <div className="hidden min-h-0 md:block">
          <ChannelSidebar />
        </div>

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">{children}</main>

        <div className="hidden min-h-0 xl:block">
          <MemberSidebar />
        </div>
      </div>
    </CommunityProvider>
  );
}
