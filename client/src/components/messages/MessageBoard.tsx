import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import { fetchMessages } from "../../apis/messages";

export interface Message {
  id: number;
  content: string;
  user: { email: string; username: string; id: number };
  createdAt: string;
  children: Message[];
}

interface MessageBoardProps {
  user: { username: string } | null;
}

const BoardContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const MessageBoard: React.FC<MessageBoardProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const getMessages = async () => {
      const response: any = await fetchMessages();
      setMessages(response.data);
    };
    getMessages();
  }, []);

  const handleNewMessage = (newMessage: Message) => {
    setMessages([newMessage, ...messages]);
  };

  return (
    <BoardContainer>
      <h2>Message Board</h2>
      {user && <MessageInput onNewMessage={handleNewMessage} />}
      {messages?.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </BoardContainer>
  );
};

export default MessageBoard;
