/**
 * 컴포넌트를 로드하여 지정된 요소에 삽입합니다.
 * @param {string} componentPath - 컴포넌트 HTML 파일 경로
 * @param {string} targetSelector - 삽입할 위치의 선택자
 * @param {string} basePath - 이미지 등 에셋의 기본 경로 (예: '../assets/' 또는 './assets/')
 */
async function loadComponent(
  componentPath,
  targetSelector,
  basePath = "./assets/"
) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`컴포넌트 로드 실패: ${componentPath}`);
    }

    let html = await response.text();

    // data-icon 속성을 가진 img 태그의 src를 basePath에 맞게 설정
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("img[data-icon]").forEach((img) => {
      const iconName = img.getAttribute("data-icon");
      img.src = `${basePath}images/${iconName}`;
    });

    const target = document.querySelector(targetSelector);
    if (target) {
      target.innerHTML = tempDiv.innerHTML;
    }
  } catch (error) {
    console.error("컴포넌트 로드 오류:", error);
  }
}

/**
 * Footer 컴포넌트를 로드합니다.
 * @param {string} basePath - 에셋 기본 경로 (기본값: './assets/')
 */
function loadFooter(basePath = "./assets/") {
  const componentPath = basePath.includes("../")
    ? "../components/footer.html"
    : "./components/footer.html";

  loadComponent(componentPath, "#footer-container", basePath);
}

/**
 * Header 컴포넌트를 로드합니다.
 * @param {string} basePath - 에셋 기본 경로 (기본값: './assets/')
 * @param {string} activePage - 현재 활성화된 페이지 ('cart', 'login', 'mypage' 등)
 */
async function loadHeader(basePath = "./assets/", activePage = "") {
  const componentPath = basePath.includes("../")
    ? "../components/header.html"
    : "./components/header.html";

  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`컴포넌트 로드 실패: ${componentPath}`);
    }

    let html = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // data-icon 속성을 가진 img 태그의 src를 basePath에 맞게 설정
    tempDiv.querySelectorAll("img[data-icon]").forEach((img) => {
      const iconName = img.getAttribute("data-icon");
      img.src = `${basePath}images/${iconName}`;
    });

    // 로고 링크 경로 설정
    const logoLink = tempDiv.querySelector('a[data-link="home"]');
    if (logoLink) {
      logoLink.href = basePath.includes("../") ? "/" : "/";
    }

    // 활성 페이지 표시
    if (activePage) {
      const activeNavLink = tempDiv.querySelector(
        `a[data-nav="${activePage}"]`
      );
      if (activeNavLink) {
        activeNavLink.classList.add("active");
        // 장바구니 활성 시 초록색 아이콘으로 변경
        if (activePage === "cart") {
          const cartIcon = activeNavLink.querySelector("img");
          if (cartIcon) {
            cartIcon.setAttribute("data-icon", "icon-shopping-cart-2.svg");
            cartIcon.src = `${basePath}images/icon-shopping-cart-2.svg`;
          }
        }
      }
    }

    const target = document.querySelector("#header-container");
    if (target) {
      target.innerHTML = tempDiv.innerHTML;
      // 헤더 로드 후 로그인 상태에 따라 UI 업데이트
      updateHeaderUI();
    }
  } catch (error) {
    console.error("Header 컴포넌트 로드 오류:", error);
  }
}

// 헤더 로그인 상태 UI 업데이트
const updateHeaderUI = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userStatusLi = document.getElementById("nav-user-status");

  // 요소가 없을 경우를 대비한 방어 코드
  if (!userStatusLi) return;

  const loginLink = userStatusLi.querySelector("a");
  const loginText = document.getElementById("login-text");

  if (isLoggedIn) {
    // 1. 로그인 완료 상태
    loginText.textContent = "마이페이지";

    // 마이페이지 클릭 시 드롭다운 토글 (링크 이동 방지)
    loginLink.setAttribute("href", "#");
    loginLink.onclick = (e) => {
      e.preventDefault();
      toggleUserDropdown();
    };

    // 드롭다운 이벤트 초기화
    initUserDropdownEvents();
  } else {
    // 2. 로그아웃 상태
    loginLink.setAttribute("href", "/login");
    loginLink.onclick = null;
    loginText.textContent = "로그인";
  }
};

/**
 * 마이페이지 드롭다운을 토글합니다.
 */
function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

/**
 * 마이페이지 드롭다운을 닫습니다.
 */
function closeUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    dropdown.classList.remove("active");
  }
}

/**
 * 드롭다운 이벤트 리스너를 초기화합니다.
 */
function initUserDropdownEvents() {
  const logoutBtn = document.getElementById("btn-logout");

  // 로그아웃 버튼 클릭
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      // 로컬 스토리지 클리어
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      // 메인 페이지로 이동
      window.location.href = "/";
    };
  }

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    const userStatus = document.getElementById("nav-user-status");
    const dropdown = document.getElementById("user-dropdown");

    if (userStatus && dropdown && !userStatus.contains(e.target)) {
      closeUserDropdown();
    }
  });
}
// JWT 토큰 관리 함수들
/**
 * 로컬 스토리지에서 access token을 가져옵니다.
 * @returns {string|null} access token 또는 null
 */
