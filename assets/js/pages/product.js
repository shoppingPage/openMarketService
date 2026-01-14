// This is app.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Product Detail Page ---
  const quantityInput = document.querySelector(".quantity-selector input");
  const plusButton = document.querySelector(".quantity-selector .plus");
  const minusButton = document.querySelector(".quantity-selector .minus");
  const totalPriceElement = document.querySelector(".total-price");
  const totalQuantityElement = document.querySelector(
    ".total-count .color-point"
  );
  const productPriceElement = document.querySelector(".product-price");

  if (
    quantityInput &&
    plusButton &&
    minusButton &&
    totalPriceElement &&
    totalQuantityElement &&
    productPriceElement
  ) {
    const unitPrice = parseInt(
      productPriceElement.innerText.replace(/[^0-9]/g, "")
    );

    const updateTotalPrice = () => {
      const quantity = parseInt(quantityInput.value);
      const totalPrice = unitPrice * quantity;
      totalPriceElement.innerText = totalPrice.toLocaleString();
      totalQuantityElement.innerText = quantity;
    };

    plusButton.addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateTotalPrice();
    });

    minusButton.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updateTotalPrice();
      }
    });

    updateTotalPrice();
  }

  const tabs = document.querySelectorAll(".product-tabs .tab-list li");
  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // --- Main Page ---
  const productLinks = document.querySelectorAll(".product-item a");
  productLinks.forEach((link) => {
    link.href = "../product-detail/index.html";
  });
});
