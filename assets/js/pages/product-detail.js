/**
 * 상품 상세 페이지
 * API: GET /products/<int:product_id>/
 */

(function() {
    'use strict';

    // 1. URL에서 상품 ID 추출
    function getProductId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    const PRODUCT_ID = getProductId();

    // 2. DOM 요소 선택
    const elements = {
        productImg: document.querySelector('.product-img img'),
        storeName: document.querySelector('.store-name'),
        productTit: document.querySelector('.product-tit'),
        productPrice: document.querySelector('.product-price'),
        deliveryInfo: document.querySelector('.delivery-info'),
        quantityInput: document.querySelector('.quantity-selector input'),
        btnMinus: document.querySelector('.minus'),
        btnPlus: document.querySelector('.plus'),
        totalCount: document.querySelector('.total-count strong'),
        totalPrice: document.querySelector('.total-price'),
        btnBuy: document.querySelector('.btn-buy'),
        btnCart: document.querySelector('.btn-cart')
    };

    // 3. 상품 상태 관리
    let productData = {
        stock: 0,      // 재고
        price: 0,      // 단가
        quantity: 1    // 현재 수량
    };

    // 4. API 호출
    async function fetchProductData() {
        if (!PRODUCT_ID) {
            window.location.href = "/404/";
            return null;
        }

        try {
            const response = await fetch(
                `https://api.wenivops.co.kr/services/open-market/products/${PRODUCT_ID}/`
            );

            if (!response.ok) {
                window.location.href = "/404/";
                return null;
            }

            return await response.json();

        } catch (error) {
            console.error('API 에러:', error);
            window.location.href = "/404/";
            return null;
        }
    }

    // 5. 화면 렌더링
    function renderProduct(data) {
        document.title = `${data.name} | HODU`;
        elements.productImg.src = data.image;
        elements.productImg.alt = data.name;
        elements.storeName.textContent = data.seller.store_name;
        elements.productTit.textContent = data.name;
        elements.productPrice.innerHTML =
            `${data.price.toLocaleString()}<span class="unit">원</span>`;

        const shippingMethod = data.shipping_method === 'PARCEL' ? '택배배송' : '직접배송';
        const shippingFee = data.shipping_fee === 0
            ? '무료배송'
            : `배송비 ${data.shipping_fee.toLocaleString()}원`;
        elements.deliveryInfo.textContent = `${shippingMethod} / ${shippingFee}`;
        elements.quantityInput.readOnly = true;
        productData.stock = data.stock;
        productData.price = data.price;
        productData.quantity = 1;

        if (productData.stock === 0) {
            handleSoldOut();
        } else {
            updateUI();
        }
    }

    // 6. 품절 처리 
    function handleSoldOut() {
        elements.btnBuy.disabled = true;
        elements.btnBuy.textContent = '품절';
        elements.btnBuy.style.opacity = '0.5';
        elements.btnCart.disabled = true;
        elements.btnCart.textContent = '품절';
        elements.btnCart.style.opacity = '0.5';
        elements.btnPlus.disabled = true;
        elements.btnPlus.style.opacity = '0.3';
        elements.btnMinus.disabled = true;
        elements.btnMinus.style.opacity = '0.3';
        elements.quantityInput.value = 0;
        elements.totalCount.textContent = 0;
        elements.totalPrice.textContent = 0;
    }

    // 7. UI 업데이트
    function updateUI() {
        const { quantity, price } = productData;
        elements.quantityInput.value = quantity;
        elements.totalCount.textContent = quantity;
        const total = quantity * price;
        elements.totalPrice.textContent = total.toLocaleString();
        updateButtonState();
    }

    // 8. 버튼 상태 관리
    function updateButtonState() {
        const { quantity, stock } = productData;

        if (quantity <= 1) {
            elements.btnMinus.disabled = true;
            elements.btnMinus.style.opacity = '0.3';
        } else {
            elements.btnMinus.disabled = false;
            elements.btnMinus.style.opacity = '1';
        }

        // + 버튼: 수량이 재고와 같으면 비활성화
        if (quantity >= stock) {
            elements.btnPlus.disabled = true;
            elements.btnPlus.style.opacity = '0.3';
        } else {
            elements.btnPlus.disabled = false;
            elements.btnPlus.style.opacity = '1';
        }
    }

    // 9. 수량 증가 
    function increaseQuantity() {
        if (productData.quantity < productData.stock) {
            productData.quantity++;
            updateUI();
        }
    }

    // 10. 수량 감소
    function decreaseQuantity() {
        if (productData.quantity > 1) {
            productData.quantity--;
            updateUI();
        }
    }

    // 11. 장바구니 중복 확인
    async function checkCartDuplicate() {
        const token = getAccessToken();
        if (!token) return false;

        try {
            const response = await fetch('https://api.wenivops.co.kr/services/open-market/cart/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return false;

            const data = await response.json();
            const cartItems = data.results || data || [];

            // 현재 상품이 장바구니에 있는지 확인
            return cartItems.some(item => item.product.id === parseInt(PRODUCT_ID));
        } catch (error) {
            console.error('장바구니 확인 오류:', error);
            return false;
        }
    }

    // 12. 장바구니 관련 모달
    function openCartDuplicateModal() {
        const modal = document.getElementById('cartDuplicateModal');
        modal.classList.add('active');
    }

    function closeCartDuplicateModal() {
        const modal = document.getElementById('cartDuplicateModal');
        modal.classList.remove('active');
    }
    
    function openCartAddSuccessModal() {
        const modal = document.getElementById('cartAddSuccessModal');
        modal.classList.add('active');
    }

    function closeCartAddSuccessModal() {
        const modal = document.getElementById('cartAddSuccessModal');
        modal.classList.remove('active');
    }

    function initCartModals() {
        // 중복 모달
        const duplicateModal = document.getElementById('cartDuplicateModal');
        const duplicateCloseBtn = document.getElementById('cartDuplicateModalClose');
        const btnDuplicateNo = document.getElementById('btnDuplicateModalNo');
        const btnDuplicateYes = document.getElementById('btnDuplicateModalYes');

        duplicateCloseBtn.addEventListener('click', closeCartDuplicateModal);
        btnDuplicateNo.addEventListener('click', closeCartDuplicateModal);
        btnDuplicateYes.addEventListener('click', () => {
            window.location.href = '../cart/';
        });
        duplicateModal.addEventListener('click', (e) => {
            if (e.target === duplicateModal) {
                closeCartDuplicateModal();
            }
        });

        // 추가 성공 모달
        const successModal = document.getElementById('cartAddSuccessModal');
        const successCloseBtn = document.getElementById('cartAddSuccessModalClose');
        const btnSuccessNo = document.getElementById('btnAddSuccessModalNo');
        const btnSuccessYes = document.getElementById('btnAddSuccessModalYes');

        successCloseBtn.addEventListener('click', closeCartAddSuccessModal);
        btnSuccessNo.addEventListener('click', closeCartAddSuccessModal);
        btnSuccessYes.addEventListener('click', () => {
            window.location.href = '../cart/';
        });
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeCartAddSuccessModal();
            }
        });
    }

    // 13. 장바구니 추가
    async function addToCart() {
        const token = getAccessToken();
        if (!token) {
            openLoginModal();
            return;
        }

        // 장바구니에 이미 있는지 확인
        const isDuplicate = await checkCartDuplicate();
        if (isDuplicate) {
            openCartDuplicateModal();
            return;
        }

        try {
            // 장바구니에 추가
            const response = await fetch('https://api.wenivops.co.kr/services/open-market/cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: parseInt(PRODUCT_ID),
                    quantity: productData.quantity
                })
            });

            if (!response.ok) {
                throw new Error('장바구니 추가 실패');
            }

            // 성공 시 장바구니 추가 성공 모달 열기
            openCartAddSuccessModal();

        } catch (error) {
            console.error('장바구니 추가 오류:', error);
            alert('장바구니 추가에 실패했습니다.');
        }
    }

    // 14. 이벤트 리스너 등록
    function initEventListeners() {
        elements.btnPlus.addEventListener('click', increaseQuantity);
        elements.btnMinus.addEventListener('click', decreaseQuantity);

        // 장바구니 버튼 클릭 - 로그인 체크 후 장바구니 추가
        elements.btnCart.addEventListener('click', () => {
            requireLogin(addToCart);
        });

        // 바로구매 버튼 클릭 - 로그인 체크
        elements.btnBuy.addEventListener('click', () => {
            requireLogin(() => {
                // 바로구매 로직 (추후 구현)
                console.log('바로구매 진행');
            });
        });

        // 탭 이벤트 리스너
        initTabListeners();
    }

    // 15. 탭 기능
    function initTabListeners() {
        const tabLinks = document.querySelectorAll('.tab-list a');

        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // 모든 탭 비활성화
                tabLinks.forEach(tab => {
                    tab.parentElement.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                });

                // 클릭한 탭 활성화
                link.parentElement.classList.add('active');
                link.setAttribute('aria-selected', 'true');
            });
        });
    }

    // 16. 초기화
    async function init() {
        // 로그인 모달 로드
        await loadLoginModal('../assets/');

        // 장바구니 관련 모달 초기화
        initCartModals();

        const data = await fetchProductData();
        if (data) {
            renderProduct(data);
            initEventListeners();
        }
    }
    init();
})();
