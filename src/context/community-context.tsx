"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { communities, mockMessages } from "@/constants/mock-data";
import type { MockMessage } from "@/constants/mock-data";

type ActiveDrawer = "channels" | "members" | null;

interface CommunityContextType {
  selectedCommunityId: string;
  selectedChannelId: string;
  messages: Record<string, MockMessage[]>;
  activeDrawer: ActiveDrawer;
  isMemberSidebarOpen: boolean;
  selectCommunity: (communityId: string) => void;
  selectChannel: (channelId: string) => void;
  sendMessage: (content: string) => void;
  openDrawer: (drawer: ActiveDrawer) => void;
  closeDrawer: () => void;
  toggleMemberSidebar: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

interface CommunityProviderProps {
  children: ReactNode;
}

export function CommunityProvider({ children }: CommunityProviderProps) {
  const [selectedCommunityId, setSelectedCommunityId] = useState("gaming");
  const [selectedChannelId, setSelectedChannelId] = useState("general");
  const [messages, setMessages] = useState<Record<string, MockMessage[]>>(mockMessages);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [isMemberSidebarOpen, setIsMemberSidebarOpen] = useState(true);

  const openDrawer = (drawer: ActiveDrawer) => {
    setActiveDrawer(drawer);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
  };

  const toggleMemberSidebar = () => {
    setIsMemberSidebarOpen((previous) => !previous);
  };

  const selectCommunity = (communityId: string) => {
    const community = communities.find((item) => item.id === communityId);

    if (!community) return;

    const firstTextChannel = community.channels.find((channel) => channel.type === "text");

    setSelectedCommunityId(communityId);

    if (firstTextChannel) {
      setSelectedChannelId(firstTextChannel.id);
    }

    closeDrawer();
  };

  const selectChannel = (channelId: string) => {
    const community = communities.find((item) => item.id === selectedCommunityId);

    const channel = community?.channels.find((item) => item.id === channelId);

    if (!channel || channel.type !== "text") return;

    setSelectedChannelId(channelId);
    closeDrawer();
  };

  const sendMessage = (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    const newMessage: MockMessage = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "Y",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: trimmedContent,
      avatar: "accent",
    };

    setMessages((previousMessages) => ({
      ...previousMessages,
      [selectedChannelId]: [...(previousMessages[selectedChannelId] ?? []), newMessage],
    }));
  };

  return (
    <CommunityContext.Provider
      value={{
        selectedCommunityId,
        selectedChannelId,
        messages,
        activeDrawer,
        isMemberSidebarOpen,
        selectCommunity,
        selectChannel,
        sendMessage,
        openDrawer,
        closeDrawer,
        toggleMemberSidebar,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);

  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }

  return context;
}
