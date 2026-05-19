document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-trainer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.trainer;
      document.getElementById('trainer-modal-name').textContent = name;
      document.getElementById('trainer-book-name').value = name;
      openModal('trainer-modal');
    });
  });

  const form = document.getElementById('trainer-book-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('trainer-modal');
      showToast(`Заявка отправлена! ${form.name.value}, мы свяжемся с вами.`);
      form.reset();
    });
  }
});
