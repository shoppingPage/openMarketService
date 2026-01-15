/**
 * 컴포넌트를 로드하여 지정된 요소에 삽입합니다.
 * @param {string} componentPath - 컴포넌트 HTML 파일 경로
 * @param {string} targetSelector - 삽입할 위치의 선택자
 * @param {string} basePath - 이미지 등 에셋의 기본 경로 (예: '../assets/' 또는 './assets/')
 */
async function loadComponent(componentPath, targetSelector, basePath = './assets/') {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`컴포넌트 로드 실패: ${componentPath}`);
        }

        let html = await response.text();

        // data-icon 속성을 가진 img 태그의 src를 basePath에 맞게 설정
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        tempDiv.querySelectorAll('img[data-icon]').forEach(img => {
            const iconName = img.getAttribute('data-icon');
            img.src = `${basePath}images/${iconName}`;
        });

        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = tempDiv.innerHTML;
        }
    } catch (error) {
        console.error('컴포넌트 로드 오류:', error);
    }
}

/**
 * Footer 컴포넌트를 로드합니다.
 * @param {string} basePath - 에셋 기본 경로 (기본값: './assets/')
 */
function loadFooter(basePath = './assets/') {
    const componentPath = basePath.includes('../')
        ? '../components/footer.html'
        : './components/footer.html';

    loadComponent(componentPath, '#footer-container', basePath);
}
