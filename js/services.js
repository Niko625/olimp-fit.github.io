/* ===== Услуги — модальные окна ===== */
const SERVICES = {
  gym: { title: 'Тренажёрный зал', desc: 'Просторный зал площадью 1200 м² с оборудованием Technogym и Hammer Strength. Зоны: силовая, кардио, функциональный тренинг.', img: IMGS.gym },
  crossfit: { title: 'Кроссфит', desc: 'Специализированная зона с штангами, гирями, канатами и турниками. Групповые WOD-тренировки для любого уровня.', img: IMGS.crossfit },
  yoga: { title: 'Йога / Пилатес', desc: 'Занятия в светлом зале с ковриками и реформерами. Улучшение гибкости, осанки и снятие стресса.', img: IMGS.yoga },
  pool: { title: 'Бассейн', desc: '25-метровый бассейн с 4 дорожками, подогрев воды 27°C. Свободное плавание и групповые занятия.', img: IMGS.pool },
  personal: { title: 'Персональные тренировки', desc: 'Индивидуальная программа с сертифицированным тренером. Диагностика, план питания, контроль прогресса.', img: IMGS.personal },
  kids: { title: 'Детские секции', desc: 'Секции для детей 5–14 лет: плавание, гимнастика, единоборства. Безопасная среда и опытные педагоги.', img: IMGS.kids }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = SERVICES[btn.dataset.service];
      if (!s) return;
      document.getElementById('service-modal-title').textContent = s.title;
      document.getElementById('service-modal-desc').textContent = s.desc;
      document.getElementById('service-modal-img').src = s.img;
      document.getElementById('service-modal-img').alt = s.title;
      openModal('service-modal');
    });
  });
});
