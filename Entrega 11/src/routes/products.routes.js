import { Router } from "express";
import ProductsManager from "../controllers/productsManager.js";

const productsRouter = Router();
const productsManager = new ProductsManager();

productsRouter.get("/", async (req, res) => {
  try {
    await productsManager.getProducts(req, res);
  } catch (error) {
    console.log(error);
  }
});

productsRouter.get("/page/:page/limit/:limit", async (req, res) => {
  try {
    await productsManager.getProductsPaginate(req, res);
  } catch (error) {
    console.log(error);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    await productsManager.createProduct(req, res);
  } catch (error) {
    console.log(error);
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    await productsManager.deleteProduct(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default productsRouter;
