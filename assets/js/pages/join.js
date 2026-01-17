document.addEventListener('DOMContentLoaded', () => {
    // 요소 선택
    const fields = ['userId', 'pw', 'pwConfirm', 'userName', 'phone2', 'phone3'];
    const form = document.getElementById('joinForm');
    const btnJoin = document.getElementById('btnJoin');
    const terms = document.getElementById('terms');

    // 유효성 상태 관리 변수 (색상 비교 대신 이 변수들을 사용해 버튼 활성화)
    let isIdChecked = false;
    let isPwValid = false;
    let isPwConfirmValid = false;
    let isNameValid = false;
    let isPhoneValid = false;
    let isTermsValid = false;

    // 1. 순차 입력 방어 로직
    fields.forEach((id, idx) => {
        const fieldEl = document.getElementById(id);
        if (fieldEl) {
            fieldEl.addEventListener('focus', () => {
                for (let i = 0; i < idx; i++) {
                    const prevField = document.getElementById(fields[i]);
                    if (prevField && !prevField.value.trim()) {
                        showMsg(fields[i], '필수 정보입니다.', 'error');
                        prevField.focus();
                        return;
                    }
                }
            });
        }
    });

    // 2. 아이디 중복 확인
    const btnCheckId = document.getElementById('btnCheckId');
    const userIdInput = document.getElementById('userId');

    userIdInput.addEventListener('input', () => {
        if (userIdInput.value.trim() !== "") {
            showMsg('userId', '', 'success');
        }
    });

    if (btnCheckId) {
        btnCheckId.addEventListener('click', async (e) => {
            e.preventDefault();
            const username = userIdInput.value.trim();
            if (!username) {
                showMsg('userId', '필수 정보입니다.', 'error');
                return;
            }
            await checkIdDuplicate(username);
        });
    }

    async function checkIdDuplicate(username) {
        try {
            const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/validate-username/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username })
            });
            const data = await response.json();

            if (response.status === 200) {
                showMsg('userId', '멋진 아이디네요 :)', 'success');
                isIdChecked = true;
            } else {
                showMsg('userId', data.error || '이미 사용 중인 아이디입니다.', 'error');
                isIdChecked = false;
            }
        } catch (error) {
            showMsg('userId', '중복확인 오류가 발생했습니다.', 'error');
            isIdChecked = false;
        }
        checkAllValid();
    }

    // 3. 비밀번호 유효성 검사 (8자 이상, 대소문자, 숫자 포함)
    const pwInput = document.getElementById('pw');
    const pwIcon = document.getElementById('pwIcon');

    pwInput.addEventListener('input', function () {
        const pwReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (pwReg.test(this.value)) {
            showMsg('pw', '', 'success'); // 메시지 지움
            pwIcon.src = '../assets/images/icon-check-on.svg';
            isPwValid = true;
        } else {
            showMsg('pw', '8자 이상, 영문 대 소문자, 숫자를 사용하세요.', 'error');
            pwIcon.src = '../assets/images/icon-check-off.svg';
            isPwValid = false;
        }
        // 비밀번호가 바뀌면 재확인 칸도 다시 체크해야 함
        validatePwConfirm();
        checkAllValid();
    });

    // 4. 비밀번호 재확인 검사
    const pwConfirmInput = document.getElementById('pwConfirm');
    const pwConfirmIcon = document.getElementById('pwConfirmIcon');

    function validatePwConfirm() {
        const pwValue = pwInput.value;
        const confirmValue = pwConfirmInput.value;

        if (confirmValue === pwValue && confirmValue !== "") {
            showMsg('pwConfirm', '', 'success');
            pwConfirmIcon.src = '../assets/images/icon-check-on.svg';
            isPwConfirmValid = true;
        } else {
            showMsg('pwConfirm', '비밀번호가 일치하지 않습니다.', 'error');
            pwConfirmIcon.src = '../assets/images/icon-check-off.svg';
            isPwConfirmValid = false;
        }
    }

    pwConfirmInput.addEventListener('input', () => {
        validatePwConfirm();
        checkAllValid();
    });

    // 5. 휴대폰 번호 검사 (실시간 반영)
    const p2 = document.getElementById('phone2');
    const p3 = document.getElementById('phone3');

    [p2, p3].forEach(el => {
        el.addEventListener('input', () => {
            el.value = el.value.replace(/[^0-9]/g, ''); // 숫자만 입력

            if (p2.value.length >= 3 && p3.value.length === 4) {
                showMsg('phone2', '', 'success');
                isPhoneValid = true;
            } else {
                showMsg('phone2', '휴대폰 번호를 확인해 주세요.', 'error');
                isPhoneValid = false;
            }
            checkAllValid();
        });
    });

    // 6. 이름 및 약관 체크
    const nameInput = document.getElementById('userName');
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== "") {
            showMsg('userName', '', 'success');
            isNameValid = true;
        } else {
            isNameValid = false;
        }
        checkAllValid();
    });

    terms.addEventListener('change', () => {
        isTermsValid = terms.checked;
        checkAllValid();
    });

    // 7. 전체 유효성 검사 및 버튼 활성화
    function checkAllValid() {
        if (isIdChecked && isPwValid && isPwConfirmValid && isNameValid && isPhoneValid && isTermsValid) {
            btnJoin.disabled = false;
            btnJoin.classList.add('active');
        } else {
            btnJoin.disabled = true;
            btnJoin.classList.remove('active');
        }
    }

    // 공통 메시지 출력 함수
    function showMsg(targetId, text, type) {
        const msgMap = {
            'userId': 'idMsg', 'pw': 'pwMsg', 'pwConfirm': 'pwConfirmMsg',
            'userName': 'nameMsg', 'phone2': 'phoneMsg', 'phone3': 'phoneMsg'
        };
        const msgTag = document.getElementById(msgMap[targetId]);
        if (msgTag) {
            msgTag.innerText = text;
            msgTag.className = 'msg ' + type;
        }
    }

    // 8. 회원가입 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!isIdChecked) {
            alert('아이디 중복확인이 필요합니다.');
            return;
        }
        await performSignup();
    });

    async function performSignup() {
        try {
            const signupData = {
                username: userIdInput.value.trim(),
                password: pwInput.value.trim(),
                name: nameInput.value.trim(),
                phone_number: document.getElementById('phone1').value + p2.value + p3.value
            };

            const response = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            if (response.ok) {
                alert('구매자로 회원가입이 완료되었습니다!');
                location.href = '../login/index.html';
            } else {
                const data = await response.json();
                if (data.username) showMsg('userId', data.username[0], 'error');
                if (data.phone_number) showMsg('phone2', '이미 가입된 휴대폰 번호입니다.', 'error');
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다.');
        }
    }
});