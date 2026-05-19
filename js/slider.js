/* ===== Слайдеры ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  if (document.querySelector('.reviews-swiper')) {
    new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }
});
