import { Router } from "express";
import { usersModel } from "../mongoDB/models/User.js";
import {hashData} from "../utils/hash.js"

const signupRouter = new Router();

signupRouter.get("/", (req, res) => {
  res.render("signup");
});

signupRouter.post("/", async (req, res) => {
  const { name, lastName, email, password } = req.body;
  const user = await usersModel.findOne({ email });

  if (user) {
    const userExist = true;
    res.render("signup", { userExist });
  } else {
    const hashPassword = await hashData(password)
    const newUser = {...req.body,password:hashPassword}
    await usersModel.create(newUser)
    req.session.user = newUser;
    res.redirect("/products");
  }
});

export default signupRouter;
