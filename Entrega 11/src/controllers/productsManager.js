import productModel from "../DAO/mongoDB/models/Products.js";
import getPaginatedProducts from "../utils/getPaginatedProducts.js";

class ProductsManager {
  async getProducts(req, res) {
    const user = req.session?.user || req.session?.passport?.user;
    const name = user?.name;
    const cartId = user?.cartId;

    if (!user) {
      return res.redirect("/login");
    }

    const page = 1;
    const limit = 10;

    try {
      const { products, productsExist, nextLink, prevLink } =
        await getPaginatedProducts(page, limit);

      res.render("products", {
        products,
        productsExist,
        nextLink,
        prevLink,
        name,
        cartId,
      });
    } catch (error) {
      console.log("Hubo un error, intentar nuevamente, error: " + error);
    }
  }

  async getProductsPaginate(req, res){
    const page = req.params.page || 1;
    const limit = req.params.limit || 10;
    const categoryFilter = req.body.category;
  
    const user = req.session?.user || req.session?.passport?.user;
    const name = user?.name;
    const cartId = user.cartId;
  
    if (!user) {
      return res.redirect("/login");
    }
  
    try {
      const { products, productsExist, nextLink, prevLink } =
        await getPaginatedProducts(page, limit, categoryFilter);
      res.render("products", {
        products,
        productsExist,
        nextLink,
        prevLink,
        name,
        cartId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createProduct(req, res){
    const code = req.body.code;
    const productData = JSON.stringify(req.body);
    const product = JSON.parse(productData);
    const existingProduct = await productModel.findOne({ code });
  
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "El código del producto ya existe" });
    }
  
    const newProduct = new productModel({
      title: product.title,
      description: product.description,
      code: product.code,
      category: product.category,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
  
    await newProduct.save();
  
    return res.status(200).json({ message: "Producto agregado!" });
  }

  async deleteProduct(req, res){
    const id = req.params.id;

    try {
      const deletedProduct = await productModel.findByIdAndRemove(id);
  
      if (!deletedProduct) {
        return res.status(400).json({ error: "Producto no encontrado" });
      }
  
      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

export default ProductsManager;
