import {
  createMessage,
  getMessages,
} from "../src/controllers/messageController"; // Adjust path as needed
import { Request, Response } from "express";
import { AppDataSource } from "../src/config/ormconfig"; // Mock your data source
import { Message } from "../src/entities/Message";
import { User } from "../src/entities/User";

// Mock dependencies
jest.mock("../src/config/ormconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockMessageRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};
const mockUserRepository = {
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
  if (entity === Message) return mockMessageRepository;
  if (entity === User) return mockUserRepository;
});

describe("createMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if message content length is invalid", async () => {
    const req = {
      body: { content: "Hi", userId: 1 },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await createMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Message length must be between 3 and 200 characters",
    });
  });

  it("should return 404 if user is not found", async () => {
    const req = {
      body: { content: "Hello world", userId: 1 },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockUserRepository.findOne.mockResolvedValue(null);

    await createMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 404 if parent message is not found", async () => {
    const req = {
      body: { content: "Reply to message", userId: 1, parentId: 2 },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockUserRepository.findOne.mockResolvedValue({ id: 1 });
    mockMessageRepository.findOne.mockResolvedValueOnce(null);

    await createMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Parent message not found",
    });
  });

  it("should create and return a new message", async () => {
    const req = {
      body: { content: "Hello world", userId: 1 },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockUser = { id: 1 };
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const mockMessage = { id: 1, content: "Hello world", user: mockUser };
    mockMessageRepository.create.mockReturnValue(mockMessage);
    mockMessageRepository.save.mockResolvedValue(mockMessage);

    await createMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockMessage);
  });
});

describe("getMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all messages with nested relationships", async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    const mockMessages = [
      {
        id: 1,
        content: "Root message",
        children: [
          {
            id: 2,
            content: "Child message",
            user: { id: 2, username: "User2" },
          },
        ],
        user: { id: 1, username: "User1" },
      },
    ];

    mockMessageRepository.find.mockResolvedValue(mockMessages);

    await getMessages(req, res);

    expect(mockMessageRepository.find).toHaveBeenCalledWith({
      relations: ["children", "user", "children.user"],
      order: { createdAt: "DESC" },
    });
    expect(res.json).toHaveBeenCalledWith(mockMessages);
  });
});
