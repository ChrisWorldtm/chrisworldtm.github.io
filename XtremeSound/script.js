/* ==========================================
   CONFIGURACIÓN
========================================== */

const WHATSAPP_NUMBER = "525642611184";

const PRODUCTS_URL =
  "https://chrisworldtm.github.io/XtremeSound/products.json";


/* ==========================================
   VARIABLES
========================================== */

let products = [];

let cart = [];

let selectedCategory = "Todos";


/* ==========================================
   ELEMENTOS
========================================== */

const productList =
  document.getElementById("product-list");

const searchInput =
  document.getElementById("search");

const cartElement =
  document.getElementById("cart");

const cartOverlay =
  document.getElementById("cart-overlay");

const cartItems =
  document.getElementById("cart-items");

const cartCount =
  document.getElementById("cart-count");

const cartTotal =
  document.getElementById("cart-total");

const productCounter =
  document.getElementById("product-counter");


/* ==========================================
   FORMATO DE PRECIOS
========================================== */

function formatPrice(price) {

  return Number(price).toLocaleString(
    "es-MX",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );

}


/* ==========================================
   CARGAR JSON
========================================== */

async function loadProducts() {

  try {

    const response =
      await fetch(PRODUCTS_URL);


    if (!response.ok) {

      throw new Error(
        "No se pudo cargar el catálogo."
      );

    }


    const data =
      await response.json();


    if (
      !data.products ||
      !Array.isArray(data.products)
    ) {

      throw new Error(
        "El archivo JSON no contiene productos válidos."
      );

    }


    products =
      data.products;


    renderProducts();

    updateCart();


  } catch (error) {

    console.error(error);


    productList.innerHTML = `

      <div class="empty-cart">

        <h3>
          No se pudieron cargar los productos
        </h3>

        <p>
          Comprueba que el archivo products.json
          esté disponible.
        </p>

      </div>

    `;

  }

}


/* ==========================================
   RENDER PRODUCTOS
========================================== */

function renderProducts() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  const filtered =
    products.filter(product => {


      const categoryMatch =
        selectedCategory === "Todos" ||
        product.category === selectedCategory;


      const productName =
        String(product.name || "")
          .toLowerCase();


      const variant =
        String(product.variant || "")
          .toLowerCase();


      const category =
        String(product.category || "")
          .toLowerCase();


      const id =
        String(product.id || "")
          .toLowerCase();


      const searchMatch =
        productName.includes(search) ||
        variant.includes(search) ||
        category.includes(search) ||
        id.includes(search);


      return categoryMatch &&
             searchMatch;

    });


  productList.innerHTML = "";


  productCounter.textContent =
    `${filtered.length} producto${filtered.length !== 1 ? "s" : ""}`;


  if (filtered.length === 0) {

    productList.innerHTML = `

      <div class="empty-cart">

        <h3>
          No encontramos productos
        </h3>

        <p>
          Intenta con otra búsqueda.
        </p>

      </div>

    `;

    return;

  }


  filtered.forEach(product => {

    const card =
      document.createElement("article");


    card.className =
      "product-card";


    let preparationHTML = "";


    if (
      product.preparation &&
      Number(product.preparation.days) > 0
    ) {

      preparationHTML = `

        <div class="preparation-badge">

          ⏳
          ${product.preparation.message || "Preparación del pedido."}

        </div>

      `;

    }


    const available =
      product.available === true &&
      Number(product.stock) > 0;


    card.innerHTML = `

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

      </div>


      <div class="product-info">

        <div class="product-category">

          ${product.category}

        </div>


        <h3 class="product-name">

          ${product.name}

        </h3>


        <div class="product-variant">

          ${product.variant || ""}

        </div>


        <div class="product-price">

          $${formatPrice(product.price)}
          ${product.currency}

        </div>


        ${preparationHTML}


        <div class="shipping-badge">

          🚚
          ${product.shipping?.message || "Envío seguro."}

        </div>


        <button
          class="add-button"
          data-id="${product.id}"
          ${!available ? "disabled" : ""}
        >

          ${
            available
              ? "Agregar al carrito"
              : "Agotado"
          }

        </button>

      </div>

    `;


    productList.appendChild(card);

  });

}


/* ==========================================
   AGREGAR PRODUCTO
========================================== */

function addToCart(id) {

  const product =
    products.find(
      item => item.id === id
    );


  if (!product) {
    return;
  }


  if (
    product.available !== true ||
    Number(product.stock) <= 0
  ) {

    return;

  }


  cart.push(product);


  updateCart();


  openCart();

}


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */

function removeFromCart(index) {

  if (
    index < 0 ||
    index >= cart.length
  ) {

    return;

  }


  cart.splice(index, 1);


  updateCart();

}


/* ==========================================
   ACTUALIZAR CARRITO
========================================== */

function updateCart() {

  cartCount.textContent =
    cart.length;


  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <h3>
          Tu carrito está vacío
        </h3>

        <p>
          Agrega productos para comenzar.
        </p>

      </div>

    `;


    cartTotal.textContent =
      "0.00";


    return;

  }


  cartItems.innerHTML = "";


  let total = 0;


  cart.forEach(
    (product, index) => {


      total +=
        Number(product.price);


      const item =
        document.createElement("div");


      item.className =
        "cart-item";


      item.innerHTML = `

        <div>

          <div class="cart-item-name">

            ${product.name}

          </div>


          <div class="cart-item-variant">

            ${product.variant || ""}

          </div>


          <div class="cart-item-price">

            $${formatPrice(product.price)}
            ${product.currency}

          </div>

        </div>


        <button
          class="remove-button"
          data-index="${index}"
        >

          Eliminar

        </button>

      `;


      cartItems.appendChild(item);

    }
  );


  cartTotal.textContent =
    formatPrice(total);

}


/* ==========================================
   CARRITO: ABRIR
========================================== */

function openCart() {

  cartElement.classList.add("open");

  cartOverlay.classList.add("active");

}


/* ==========================================
   CARRITO: CERRAR
========================================== */

function closeCart() {

  cartElement.classList.remove("open");

  cartOverlay.classList.remove("active");

}


/* ==========================================
   CATEGORÍAS
========================================== */

function selectCategory(category) {

  selectedCategory =
    category;


  document
    .querySelectorAll(".category")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.category === category
      );

    });


  renderProducts();

}


/* ==========================================
   WHATSAPP
========================================== */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    alert(
      "Tu carrito está vacío."
    );

    return;

  }


  let total = 0;


  let message =
    "Hola XtremeSound™ 👋\n\n
