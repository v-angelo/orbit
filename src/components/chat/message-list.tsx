const messages = [
  {
    id: 1,
    name: "Alex Morgan",
    initials: "A",
    time: "10:30 AM",
    color: "bg-accent-soft text-accent",
    content: "Hey everyone! Welcome to our community.",
  },
  {
    id: 2,
    name: "Sam Wilson",
    initials: "S",
    time: "10:32 AM",
    color: "bg-(--accent-soft) text-accent",
    content: "Thanks for having me here! Excited to be part of this.",
  },
  {
    id: 3,
    name: "Jordan Lee",
    initials: "J",
    time: "10:35 AM",
    color: "bg-surface-hover text-foreground",
    content: "Anyone working on something interesting lately?",
  },
  {
    id: 4,
    name: "Alex Morgan",
    initials: "A",
    time: "10:38 AM",
    color: "bg-accent-soft text-accent",
    content: "I've been building a small web application. Happy to share it soon!",
  },
];

export default function MessageList() {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-5">
      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">Today</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {messages.map((message) => (
        <article key={message.id} className="flex gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${message.color}`}
          >
            {message.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold text-foreground">{message.name}</span>

              <span className="text-xs text-muted">{message.time}</span>
            </div>

            <p className="text-sm leading-relaxed text-muted">{message.content}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
