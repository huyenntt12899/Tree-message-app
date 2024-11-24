import React, { useState } from "react";
import styled from "styled-components";
import { postMessage } from "../../apis/messages";
import { Message } from "./MessageBoard";

interface MessageInputProps {
  onNewMessage: (newMessage: Message) => void;
  parentId?: number;
}

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  margin-top: 4px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 100px;
  box-sizing: border-box;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
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

const WordCount = styled.p.attrs<{ isOverLimit: boolean }>((props) => ({
  style: { color: props.isOverLimit ? "red" : "#333" },
}))`
  font-size: 14px;
`;

const MessageInput: React.FC<MessageInputProps> = ({
  onNewMessage,
  parentId = null,
}) => {
  const [message, setMessage] = useState<string>("");
  const maxLength = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.length < 3 || message.length > maxLength) {
      return;
    }

    try {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser)?.user;
        const res = await postMessage(message, user.id, parentId);

        onNewMessage({ ...res.data, children: [] });
        setMessage("");
      }
    } catch (error) {
      alert("Failed to post message.");
    }
  };

  return (
    <InputContainer>
      <form onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
        />
        <WordCount isOverLimit={message.length > maxLength}>
          {maxLength - message.length > 0 ? maxLength - message.length : 0}{" "}
          characters remaining
        </WordCount>
        <Button
          type="submit"
          disabled={
            message?.trim().length < 3 || message?.trim().length > maxLength
          }
        >
          Post Message
        </Button>
      </form>
    </InputContainer>
  );
};

export default MessageInput;
