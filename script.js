const products = [
  {
    id: 1,
    name: "Poedagar Luxury Business Quartz Watch",
    description: "Classic stainless steel strap with luminous date display and elegant black dial.",
    price: 85000,
    image: "image/Poedagar-Men-Watch-Luxury-Business-Quartz-Watches-Stainless-Stain-Strap-Sport-Chronograph-Men-39-s-Wristwatch-Waterproof-Luminous-Quartz-Wristwatches_7b31bf36-11cf-4c68-8dfd-e630bc9a93f6.284ee349d31df69a.avif"
  },
  {
    id: 2,
    name: "Poedagar Sport Chronograph Quartz Watch",
    description: "Full steel luxury chronograph with waterproof construction and sharp modern styling.",
    price: 95000,
    image: "image/POEDAGAR-Men-Watch-Sport-Chronograph-Quartz-Watches-Top-Brand-Luxury-Full-Steel-Waterproof-Luminous-Date-Man-Fashion-Wristwatch_53c89d5b-c864-46de-9688-800c14fb1076.85ada78dc657f86f75a3569f267df7d7.avif"
  }
];

const cart = {};
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const viewProductsBtn = document.getElementById("viewProductsBtn");

function formatCurrency(value) {
  return `TSh ${value.toLocaleString("en-US")}`;
}

function updateCartCounter() {
  if (!cartCount) return;
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function updateCartPanel() {
  if (!cartItems || !cartTotal) return;
  cartItems.innerHTML = "";

  const items = Object.values(cart);
  if (items.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty. Add a watch to start.</p>`;
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
    const itemNode = document.createElement("div");
    itemNode.className = "cart-item";
    itemNode.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} × ${item.quantity}</p>
        <div class="cart-item-actions">
          <span>${formatCurrency(item.price * item.quantity)}</span>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    cartItems.appendChild(itemNode);
  });

  cartTotal.textContent = formatCurrency(total);
}

function addToCart(productId) {
  if (!cartPanel) return;
  const product = products.find(item => item.id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 0 };
  }
  cart[productId].quantity += 1;
  updateCartCounter();
  updateCartPanel();
  if (!cartPanel.classList.contains("open")) {
    cartPanel.classList.add("open");
  }
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCartCounter();
  updateCartPanel();
}

function renderProducts() {
  if (!productGrid) return;
  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
      </div>
      <div class="product-meta">
        <span class="price">${formatCurrency(product.price)}</span>
        <button class="add-button" data-id="${product.id}">Add to cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

if (productGrid) {
  productGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    const productId = Number(button.dataset.id);
    addToCart(productId);
  });
}

if (cartItems) {
  cartItems.addEventListener("click", event => {
    if (!event.target.classList.contains("remove-btn")) return;
    const productId = Number(event.target.dataset.id);
    removeFromCart(productId);
  });
}

if (cartToggle && cartPanel) {
  cartToggle.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });
}

if (closeCart && cartPanel) {
  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });
}

if (viewProductsBtn) {
  viewProductsBtn.addEventListener("click", () => {
    const productsSection = document.getElementById("productsSection");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const authTabs = document.querySelectorAll(".auth-tab");
const authPanels = document.querySelectorAll(".auth-panel");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (authTabs.length && authPanels.length) {
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(item => item.classList.remove("active"));
      authPanels.forEach(panel => panel.classList.remove("active"));
      tab.classList.add("active");
      const activePanel = document.getElementById(`${tab.dataset.tab}Form`);
      if (activePanel) {
        activePanel.classList.add("active");
      }
    });
  });
}

function handleAuthSubmit(event, action) {
  event.preventDefault();
  alert(`${action} successful. You can now continue shopping.`);
  event.target.reset();
  window.location.href = "index.php";
}

if (loginForm) {
  loginForm.addEventListener("submit", event => handleAuthSubmit(event, "Login"));
}

if (registerForm) {
  registerForm.addEventListener("submit", event => handleAuthSubmit(event, "Register"));
}

renderProducts();
updateCartCounter();
updateCartPanel();
