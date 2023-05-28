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
    const searchedCart = await cartModel
      .findById(cid)
      .populate("products.id_prod");

    const products = searchedCart.products.map((product) => ({
      id: product.id_prod,
      title: product.id_prod.title,
      price: product.id_prod.price,
      quantity: product.quantity,
      totalProduct: product.id_prod.price * product.quantity,
    }));

    let cartTotal = 0;
    const productsExist = products.length > 0;

    products.forEach((product) => (cartTotal += product.totalProduct));

    res.status(200).render("cart", { products, productsExist, cartTotal });
  } catch (error) {
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    const existingCart = await cartModel.findById(cid);
    const existingProduct = await productModel.findById(pid);

    if (existingCart && existingProduct) {
      const productInCart = existingCart.products.find((p) =>
        p.id_prod.equals(existingProduct._id)
      );

      if (productInCart) {
        productInCart.quantity = quantity;
      } else {
        const productAdded = {
          id_prod: existingProduct._id,
          quantity: quantity,
        };

        existingCart.products.push(productAdded);
      }

      existingCart.save();
      res
        .status(200)
        .json({ message: "El producto se ha agregado correctamente!" });
    } else {
      res
        .status(200)
        .json({ message: "El id del producto o el carrito son incorrectos" });
    }
  } catch (error) {
    console.log("Algo salió mal, intente nuevamente.");
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  //  Enviar la propiedad id_prod desde postman
  try {
    const cid = req.params.cid;
    const newItems = req.body;
    const existingCart = await cartModel.findById(cid);
    const products = await productModel.find();
    let error = null;

    newItems.forEach(async (product) => {
      const pid = product.id_prod;
      const productExist = products.find((p) => p._id.equals(pid));
      const productInCart = existingCart.products.find((p) =>
        p.id_prod.equals(pid)
      );

      if (!productExist) {
        error = "El producto a ingresar no existe";
        return;
      }

      if (productInCart) {
        error = "El producto a ingresar ya existe en el carrito";
        return;
      }

      if (!product.quantity) product.quantity = 1;
    });

    if (error) {
      res.status(400).json({ error });
    } else {
      existingCart.products = [];
      existingCart.products.push(...newItems);
      await existingCart.save();
      res
        .status(200)
        .json({ message: "Productos insertados con éxito en el carrito" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al insertar productos en el carrito" });
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    const existingCart = await cartModel.findById(cid);
    const existingProduct = await productModel.findById(pid);

    if (existingCart && existingProduct) {
      const productInCart = existingCart.products.find((p) =>
        p.id_prod.equals(existingProduct._id)
      );

      if (productInCart) {
        productInCart.quantity = quantity;
        existingCart.save();
        return res
          .status(200)
          .json({ message: "Se ha modificado la cantidad" });
      } else {
        return res
          .status(400)
          .json({ error: "El producto indicado no esta en el carrito" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "El producto indicado no esta en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const existingCart = await cartModel.findById(cid);

    existingCart.products = [];

    existingCart.save();

    return res.status(200).json({ message: "El carrito se ha vaciado" });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Hubo un problema, intenta nuevamente" });
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const existingCart = await cartModel.findById(cid);
    const productExist = existingCart.products.find(
      (product) => product.id_prod.toString() === pid
    );

    if (!productExist) {
      return res
        .status(400)
        .json({ error: "El producto ingresado no existe en el carrito" });
    }

    if (!existingCart) {
      return res.status(400).json({ error: "El carrito no existe." });
    }

    existingCart.products = existingCart.products.filter(
      (product) => product.id_prod.toString() !== pid
    );

    await existingCart.save();

    return res.json({
      message: "Producto eliminado del carrito correctamente.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito." });
  }
});

export default cartRouter;
