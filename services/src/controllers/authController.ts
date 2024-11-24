import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../entities/User";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth";
import { validate } from "class-validator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }
    if (password.length < 8 || password.length > 20) {
      res.status(400).json({
        message: "Password must be greater than 8 or equal to 20 characters",
      });
      return;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const errors = await validate({ username, email, password });
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
    await userRepository.save(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken({ id: user?.id, username: user?.username });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
