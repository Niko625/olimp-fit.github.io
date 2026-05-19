/* ===== Расписание ===== */
const SCHEDULE = [
  { day: 'Пн', time: '07:00', name: 'Силовая', type: 'strength' },
  { day: 'Пн', time: '10:00', name: 'Йога', type: 'yoga' },
  { day: 'Пн', time: '18:00', name: 'Кроссфит', type: 'strength' },
  { day: 'Пн', time: '20:00', name: 'Плавание', type: 'pool' },
  { day: 'Вт', time: '08:00', name: 'Пилатес', type: 'yoga' },
  { day: 'Вт', time: '12:00', name: 'Силовая', type: 'strength' },
  { day: 'Вт', time: '19:00', name: 'Бассейн', type: 'pool' },
  { day: 'Ср', time: '07:30', name: 'Йога', type: 'yoga' },
  { day: 'Ср', time: '17:00', name: 'Кроссфит', type: 'strength' },
  { day: 'Ср', time: '20:30', name: 'Аквааэробика', type: 'pool' },
  { day: 'Чт', time: '09:00', name: 'Силовая', type: 'strength' },
  { day: 'Чт', time: '11:00', name: 'Пилатес', type: 'yoga' },
  { day: 'Чт', time: '18:30', name: 'Плавание', type: 'pool' },
  { day: 'Пт', time: '07:00', name: 'Кроссфит', type: 'strength' },
  { day: 'Пт', time: '16:00', name: 'Йога', type: 'yoga' },
  { day: 'Пт', time: '19:00', name: 'Бассейн', type: 'pool' },
  { day: 'Сб', time: '10:00', name: 'Семейное плавание', type: 'pool' },
  { day: 'Сб', time: '12:00', name: 'Силовая', type: 'strength' },
  { day: 'Сб', time: '14:00', name: 'Йога', type: 'yoga' },
  { day: 'Вс', time: '11:00', name: 'Растяжка', type: 'yoga' },
  { day: 'Вс', time: '13:00', name: 'Бассейн', type: 'pool' }
];

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '16:00', '17:00', '18:00', '18:30', '19:00', '20:00', '20:30'];

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('schedule-body')) return;
  renderSchedule('all');
  initFilters();
  initBookingModal();
});

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.dataset.filter);
    });
  });
}

function renderSchedule(filter) {
  const tbody = document.getElementById('schedule-body');
  const filtered = filter === 'all' ? SCHEDULE : SCHEDULE.filter(c => c.type === filter);

  tbody.innerHTML = TIMES.map(time => {
    const cells = DAYS.map(day => {
      const classes = filtered.filter(c => c.day === day && c.time === time);
      if (!classes.length) return '<td>—</td>';
      return `<td>${classes.map(c =>
        `<span class="schedule-class ${c.type}" data-class="${c.name}" data-day="${day}" data-time="${time}" data-type="${c.type}">${c.name}</span>`
      ).join('')}</td>`;
    }).join('');
    return `<tr><td><strong>${time}</strong></td>${cells}</tr>`;
  }).join('');

  tbody.querySelectorAll('.schedule-class').forEach(el => {
    el.addEventListener('click', () => openBooking(el));
  });
}

function openBooking(el) {
  const modal = document.getElementById('booking-modal');
  const info = document.getElementById('booking-info');
  if (!modal || !info) return;

  info.innerHTML = `<p><strong>${el.dataset.class}</strong></p>
    <p style="color:var(--text-secondary)">${el.dataset.day}, ${el.dataset.time}</p>`;

  modal.dataset.className = el.dataset.class;
  modal.dataset.day = el.dataset.day;
  modal.dataset.time = el.dataset.time;
  openModal('booking-modal');
}

function initBookingModal() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modal = document.getElementById('booking-modal');
    const user = JSON.parse(localStorage.getItem('olimp_current_user') || 'null');

    const booking = {
      id: Date.now(),
      className: modal.dataset.className,
      day: modal.dataset.day,
      time: modal.dataset.time,
      userId: user?.id,
      userEmail: user?.email,
      name: form.name.value || user?.name || 'Гость',
      phone: form.phone.value || user?.phone || '',
      date: new Date().toLocaleString('ru-RU')
    };

    const bookings = JSON.parse(localStorage.getItem('olimp_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('olimp_bookings', JSON.stringify(bookings));

    closeModal('booking-modal');
    showToast('Вы записаны на тренировку!');
    form.reset();
  });
}
