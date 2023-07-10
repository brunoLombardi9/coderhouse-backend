import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const cartRouter = Router();

const cartManager = new CartManager();

cartRouter.get("/:cid", async (req, res) => {
  try {
    return await cartManager.getCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/:pid", async (req, res) => {
  try {
    return await cartManager.createCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    return await cartManager.updateQuantity(req, res);
  } catch (error) {
    console.log(error);
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    return await cartManager.deleteCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    return await cartManager.deleteProduct(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default cartRouter;
