import { Router } from "express";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", (req, res) => {
  res.render("realTimeProducts", { data: "bigote" });
});

export default realTimeProductsRouter;
