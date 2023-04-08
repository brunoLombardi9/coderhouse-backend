class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }
  addProduct(...product) {

    product.forEach((p) => {
      const hasSameCode = this.products.find((x) => x.code === p.code);
      const missingData = Object.values(p).includes(undefined);

      if (missingData) console.log(`Al producto ${p.title} le faltan datos.`);
      
      if (hasSameCode) console.log(`El codigo del producto ${p.title} ya existe`); 
      
      if (!missingData && !hasSameCode){
        p.id = this.nextId;
        this.products.push(p);
        this.nextId++;
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
const product4 = new Product("Notebook banghoo", "Computacion", 200000, "url...", 700, 5);

products.addProduct(product1, product2, product3, product4);


// products.getProducts();
// products.getProductById(1);
// products.getProductById(5);
