import type { ReactNode } from "react";
import ServerSidebar from "./server-sidebar";
import ChannelSidebar from "./channel-sidebar";
import MemberSidebar from "./member-sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-[4.5rem_minmax(0,1fr)] bg-background md:grid-cols-[4.5rem_15rem_minmax(0,1fr)] xl:grid-cols-[4.5rem_15rem_minmax(0,1fr)_15rem]">
      <ServerSidebar />

      <div className="hidden min-h-screen md:block">
        <ChannelSidebar />
      </div>

      <main className="flex min-h-screen min-w-0 flex-col">{children}</main>

      <div className="hidden min-h-screen xl:block">
        <MemberSidebar />
      </div>
    </div>
  );
}
