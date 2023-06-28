import { Router } from "express";
import { usersModel } from "../mongoDB/models/User.js";
import { compareData } from "../utils/hash.js";

const loginrouter = new Router();

loginrouter.get("/", (req, res) => {
  const user = req.session?.user || req.session?.passport?.user;

  user ? res.redirect("/products") : res.render("login");
});

loginrouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersModel.findOne({ email });

  if (user) {
    const isPasswordValid = await compareData(password, user.password);

    if (!isPasswordValid) {
      const badData = true;
      return res.render("login", { badData });
    }

    req.session.user = user;
    res.redirect("/products");
  } else {
    const noUser = true;
    res.render("login", { noUser });
  }
});

export default loginrouter;
