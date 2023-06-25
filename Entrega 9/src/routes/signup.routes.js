import { Router } from "express";
import { usersModel } from "../mongoDB/models/User.js";
import { hashData } from "../utils/hash.js";
import passport from "passport";

const signupRouter = new Router();

signupRouter.get("/", (req, res) => {
  const user = req.session?.user || req.session?.passport?.user;

  user ? res.redirect("/products") : res.render("signup");
});

signupRouter.post("/", async (req, res) => {
  const { name, lastName, email, password } = req.body;
  const user = await usersModel.findOne({ email });

  if (user) {
    const userExist = true;
    res.render("signup", { userExist });
  } else {
    const hashPassword = await hashData(password);
    const newUser = { ...req.body, password: hashPassword };
    await usersModel.create(newUser);
    req.session.user = newUser;
    res.redirect("/products");
  }
});

signupRouter.get(
  "/githubSignup",
  passport.authenticate("githubSignup", { scope: ["user:email"] })
);

signupRouter.get(
  "/githubSignup/callback",
  passport.authenticate("githubSignup", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

export default signupRouter;
