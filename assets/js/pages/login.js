// ==========================================
// 폼 요소 선택
// ==========================================
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const warnBox = document.getElementById('warnBox');

// ==========================================
// 탭 전환 기능 (구매회원/판매회원)
// ==========================================
const tabs = document.querySelectorAll('.login__tab');
let currentLoginType = 'buyer'; // 기본값: 구매회원

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // 모든 탭 비활성화
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    
    // 클릭한 탭 활성화
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    currentLoginType = tab.dataset.type;
    
    // 탭 전환 시 경고 메시지 제거 및 초기화
    hideWarning();
    clearInputErrors();
  });
});

// ==========================================
// 유효성 검사 - 경고 메시지 관리
// ==========================================

// 경고 메시지 표시
function showWarning(message) {
  warnBox.textContent = message;
  warnBox.classList.add('show');
}

// 경고 메시지 숨김
function hideWarning() {
  warnBox.textContent = '';
  warnBox.classList.remove('show');
}

// ==========================================
// 유효성 검사 - 입력 필드 에러 상태 관리
// ==========================================

// 입력 필드 에러 표시
function showInputError(input) {
  input.classList.add('error');
}

// 모든 입력 필드 에러 제거
function clearInputErrors() {
  usernameInput.classList.remove('error');
  passwordInput.classList.remove('error');
}

// ==========================================
// Focus 이벤트 처리 - 입력 시 에러 상태 자동 제거
// ==========================================

usernameInput.addEventListener('input', () => {
  usernameInput.classList.remove('error');
  hideWarning();
});

passwordInput.addEventListener('input', () => {
  passwordInput.classList.remove('error');
  hideWarning();
});

// ==========================================
// 유효성 검사 - 빈 값 체크
// ==========================================

function validateEmptyFields(username, password) {
  // 아이디, 비밀번호 입력란 모두 공란일 경우, 비밀번호만 입력했을 경우 : 
  if (!username && !password) {
    showWarning('아이디를 입력해 주세요.');
    showInputError(usernameInput);
    showInputError(passwordInput);
    usernameInput.focus(); // 아이디 입력창에 포커스
    return false;
  }

  // 아이디만 입력했을 경우 : 
  if (!password) {
    showWarning('비밀번호를 입력해 주세요.');
    showInputError(passwordInput);
    passwordInput.focus(); // 비밀번호 입력창에 포커스
    return false;
  }

  return true;
}

// ==========================================
// 유효성 검사 - 로그인 폼 제출 처리
// ==========================================

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 에러 상태 초기화
  clearInputErrors();
  hideWarning();
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // 1단계: 빈 값 검증
  if (!validateEmptyFields(username, password)) {
    // 입력 창 아래에 경고창이 나타나면 로그인 버튼을 눌러도 로그인 되지 않음
    return; // 검증 실패 시 로그인 진행하지 않음
  }

  // 2단계: 로그인 시도 (아이디/비밀번호 일치 여부 확인)
  await performLogin(username, password);
});

// ==========================================
// 유효성 검사 - 불일치 체크 및 로그인 수행
// ==========================================

async function performLogin(username, password) {
  try {
    // 실제 환경에서는 여기서 API 호출
    // 예시:
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     username, 
    //     password, 
    //     loginType: currentLoginType 
    //   })
    // });
    // const data = await response.json();
    // if (!data.success) {
    //   throw new Error('로그인 실패');
    // }
    
    // 데모용 검증 (실제로는 서버 응답 사용)
    const isValid = validateCredentials(username, password);

    if (!isValid) {
      // 아이디, 비밀번호가 일치하지 않을 경우 :
      showWarning('아이디 또는 비밀번호가 일치하지 않습니다.');
      showInputError(passwordInput);
      
      // Focus 이벤트: 비밀번호 입력창 초기화 후 포커스
      passwordInput.value = '';
      passwordInput.focus();
      return;
    }

    // 로그인 성공
    handleLoginSuccess();
    
  } catch (error) {
    console.error('로그인 오류:', error);
    showWarning('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
}

// ==========================================
// 자격 증명 검증 (데모용 - 실제로는 서버에서 처리)
// ==========================================

function validateCredentials(username, password) {
  // 데모용 계정
  // 구매회원: buyer / buyer123
  // 판매회원: seller / seller123
  
  if (currentLoginType === 'buyer') {
    return username === 'buyer' && password === 'buyer123';
  } else {
    return username === 'seller' && password === 'seller123';
  }
}

// ==========================================
// 로그인 성공 시 이전 페이지로 이동
// ==========================================

function handleLoginSuccess() {
  // 세션 스토리지에서 이전 페이지 URL 가져오기
  const returnUrl = sessionStorage.getItem('returnUrl');
  
  // 이전 페이지가 있고, 로그인/회원가입 페이지가 아닌 경우
  if (returnUrl && !returnUrl.includes('login') && !returnUrl.includes('signup')) {
    sessionStorage.removeItem('returnUrl'); // 사용 후 제거
    window.location.href = returnUrl;
    return;
  }

  // document.referrer를 통한 이전 페이지 체크
  const previousPage = document.referrer;
  if (previousPage && 
      !previousPage.includes('login') && 
      !previousPage.includes('signup') &&
      previousPage.includes(window.location.hostname)) {
    window.location.href = previousPage;
    return;
  }

  // 이전 페이지가 없거나 외부 사이트인 경우
  // 구매자/판매자에 따라 메인 페이지로 이동
  if (currentLoginType === 'buyer') {
    window.location.href = './index.html';
  } else {
    window.location.href = './seller-center.html';
  }
}

// ==========================================
// 페이지 진입 시 returnUrl 저장 (선택사항)
// ==========================================

// 다른 페이지에서 로그인 페이지로 이동할 때
// 해당 페이지에서 다음과 같이 호출:
// sessionStorage.setItem('returnUrl', window.location.href);
// window.location.href = './login.html';