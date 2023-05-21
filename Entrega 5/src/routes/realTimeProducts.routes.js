import { Router } from "express";
import { productManager } from "./products.routes.js";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", async(req, res) => {
  const products = await productManager.getProducts();
  const productsExist = products.length > 0;
  res.render("realTimeProducts", { products, productsExist });
});


export default realTimeProductsRouter;
