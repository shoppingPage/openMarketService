/**
 * 장바구니 페이지 JavaScript
 * API: https://api.wenivops.co.kr/services/open-market/
 */

const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

// DOM Elements
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartContainer = document.getElementById('emptyCart');
const selectAllCheckbox = document.getElementById('selectAll');
const totalProductPriceEl = document.getElementById('totalProductPrice');
const discountPriceEl = document.getElementById('discountPrice');
const shippingFeeEl = document.getElementById('shippingFee');
const totalPriceEl = document.getElementById('totalPrice');
const orderBtn = document.getElementById('orderBtn');

// State
let cartItems = [];
let products = {}; // 상품 정보 캐시

/**
 * 토큰 가져오기
 */
function getToken() {
  return localStorage.getItem('access');
}

/**
 * 숫자 포맷팅 (천 단위 콤마)
 */
function formatPrice(price) {
  return price.toLocaleString('ko-KR');
}

/**
 * API 요청 헤더
 */
function getHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * 장바구니 목록 조회
 */
async function fetchCartItems() {
  try {
    const token = getToken();
    if (!token) {
      showLoginAlert();
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        showLoginAlert();
        return [];
      }
      throw new Error('장바구니 조회 실패');
    }

    const data = await response.json();
    return data.results || data || [];
  } catch (error) {
    console.error('장바구니 조회 오류:', error);
    return [];
  }
}

/**
 * 장바구니 수량 변경
 */
async function updateCartQuantity(cartId, quantity) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) throw new Error('수량 변경 실패');
    return await response.json();
  } catch (error) {
    console.error('수량 변경 오류:', error);
    return null;
  }
}

/**
 * 장바구니 아이템 삭제
 */
async function deleteCartItem(cartId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) throw new Error('삭제 실패');
    return true;
  } catch (error) {
    console.error('삭제 오류:', error);
    return false;
  }
}

/**
 * 로그인 안내
 */
function showLoginAlert() {
  alert('로그인이 필요합니다.');
  window.location.href = '/login';
}

/**
 * 장바구니 아이템 렌더링
 * API 응답에서 product 객체가 직접 포함됨
 */
function renderCartItem(cartItem) {
  const product = cartItem.product;
  const totalPrice = product.price * cartItem.quantity;
  const shippingText = product.shipping_fee > 0
    ? `배송비 ${formatPrice(product.shipping_fee)}원`
    : '무료배송';

  // 상품 정보 캐시에 저장 (수량 변경 등에서 사용)
  products[product.id] = product;

  return `
    <article class="cart-item" data-cart-id="${cartItem.id}" data-product-id="${product.id}">
      <label class="custom-checkbox cart-item-checkbox">
        <input type="checkbox" class="item-checkbox" data-cart-id="${cartItem.id}" checked />
        <span class="checkmark"></span>
      </label>

      <div class="cart-item-content">
        <div class="cart-item-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>

        <div class="cart-item-info">
          <span class="cart-item-store">${product.seller?.store_name || '판매자'}</span>
          <h3 class="cart-item-name">${product.name}</h3>
          <span class="cart-item-unit-price">${formatPrice(product.price)}원</span>
          <span class="cart-item-delivery">${shippingText}</span>
        </div>

        <div class="cart-item-quantity">
          <div class="quantity-control">
            <button type="button" class="quantity-btn minus-btn" data-cart-id="${cartItem.id}">
              <img src="../assets/images/icon-minus-line.svg" alt="감소" />
            </button>
            <span class="quantity-value">${cartItem.quantity}</span>
            <button type="button" class="quantity-btn plus-btn" data-cart-id="${cartItem.id}">
              <img src="../assets/images/icon-plus-line.svg" alt="증가" />
            </button>
          </div>
        </div>

        <div class="cart-item-price-section">
          <span class="cart-item-total-price">${formatPrice(totalPrice)}원</span>
          <button type="button" class="cart-item-order-btn">주문하기</button>
        </div>
      </div>

      <button type="button" class="cart-item-delete" data-cart-id="${cartItem.id}">
        <img src="../assets/images/icon-delete.svg" alt="삭제" />
      </button>
    </article>
  `;
}

