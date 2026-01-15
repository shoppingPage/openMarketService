// const productContainer = document.getElementById("product-container");

// async function fetchAndRender() {
//   try {
//     // 1. API 데이터 가져오기
//     const res = await fetch(
//       "https://api.wenivops.co.kr/services/open-market/products/"
//     );
//     const data = await res.json();
//     const products = data.results; // 상품 배열

//     // 2. 데이터 화면에 뿌리기
//     productContainer.innerHTML = products
//       .map(
//         (product) => `
//       <article class="product-item">
//         <figure class="product-image">
//           <img src="${product.image}" alt="${product.name} 이미지">
//         </figure>

//         <div class="product-info">
//           <span class="brand-name">${product.seller.store_name}</span>

//           <h3 class="product-name">
//             <a href="#">${product.name}</a>
//           </h3>

//           <p class="product-price">
//             <span class="amount">${product.price.toLocaleString()}</span><span class="unit">원</span>
//           </p>
//         </div>
//       </article>
//     `
//       )
//       .join("");
//   } catch (err) {
//     console.error("데이터 로딩 중 오류:", err);
//     productContainer.innerHTML =
//       '<p style="text-align:center; padding: 50px;">상품을 불러오는 데 실패했습니다.</p>';
//   }
// }

// fetchAndRender();

// 새로운 코드

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
            <img src="${product.image}" alt="${product.name} 이미지">
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
    productContainer.innerHTML =
      '<p style="text-align:center; padding: 50px;">상품을 불러오는 데 실패했습니다.</p>';
  }
}

fetchAndRender();
