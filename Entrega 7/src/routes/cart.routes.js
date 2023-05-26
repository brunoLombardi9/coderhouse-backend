import { Router } from "express";
import cartModel from "../mongoDB/models/Cart.js";
import productModel from "../mongoDB/models/Products.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  const cart = await cartModel.find();
  res.send(cart);
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const searchedCart = await cartModel.findById(cid);
    res.status(200).json(searchedCart);
  } catch (error) {
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

cartRouter.post("/:cid/product/:pid/quantity/:q", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const q = req.params.q;

    const existingCart = await cartModel.findById(cid);
    const existingProduct = await productModel.findById(pid);

    if (existingCart && existingProduct) {
      const productInCart = existingCart.products.find((p) =>
        p._id.equals(existingProduct._id)
      );

      if (productInCart) {
        productInCart.quantity = q;
      } else {
        const productAdded = {
          _id: existingProduct._id,
          quantity: q,
        };

        existingCart.products.push(productAdded);
      }

      existingCart.save();
    } else {
      console.log("El id del producto o el carrito son incorrectos");
    }
  } catch (error) {
    console.log(error);
    console.log("Algo salió mal, intente nuevamente.");
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

export default cartRouter;
