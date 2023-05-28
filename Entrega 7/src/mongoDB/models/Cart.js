import { Schema, model } from "mongoose";
import productModel from "./Products.js"; // Importa el modelo de productos

const cartSchema = new Schema({
  products: [
    {
      id_prod: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const cartModel = model("carts", cartSchema);

export default cartModel;

