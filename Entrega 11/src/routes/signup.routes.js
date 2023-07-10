import { Router } from "express";
import passport from "passport";
import UserManager from "../controllers/userManager.js";

const signupRouter = new Router();
const userManager = new UserManager();

signupRouter.get("/", (req, res) => {
  const user = req.session?.user || req.session?.passport?.user;

  user ? res.redirect("/products") : res.render("signup");
});

signupRouter.post("/", async (req, res) => {
  try {
    await userManager.createUser(req, res);
  } catch (error) {
    console.log(error);
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