/**
 * 장바구니 전체 렌더링
 * API 응답에 product 객체가 포함되어 있어 별도 조회 불필요
 */
async function renderCart() {
  cartItems = await fetchCartItems();

  if (cartItems.length === 0) {
    cartItemsContainer.style.display = 'none';
    emptyCartContainer.style.display = 'flex';
    document.querySelector('.cart-summary-wrapper').style.display = 'none';
    document.querySelector('.order-btn-wrapper').style.display = 'none';
    return;
  }

  // 렌더링 (API 응답에 product 객체 포함)
  cartItemsContainer.innerHTML = cartItems
    .map(cartItem => renderCartItem(cartItem))
    .join('');

  cartItemsContainer.style.display = 'block';
  emptyCartContainer.style.display = 'none';
  document.querySelector('.cart-header-bar').style.display = 'block';
  document.querySelector('.cart-summary-wrapper').style.display = 'block';
  document.querySelector('.order-btn-wrapper').style.display = 'flex';

  // 이벤트 리스너 등록
  attachEventListeners();

  // 총액 계산
  calculateTotal();
}

/**
 * 이벤트 리스너 등록
 */
function attachEventListeners() {
  // 개별 체크박스
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleItemCheckChange);
  });

  // 수량 감소 버튼
  document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', handleQuantityDecrease);
  });

  // 수량 증가 버튼
  document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', handleQuantityIncrease);
  });

  // 삭제 버튼
  document.querySelectorAll('.cart-item-delete').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });

  // 개별 주문 버튼
  document.querySelectorAll('.cart-item-order-btn').forEach(btn => {
    btn.addEventListener('click', handleItemOrder);
  });
}

/**
 * 전체 선택 체크박스 핸들러
 */
function handleSelectAllChange() {
  const isChecked = selectAllCheckbox.checked;
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.checked = isChecked;
  });
  calculateTotal();
}

/**
 * 개별 체크박스 변경 핸들러
 */
function handleItemCheckChange() {
  const allCheckboxes = document.querySelectorAll('.item-checkbox');
  const checkedCheckboxes = document.querySelectorAll('.item-checkbox:checked');

  selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
  calculateTotal();
}

/**
 * 수량 감소 핸들러
 */
async function handleQuantityDecrease(e) {
  const cartId = e.currentTarget.dataset.cartId;
  const cartItem = cartItems.find(item => item.id == cartId);

  if (!cartItem || cartItem.quantity <= 1) return;

  const newQuantity = cartItem.quantity - 1;
  const result = await updateCartQuantity(cartId, newQuantity);

  if (result) {
    cartItem.quantity = newQuantity;
    updateItemUI(cartId, newQuantity);
    calculateTotal();
  }
}

/**
 * 수량 증가 핸들러
 */
async function handleQuantityIncrease(e) {
  const cartId = e.currentTarget.dataset.cartId;
  const cartItem = cartItems.find(item => item.id == cartId);

  if (!cartItem) return;

  const product = cartItem.product;
  if (product && cartItem.quantity >= product.stock) {
    alert('재고가 부족합니다.');
    return;
  }

  const newQuantity = cartItem.quantity + 1;
  const result = await updateCartQuantity(cartId, newQuantity);

  if (result) {
    cartItem.quantity = newQuantity;
    updateItemUI(cartId, newQuantity);
    calculateTotal();
  }
}

// 삭제 모달 관련 변수
let pendingDeleteCartId = null;

/**
 * 삭제 모달 열기
 */
function openDeleteModal(cartId) {
  pendingDeleteCartId = cartId;
  const modal = document.getElementById('deleteModal');
  modal.classList.add('active');
}

/**
 * 삭제 모달 닫기
 */
function closeDeleteModal() {
  pendingDeleteCartId = null;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('active');
}

/**
 * 삭제 모달 초기화
 */
