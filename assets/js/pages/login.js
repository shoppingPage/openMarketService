// ==========================================
// 1. 요소 선택 및 상태 초기화
// ==========================================
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const warnBox = document.getElementById("warnBox");

// ==========================================
// 2. UI 제어 함수 (경고 및 에러 관리)
// ==========================================
function showWarning(message) {
  if (warnBox) {
    warnBox.textContent = message;
    warnBox.classList.add("show");
  }
}

function hideWarning() {
  if (warnBox) {
    warnBox.textContent = "";
    warnBox.classList.remove("show");
  }
}

function showInputError(input) {
  input.classList.add("error");
}

function clearInputErrors() {
  usernameInput.classList.remove("error");
  passwordInput.classList.remove("error");
}

// 입력 시 실시간으로 에러 상태 해제
[usernameInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
    hideWarning();
  });
});

// ==========================================
// 3. API 로그인 시도 (Main Logic)
// ==========================================
async function performLogin(username, password) {
  try {
    const response = await fetch(
      "https://api.wenivops.co.kr/services/open-market/accounts/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // 로그인 성공 시 처리
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      handleLoginSuccess();
    } else {
      // 401 Unauthorized 또는 400 Bad Request 처리
      showWarning(
        data.FAIL_Message || "아이디 또는 비밀번호가 일치하지 않습니다."
      );
      showInputError(usernameInput);
      showInputError(passwordInput);
      passwordInput.value = ""; // 비밀번호 초기화
      passwordInput.focus();
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    showWarning("서버와의 연결이 원활하지 않습니다.");
  }
}

// ==========================================
// 4. 폼 제출 이벤트 리스너
// ==========================================
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // 빈 값 검증
  if (!username) {
    showWarning("아이디를 입력해 주세요.");
    showInputError(usernameInput);
    usernameInput.focus();
    return;
  }

  if (!password) {
    showWarning("비밀번호를 입력해 주세요.");
    showInputError(passwordInput);
    passwordInput.focus();
    return;
  }

  // 서버로 로그인 요청
  performLogin(username, password);
});

// ==========================================
// 5. 성공시 이동 처리
// ==========================================
function handleLoginSuccess() {
  // 세션에 저장된 이동할 주소가 있으면 해당 주소로, 없으면 메인으로 이동
  const returnUrl = sessionStorage.getItem("returnUrl");

  if (
    returnUrl &&
    !returnUrl.includes("login") &&
    !returnUrl.includes("join")
  ) {
    sessionStorage.removeItem("returnUrl");
    window.location.href = returnUrl;
  } else {
    window.location.href = "/";
  }
}

// 로그인 완료시 헤더 아이콘 변경

// 로그인 버튼 클릭 이벤트 핸들러
const handleLoginSubmit = async () => {
  // 1. 사용자가 입력한 값 가져오기
  const id = document.getElementById("user-id").value;
  const pw = document.getElementById("user-pw").value;

  // 2. 실제 API 호출 (가정)
  const response = await fetch("https://api.example.com/login", {
    method: "POST",
    body: JSON.stringify({ id, pw }),
  });

  if (response.ok) {
    // ✅ 성공 시: 로컬 스토리지에 로그인 상태 저장
    localStorage.setItem("isLoggedIn", "true");

    // ✅ 성공 시: 헤더 UI를 즉시 업데이트 (전역 함수 호출)
    if (typeof window.updateHeaderUI === "function") {
      window.updateHeaderUI();
    }

    // 메인 페이지로 이동
    window.location.href = "/";
  } else {
    alert("로그인 정보가 올바르지 않습니다.");
  }
};
