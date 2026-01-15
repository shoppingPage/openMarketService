<!-- .github/copilot-instructions.md: openMarketService 레포에서 AI 에이전트가 빠르게 작업할 수 있도록 핵심 정보를 제공합니다. -->

# Copilot / AI 에이전트 안내 — openMarketService

목표: 이 정적 쇼핑몰 저장소에서 작고 명확한 변경을 빠르게 수행할 수 있도록 필요한 지식과 예시를 제공한다.

## 전체 개요
- 이 저장소는 빌드 시스템이 없는 정적 다중 페이지 웹사이트입니다. 최상위 페이지는 `product-detail/`, `login/`, `join/` 같은 폴더에 위치하고, 모든 자산은 `assets/` 아래에서 참조됩니다.
- 클라이언트 측 JS가 외부 API에서 상품 목록을 가져와 렌더링합니다: `https://api.wenivops.co.kr/services/open-market/products/` (구현 예: `assets/js/pages/product.js`).
- 서버 코드는 없습니다. 변경 후에는 정적 서버(로컬)로 서빙하여 동작을 확인하세요.

## 주요 파일 요약
- `index.html`: 진입점, `assets/css/pages/product.css`와 `assets/js/pages/product.js`를 로드합니다.
- `assets/js/pages/product.js`: 상품 목록을 fetch 한 뒤 `#product-container`에 `innerHTML`로 렌더링하는 패턴을 사용합니다.
- `assets/js/pages/join.js`: 클라이언트 측 입력 검증과 메시지 출력 패턴(`showMsg`, `checkAllValid`)이 구현되어 있습니다.
- `assets/js/common.js`: 공용 헬퍼용 빈 파일입니다. 여러 페이지에서 쓰일 유틸은 여기로 모으세요.
- `assets/css/pages/`: 페이지별 CSS가 있으며 BEM 네이밍을 따릅니다.

## 프로젝트 규약 (변경 금지 권장)
- CSS: BEM(`block__elem--modifier`) 패턴을 사용합니다.
- JS: 기본적으로 `const`, 재할당 시 `let`, `var` 사용 금지. 화살표 함수와 `async/await` 권장. 문장 끝에 세미콜론 사용.
- DOM 변수는 `$` 접두어를 사용할 수 있습니다 (예: `$submitBtn`).
- `join` 페이지의 메시지 요소 id들(`idMsg`, `pwMsg`, `pwConfirmMsg`, `nameMsg`, `phoneMsg`)을 유지하세요 — JS가 이 id들에 의존합니다.
- 상품 상세 링크 패턴: `product-detail/index.html?product_id=<id>` — 상세 페이지에서 `location.search`로 `product_id`를 파싱하세요.

## 데이터 흐름 및 연동 포인트
- 상품 목록 흐름: 클라이언트 → GET `https://api.wenivops.co.kr/services/open-market/products/` → 응답 `{ results: [...] }`.
- 네트워크 오류는 `product.js`와 동일한 메시지 스타일로 로깅하세요: `console.error('상품을 불러오지 못했습니다.', err)`.
- 오프라인 개발 시 API를 직접 모킹하거나 스크립트 내에서 테스트용 데이터를 사용하세요. 로컬 프록시 설정은 포함되어 있지 않습니다.

## 개발/디버그 워크플로우
- 로컬에서 정적 서버로 서빙하여 확인합니다. 예:

```bash
# macOS / Python 3
python3 -m http.server 8000

# 또는 (선택) live-server가 있다면
npx live-server --port=8000
```

- 브라우저에서 `http://localhost:8000/`를 열고 DevTools의 Console/Network 탭으로 API 호출과 에러 로그를 확인하세요.

## 페이지 확장 가이드
- 새 페이지 추가: `your-page/` 폴더 생성 → `index.html` 추가 → 스타일은 `assets/css/pages/your-page.css` → 스크립트는 `assets/js/pages/your-page.js`로 관리하세요.
- 공용 유틸은 `assets/js/common.js`에 추가하고, 해당 `<script>`를 각 페이지에서 공통으로 포함하세요.

## 병합 및 안전 지침
- 페이지 변경은 범위를 좁게 유지하세요. 전역 CSS를 변경해야 할 정당한 이유가 없다면 페이지별 CSS를 사용하세요.
- 기존 메시지 id나 BEM 클래스명을 변경하면 JS가 깨질 수 있으니 주의하세요.

## 참고할 코드 예시
- 상품 목록 렌더링: `assets/js/pages/product.js`의 fetch → map → `innerHTML` 패턴.
- 폼 검증 및 메시지: `assets/js/pages/join.js`의 `showMsg()`와 `checkAllValid()` 패턴을 따르세요.

---
추가로 자세히 원하시면, `assets/js/pages/product.js`에서의 에러 메시지 포맷(예: "상품을 불러오지 못했습니다.")을 다른 페이지에서도 일관되게 사용하도록 통일하거나, 테스트용 모킹 코드 예시를 추가해 드리겠습니다. 어떤 부분을 더 보강할까요?
