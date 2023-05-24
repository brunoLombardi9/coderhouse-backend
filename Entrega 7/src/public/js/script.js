const socket = io();

//Elementos del DOM
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const code = document.querySelector("#code");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const user = document.querySelector("#user");
const message = document.querySelector("#message");

//Datos del form

function productsFormHandler(e) {
  e.preventDefault();
  const formData = {
    title: title.value,
    description: description.value,
    code: code.value,
    category: category.value,
    price: price.value,
    stock: stock.value,
  };

  fetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      if (res.status === 400) {
        console.log(res);
        alert("Ya existe un producto con el código ingresado");
      }
      if (res.status === 200) {
        console.log(res);
        alert("Producto agregado correctamente");
        location.reload();
      }
    })
    .catch((error) => alert("Algo salió mal, error" + error));
}

function deleteProduct(prodId) {
  const id = prodId;

  fetch(`/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 200) {
        alert("Producto eliminado correctamente");
        location.reload();
      }
      if (response.status === 400) {
        alert("Producto no encontrado");
      }
    })
    .catch((error) => {
      console.error("Error en la petición:", error);
    });
}

function chatHandler(e) {
  e.preventDefault();

  const chatData = {
    user: user.value,
    message: message.value,
  };

  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatData),
  }).catch((err) => console.log(err));
}

socket.on("new-message", (data) => {
  chat.innerHTML = "";
  data.map((message) => {
    return (chat.innerHTML += `
  <div class="d-flex gap-3 ms-5">
  <p>${message.user}:</p>
  <p>${message.message}</p>
 </div>`);
  });
});
