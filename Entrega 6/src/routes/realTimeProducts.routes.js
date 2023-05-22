import { Router } from "express";
import productModel from "../mongoDB/models/Products.js";

const realTimeProductsRouter =  Router();

realTimeProductsRouter.get("/", async (req, res) => {
  const products = await productModel.find();
  const productsExist = products.length > 0;
  res.render("realTimeProducts", { products, productsExist });
});

realTimeProductsRouter.post("/", async (req, res) => {
  const code = req.body.code;
  const productData = JSON.stringify(req.body);
  const product = JSON.parse(productData);
  const existingProduct = await productModel.findOne({ code });

  if (existingProduct) {
    return res.status(400).json({ error: "El código del producto ya existe" });
  }

  const newProduct = new productModel({
    title: product.title,
    description: product.description,
    code: product.code,
    category: product.category,
    price: product.price,
    stock: product.stock,
    thumbnail: product.thumbnail,
  });

  await newProduct.save();

  res.status(200).json({ message: "Producto agregado correctamente" });
});

realTimeProductsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedProduct = await productModel.findByIdAndRemove(id);

    if (!deletedProduct) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

export default realTimeProductsRouter;
