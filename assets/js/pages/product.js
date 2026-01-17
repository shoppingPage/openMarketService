const productContainer = document.getElementById("product-container");

async function fetchAndRender() {
  try {
    const res = await fetch(
      "https://api.wenivops.co.kr/services/open-market/products/"
    );
    const data = await res.json();
    const products = data.results;

    productContainer.innerHTML = products
      .map(
        (product) => `
      <article class="product-item">
        <a href="product-detail/index.html?id=${product.id}">
          <figure class="product-image">
            <img src="${toHttps(product.image)}" alt="${product.name} 이미지">
          </figure>
          
          <div class="product-info">
            <span class="brand-name">${product.seller.store_name}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">
              <span class="amount">${product.price.toLocaleString()}</span><span class="unit">원</span>
            </p>
          </div>
        </a>
      </article>
    `
      )
      .join("");
  } catch (err) {
    console.error("데이터 로딩 중 오류:", err);
    window.location.href = "./404/";
  }
}

fetchAndRender();

// 배너 슬라이더
(function() {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  let autoSlideInterval;
  const AUTO_SLIDE_DELAY = 3000;


  function goToSlide(index) {

    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    dots[index].setAttribute('aria-selected', 'true');

    currentIndex = index;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
  });

  const heroBanner = document.querySelector('.hero-banner');
  if (heroBanner) {
    heroBanner.addEventListener('mouseenter', stopAutoSlide);
    heroBanner.addEventListener('mouseleave', startAutoSlide);
  }

  if (slides.length > 0) {
    startAutoSlide();
  }
})();
