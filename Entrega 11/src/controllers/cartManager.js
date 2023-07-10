import cartModel from "../DAO/mongoDB/models/Cart.js";
import productModel from "../DAO/mongoDB/models/Products.js";

class CartManager {
  async getCart(req, res) {
    const cid = req.params.cid;
    const user = req.session?.user || req.session?.passport?.user;

    if (!user || cid !== user.cartId) {
      return res.redirect("/login");
    }

    try {
      const cid = req.params.cid;
      const searchedCart = await cartModel
        .findById(cid)
        .populate("products.id_prod");

      const products = searchedCart.products.map((product) => ({
        id: product.id_prod._id,
        title: product.id_prod.title,
        price: product.id_prod.price,
        quantity: product.quantity,
        totalProduct: product.id_prod.price * product.quantity,
      }));

      let cartTotal = 0;
      const productsExist = products.length > 0;

      products.forEach((product) => (cartTotal += product.totalProduct));

      return res
        .status(200)
        .render("cart", { products, productsExist, cartTotal });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Algo salió mal, intente nuevamente." });
    }
  }

  async createCart(req, res) {
    const user = req.session?.user || req.session?.passport?.user;

    if (!user) {
      return res.redirect("/login");
    }
    try {
      const cid = user.cartId;
      const pid = req.params.pid;
      const quantity = req.body.quantity || 1;

      const existingCart = await cartModel.findById(cid);
      const existingProduct = await productModel.findById(pid);

      if (existingCart && existingProduct) {
        const productInCart = existingCart.products.find((p) =>
          p.id_prod.equals(existingProduct._id)
        );

        if (productInCart) {
          productInCart.quantity = quantity;
        } else {
          const productAdded = {
            id_prod: existingProduct._id,
            quantity: quantity,
          };

          existingCart.products.push(productAdded);
        }

        existingCart.save();
       return res
          .status(200)
          .json({ message: "El producto se ha agregado correctamente!" });
      } else {
       return res
          .status(200)
          .json({ message: "El id del producto o el carrito son incorrectos" });
      }
    } catch (error) {
      console.log("Algo salió mal, intente nuevamente.");
      return res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
    }
  }

  async updateQuantity(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const quantity = req.body.quantity || 1;

      const existingCart = await cartModel.findById(cid);
      const existingProduct = await productModel.findById(pid);

      if (existingCart && existingProduct) {
        const productInCart = existingCart.products.find((p) =>
          p.id_prod.equals(existingProduct._id)
        );

        if (productInCart) {
          productInCart.quantity = quantity;
          existingCart.save();
          return res
            .status(200)
            .json({ message: "Se ha modificado la cantidad" });
        } else {
          return res
            .status(400)
            .json({ error: "El producto indicado no esta en el carrito" });
        }
      } else {
        return res
          .status(400)
          .json({ error: "El producto indicado no esta en el carrito" });
      }
    } catch (error) {
      res.status(500).json({ error: "Algo salió mal, intente nuevamente." });
    }
  }

  async deleteCart(req, res) {
    try {
      const cid = req.params.cid;
      const existingCart = await cartModel.findById(cid);

      existingCart.products = [];

      existingCart.save();

      return res.status(200).json({ message: "El carrito se ha vaciado" });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Hubo un problema, intenta nuevamente" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const existingCart = await cartModel.findById(cid);
      const productExist = existingCart.products.find(
        (product) => product.id_prod.toString() === pid
      );

      if (!productExist) {
        return res
          .status(400)
          .json({ error: "El producto ingresado no existe en el carrito" });
      }

      if (!existingCart) {
        return res.status(400).json({ error: "El carrito no existe." });
      }

      existingCart.products = existingCart.products.filter(
        (product) => product.id_prod.toString() !== pid
      );

      await existingCart.save();

      return res.json({
        message: "Producto eliminado del carrito correctamente.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al eliminar el producto del carrito." });
    }
  }
}

export default CartManager;
