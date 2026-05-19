
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Сообщение отправлено! Мы свяжемся с вами.');
  e.target.reset();
});
