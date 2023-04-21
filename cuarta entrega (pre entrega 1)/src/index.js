import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { __dirname } from "./path.js";

const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT);

//Routes
app.use("/static", express.static(__dirname + "/public"));
app.use("/product", productRouter);
app.use("/cart", cartRouter);
