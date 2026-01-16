// ==========================================
// 1. 요소 선택 및 상태 초기화
// ==========================================
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const warnBox = document.getElementById('warnBox');
const tabs = document.querySelectorAll('.login__tab');

let currentLoginType = 'buyer'; // 기본값 (BUYER)

// ==========================================
// 2. 탭 전환 기능 (구매회원 / 판매회원)
// ==========================================
if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 모든 탭 활성화 해제
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // 선택한 탭 활성화
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // 데이터 타입 업데이트 (buyer / seller)
            currentLoginType = tab.dataset.type;
            
            // 상태 초기화
            hideWarning();
            clearInputErrors();
        });
    });
}

// ==========================================
// 3. UI 제어 함수 (경고 및 에러 관리)
// ==========================================
function showWarning(message) {
    if (warnBox) {
        warnBox.textContent = message;
        warnBox.classList.add('show');
    }
}

function hideWarning() {
    if (warnBox) {
        warnBox.textContent = '';
        warnBox.classList.remove('show');
    }
}

function showInputError(input) {
    input.classList.add('error');
}

function clearInputErrors() {
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error');
}

// 입력 시 실시간으로 에러 상태 해제
[usernameInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        hideWarning();
    });
});

// ==========================================
// 4. API 로그인 시도 (Main Logic)
// ==========================================
async function performLogin(username, password) {
    try {
        const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                // login_type: currentLoginType.toUpperCase() // BUYER 또는 SELLER
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 로그인 성공 시 처리
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            handleLoginSuccess();
        } else {
            // 401 Unauthorized 또는 400 Bad Request 처리
            showWarning(data.FAIL_Message || '아이디 또는 비밀번호가 일치하지 않습니다.');
            showInputError(usernameInput);
            showInputError(passwordInput);
            passwordInput.value = ''; // 비밀번호 초기화
            passwordInput.focus();
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        // CORS 에러가 나면 이 블록이 실행됩니다.
        showWarning('서버와의 연결이 원활하지 않습니다. CORS 확장 프로그램을 확인해 주세요.');
    }
}

// ==========================================
// 5. 폼 제출 이벤트 리스너
// ==========================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // 빈 값 검증
    if (!username) {
        showWarning('아이디를 입력해 주세요.');
        showInputError(usernameInput);
        usernameInput.focus();
        return;
    }
    
    if (!password) {
        showWarning('비밀번호를 입력해 주세요.');
        showInputError(passwordInput);
        passwordInput.focus();
        return;
    }

    // 서버로 로그인 요청
    performLogin(username, password);
});

// ==========================================
// 6. 성공 시 이동 처리
// ==========================================
function handleLoginSuccess() {
    // 세션에 저장된 이동할 주소가 있으면 해당 주소로, 없으면 타입별 메인으로 이동
    const returnUrl = sessionStorage.getItem('returnUrl');
    
    if (returnUrl && !returnUrl.includes('login') && !returnUrl.includes('signup')) {
        sessionStorage.removeItem('returnUrl');
        window.location.href = returnUrl;
    } else {
        window.location.href = (currentLoginType === 'buyer') ? '../index.html' : '../seller-center.html';
    }
}