import express from "express";
import { ProductManager } from "./src/ProductManager.js";

const productManager = new ProductManager("./src/products.txt");

const app = express();

const PORT = 4000;

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  const results = limit ? products.slice(0, limit) : products;

  res.send(JSON.stringify(results));
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const products = await productManager.getProducts();
  const result = products.find((p) => p.id === parseInt(id));

  result
    ? res.send(JSON.stringify(result))
    : res.send("No se encontro producto");
});

app.listen(PORT);
