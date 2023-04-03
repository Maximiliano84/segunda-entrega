const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { ...product, id };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products));
    return newProduct;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error(`Not found`);
    }
    const updatedProduct = { ...products[productIndex], ...updatedFields, id };
    products[productIndex] = updatedProduct;
    await fs.writeFile(this.path, JSON.stringify(products));
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((product) => product.id !== id);
    await fs.writeFile(this.path, JSON.stringify(filteredProducts));
  }
}

// Ejemplo de uso
const productManager = new ProductManager("./products.json");

(async () => {
  await productManager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 100,
    thumbnail: "img/producto1.jpg",
    code: "abc123",
    stock: 10,
  });

  const products = await productManager.getProducts(2);
  console.log(products);

  const productToUpdate = await productManager.getProductById(1);
  const updatedProduct = await productManager.updateProduct(
    productToUpdate.id,
    {
      title: "Producto 1 Actualizado",
      price: 150,
      stock: 15,
    }
  );
  console.log(updatedProduct);


  //eliminar producto
  //await productManager.deleteProduct(updatedProduct.id);
})();
