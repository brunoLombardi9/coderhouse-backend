import { Router } from "express";
import { CartManager } from "../CartManager.js";

const cartRouter = new Router();
const cartManager = new CartManager("./src/cart.txt");

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    console.log(newCart);
  } catch (error) {
    console.log("Algo salio mal, intente nuevamente.");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const searchedCart = await cartManager.getCart(cid);
    console.log(searchedCart);
  } catch (error) {
    console.log(error)
    console.log("Algo salio mal, intente nuevamente.");
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const addProductResult = await cartManager.addProductToCart(cid, pid);
    console.log(addProductResult);
  } catch (error) {
    console.log(error)
    console.log("Algo salio mal, intente nuevamente.");
  }
});

export default cartRouter;
