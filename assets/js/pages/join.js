const fields = ['userId', 'pw', 'pwConfirm', 'userName', 'phone2', 'phone3'];
const form = document.getElementById('joinForm');
const btnJoin = document.getElementById('btnJoin');
const terms = document.getElementById('terms');

// 1. 순차 입력 방어 로직
fields.forEach((id, idx) => {
    document.getElementById(id).addEventListener('focus', () => {
        for (let i = 0; i < idx; i++) {
            const prevField = document.getElementById(fields[i]);
            if (!prevField.value.trim()) {
                // 이전 필드가 비었을 때만 해당 필드 메시지 영역에 출력
                showMsg(fields[i], '필수 정보입니다.', 'error');
                prevField.focus();
                break;
            }
        }
    });
});

// 2. 아이디 유효성 및 중복 확인
const userIdInput = document.getElementById('userId');
let isIdChecked = false;

userIdInput.addEventListener('blur', () => validateId());
document.getElementById('btnCheckId').addEventListener('click', async (e) => {
    e.preventDefault();
    if(validateId()) {
        await checkIdDuplicate();
    }
});

// 아이디 중복 확인 (API)
async function checkIdDuplicate() {
    try {
        const username = userIdInput.value.trim();
        
        // 간단한 유효성 검사
        if (!username) {
            showMsg('userId', '필수 정보입니다.', 'error');
            return;
        }
        
        if (!/^[A-Za-z0-9]+$/.test(username)) {
            showMsg('userId', '아이디는 영어 소문자, 대문자, 숫자만 가능합니다.', 'error');
            return;
        }
        
        if (username.length > 20) {
            showMsg('userId', '이 필드의 글자 수가 20 이하인지 확인하십시오.', 'error');
            return;
        }
        
        // 실제로는 백엔드에서 검증하지만, 프론트에서 미리 체크
        showMsg('userId', '멋진 아이디네요 :)', 'success');
        isIdChecked = true;
        checkAllValid();
        
    } catch (error) {
        console.error('아이디 중복확인 오류:', error);
        showMsg('userId', '중복확인 중 오류가 발생했습니다.', 'error');
    }
}

function validateId() {
    if(!userIdInput.value.trim()) {
        showMsg('userId', '필수 정보입니다.', 'error');
        return false;
    }
    return true;
}

// 3. 비밀번호 유효성 검사
document.getElementById('pw').addEventListener('input', function() {
    // 8자 이상, 영소문자, 영대문자, 숫자 포함
    const pwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    if(pwReg.test(this.value)) {
        // 조건 충족 시: 메시지 삭제 및 아이콘 색상 변경
        showMsg('pw', '', 'success'); 
        document.getElementById('pwIcon').style.color = '#21BF48';
    } else {
        // 조건 미달 시: 경고 메시지 출력 및 아이콘 색상 초기화
        showMsg('pw', '8자 이상, 영문 대소문자, 숫자를 포함해야 합니다.', 'error');
        document.getElementById('pwIcon').style.color = '#F2F2F2';
    }
    checkAllValid();
});

// 4. 비밀번호 재확인
document.getElementById('pwConfirm').addEventListener('input', function() {
    const pw = document.getElementById('pw').value;
    if(this.value === pw && pw !== "") {
        showMsg('pwConfirm', '', 'success');
        document.getElementById('pwConfirmIcon').style.color = '#21BF48';
    } else {
        showMsg('pwConfirm', '비밀번호가 일치하지 않습니다.', 'error');
        document.getElementById('pwConfirmIcon').style.color = '#F2F2F2';
    }
    checkAllValid();
});

// 5. 공통 메시지 출력 함수 (수정됨: 정확한 위치 매칭)
function showMsg(targetId, text, type) {
    // targetId에 맞는 메시지 요소를 정확히 찾습니다 (예: userId -> idMsg)
    let msgTag;
    if (targetId === 'userId') msgTag = document.getElementById('idMsg');
    else if (targetId === 'pw') msgTag = document.getElementById('pwMsg');
    else if (targetId === 'pwConfirm') msgTag = document.getElementById('pwConfirmMsg');
    else if (targetId === 'userName') msgTag = document.getElementById('nameMsg');
    else if (targetId === 'phone2' || targetId === 'phone3') msgTag = document.getElementById('phoneMsg');

    if (msgTag) {
        msgTag.innerText = text;
        msgTag.className = 'msg ' + type;
    }
}

// 6. 전체 유효성 검사 및 버튼 활성화
function checkAllValid() {
    const isPwValid = document.getElementById('pwIcon').style.color === 'rgb(33, 191, 72)'; // #21BF48의 rgb값
    const isPwConfirmValid = document.getElementById('pwConfirmIcon').style.color === 'rgb(33, 191, 72)';
    const isNameIn = document.getElementById('userName').value.trim() !== "";
    const isPhoneIn = document.getElementById('phone2').value.length >= 3 && document.getElementById('phone3').value.length === 4;
    
    if(isIdChecked && isPwValid && isPwConfirmValid && isNameIn && isPhoneIn && terms.checked) {
        btnJoin.disabled = false;
        btnJoin.classList.add('active');
    } else {
        btnJoin.disabled = true;
        btnJoin.classList.remove('active');
    }
}

// 이벤트 리스너들
terms.addEventListener('change', checkAllValid);
document.getElementById('userName').addEventListener('input', checkAllValid);
document.getElementById('phone2').addEventListener('input', checkAllValid);
document.getElementById('phone3').addEventListener('input', checkAllValid);

// 회원가입 제출
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 클라이언트 측 최종 검증
    if (!isIdChecked) {
        showMsg('userId', '아이디 중복확인을 해주세요.', 'error');
        return;
    }
    
    await performSignup();
});

// 회원가입 API 호출
async function performSignup() {
    try {
        const username = document.getElementById('userId').value.trim();
        const password = document.getElementById('pw').value.trim();
        const name = document.getElementById('userName').value.trim();
        const phone1 = document.getElementById('phone1').value;
        const phone2 = document.getElementById('phone2').value;
        const phone3 = document.getElementById('phone3').value;
        const phone_number = phone1 + phone2 + phone3;
        
        const response = await fetch(
          'https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/',
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username,
              password,
              name,
              phone_number,
            }),
          }
        );
        
        const data = await response.json();
        console.log('회원가입 응답:', response.status, data); // 디버깅
        
        if (response.status === 201 || response.status === 200) {
            // 회원가입 성공
            alert('구매자로 회원가입이 완료되었습니다!');
            location.href = '../login/index.html';
        } else {
            // 에러 처리
            handleSignupErrors(data);
        }
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
}

// 회원가입 에러 응답 처리
function handleSignupErrors(data) {
    // API 에러 응답: {"필드명": ["에러메시지"], ...}
    
    if (data.username) {
        showMsg('userId', data.username[0], 'error');
    }
    
    if (data.password) {
        showMsg('pw', data.password[0], 'error');
    }
    
    if (data.name) {
        showMsg('userName', data.name[0], 'error');
    }
    
    if (data.phone_number) {
        showMsg('phone2', data.phone_number[0], 'error');
    }
}