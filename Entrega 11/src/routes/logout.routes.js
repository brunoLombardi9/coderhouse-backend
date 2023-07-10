import { Router } from "express";
import UserManager from "../controllers/userManager.js";

const logoutRouter = Router();
const userManager = new UserManager();

logoutRouter.get("/", async (req, res) => {
  try {
    await userManager.logoutUser(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default logoutRouter;
