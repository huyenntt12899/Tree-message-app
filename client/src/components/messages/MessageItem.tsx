import React, { useState } from "react";
import styled from "styled-components";
import { Message } from "./MessageBoard";
import MessageInput from "./MessageInput";

interface MessageItemProps {
  message: Message;
}

const MessageContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const MessageHeader = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
`;

const MessageContent = styled.div`
  font-size: 16px;
`;

const Button = styled.button`
  margin-top: 10px;
  margin-left: 4px;
  padding: 5px 10px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [canReply, setCanReply] = useState(false);
  const storedUser = localStorage.getItem("userData");
  const [childData, setChildData] = useState<Message[]>(
    message?.children ?? []
  );

  const handleNewMessage = (newMessage: Message) => {
    setChildData([newMessage, ...childData]);
    setCanReply(false);
  };
  return (
    <MessageContainer>
      <MessageHeader>
        <strong>{message?.user?.email}</strong> -{" "}
        {new Date(message.createdAt).toLocaleString()}
      </MessageHeader>
      <MessageContent>{message.content}</MessageContent>
      {canReply && (
        <MessageInput onNewMessage={handleNewMessage} parentId={message.id} />
      )}
      {storedUser && (
        <>
          {!canReply ? (
            <Button onClick={() => setCanReply(true)}>Reply</Button>
          ) : (
            <Button onClick={() => setCanReply(false)}>Cancel</Button>
          )}
        </>
      )}
      {childData?.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {message?.children?.map((child) => (
            <MessageItem key={child.id} message={child} />
          ))}
        </div>
      )}
    </MessageContainer>
  );
};

export default MessageItem;
