## 🎨 Coding Convention

프로젝트의 유지보수와 협업을 위해 아래의 코딩 컨벤션을 준수합니다.

### 1. HTML Convention

- **소문자 사용**: 모든 태그와 속성은 소문자로 작성합니다.
- **시맨틱 태그**: 의미 있는 마크업을 위해 `<div>`보다는 `<header>`, `<main>`, `<footer>`, `<section>` 등 시맨틱 태그 사용을 지향합니다.

### 2. CSS Convention

- **Naming**: **Kebab case** 패턴을 사용합니다.
  - (예: `.card-btn-active`)
- **속성 선언 순서**:
  1. **Layout**: `display`, `position`, `flex`, `z-index`
  2. **Box Model**: `width`, `height`, `margin`, `padding`
  3. **Visual**: `background`, `border`, `color`
  4. **Typography**: `font-family`, `font-size`, `text-align`
- **단위**: 반응형을 고려하여 `rem`, `%`, `vw/vh` 사용을 권장하며, 고정 크기에는 `px`를 사용합니다.

### 3. JavaScript Convention

- **Variable**:
  - 기본적으로 `const`를 사용하며, 재할당이 필요한 경우에만 `let`을 사용합니다. (`var` 사용 금지)
  - 변수명과 함수명은 **camelCase**를 사용합니다. (예: `getProductData`)
  - 상수는 **UPPER_SNAKE_CASE**를 사용합니다. (예: `API_BASE_URL`)
- **DOM**:
  - DOM 요소를 담는 변수는 접두어 `$`를 사용합니다. (예: `const $submitBtn = ...`)
- **Function**:
  - 가급적 화살표 함수(`arrow function`)를 사용합니다.
  - 비동기 로직은 `async / await` 구문을 사용하여 처리합니다.
- **Syntax**:
  - 문장 끝에 반드시 세미콜론(`;`)을 사용합니다.
  - 문자열은 작은따옴표(`'`) 또는 백틱(`` ` ``) 사용을 지향합니다.

---

## 🛠 Tech Stack

- **Markup**: HTML5
- **Styling**: CSS3
- **Scripting**: JavaScript (ES6+)
- **HTTP Client**: Fetch API
