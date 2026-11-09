import { Compass, Gamepad2, Plus, Settings } from "lucide-react";

const servers = [
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "#a78bfa" },
  { id: "developers", name: "Developers", icon: Settings, color: "#38bdf8" },
];

export default function ServerSidebar() {
  return (
    <aside className="flex min-h-screen flex-col items-center gap-4 border-r border-border bg-surface py-4">
      <div
        title="Orbit"
        className="flex size-11 items-center justify-center rounded-2xl bg-accent text-background"
      >
        <Compass size={25} />
      </div>

      <div className="h-px w-8 bg-border" />

      {servers.map((server) => {
        const Icon = server.icon;

        return (
          <div
            key={server.id}
            title={server.name}
            className="flex size-11 cursor-pointer items-center justify-center rounded-2xl transition-colors hover:bg-surface-hover"
            style={{ color: server.color }}
          >
            <Icon size={22} />
          </div>
        );
      })}

      <div
        title="Add a community"
        className="flex size-11 cursor-pointer items-center justify-center rounded-2xl text-success transition-colors hover:bg-surface-hover"
      >
        <Plus size={23} />
      </div>

      <div className="mt-auto flex size-11 items-center justify-center rounded-2xl bg-surface-hover text-muted">
        <Settings size={21} />
      </div>
    </aside>
  );
}
