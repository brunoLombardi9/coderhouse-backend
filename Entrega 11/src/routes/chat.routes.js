import { Router } from "express";
import MessagesManager from "../controllers/messagesManager.js";

const chatRouter = Router();
const messagesManager = new MessagesManager();

chatRouter.get("/", async (req, res) => {
  try {
    await messagesManager.getMessages(req, res);
  } catch (error) {
    console.log(error);
  }
});

chatRouter.post("/", async (req, res) => {
  try {
    await messagesManager.createMessage(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default chatRouter;
