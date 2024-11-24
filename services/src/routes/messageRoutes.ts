import express from "express";
import { createMessage, getMessages } from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createMessage);

router.get("/", getMessages);

export default router;
