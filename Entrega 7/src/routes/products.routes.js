import { Router } from "express";
import productModel from "../mongoDB/models/Products.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    const productsExist = products.length > 0;
    console.log(products);
    res.render("products", { products, productsExist });
  } catch (error) {
    console.log("Hubo un error, intentar nuevamente, error:" + error);
  }
});

productsRouter.get("/page/:page/limit/:limit", async (req, res) => {
  const page = req.params.page || 1;
  const limit = req.params.limit || 10;

  try {
    const pagination = await productModel.paginate(
      {},
      { page, limit, sort: { price: 1 } }
    );
    const products = pagination.docs;
    const productsExist = products.length > 0;
    const nextLink = `/products/page/${pagination.nextPage}/limit/${limit}`;
    const prevLink = `/products/page/${pagination.prevPage}/limit/${limit}`;

    pagination.status = "success";
    pagination.nextLink = pagination.hasNextPage ? nextLink : null;
    pagination.prevLink = pagination.hasPrevPage ? prevLink : null;

    res.json(pagination);
    res.render("products", { products, productsExist });
  } catch (error) {
    console.error(error);
  }
});

productsRouter.post("/", async (req, res) => {
  const code = req.body.code;
  const productData = JSON.stringify(req.body);
  const product = JSON.parse(productData);
  const existingProduct = await productModel.findOne({ code });

  if (existingProduct) {
    console.log("El código del producto ya existe");
    return res.status(400);
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

  console.log("Producto agregado correcamente!");
  res.status(200);
});

productsRouter.delete("/:id", async (req, res) => {
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
});

export default productsRouter;
