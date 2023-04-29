import express from "express";
import * as path from "path";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import productsRouter, { productManager } from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";

//Config

const app = express();
const PORT = 4000;

//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//Server IO

const server = app.listen(PORT);
const io = new Server(server);

io.on("connection", async (socket) => {
  socket.on("new-product", async (product) => {
    const addProduct = await productManager.addProduct(product);
    const products = await productManager.getProducts();

    socket.emit("updated-products", products);

    if (addProduct === "exist") {
      socket.emit("product-exist", "ya existe producto con ese code");
    }

    if (addProduct === "added") {
      socket.emit("product-added", "Producto añadido correctamente!");
    }
  });

  socket.on("delete-product", async (id) => {
    console.log(id)
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    socket.emit("updated-products", products);
  });
});

//Routes

app.use("/", express.static(__dirname + "/public"));
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
