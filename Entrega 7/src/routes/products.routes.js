import { Router } from "express";
import productModel from "../mongoDB/models/Products.js";

const productsRouter = Router();

async function getPaginatedProducts(page, limit, categoryFilter = null) {
  const filter = {};

  if (categoryFilter) {
    filter.category = categoryFilter;
  }

  const pagination = await productModel.paginate(filter, {
    page,
    limit,
    sort: { price: -1 },
  });

  const products = pagination.docs;
  const productsExist = products.length > 0;
  const nextLink = pagination.hasNextPage
    ? `/products/page/${pagination.nextPage}/limit/${limit}`
    : null;
  const prevLink = pagination.hasPrevPage
    ? `/products/page/${pagination.prevPage}/limit/${limit}`
    : null;

  pagination.status = "success";
  pagination.nextLink = nextLink;
  pagination.prevLink = prevLink;

  return { products, productsExist, nextLink, prevLink };
}

productsRouter.get("/", async (req, res) => {
  const page = 1;
  const limit = 5;
  
  try {
    const productsData = await getPaginatedProducts(page, limit);
    res.render("products", productsData);
  } catch (error) {
    console.log("Hubo un error, intentar nuevamente, error: " + error);
  }
});

productsRouter.get("/page/:page/limit/:limit", async (req, res) => {
  const page = req.params.page || 1;
  const limit = req.params.limit || 10;
  const categoryFilter = req.body.category;

  try {
    const productsData = await getPaginatedProducts(
      page,
      limit,
      categoryFilter
    );
    res.render("products", productsData);
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

  console.log("Producto agregado correctamente!");
  res.status(200).json({ message: "Producto agregado" });
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
