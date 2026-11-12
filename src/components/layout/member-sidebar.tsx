const members = [
  { id: "alex", name: "Alex Morgan", status: "online" },
  { id: "sam", name: "Sam Wilson", status: "online" },
  { id: "jordan", name: "Jordan Lee", status: "online" },
  { id: "taylor", name: "Taylor Smith", status: "offline" },
  { id: "morgan", name: "Morgan Reed", status: "offline" },
];

export default function MemberSidebar() {
  const onlineMembers = members.filter((member) => member.status === "online");

  const offlineMembers = members.filter((member) => member.status === "offline");

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-border bg-surface p-4">
      <h2 className="mb-5 text-sm font-semibold text-foreground">Members — {members.length}</h2>

      {/* Online Members */}
      <section className="mb-6">
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted">
          ONLINE — {onlineMembers.length}
        </h3>

        <div className="space-y-3">
          {onlineMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {member.name.charAt(0)}

                <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-surface bg-success" />
              </div>

              <span className="truncate text-sm text-foreground">{member.name}</span>
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
              <div className="flex size-9 items-center justify-center rounded-full bg-surface-hover text-sm font-semibold text-muted">
                {member.name.charAt(0)}
              </div>

              <span className="truncate text-sm text-muted">{member.name}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
