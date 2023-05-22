import "dotenv/config";
import express from "express";
import * as path from "path";
import exphbs from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";

//Config

const app = express();
const server = app.listen(process.env.SERVER_PORT);
const hbs = exphbs.create({
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//Mongoose
const atlasConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ecommerce",
};

mongoose
  .connect(process.env.MONGODB_ATLAS, atlasConfig)
  .then((res) => console.log("conectado"))
  .catch((err) => console.log(err));

//Server IO
export const io = new Server(server);

//Routes

app.use("/", express.static(__dirname + "/public"));
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/chat", chatRouter)
