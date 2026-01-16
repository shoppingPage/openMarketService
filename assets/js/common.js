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
        // 장바구니 활성 시 아이콘 변경
        if (activePage === "cart") {
          const cartIcon = activeNavLink.querySelector("img");
          if (cartIcon) {
            cartIcon.setAttribute("data-icon", "icon-shopping-cart.svg");
            cartIcon.src = `${basePath}images/icon-shopping-cart.svg`;
          }
        }
      }
    }

    const target = document.querySelector("#header-container");
    if (target) {
      target.innerHTML = tempDiv.innerHTML;
    }
  } catch (error) {
    console.error("Header 컴포넌트 로드 오류:", error);
  }
}

// 가짜 마이페이지 구현

const updateHeaderUI = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userStatusLi = document.getElementById("nav-user-status");

  // 요소가 없을 경우를 대비한 방어 코드
  if (!userStatusLi) return;

  const loginLink = userStatusLi.querySelector("a");
  const loginText = document.getElementById("login-text");
  const loginIcon = loginLink.querySelector("img");

  if (isLoggedIn) {
    // 1. 로그인 완료 상태
    userStatusLi.classList.add("is-login");
    loginLink.setAttribute("href", "/mypage");
    loginText.textContent = "마이페이지";
    // 확장자 .svg를 반드시 붙여주세요!
    loginIcon.setAttribute("src", "../assets/images/icon-user-2.svg");
  } else {
    // 2. 로그아웃 상태
    userStatusLi.classList.remove("is-login");
    loginLink.setAttribute("href", "/login");
    loginText.textContent = "로그인";
    loginIcon.setAttribute("src", "../assets/images/icon-user.svg");
  }
};
