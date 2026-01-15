const productContainer = document.getElementById("product-container");

async function fetchAndRender() {
  try {
    const res = await fetch(
      "https://api.wenivops.co.kr/services/open-market/products/"
    );
    const { results } = await res.json();

    productContainer.innerHTML = results
      .map(
        (product) => `
      <article class="product-item">
        <figure class="product-image">
          <img src="${product.image}" alt="${product.product_name} 이미지">
        </figure>
        
        <div class="product-info">
          <span class="brand-name">${product.store_name}</span>
          <h3 class="product-name">
            <a href="product-detail/index.html?product_id=${
              product.product_id
            }">${product.product_name}</a>
          </h3>
          <p class="product-price">
            <span class="amount">${product.price.toLocaleString()}</span><span class="unit">원</span>
          </p>
        </div>
      </article>
    `
      )
      .join("");
  } catch (err) {
    console.error("상품을 불러오지 못했습니다.", err);
  }
}

fetchAndRender();
