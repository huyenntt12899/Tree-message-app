import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { fetchMessages } from "../src/apis/messages";
import MessageBoard from "../src/components/messages/MessageBoard";
import "@testing-library/jest-dom";
// Mock the API call
jest.mock("../src/apis/messages", () => ({
  fetchMessages: jest.fn(),
}));

const mockMessages = [
  {
    id: 1,
    content: "This is a test message",
    user: { email: "test@example.com", username: "Test User", id: 1 },
    createdAt: "2024-11-19T12:00:00Z",
    children: [],
  },
];

describe("MessageBoard", () => {
  beforeEach(() => {
    (fetchMessages as jest.Mock).mockResolvedValue({ data: mockMessages });
  });

  it("should render the message board and display messages", async () => {
    render(<MessageBoard user={{ username: "TestUser" }} />);

    // Wait for messages to load
    await waitFor(() => screen.getByText("This is a test message"));

    // Check that the test message is rendered
    expect(screen.getByText("This is a test message")).toBeInTheDocument();
  });

  it("should display a message input for logged-in users", async () => {
    render(<MessageBoard user={{ username: "TestUser" }} />);

    await waitFor(() => screen.getByText("This is a test message"));

    expect(
      screen.getByPlaceholderText("Write your message here...")
    ).toBeInTheDocument();
  });
});
