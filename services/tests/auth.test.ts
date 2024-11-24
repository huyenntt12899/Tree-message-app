import { Request, Response } from "express";
import { hashPassword, verifyPassword, generateToken } from "../src/utils/auth";
import { register, login } from "../src/controllers/authController";
import { AppDataSource } from "../src/config/ormconfig";

// Mock dependencies
jest.mock("../src/config/ormconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));
jest.mock("../src/utils/auth", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
}));

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it("should return 400 if username or email already exists", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRepository.findOne.mockResolvedValue({ id: 1 });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username or email already exists",
    });
  });

  it("should return 400 for invalid password length", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "short",
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRepository.findOne.mockResolvedValue(null);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password must be greater than 8 or equal to 20 characters",
    });
  });

  it("should return 201 on successful registration", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "validPassword123",
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRepository.findOne.mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword123");
    mockRepository.create.mockReturnValue({});
    mockRepository.save.mockResolvedValue({});

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });
});

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it("should return 400 if credentials are invalid", async () => {
    const req = {
      body: { usernameOrEmail: "testuser", password: "wrongPassword" },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockRepository.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return a token and user data on successful login", async () => {
    const req = {
      body: { usernameOrEmail: "testuser", password: "validPassword" },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashedPassword",
    };
    mockRepository.findOne.mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("mockToken123");

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      token: "mockToken123",
      user: { id: 1, username: "testuser", email: "test@example.com" },
    });
  });
});
