const container = document.querySelector("#contenedor");
const modalBody = document.querySelector(".modal .modal-body");

const containerShoppingCart = document.querySelector("#carritoContenedor");
const removeAllProductsCart = document.querySelector("#vaciarCarrito");

const keepBuy = document.querySelector("#procesarCompra");
const totalPrice = document.querySelector("#precioTotal");

const activeFunction = document.querySelector('#activarFuncion')


const fakeStoreApi = "https://fakestoreapi.com/products";

let shoppingCart = [];
let productList = [];

let counter = 0;
let quantity = [];

// requisição e adição ao container

const fetchProducts = async () => {
  try {
    const response = await fetch(fakeStoreApi);
    if (!response.ok) {
      throw new Error("Nao foi possivel");
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
};

const addProductsContainer = (product) => {
  const { id, title, image, price, description } = product;
  container.innerHTML += `
  <div class="card mt-3" style="width: 18rem;">
  <img class="card-img-top mt-2" src="${image}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text" style="font-weight: bold">R$ ${price}</p>
      <p class="card-text">• ${description}</p>
      <button class="btn btn-primary" onclick="addProduct(${id})">Comprar produto</button>
    </div>
  </div>
  `;
};

const getProducts = async () => {
  const products = await fetchProducts();
  products.forEach(addProductsContainer);

  productList = products;
};

// adicionando produtos

const addProduct = (id) => {
  const testProductId = shoppingCart.some((item) => item.id === id);

  if (testProductId) {
    Swal.fire({
      title: "Item já adicionado",
      text: "Por favor selecione outro produto",
      icon: "success",
    });
    return;
  }

  shoppingCart.push({
    ...productList.find((item) => item.id === id),
    quantity: 1,
  });

  showShoppingCart();
};

// carrinho de compras

const showShoppingCart = () => {
  modalBody.innerHTML = "";

  shoppingCart.forEach((product) => {
    const { title, image, price, id } = product;

    modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
          <img class="img-fluid img-carrito" src="${image}"/>
        </div>
        <div>
          <p style="font-weight: bold">${title}</p>
          <p style="font-weight: bold">Preço: R$ ${price}</p>
          <div>
            <button onclick="removeProducts(${id})" class="btn btn-danger">Eliminar produto</button>
          </div>
        </div>
      </div>
    `;
  });

  totalPriceInCart(totalPrice);
  messageEmptyShoppingCart();
  containerShoppingCart.textContent = shoppingCart.length;
  setItemInLocalStorage();
};

//remover item do carrinho

const removeProducts = (id) => {
  const index = shoppingCart.findIndex((item) => item.id === id);

  if (index !== -1) {
    shoppingCart.splice(index, 1);
    showShoppingCart();
  }
};

// esvaziar carrinho

removeAllProductsCart.addEventListener("click", () => {
  shoppingCart.length = [];
  showShoppingCart();
});

// mensagem carrinho vazio
const messageEmptyShoppingCart = () => {
  if (shoppingCart.length === 0) {
    modalBody.innerHTML = `
      <p class="text-center text-primary parrafo">Não há itens no carrinho!</p>
    `;
  }
};

// continuar comprando

keepBuy.addEventListener("click", () => {
  if (shoppingCart.length === 0) {
    Swal.fire({
      title: "Seu carrinho está vazio",
      text: "Compre algo para continuar",
      icon: "error",
      confirmButtonText: "Aceitar",
    });
  } else {
    location.href = "index.html";
    finalOrder()
  }
});

// preço no carrinho

const totalPriceInCart = (totalPriceCart) => {
  totalPriceCart.innerText = shoppingCart.reduce((acc, prod) => {
    return acc + prod.price;
  }, 0);
};

// local storage
const setItemInLocalStorage = () => {
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};

const addItemInLocalStorage = () => {
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  setItemInLocalStorage();
  showShoppingCart();
};

document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
getProducts();
