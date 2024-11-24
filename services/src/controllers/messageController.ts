import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

export const createMessage = async (req: Request, res: Response) => {
  const { content, parentId, userId } = req.body;

  if (content.length < 3 || content.length > 200) {
    res
      .status(400)
      .json({ message: "Message length must be between 3 and 200 characters" });
    return;
  }

  const messageRepository = AppDataSource.getRepository(Message);
  const userRepository = AppDataSource.getRepository(User);

  // Find user
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Create message
  const newMessage = messageRepository.create({ content, user });

  // If replying to a parent message, set parent relationship
  if (parentId) {
    const parentMessage = await messageRepository.findOne({
      where: { id: parentId },
    });
    if (!parentMessage) {
      res.status(404).json({ message: "Parent message not found" });
      return;
    }
    newMessage.parent = parentMessage;
  }

  await messageRepository.save(newMessage);
  res.status(201).json(newMessage);
};

export const getMessages = async (_req: Request, res: Response) => {
  const messageRepository = AppDataSource.getRepository(Message);

  // Find all root messages (those without a parent) and load their nested comments
  const messages = await messageRepository.find({
    relations: ["children", "user", "children.user"],
    order: { createdAt: "DESC" },
  });

  res.json(messages);
};
