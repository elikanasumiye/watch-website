const products = [
  {
    id: 1,
    name: "T-shirt za Rangi Mchanganyiko",
    description: "T-shirt laini za pamba zenye rangi nyingi kwa matumizi ya kila siku na vikundi.",
    price: 18000,
    image: "image/Exclusive-Design-Man-T-Shirt-Short-100-Cotton-Collar-Assorted-T-Shirts-for-Men.webp"
  },
  {
    id: 2,
    name: "T-shirt Nyeusi Crew Neck",
    description: "Muonekano wa kisasa na rahisi kuvaa, inafaa kwa jeans, koti, au mavazi ya kawaida.",
    price: 22000,
    image: "image/hemptique-hemp-crew-neck-t-shirt-black.webp"
  },
  {
    id: 3,
    name: "T-shirt ya Collar",
    description: "T-shirt yenye collar kwa mwonekano nadhifu zaidi kazini, dukani, au kwenye matembezi.",
    price: 25000,
    image: "image/W10248s.webp"
  },
  {
    id: 4,
    name: "T-shirt ya Graphic",
    description: "Chaguo la kipekee kwa wapenzi wa mitindo ya picha na mavazi yanayoonekana haraka.",
    price: 20000,
    image: "image/33b705173331423.648ea47a75676.webp"
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
const checkoutBtn = document.getElementById("checkoutBtn");
const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");

function formatCurrency(value) {
  return `TSh ${value.toLocaleString("sw-TZ")}`;
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
    cartItems.innerHTML = `<p class="empty-cart">Kikapu chako bado ni tupu. Ongeza T-shirt kuanza.</p>`;
    cartTotal.textContent = formatCurrency(0);
    if (orderForm) {
      orderForm.classList.remove("active");
      orderForm.reset();
    }
    if (checkoutBtn) {
      checkoutBtn.style.display = "block";
    }
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
          <button class="remove-btn" data-id="${item.id}">Ondoa</button>
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

function showOrderMessage(message, isError = false) {
  if (!orderMessage) return;
  orderMessage.textContent = message;
  orderMessage.className = `auth-message ${isError ? "error" : "success"}`;
  orderMessage.style.display = "block";
}

function getOrderItems() {
  return Object.values(cart).map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));
}

function getOrderTotal() {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
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
        <button class="add-button" data-id="${product.id}">Ongeza kikapuni</button>
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

if (checkoutBtn && orderForm) {
  checkoutBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      showOrderMessage("Tafadhali ongeza T-shirt kwenye kikapu kwanza.", true);
      orderForm.classList.add("active");
      return;
    }

    orderForm.classList.add("active");
    checkoutBtn.style.display = "none";
    orderForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", async event => {
    event.preventDefault();

    const items = getOrderItems();
    if (items.length === 0) {
      showOrderMessage("Kikapu chako ni tupu. Ongeza T-shirt kabla ya kutuma oda.", true);
      return;
    }

    const payload = {
      fullName: orderForm.fullName.value.trim(),
      email: orderForm.email.value.trim(),
      contact: orderForm.contact.value.trim(),
      location: orderForm.location.value.trim(),
      deliveryPayment: orderForm.deliveryPayment.value,
      items,
      total: getOrderTotal()
    };

    if (!payload.fullName || !payload.email || !payload.contact || !payload.location || !payload.deliveryPayment) {
      showOrderMessage("Tafadhali jaza taarifa zote za oda.", true);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        showOrderMessage(data.error || "Oda imeshindikana kutumwa. Jaribu tena.", true);
        return;
      }

      Object.keys(cart).forEach(id => delete cart[id]);
      updateCartCounter();
      updateCartPanel();
      orderForm.classList.add("active");
      if (checkoutBtn) {
        checkoutBtn.style.display = "none";
      }
      showOrderMessage("Oda yako imetumwa kikamilifu. Tutakupigia kwa uthibitisho na delivery.", false);
    } catch (error) {
      showOrderMessage("Hitilafu imetokea. Tafadhali jaribu tena.", true);
    }
  });

}

renderProducts();
updateCartCounter();
updateCartPanel();
