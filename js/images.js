/* ===== Тематические изображения (Unsplash) ===== */
const IMGS = {
  hero: 'assets/products/photo-1576678927484-cc907957088c.png',
  gym: 'assets/products/photo-1576678927484-cc907957088c.png',
  pool: 'assets/products/638c04abffcff39cb433bd83c739f8e3.jpg',
  crossfit: 'assets/products/L_height.webp',
  yoga: 'assets/products/photo-1544367567-0f2fcb009e0b.jpg',
  personal: 'assets/products/1-3.jpg',
  kids: 'assets/products/det.sek.png',
  sauna: 'https://images.unsplash.com/photo-1540555617419-2b4c3c9d2f1e?w=800&q=80',
  authBg: 'assets/products/photo-1576678927484-cc907957088c.png',

  trainers: {
    igor: 'https://images.unsplash.com/photo-1581009146145-b5ef050c1498?w=500&q=80',
    anna: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
    maxim: 'https://images.unsplash.com/photo-1574680096145-b5cf8a110894?w=500&q=80',
    elena: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80',
    denis: 'https://images.unsplash.com/photo-1583454118551-6c1c7f6c3b8a?w=500&q=80'
  },

  products: {
    tshirtClassic: 'assets/products/tshirt-classic.png',
    tshirtPro: 'assets/products/tshirt-pro.png',
    hoodie: 'assets/products/hoodie-olimp.png',
    shaker: 'assets/products/shaker-olimp.png',
  },

  fallback: 'assets/products/photo-1576678927484-cc907957088c.png'
};

function initImageFallbacks() {
  document.querySelectorAll('img[data-img], img[src*="unsplash"]').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = IMGS.fallback;
      img.alt = img.alt || 'Спорткомплекс Олимп';
    });
  });
}

document.addEventListener('DOMContentLoaded', initImageFallbacks);
