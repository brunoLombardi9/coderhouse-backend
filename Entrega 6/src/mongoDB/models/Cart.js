import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

const cartModel = model("carts", cartSchema);

export default cartModel;
