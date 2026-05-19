/* ===== Корзина ===== */
const PRODUCTS = [
  
  { id: 1, name: 'Футболка Олимп Classic', price: 1990, category: 'Футболки', img: IMGS.products.tshirtClassic, desc: 'Чёрная, хлопок премиум' },
  { id: 2, name: 'Футболка Олимп Pro Fit', price: 2490, category: 'Футболки', img: IMGS.products.tshirtPro, desc: 'Графитовая, дышащая ткань для тренировок' },
  { id: 3, name: 'Худи Олимп Warm', price: 4490, category: 'Худи', img: IMGS.products.hoodie, desc: 'Утеплённое худи с капюшоном и логотипом' },
  { id: 4, name: 'Шейкер Олимп 600ml', price: 1290, category: 'Шейкеры', img: IMGS.products.shaker, desc: 'Чёрный, с сеткой для коктейлей' },
];

function getProductUrl(id) {
  return `product.html?id=${id}`;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function productImgClass(light) {
  return light ? 'product-card__img product-card__img--light' : 'product-card__img';
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('shop-grid')) renderShop();
  if (document.getElementById('product-detail')) renderProduct();
  if (document.getElementById('cart-items')) renderCart();
  initCartCheckout();
});

function getCart() {
  return JSON.parse(localStorage.getItem('olimp_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('olimp_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  showToast(`${product.name} добавлен в корзину`);
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="glass-card product-card" data-aos="fade-up">
      <a href="${getProductUrl(p.id)}" class="${productImgClass(p.light)}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </a>
      <div class="product-card__body">
        <span style="color:var(--accent-purple);font-size:0.8rem">${p.category}</span>
        <h3><a href="${getProductUrl(p.id)}" class="product-card__title">${p.name}</a></h3>
        <p style="color:var(--text-secondary);font-size:0.85rem">${p.desc}</p>
        <p class="product-card__price">${formatPrice(p.price)} ₽</p>
        <div class="product-card__actions">
          <a href="${getProductUrl(p.id)}" class="btn btn-outline btn-block"><i class="fas fa-eye"></i> Осмотр</a>
          <button type="button" class="btn btn-primary btn-block" onclick="addToCart(${p.id})">
            <i class="fas fa-cart-plus"></i> В корзину
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderProduct() {
  const container = document.getElementById('product-detail');
  const id = new URLSearchParams(window.location.search).get('id');
  const product = getProductById(id);

  if (!product) {
    container.innerHTML = `
      <div class="empty-state glass-card product-not-found">
        <p>Товар не найден</p>
        <a href="shop.html" class="btn btn-primary" style="margin-top:20px">В магазин</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} — ОЛИМП`;

  container.innerHTML = `
    <article class="glass-card product-detail" data-aos="fade-up">
      <div class="${productImgClass(product.light)} product-detail__gallery">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <div class="product-detail__info">
        <span class="product-detail__category">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="product-detail__desc">${product.desc}</p>
        <p class="product-card__price product-detail__price">${formatPrice(product.price)} ₽</p>
        <div class="product-detail__actions">
          <button type="button" class="btn btn-primary" onclick="addToCart(${product.id})">
            <i class="fas fa-cart-plus"></i> В корзину
          </button>
          <a href="shop.html" class="btn btn-outline"><i class="fas fa-store"></i> Все товары</a>
        </div>
      </div>
    </article>
  `;
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = '<div class="empty-state glass-card"><p>Корзина пуста</p><a href="shop.html" class="btn btn-primary" style="margin-top:20px">В магазин</a></div>';
    if (totalEl) totalEl.textContent = '0';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const sum = item.price * item.qty;
    total += sum;
    return `
      <div class="glass-card cart-item">
        <a href="${getProductUrl(item.id)}" class="cart-item__img ${item.light ? 'cart-item__img--light' : ''}"><img src="${item.img}" alt="${item.name}" loading="lazy"></a>
        <div class="cart-item__info">
          <h3><a href="${getProductUrl(item.id)}">${item.name}</a></h3>
          <p style="color:var(--text-secondary)">${formatPrice(item.price)} ₽</p>
        </div>
        <div class="cart-item__qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <strong>${formatPrice(sum)} ₽</strong>
        <button class="btn btn-outline btn-sm" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = formatPrice(total);
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }
  renderCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
  showToast('Товар удалён', 'info');
}

function initCartCheckout() {
  const btn = document.getElementById('checkout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) {
      showToast('Корзина пуста', 'error');
      return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: Date.now(),
      items: cart.map(i => `${i.name} ×${i.qty}`).join(', '),
      price: total,
      total,
      date: new Date().toLocaleString('ru-RU'),
      status: 'Оплачено'
    };

    const orders = JSON.parse(localStorage.getItem('olimp_orders') || '[]');
    orders.push(order);
    localStorage.setItem('olimp_orders', JSON.stringify(orders));
    localStorage.setItem('olimp_cart', '[]');
    updateCartBadge();
    showToast('Заказ оформлен!');
    renderCart();
  });
}
// Эта функция срабатывает при успешной "оплате" в модальном окне
async function processOrder(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Заказ успешно сохранен в базе данных!');
            localStorage.removeItem('olimp_cart'); // Очищаем корзину после успеха
            window.location.href = 'profile.html'; // Переходим в кабинет
        }
    } catch (error) {
        console.error('Ошибка БД:', error);
        alert('Сервер не отвечает. Убедитесь, что запущен node server.js');
    }
}

// Слушатель для вашей формы из shop.html
document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('olimp_current_user') || '{}');
    const cart = JSON.parse(localStorage.getItem('olimp_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
        userId: user.id || 1, // Если не залогинен, ставим ID 1 для теста
        items: cart,
        total: total,
        date: new Date().toLocaleString()
    };

    processOrder(orderData);
});
// Функция для отправки данных заказа на сервер (Node.js + SQLite)
async function processOrder(orderData) {
    try {
        
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData) 
        });

        if (response.ok) {
            const result = await response.json();
            alert('Успех! ' + result.message);
            
            
            localStorage.removeItem('olimp_cart');
            window.location.href = 'profile.html';
        } else {
            throw new Error('Ошибка при сохранении заказа');
        }
    } catch (error) {
        console.error('Критическая ошибка при связи с сервером:', error);
        alert('Не удалось связаться с сервером. Проверьте подключение.');
    }
}
