import { Router } from "express";
import UserManager from "../controllers/userManager.js";

const loginrouter = new Router();
const userManager = new UserManager();

loginrouter.get("/", (req, res) => {
  const user = req.session?.user || req.session?.passport?.user;

  user ? res.redirect("/products") : res.render("login");
});

loginrouter.post("/", async (req, res) => {
  try {
    await userManager.loginUser(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default loginrouter;
