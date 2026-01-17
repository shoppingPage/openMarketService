# 🛒 팀 오합지졸의 오픈마켓 서비스 프로젝트 (Open Market Service)

> **판매자와 구매자를 잇는 커머스 플랫폼** > 본 프로젝트는 Vanilla JS와 REST API를 활용하여 멀티 페이지 애플리케이션(MPA) 환경에서의 상품 등록, 결제 및 CRUD를 직접 구현한 팀 프로젝트입니다.

---

## 1. 🛠 Tech Stack

- **Markup:** HTML5
- **Styling:** CSS3
- **Scripting:** JavaScript (ES6+)
- **HTTP Client:** Fetch API

---

---

## 📂2. Project Structure

프로젝트의 폴더 구조는 기능별로 명확하게 분리하여 관리하고 있습니다. 각 페이지는 독립된 폴더 내의 `index.html`을 가지며, 공통 자원은 `assets` 폴더에서 관리합니다.

```text
root/
├── 404/                # 404 에러 페이지
│   └── index.html
├── assets/             # 정적 자원 관리
│   ├── css/
│   │   ├── pages/      # 페이지별 전용 스타일 (login, join, cart 등)
│   │   ├── common.css  # 공통 레이아웃 스타일
│   │   ├── reset.css   # 브라우저 기본 스타일 초기화
│   │   └── root.css    # CSS 변수 및 루트 설정
│   ├── images/         # 이미지 리소스
│   └── js/
│       ├── common.js   # 공통 로직 및 컴포넌트 연결
│       └── [page].js   # 각 페이지별 독립 스크립트
├── cart/               # 장바구니 페이지
│   └── index.html
├── components/         # 재사용 가능한 HTML 조각
│   ├── footer.html
│   └── header.html
├── join/               # 회원가입 페이지
│   └── index.html
├── login/              # 로그인 페이지
│   └── index.html
├── product-detail/     # 상품 상세 페이지
│   └── index.html
├── index.html          # 메인(상품 목록) 페이지
└── README.md

```

## 3. 📝 Coding Convention

프로젝트의 유지보수와 원활한 협업을 위해 아래의 컨벤션을 준수하였습니다.

### 🎨 HTML & CSS

- **HTML:** 모든 태그와 속성은 소문자로 작성하며, 시맨틱 태그(`<header>`, `<main>`, `<footer>` 등) 사용을 지향합니다.
- **Naming:** CSS 클래스명은 `Kebab-case`를 사용합니다. (예: `.card-btn-active`)
- **Property Order:** Layout(display, position) → Box Model(width, margin) → Visual(background, color) → Typography 순으로 작성합니다.
- **Unit:** 반응형을 위해 `rem`, `%`, `vw/vh`를 권장하며, 고정 크기에만 `px`를 사용합니다.

### 💻 JavaScript

- **Variable:** `const` 사용을 원칙으로 하며, 변수/함수명은 `camelCase`, 상수는 `UPPER_SNAKE_CASE`를 사용합니다.
- **DOM:** DOM 요소를 담는 변수는 접두어 `$`를 사용합니다. (예: `const $submitBtn`)
- **Syntax:** 화살표 함수와 `async / await` 구문을 사용하며, 모든 문장 끝에는 세미콜론(`;`)을 붙입니다.

---

## 4. 👥 팀원 및 역할 분담

| 이름              | 역할             | 담당 기능 구현                                                           |
| :---------------- | :--------------- | :----------------------------------------------------------------------- |
| **한유리 (팀장)** | 메인 페이지      | 프로덕트 페이지 목록 렌더링, 상품 상세페이지와 API 연동                  |
| **김성민**        | 회원가입 페이지  | 구매자 회원가입 유효성 검사, 아이디 중복 확인 API 연동                   |
| **이영미**        | 로그인 페이지    | 로그인 예외 처리(Focus 이벤트), 세션 유지 및 리다이렉트                  |
| **변슬기**        | 상품 상세 페이지 | 상품 상세 데이터 Fetching, 수량 변경 및 총 가격 계산 로직, 장바구니 로직 |

---

## 🤝 5. Collaboration & Work-flow

성공적인 협업과 코드 품질 유지를 위해 GitHub의 다양한 기능을 활용하여 체계적인 워크플로우를 구축하였습니다.

### 1. GitHub Project & Issue Management

- **GitHub Projects (Kanban):** 전체 할업 업무를 `Todo`, `In Progress`, `Done`으로 세분화하여 실시간 진행 상황을 공유했습니다.
- **Issue-Driven Development:** 모든 기능 구현과 버그 수정은 Issue 등록부터 시작했습니다. 이를 통해 각 작업의 목적을 명확히 하고, 변경 이력을 투명하게 관리했습니다.

### 2. Branch Strategy (Git-Flow)

- **Main Branch:** 배포 가능한 상태의 안정적인 코드만을 관리합니다.
- **Dev Branch:** 기능 구현이 완료된 코드들이 통합되는 개발 주축 브랜치입니다.
- **Feature Branch:** 각 팀원이 담당한 기능을 개발하는 브랜치로, `feat/login`, `feat/join`과 같이 명확한 네이밍 규칙을 적용했습니다.

### 3. Code Review & Pull Request

- **Strict Code Review:** 모든 기능 구현은 `dev` 브랜치로의 Pull Request(PR)를 통해 팀원들의 코드 리뷰를 거쳤습니다.
- **Quality Control:** PR 단계에서 코드 컨벤션 준수 여부 및 로직의 효율성을 검토하고, 팀원 모두의 승인(Approve)이 있을 때만 머지를 진행하여 코드 품질을 상향 평준화했습니다.
- **Conflict Management:** 로컬 환경에서 선제적인 `pull`과 `merge` 테스트를 통해 충돌을 최소화하고 안정적으로 통합했습니다.

## 6. 🚀 핵심 기능 상세

### 🔐 1) 로그인 및 회원가입

- **로그인 유효성:** 미입력 시 해당 항목 `focus` 이벤트 발생, 일치하지 않을 시 비밀번호창 초기화 및 `focus`.
- **회원가입:** 모든 입력 및 이용약관 동의 시에만 가입 가능. 아이디 중복 확인 기능 포함.
- **권한 분리:** 구매자/판매자 탭 구분을 통해 각각의 회원 체계 관리.

### 🛍️ 2) 상품 목록 및 상세 페이지

- **목록:** API를 통해 실시간 상품 정보(판매자, 상품명, 가격) 노출.
- **상세 정보:** `productId` 기반의 데이터 로드.
- **수량 조절:** 재고 수량 초과 시 `+` 버튼 비활성화 및 수량에 따른 총 가격 실시간 계산.
- **중복 방지:** 이미 선택된 상품의 중복 추가 방지 로직 적용.

### 🏗️ 3) 공통 컴포넌트 (GNB, Footer)

- **컴포넌트화:** 헤더와 푸터를 별도 JS로 분리하여 관리 및 각 페이지 동적 연결.
- **GNB 유동성:** 비로그인 유저가 장바구니 접근 시 로그인 안내 모달 노출.

---

## 7. 💡 추가 발표 포인트 (Tips)

- **MPA 구현 방식:** 각 페이지 간 데이터 전달 방식(URL 파라미터 등) 설명.
- **Vanilla JS의 도전:** 프레임워크 없이 컴포넌트를 분리하고 관리하며 느꼈던 기술적 성찰.
- **UX 디테일:** 사용자 입력 오류 시 `alert`만 띄우지 않고 `focus`를 주는 등 사용자 경험을 고려한 부분 강조.
