import { promises as fs } from "fs";

export class ProductManager {
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

  getProps() {
    const props = [
      { property: "title", type: "string" },
      { property: "description", type: "string" },
      { property: "price", type: "number" },
      { property: "thumbnail", type: "array" },
      { property: "code", type: "string" },
      { property: "stock", type: "number" },
      { property: "category", type: "string" },
      { property: "status", type: "boolean" },
    ];
    return props;
  }

  async checkProperties(product) {
    const props = this.getProps();

    for (let i = 0; i < props.length; i++) {
      const hasProp = Object.keys(product).includes(props[i].property);
      const actualProperty = product[props[i].property];
      const actualType = props[i].type;

      if (!hasProp) return "Faltan datos.";

      if (actualType === "number") {
        product[props[i].property] = parseInt(actualProperty);
      }
      if (actualType === "array" || actualType === "boolean") {
        product[props[i].property] = JSON.parse(actualProperty);
      }
    }
  }

  async addProduct(product) {
    try {
      const productsFile = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(productsFile);
      const hasSameCode = productsArray.find((x) => x.code === product.code);
      const missingData = await this.checkProperties(product);

      if (missingData) return missingData;
      if (hasSameCode) {
        return `El code de ${product.title} ya existe.`;
      }

      const newProduct = new Product(
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.code,
        product.stock,
        product.category,
        product.status
      );

      productsArray.push(newProduct);
      await fs.writeFile(this.productsPath, JSON.stringify(productsArray));
      return "Producto agregado";
    } catch (error) {
      return "Hubo un problema, intenta nuevamente.";
    }
  }
  async getProducts() {
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      return "No se encontraron productos";
    }
  }
  async getProductById(id) {
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(products);
      const searchedProduct = productsArray.find((p) => p.id === id);

      if (searchedProduct) {
        return searchedProduct;
      } else {
        return "No se encontro el producto indicado";
      }
    } catch (error) {
      return "No se encontro archivo con productos";
    }
  }

  async updateProduct(id, product) {
    try {
      const products = await fs.readFile(this.productsPath, "utf-8");
      const productsArray = JSON.parse(products);
      const searchedProduct = productsArray.find((p) => p.id === id);
      const missingData = await this.checkProperties(product);
      const newArray = productsArray.filter((p) => p.id !== id);
      const hasSameCode = newArray.find((x) => x.code === product.code);

      if (!searchedProduct) return `No se encontro un producto con el id ${id}`;
      if (hasSameCode) return `El code de ${product.title} ya existe.`;
      if (missingData) return missingData;

      searchedProduct.title = product.title;
      searchedProduct.description = product.description;
      searchedProduct.price = product.price;
      searchedProduct.thumbnail = product.thumbnail;
      searchedProduct.code = product.code;
      searchedProduct.stock = product.stock;
      searchedProduct.category = product.category;
      searchedProduct.status = product.status;

      newArray.push(searchedProduct);
      await fs.writeFile(this.productsPath, JSON.stringify(newArray));

      return "Producto modificado";
    } catch (error) {
      return "Hubo un problema, intenta nuevamente.";
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
      const searchedProduct = productsArray.find((p) => p.id === id);

      if (!searchedProduct) return "No se encontro el producto a borrar.";

      await fs.writeFile(this.productsPath, JSON.stringify(newArray));
      return `Se borro correctamente el producto con el ${id}`;
    } catch (error) {
      return "No se encontro archivo de productos.";
    }
  }
}

class Product {
  constructor( title, description, price, thumbnail, code, stock, category, status) {
    (this.title = title),
      (this.description = description),
      (this.price = price),
      (this.thumbnail = thumbnail),
      (this.code = code),
      (this.stock = stock);
      this.category = category;
      this.status = status;
      this.id = ProductManager.asignId();
  }
}