function getAccessToken() {
    return localStorage.getItem('access');
}

/**
 * 로컬 스토리지에서 refresh token을 가져옵니다.
 * @returns {string|null} refresh token 또는 null
 */
function getRefreshToken() {
    return localStorage.getItem('refresh');
}

/**
 * 로컬 스토리지에서 저장된 사용자 정보를 가져옵니다.
 * @returns {object|null} 사용자 정보 객체 또는 null
 */
function getUserInfo() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * 사용자가 로그인 상태인지 확인합니다.
 * @returns {boolean} 로그인 상태 여부
 */
function isLoggedIn() {
    return !!getAccessToken();
}

/**
 * Access token을 갱신합니다.
 * @returns {Promise<string|null>} 새로운 access token 또는 null
 */
async function refreshAccessToken() {
    try {
        const refresh = getRefreshToken();
        
        if (!refresh) {
            return null;
        }

        const response = await fetch('https://api.wenivops.co.kr/accounts/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem('access', data.access);
            return data.access;
        } else {
            handleLogout();
            return null;
        }
        
    } catch (error) {
        console.error('토큰 갱신 오류:', error);
        handleLogout();
        return null;
    }
}

/**
 * 로그아웃 처리: 토큰과 사용자 정보를 삭제합니다.
 */
function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    // 로그인 페이지로 이동
    if (!window.location.pathname.includes('login')) {
        window.location.href = '../login/index.html';
    }
}

/**
 * API 요청 시 자동으로 authorization 헤더를 추가합니다.
 * @param {string} url - 요청 URL
 * @param {object} options - fetch 옵션
 * @returns {Promise<Response>} fetch 응답
 */
async function fetchWithAuth(url, options = {}) {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
        handleLogout();
        return null;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    let response = await fetch(url, { ...options, headers });

    // 401 응답 (Unauthorized): access token 갱신 시도
    if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
            // 새 토큰으로 재요청
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(url, { ...options, headers });
        } else {
            handleLogout();
            return null;
        }
    }

    return response;
}

// 로그인 요청 모달 함수들
/**
 * 로그인 모달 컴포넌트를 로드합니다.
 * @param {string} basePath - 에셋 기본 경로 (기본값: './assets/')
 */
async function loadLoginModal(basePath = './assets/') {
    // 이미 로드된 경우 스킵
    if (document.getElementById('login-modal')) {
        return;
    }

    const componentPath = basePath.includes('../')
        ? '../components/login-modal.html'
        : './components/login-modal.html';

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`컴포넌트 로드 실패: ${componentPath}`);
        }

        let html = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // data-icon 속성을 가진 img 태그의 src를 basePath에 맞게 설정
        tempDiv.querySelectorAll('img[data-icon]').forEach((img) => {
            const iconName = img.getAttribute('data-icon');
            img.src = `${basePath}images/${iconName}`;
        });

        // body에 모달 추가
        document.body.insertAdjacentHTML('beforeend', tempDiv.innerHTML);

        // 모달 이벤트 리스너 초기화
        initLoginModalEvents(basePath);

    } catch (error) {
        console.error('로그인 모달 컴포넌트 로드 오류:', error);
    }
}

/**
 * 로그인 모달 이벤트 리스너를 초기화합니다.
 * @param {string} basePath - 에셋 기본 경로
 */
function initLoginModalEvents(basePath = './assets/') {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('login-modal-close');
    const cancelBtn = document.getElementById('btn-modal-cancel');
    const confirmBtn = document.getElementById('btn-modal-confirm');

    if (!modal) return;

    // 닫기 버튼
    closeBtn?.addEventListener('click', closeLoginModal);

    // 아니오 버튼
    cancelBtn?.addEventListener('click', closeLoginModal);

    // 예 버튼 - 로그인 페이지로 이동
    confirmBtn?.addEventListener('click', () => {
        const loginPath = basePath.includes('../') ? '../login/' : './login/';
        window.location.href = loginPath;
    });

    // 오버레이 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLoginModal();
        }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeLoginModal();
        }
    });
}

/**
 * 로그인 모달을 엽니다.
 */
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        // 스크롤바 너비 계산
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    } else {
        console.error('로그인 모달이 로드되지 않았습니다.');
    }
}

/**
 * 로그인 모달을 닫습니다.
 */
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
}

/**
 * 로그인이 필요한 액션을 실행합니다.
 * 로그인 상태가 아니면 모달을 띄우고, 로그인 상태면 콜백을 실행합니다.
 * @param {Function} callback - 로그인 상태일 때 실행할 콜백 함수
 */
function requireLogin(callback) {
    if (isLoggedIn()) {
        callback();
    } else {
        openLoginModal();
    }
}
