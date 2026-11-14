import { Code2, Gamepad2, type LucideIcon } from "lucide-react";

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
}

export interface Community {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  channels: Channel[];
}

export interface MockReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface MockMessage {
  id: string;
  author: string;
  initials: string;
  timestamp: string;
  content: string;
  avatar: "accent" | "neutral";
  reactions: MockReaction[];
  isOwn: boolean;
}

export interface MockMember {
  id: string;
  name: string;
  status: "online" | "offline";
  role: "admin" | "moderator" | "member";
}

export const communities: Community[] = [
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    color: "#a78bfa",
    channels: [
      { id: "general", name: "general", type: "text" },
      { id: "introductions", name: "introductions", type: "text" },
      { id: "announcements", name: "announcements", type: "text" },
      { id: "share-projects", name: "share-projects", type: "text" },
      { id: "lounge", name: "Lounge", type: "voice" },
      { id: "gaming-voice", name: "Gaming", type: "voice" },
    ],
  },
  {
    id: "developers",
    name: "Developers",
    icon: Code2,
    color: "#38bdf8",
    channels: [
      { id: "dev-general", name: "general", type: "text" },
      { id: "frontend", name: "frontend", type: "text" },
      { id: "backend", name: "backend", type: "text" },
      { id: "resources", name: "resources", type: "text" },
      { id: "coworking", name: "Coworking", type: "voice" },
    ],
  },
];

export const mockMessages: Record<string, MockMessage[]> = {
  general: [
    {
      id: "1",
      author: "Alex Morgan",
      initials: "A",
      timestamp: "10:30 AM",
      content: "Hey everyone! Welcome to our community.",
      avatar: "accent",
      reactions: [
        { emoji: "👋", count: 3, reacted: false },
        { emoji: "❤️", count: 2, reacted: true },
      ],
      isOwn: false,
    },
    {
      id: "2",
      author: "Sam Wilson",
      initials: "S",
      timestamp: "10:32 AM",
      content: "Thanks for having me here! Excited to be part of this.",
      avatar: "neutral",
      reactions: [{ emoji: "🎉", count: 2, reacted: false }],
      isOwn: false,
    },

    {
      id: "3",
      author: "Jordan Lee",
      initials: "J",
      timestamp: "10:35 AM",
      content: "Anyone working on something interesting lately?",
      avatar: "accent",
      reactions: [],
      isOwn: false,
    },
  ],

  introductions: [
    {
      id: "4",
      author: "Taylor Smith",
      initials: "T",
      timestamp: "11:15 AM",
      content: "Hello everyone! I'm Taylor. Great to meet you all!",
      avatar: "neutral",
      reactions: [{ emoji: "👋", count: 4, reacted: false }],
      isOwn: false,
    },
  ],

  "dev-general": [
    {
      id: "5",
      author: "Alex Morgan",
      initials: "A",
      timestamp: "09:15 AM",
      content: "What technologies is everyone working with lately?",
      avatar: "accent",
      reactions: [],
      isOwn: false,
    },
    {
      id: "6",
      author: "Jordan Lee",
      initials: "J",
      timestamp: "09:20 AM",
      content: "Currently exploring Next.js and TypeScript. Really enjoying the experience!",
      avatar: "neutral",
      reactions: [
        { emoji: "🔥", count: 3, reacted: false },
        { emoji: "💯", count: 1, reacted: true },
      ],
      isOwn: false,
    },
  ],

  frontend: [
    {
      id: "7",
      author: "Sam Wilson",
      initials: "S",
      timestamp: "12:10 PM",
      content: "Does anyone have recommendations for component libraries?",
      avatar: "accent",
      reactions: [],
      isOwn: false,
    },
  ],

  backend: [
    {
      id: "8",
      author: "Morgan Reed",
      initials: "M",
      timestamp: "01:30 PM",
      content: "I've been experimenting with Node.js and MongoDB recently.",
      avatar: "neutral",
      reactions: [],
      isOwn: false,
    },
  ],
};

export const membersByCommunity: Record<string, MockMember[]> = {
  gaming: [
    { id: "alex", name: "Alex Morgan", status: "online", role: "admin" },
    { id: "sam", name: "Sam Wilson", status: "online", role: "moderator" },
    { id: "jordan", name: "Jordan Lee", status: "online", role: "member" },
    { id: "taylor", name: "Taylor Smith", status: "offline", role: "member" },
    { id: "morgan", name: "Morgan Reed", status: "offline", role: "moderator" },
  ],
  developers: [
    { id: "chris", name: "Chris Evans", status: "online", role: "admin" },
    { id: "jamie", name: "Jamie Parker", status: "online", role: "moderator" },
    { id: "riley", name: "Riley Cooper", status: "offline", role: "member" },
    { id: "casey", name: "Casey Brooks", status: "offline", role: "member" },
  ],
};
