import { promises as fs } from "fs";
import { productManager } from "./routes/product.routes.js";

export class CartManager {
  constructor(productsPath) {
    this.productsPath = productsPath;
  }

  async createCart() {
    try {
      const cartFile = await fs.readFile(this.productsPath, "utf-8");
      const cartArray = JSON.parse(cartFile);
      const maxID = cartArray.reduce((max, prod) => (prod.id > max ? prod.id : max), 0);
      const newCart = new Cart(maxID ? maxID + 1 : 1);
      cartArray.push(newCart);
      await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
      return "Carrito creado.";
    } catch (error) {
      console.log(error);
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
      console.log(error)
      return "Hubo un problema, intenta nuevamente";
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cartFile = await fs.readFile(this.productsPath, "utf-8");
      const cartArray = JSON.parse(cartFile);
      const searchedCart = cartArray.find((cart) => cart.id === cid);
      const inCartProduct = searchedCart && searchedCart.products.find((prod) => prod.id === pid) 
      const product = await productManager.getProductById(pid);

      if (!searchedCart) return `No se encontraron carritos con el id ${cid}`;

      if (typeof product !== "object") {
        return `No se encontraron productos con el id ${pid}`;
      }

      if (inCartProduct) {
        inCartProduct.quantity++;
        await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
        return `Se sumo otra unidad del producto ${inCartProduct.title}.`;
      } else {
        const newItem = {
          id: product.id,
          title: product.title,
          quantity: 1,
        };
        searchedCart.products.push(newItem);
        await fs.writeFile(this.productsPath, JSON.stringify(cartArray));
        return `Se agrego una unidad del producto ${product.title}.`;
      }

    } catch (error) {
      console.log(error);
      return "Hubo un problema, intenta nuevamente";
    }
  }
}

class Cart {
  constructor(id) {
    this.id = id;
    this.products = [];
  }
}
