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
document.getElementById('btnCheckId').addEventListener('click', () => {
    if(validateId()) {
        // 중복 시뮬레이션 (test 입력 시 중복 처리)
        if(userIdInput.value === 'test') {
            showMsg('userId', '이미 사용 중인 아이디 입니다.', 'error');
            isIdChecked = false;
        } else {
            // 이제 정확히 userId 아래에 출력됩니다.
            showMsg('userId', '멋진 아이디네요 :)', 'success');
            isIdChecked = true;
        }
    }
    checkAllValid();
});

function validateId() {
    if(!userIdInput.value.trim()) {
        showMsg('userId', '필수 정보입니다.', 'error');
        return false;
    }
    return true;
}

// 3. 비밀번호 유효성 검사 (수정됨)
document.getElementById('pw').addEventListener('input', function() {
    // 8자 이상, 대소문자, 숫자, 특수문자 포함 정규식
    const pwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    
    if(pwReg.test(this.value)) {
        // 조건 충족 시: 메시지 삭제 및 아이콘 색상 변경
        showMsg('pw', '', 'success'); 
        document.getElementById('pwIcon').style.color = '#21BF48';
    } else {
        // 조건 미달 시: 경고 메시지 출력 및 아이콘 색상 초기화
        showMsg('pw', '8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.', 'error');
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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('구매자로 회원가입이 완료되었습니다!');
    location.href = 'login.html';
});