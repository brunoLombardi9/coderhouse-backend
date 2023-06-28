import { Schema, model } from "mongoose";

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 18,
  },
  password: {
    type: String,
    required: true,
    default: " ",
  },
  role: {
    type: String,
    default: "user",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
});

export const usersModel = model("Users", usersSchema);
