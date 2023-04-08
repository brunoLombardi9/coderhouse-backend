import { promises as fs } from "fs";

class ProductManager {
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

  async addProduct(product) {
    const missingData = Object.values(product).includes(undefined);
    if (missingData) {
      console.log(`Al producto ${product.title} le faltan datos.`);
      return;
    }

    try {
      const productsFile = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(productsFile);
      const hasSameCode = productsArray.find((x) => x.code === product.code);
      if (hasSameCode) {
        console.log(`El code de ${product.title} ya existe.`);
        return;
      } else {
        productsArray.push(product);
        await fs.writeFile(this.productsPath, JSON.stringify(productsArray));
        console.log(
          `Se ha registrado el producto ${product.title} correctamente.`
        );
      }
    } catch (error) {
      await fs.writeFile(this.productsPath, JSON.stringify([product]));
      console.log(
        `Se ha registrado el producto ${product.title} correctamente.`
      );
    }
  }
  async getProducts() {
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      console.log(JSON.parse(products));
    } catch (error) {
      console.log("No se encontro archivo con productos.");
    }
  }
  async getProductById(id) {
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(products);
      const searchedProduct = productsArray.find((p) => p.id === id);

      searchedProduct
        ? console.log(searchedProduct)
        : console.log("No se encontro ningun producto para ese Id");
    } catch (error) {
      console.log("No se encontro archivo con productos.");
    }
  }

  async updateProduct(id, property, newValue) {
    if (property === "id") {
      console.log("No se permite modificar el id");
      return;
    }
    if (!newValue) {
      console.log("El nuevo valor no puede estar vacio");
    }
    const numericProperties = ["price", "stock"];
    if (numericProperties.includes(property) &&  typeof(newValue) !== "number") {
      console.log("Las propiedades price y stock solo pueden ser numericas");
      return;
    }
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(products);
      const searchedProduct = productsArray.find((p) => p.id === id);
      if (Object.keys(searchedProduct).includes(property)) {
        searchedProduct[property] = newValue;
        await fs.writeFile(this.productsPath, JSON.stringify(productsArray));
      } else {
        console.log("Propiedad invalida.");
      }
    } catch (error) {
      console.log("No se encontro archivo con productos.");
    }
  }

  async deleteProduct(id) {
    if (!id) {
      console.log("Es obligatorio ingresar id del producto");
      return;
    }
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(products);
      const newArray = productsArray.filter((p) => p.id !== id);
      await fs.writeFile(this.productsPath, JSON.stringify(newArray));
      console.log(`Se borro correctamente el producto con el ${id}`);
    } catch (error) {
      console.log("No se encontro archivo de productos.");
    }
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
    this.id = ProductManager.asignId();
  }
}

const productManager = new ProductManager("./products.txt");

const product1 = new Product("Celular", "Telefonia", 50000, "url...", 400, 10);
const product2 = new Product("Auricular", "Audio", 8000, "url...", 500, 7);
const product3 = new Product("TV 50 pulgadas", "TV", 100000, "url...", 400, 15); // se repite el mismo code que el primer producto para forzar error
const product4 = new Product( "Notebook banghoo", "Computacion", 200000, "url...", 700, 5 );

await productManager.addProduct(product1);
await productManager.addProduct(product2);
await productManager.addProduct(product3);
await productManager.addProduct(product4);
// await productManager.updateProduct(4, "stock", 15);
// await productManager.getProductById(4);
// await productManager.deleteProduct(2);
await productManager.getProducts();
