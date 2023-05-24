import { Router } from "express";
import messageModel from "../mongoDB/models/Messages.js";
import { io } from "../index.js";

const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
  const messages = await messageModel.find();
  const messagesExist = messages.length > 0;
  res.render("chat", { messages, messagesExist });
});

chatRouter.post("/", async (req, res) => {
  const chatData = new messageModel({
    user: req.body.user,
    message: req.body.message,
  });
  await chatData.save();
  const allMessages = await messageModel.find();
  io.emit("new-message", allMessages);
});

export default chatRouter;
