import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productRouter = new Router();
export const productManager = new ProductManager("./src/products.txt");

productRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    const results = limit ? products.slice(0, limit) : products;
    res.send(JSON.stringify(results));
    console.log(results);
  } catch (error) {
    res.send("No hay productos guardados");
  }
});

productRouter.post("/", async (req, res) => {
  const addProductResult = await productManager.addProduct(req.body);
  console.log(addProductResult);
});

productRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    res.send(JSON.stringify(product));
    console.log(product);
  } catch (error) {
    res.send("No se encontro el producto indicado");
  }
});

productRouter.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateProductResult = await productManager.updateProduct(id, req.body);
  console.log(updateProductResult);
});

productRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateProductResult = await productManager.deleteProduct(id);
  console.log(updateProductResult);
});

export default productRouter;
