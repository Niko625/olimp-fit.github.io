/* ===== Авторизация и работа с SQLite ===== */
document.addEventListener('DOMContentLoaded', () => {
  initAuthClose();
  initRegistration();
  initLogin();
  initProfile();
  protectProfile();
});

function initAuthClose() {
  if (!document.body.classList.contains('auth-body')) return;

  const goBack = () => {
    const ref = document.referrer;
    if (ref && new URL(ref).origin === location.origin) {
      history.back();
    } else {
      window.location.href = 'index.html';
    }
  };

  document.getElementById('auth-close')?.addEventListener('click', goBack);
  document.querySelector('.auth-overlay')?.addEventListener('click', goBack);
  document.querySelector('.auth-back-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') goBack();
  });
}

// РЕГИСТРАЦИЯ С ИСПОЛЬЗОВАНИЕМ СЕРВЕРА И SQLITE
function initRegistration() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const password = form.password.value;

    if (password.length < 6) {
      if (typeof showToast === 'function') showToast('Пароль должен быть не менее 6 символов', 'error');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    // Отправляем данные на Node.js сервер
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        if (typeof showToast === 'function') showToast(data.error, 'error');
      } else {
        // Сохраняем только ТЕКУЩЕГО пользователя локально для сессии
        localStorage.setItem('olimp_current_user', JSON.stringify({ ...userData, id: data.id }));
        if (typeof showToast === 'function') showToast('Регистрация успешна!');
        setTimeout(() => { window.location.href = 'profile.html'; }, 1000);
      }
    })
    .catch(err => {
      console.error(err);
      if (typeof showToast === 'function') showToast('Ошибка соединения с сервером', 'error');
    });
  });
}

// АВТОРИЗАЦИЯ С ИСПОЛЬЗОВАНИЕМ СЕРВЕРА И SQLITE
function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = form.login.value.trim().toLowerCase();
    const password = form.password.value;

    // Запрос к серверу для проверки пользователя в БД
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Неверный логин или пароль');
      return res.json();
    })
    .then(user => {
      localStorage.setItem('olimp_current_user', JSON.stringify(user));
      if (typeof showToast === 'function') showToast('Добро пожаловать!');
      setTimeout(() => { window.location.href = 'profile.html'; }, 800);
    })
    .catch(err => {
      console.error(err);
      if (typeof showToast === 'function') showToast('Неверный email/телефон или пароль', 'error');
    });
  });
}

function protectProfile() {
  if (!window.location.pathname.includes('profile.html')) return;
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('olimp_current_user') || 'null');
}

function initProfile() {
  if (!document.getElementById('profile-content')) return;
  renderProfile();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('olimp_current_user');
      if (typeof showToast === 'function') showToast('Вы вышли из аккаунта');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    });
  }
}

function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const phoneEl = document.getElementById('profile-phone');
  const avatarEl = document.getElementById('profile-avatar');
  const subEl = document.getElementById('profile-subscription');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (phoneEl) phoneEl.textContent = user.phone;
  if (avatarEl) avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  if (subEl) {
    if (user.subscription) {
      subEl.innerHTML = `<span class="subscription-badge">${user.subscription.name}</span>
        <p style="margin-top:12px;color:var(--text-secondary)">Действует до: ${user.subscription.until}</p>`;
    } else {
      subEl.innerHTML = '<p style="color:var(--text-secondary)">Нет активного абонемента. <a href="price.html">Выбрать тариф</a></p>';
    }
  }

  renderOrders();
  renderBookings();
}

function renderOrders() {
  const container = document.getElementById('profile-orders');
  if (!container) return;

  const payments = JSON.parse(localStorage.getItem('olimp_payments') || '[]');
  const cartOrders = JSON.parse(localStorage.getItem('olimp_orders') || '[]');
  const all = [...payments, ...cartOrders].sort((a, b) => b.id - a.id);

  if (!all.length) {
    container.innerHTML = '<p class="empty-state">Заказов пока нет</p>';
    return;
  }

  container.innerHTML = all.map(o => `
    <div class="order-item">
      <div>
        <strong>${o.item || o.items || 'Заказ'}</strong>
        <p style="color:var(--text-secondary);font-size:0.85rem">${o.date}</p>
      </div>
      <div>
        <span>${typeof formatPrice === 'function' ? formatPrice(o.price || o.total || 0) : (o.price || o.total || 0)} ₽</span>
        <span class="status-paid">${o.status || 'Оплачено'}</span>
      </div>
    </div>
  `).join('');
}

function renderBookings() {
  const container = document.getElementById('profile-bookings');
  if (!container) return;

  const bookings = JSON.parse(localStorage.getItem('olimp_bookings') || '[]');
  const user = getCurrentUser();
  const userBookings = bookings.filter(b => !user || b.userId === user.id || b.userEmail === user.email);

  if (!userBookings.length) {
    container.innerHTML = '<p class="empty-state">Записей на тренировки нет</p>';
    return;
  }

  container.innerHTML = userBookings.map(b => `
    <div class="booking-item">
      <div>
        <strong>${b.className}</strong>
        <p style="color:var(--text-secondary);font-size:0.85rem">${b.day} · ${b.time}</p>
      </div>
      <span class="status-paid">Записан</span>
    </div>
  `).join('');
}