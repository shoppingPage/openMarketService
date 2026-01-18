# 웹사이트 성능 개선 계획서

이 문서는 Lighthouse 진단 보고서를 기반으로 웹사이트의 성능을 개선하기 위한 계획을 설명합니다.

## 1. 이미지 최적화 (가장 시급)

**문제점:**

- 이미지 파일 크기가 너무 커서 다운로드 시간이 깁니다 (예상 절감: 20,638KiB).
- 이미지에 `width`와 `height` 속성이 없어 레이아웃 변경(CLS)을 유발합니다.
- 가장 큰 콘텐츠풀 페인트(LCP) 이미지의 로딩이 최적화되어 있지 않습니다.

**해결 방안:**

1.  **이미지 압축:**
    - `assets/images/` 폴더에 있는 모든 JPG, PNG 이미지의 품질을 유지하면서 압축.
    - 가능하다면 WebP와 같은 최신 이미지 포맷으로 변환하여 제공하는 것을 고려합니다.
2.  **LCP 이미지 최적화:**
    - 가장 중요한 이미지(보통 페이지 상단의 큰 배너 또는 상품 이미지)에 `fetchpriority="high"` 속성을 추가하여 브라우저가 우선적으로 다운로드하도록 합니다.
    - 예시: `<img src="path/to/lcp-image.jpg" fetchpriority="high" alt="...">`
3.  **지연 로딩(Lazy Loading) 적용:**
    - 화면 밖에 있는 이미지(스크롤해야 보이는 이미지)에 `loading="lazy"` 속성을 추가하여 초기 페이지 로드 속도를 개선합니다.
    - 예시: `<img src="path/to/offscreen-image.jpg" loading="lazy" alt="...">`

## 2. 렌더링 차단 리소스 제거

**문제점:**

- CSS와 JavaScript 파일이 페이지의 초기 렌더링을 차단하고 있습니다 (예상 절감: 70ms).
- 특히 `font.css` 파일이 렌더링을 지연시키고 있습니다.

**해결 방안:**

1.  **JavaScript 로드 지연:**
    - `index.html` 및 다른 HTML 파일에서 `<head>`에 있는 `<script>` 태그를 `<body>` 태그가 닫히기 직전으로 이동시킵니다.
    - 스크립트 실행 순서가 중요하지 않다면 `async` 속성을, 순서가 중요하다면 `defer` 속성을 추가합니다.
    - 예시: `<script src="assets/js/pages/product.js" defer></script>`
2.  **CSS 로드 최적화:**
    - **필수 CSS 인라이닝:** 스크롤 없이 볼 수 있는 부분(Above-the-fold)에 필요한 최소한의 CSS를 `<style>` 태그를 이용해 HTML 파일에 직접 삽입합니다.
    - **비필수 CSS 비동기 로드:** 나머지 CSS 파일들은 아래와 같은 패턴을 사용하여 비동기적으로 로드합니다.
      ```html
      <link
        rel="stylesheet"
        href="styles.css"
        media="print"
        onload="this.media='all'"
      />
      <noscript><link rel="stylesheet" href="styles.css" /></noscript>
      ```
    - `font.css` 파일에 `font-display: swap;` 속성을 추가하여 텍스트가 먼저 보이도록 하고 웹폰트 로딩으로 인한 텍스트 공백(FOIT)을 방지합니다.

## 3. JavaScript 및 CSS 최적화

**문제점:**

- JavaScript와 CSS 파일이 축소(Minify)되지 않아 파일 크기가 불필요하게 큽니다 (JS 예상 절감: 10KiB).
- 사용하지 않는 JavaScript 코드가 포함되어 있습니다 (예상 절감: 26KiB).

**해결 방안:**

1.  **코드 축소(Minification):**
    - `assets/js`와 `assets/css` 폴더의 모든 JavaScript 및 CSS 파일들을 축소합니다. (예: `terser`, `cssnano`와 같은 도구 사용)
    - 축소된 파일(예: `common.min.js`)을 HTML에서 연결하여 사용합니다.
2.  **사용하지 않는 코드 제거:**
    - Chrome DevTools의 `Coverage` 탭을 사용하여 페이지에서 실제로 사용되지 않는 JavaScript 및 CSS 코드를 식별하고 제거합니다.
    - 코드 분할(Code Splitting)을 도입하여 각 페이지에 필요한 스크립트만 로드하도록 구조를 변경하는 것을 고려합니다.

## 4. 캐싱 및 네트워크 설정

**문제점:**

- 정적 자산(이미지, JS, CSS)에 효율적인 캐시 정책이 적용되지 않았습니다 (예상 절감: 6,364KiB).
- 텍스트 기반 리소스(HTML, CSS, JS)에 압축이 적용되지 않았습니다.
- 서드파티 리소스(예: 폰트) 연결에 대한 최적화가 없습니다.

**해결 방안:**

1.  **브라우저 캐시 활용:**
    - 서버 설정을 통해 이미지, CSS, JS와 같은 정적 자산에 대해 긴 만료 시간(예: `Cache-Control: max-age=31536000`)을 설정합니다.
2.  **텍스트 압축 활성화:**
    - 서버에서 Gzip 또는 Brotli 압축을 활성화하여 HTML, CSS, JavaScript 파일의 전송 크기를 줄입니다.
3.  **사전 연결(Preconnect) 사용:**
    - `cdn.jsdelivr.net`과 같이 중요한 서드파티 도메인에 대해 `<head>`에 `preconnect` 힌트를 추가하여 DNS 조회, TCP 핸드셰이크, TLS 협상 시간을 미리 줄입니다.
    - 예시: `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>`

## 5. 뒤로/앞으로 캐시(BFCache) 활성화

**문제점:**

- 뒤로 가기/앞으로 가기 시 페이지가 캐시에서 빠르게 복원되지 않고 새로 로드됩니다.

**해결 방안:**

1.  **`unload` 이벤트 리스너 제거:**
    - `unload` 이벤트는 BFCache를 비활성화하는 주요 원인입니다. 코드에서 `unload` 이벤트 리스너를 사용하고 있다면, `pagehide` 이벤트로 대체하는 것을 검토합니다.

---

**실행 순서 제안:**

1.  **1단계 (즉각적인 개선):** 이미지에 `width`, `height` 속성 추가 및 LCP 이미지에 `fetchpriority="high"` 적용.
2.  **2단계 (빌드 프로세스 개선):** JS/CSS 축소 및 이미지 압축 자동화.
3.  **3단계 (코드 리팩토링):** 스크립트 `defer` 적용, CSS 비동기 로드, BFCache 문제 해결.
4.  **4단계 (서버 설정):** 캐시 정책 및 텍스트 압축 설정.

이 계획을 단계적으로 실행하면 웹사이트의 로딩 속도와 사용자 경험을 크게 향상시킬 수 있습니다.
