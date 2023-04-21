import { promises as fs } from "fs";
import { productManager } from "./routes/product.routes.js";

export class CartManager {
  constructor(productsPath) {
    this.productsPath = productsPath;
  }

  static asignId() {
    if (this.nextId) {
      this.nextId++;
    } else {
      this.nextId = 1;
    }

    return this.nextId;
  }

  async createCart() {
    try {
      const cartFile = await fs.readFile(this.productsPath, "utf-8");
      const cartArray = JSON.parse(cartFile);
      const newCart = new Cart();
      cartArray.push(newCart);
      await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
      return "Carrito creado.";
    } catch (error) {
      return "Hubo un problema, intenta nuevamente";
    }
  }

  async getCart(id) {
    try {
      const cartFile = await fs.readFile(this.productsPath, "utf-8");
      const cartArray = JSON.parse(cartFile);
      const searchedCart = cartArray.find((cart) => cart.id === id);

      if (searchedCart) {
        return searchedCart.products;
      } else {
        return `No se encontraron carritos con el id ${id}`;
      }
    } catch (error) {
      return "Hubo un problema, intenta nuevamente";
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cartFile = await fs.readFile(this.productsPath, "utf-8");
      const cartArray = JSON.parse(cartFile);
      const searchedCart = cartArray.find((cart) => cart.id === cid);
      const inCartProduct = searchedCart.products.find(
        (prod) => prod.id === pid
      );
      const product = await productManager.getProductById(pid);

      if (!searchedCart) return `No se encontraron carritos con el id ${cid}`;

      if (typeof product !== "object")
        return `No se encontraron productos con el id ${cid}`;

      if (inCartProduct) {
        inCartProduct.quantity++;
        await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
      } else {
        const newItem = { id: CartManager.asignId(), quantity: 1 };
        searchedCart.products.push(newItem);
        await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
        console.log(searchedCart);
      }
      // return searchedCart

      // return `No se encontraron carritos con el id ${cid}`;
    } catch (error) {
      console.log(error);
      return "Hubo un problema, intenta nuevamente";
    }
  }
}

class Cart {
  constructor() {
    this.id = CartManager.asignId();
    this.products = [];
  }
}
