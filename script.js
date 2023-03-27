class ProductManager {
  constructor() {
    this.products = [];
    this.latestId = 1;
  }
  addProduct(...product) {

    product.forEach((p) => {
      const hasSameCode = this.products.find((x) => x.code === p.code);
      const productData = Object.values(p);

      if (hasSameCode || productData.includes(undefined)) {
        console.log(`Al producto ${p.title} le faltan datos / El codigo de producto ya existe`);
      } else {
        p.id = this.latestId;
        this.latestId++;
        this.products.push(p);
      }
    });
  }
  getProducts() {
    console.log(this.products);
  }
  getProductById(id) {
    const searchedProduct = this.products.find((p) => p.id === id);

    searchedProduct
      ? console.log(searchedProduct)
      : console.log("No se encontro ningun producto para ese Id");
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    (this.title = title),
      (this.description = description),
      (this.price = price),
      (this.thumbnail = thumbnail),
      (this.code = code),
      (this.stock = stock);
  }
}

const products = new ProductManager();

const product1 = new Product("Celular", "Telefonia", 50000, "url...", 400, 10);
const product2 = new Product("Auricular", "Audio", 8000, "url...", 500, 7);
const product3 = new Product("TV 50 pulgadas", "TV", 100000, "url...", 400, 15); // se repite el mismo code que el primer producto para forzar error
const product4 = new Product("Notebook banghoo", "Computacion", 200000, "url...", 600, 5);

products.addProduct(product1, product2, product3, product4);


//  products.getProducts();
//  products.getProductById(1);
//  products.getProductById(5);