function initDeleteModal() {
  const modal = document.getElementById('deleteModal');
  const closeBtn = document.getElementById('deleteModalClose');
  const btnCancel = document.getElementById('btnDeleteCancel');
  const btnConfirm = document.getElementById('btnDeleteConfirm');

  // 닫기 버튼
  closeBtn.addEventListener('click', closeDeleteModal);

  // 취소 버튼
  btnCancel.addEventListener('click', closeDeleteModal);

  // 확인 버튼 - 실제 삭제 실행
  btnConfirm.addEventListener('click', async () => {
    if (pendingDeleteCartId) {
      await confirmDelete(pendingDeleteCartId);
    }
    closeDeleteModal();
  });

  // 오버레이 클릭 시 닫기
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDeleteModal();
    }
  });
}

/**
 * 삭제 확인 후 실제 삭제
 */
async function confirmDelete(cartId) {
  const success = await deleteCartItem(cartId);

  if (success) {
    // 상태에서 제거
    cartItems = cartItems.filter(item => item.id != cartId);

    // DOM에서 제거
    const itemEl = document.querySelector(`.cart-item[data-cart-id="${cartId}"]`);
    if (itemEl) {
      itemEl.remove();
    }

    // 빈 장바구니 체크
    if (cartItems.length === 0) {
      cartItemsContainer.style.display = 'none';
      emptyCartContainer.style.display = 'flex';
      document.querySelector('.cart-summary-wrapper').style.display = 'none';
      document.querySelector('.order-btn-wrapper').style.display = 'none';
    }

    // 전체 선택 체크박스 상태 업데이트
    handleItemCheckChange();
    calculateTotal();
  }
}

/**
 * 삭제 핸들러
 */
function handleDelete(e) {
  const cartId = e.currentTarget.dataset.cartId;
  openDeleteModal(cartId);
}

/**
 * 개별 주문 핸들러
 */
function handleItemOrder(e) {
  // 추후 구현 예정
}

/**
 * 아이템 UI 업데이트
 */
function updateItemUI(cartId, quantity) {
  const itemEl = document.querySelector(`.cart-item[data-cart-id="${cartId}"]`);
  if (!itemEl) return;

  const cartItem = cartItems.find(item => item.id == cartId);
  const product = cartItem.product;
  const totalPrice = product.price * quantity;

  itemEl.querySelector('.quantity-value').textContent = quantity;
  itemEl.querySelector('.cart-item-total-price').textContent = `${formatPrice(totalPrice)}원`;
}

/**
 * 총액 계산
 */
function calculateTotal() {
  let totalProductPrice = 0;
  let totalShippingFee = 0;
  const discount = 0; // API에 할인 정보 없음

  // 체크된 아이템만 계산
  document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
    const cartId = checkbox.dataset.cartId;
    const cartItem = cartItems.find(item => item.id == cartId);

    if (cartItem) {
      const product = cartItem.product;
      if (product) {
        totalProductPrice += product.price * cartItem.quantity;
        totalShippingFee += product.shipping_fee || 0;
      }
    }
  });

  const finalTotal = totalProductPrice - discount + totalShippingFee;

  // UI 업데이트
  totalProductPriceEl.innerHTML = `${formatPrice(totalProductPrice)}<span class="unit">원</span>`;
  discountPriceEl.innerHTML = `${formatPrice(discount)}<span class="unit">원</span>`;
  shippingFeeEl.innerHTML = `${formatPrice(totalShippingFee)}<span class="unit">원</span>`;
  totalPriceEl.innerHTML = `${formatPrice(finalTotal)}<span class="unit">원</span>`;

  // 주문 버튼 상태
  const hasCheckedItems = document.querySelectorAll('.item-checkbox:checked').length > 0;
  orderBtn.disabled = !hasCheckedItems;
}

/**
 * 메인 주문 버튼 핸들러
 */
function handleMainOrder() {
  // 추후 구현 예정
}

/**
 * 초기화
 */
function init() {
  // 삭제 모달 초기화
  initDeleteModal();

  // 전체 선택 체크박스 이벤트
  selectAllCheckbox.addEventListener('change', handleSelectAllChange);

  // 메인 주문 버튼 이벤트
  orderBtn.addEventListener('click', handleMainOrder);

  // 장바구니 렌더링
  renderCart();
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', init);
