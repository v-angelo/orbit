import ChatHeader from "@/components/chat/chat-header";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";

export default function ChatPage() {
  return (
    <>
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </>
  );
}
