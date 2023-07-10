import productModel from "../DAO/mongoDB/models/Products.js";

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

  export default getPaginatedProducts;