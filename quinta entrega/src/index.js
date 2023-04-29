import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import * as path from "path";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import { Server } from "socket.io";

const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
const server = app.listen(PORT);

//Socket.io
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("conectado");

  socket.on("mensaje", (data) => console.log(data));
});

//Routes
app.use("/", express.static(__dirname + "/public")); // apunta a public
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
