import "dotenv/config";
import express from "express";
import * as path from "path";
import exphbs from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";
import productsRouter from "./routes/products.routes.js";
import cookieParser from "cookie-parser";
import loginrouter from "./routes/login.routes.js";
import session from "express-session";
import signupRouter from "./routes/signup.routes.js";
import MongoStore from "connect-mongo";
import logoutRouter from "./routes/logout.routes.js";
import passport from "passport";
import "./utils/passportStrategies.js";


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

//Sessions

app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_ATLAS,
      ttl: 3000,
    }),
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {},
  })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

mongoose
  .connect(process.env.MONGODB_ATLAS)
  .then((res) => console.log("conectado"))
  .catch((err) => console.log(err));

//Server IO
export const io = new Server(server);

//Routes

app.use("/", express.static(__dirname + "/public"));
app.use("/signup", signupRouter);
app.use("/login", loginrouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/chat", chatRouter);
app.use("/logout", logoutRouter);
app.use((req, res) => res.redirect("/login"));
