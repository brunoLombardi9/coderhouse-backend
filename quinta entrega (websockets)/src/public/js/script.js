const socket = io();

//Datos del form
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const code = document.querySelector("#code");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const realTimeProducts = document.querySelector("#realTimeProducts");

function productsFormHandler(e) {
  e.preventDefault();

  const newProduct = {
    title: title.value,
    description: description.value,
    price: parseFloat(price.value),
    thumbnail: [],
    code: code.value,
    stock: parseInt(stock.value),
    category: category.value,
    status: true,
  };

  socket.emit("new-product", newProduct);
}

function deleteProduct(prodId) {
  const id = parseInt(prodId);
  socket.emit("delete-product", id);
}

function generateCards(products) {
  realTimeProducts.innerHTML = "";
  products.forEach((p) => {
    const productCard = `      
   <div class="card m-3" style="width: 18rem;">
    <ul class="list-group list-group-flush">
       <li class="list-group-item">${p.title}</li>
       <li class="list-group-item">${p.description}</li>
       <li class="list-group-item">$${p.price}</li>
       <li class="list-group-item">${p.code}</li>
       <li class="list-group-item">${p.stock}</li>
       <li class="list-group-item">${p.category}</li>
       <li class="list-group-item">${p.id}</li>
     <button
        class="btn btn-danger"
        onclick="deleteProduct(${p.id})"
         >Eliminar</button>
     </ul>
   </div>`;
    realTimeProducts.innerHTML += productCard;
  });
}

socket.on("updated-products", (data) => {
  generateCards(data);
});

socket.on("product-exist", (message) => {
  alert(message)
})

socket.on("product-added", (message) => {
  alert(message)
})
