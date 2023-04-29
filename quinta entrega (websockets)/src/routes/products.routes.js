import { Router } from "express";
import { ProductManager } from "../productManager.js";

const productsRouter = new Router();
export const productManager = new ProductManager("./src/products.json");

productsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const productsExist = products.length > 0;
  res.render("home", { products, productsExist });
  console.log(products)
});


productsRouter.post("/", async (req, res) => {
  const addProductResult = await productManager.addProduct(req.body);
  console.log(addProductResult);
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    res.send(JSON.stringify(product));
    console.log(product);
  } catch (error) {
    res.send("No se encontro el producto indicado");
  }
});

productsRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateProductResult = await productManager.updateProduct(id, req.body);
  console.log(updateProductResult);
});

productsRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateProductResult = await productManager.deleteProduct(id);
  console.log(updateProductResult);
});


export default productsRouter;
