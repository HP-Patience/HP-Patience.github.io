document.addEventListener('DOMContentLoaded', function() {
    try {
        const columnLeft = document.querySelector('.column-left');
        const columnMain = document.querySelector('.column-main');
        
        if (!columnLeft || !columnMain) return;

        let scrollHandler = null;
        let resizeHandler = null;
        const originalPosition = columnLeft.style.position || '';
        const originalTop = columnLeft.style.top || '';
        const originalBottom = columnLeft.style.bottom || '';
        const originalWidth = columnLeft.style.width || '';
        const originalZIndex = columnLeft.style.zIndex || '';

        function updateSidebarPosition() {
            const sidebarHeight = columnLeft.offsetHeight;
            const mainHeight = columnMain.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const maxScroll = mainHeight - windowHeight + sidebarHeight;

            if (sidebarHeight <= windowHeight) {
                if (scrollTop <= maxScroll) {
                    columnLeft.style.position = 'sticky';
                    columnLeft.style.top = '1.5rem';
                    columnLeft.style.bottom = 'auto';
                } else {
                    columnLeft.style.position = '';
                    columnLeft.style.top = '';
                    columnLeft.style.bottom = '';
                }
            } else {
                columnLeft.style.position = '';
                columnLeft.style.top = '';
                columnLeft.style.bottom = '';
            }
        }

        function checkAndApplySticky() {
            if (window.innerWidth >= 769) {
                columnLeft.style.width = columnLeft.offsetWidth + 'px';
                
                if (!scrollHandler) {
                    scrollHandler = updateSidebarPosition;
                    window.addEventListener('scroll', scrollHandler);
                }
                updateSidebarPosition();
            } else {
                columnLeft.style.position = originalPosition;
                columnLeft.style.top = originalTop;
                columnLeft.style.bottom = originalBottom;
                columnLeft.style.width = originalWidth;
                columnLeft.style.zIndex = originalZIndex;
                
                if (scrollHandler) {
                    window.removeEventListener('scroll', scrollHandler);
                    scrollHandler = null;
                }
            }
        }

        checkAndApplySticky();
        
        if (!resizeHandler) {
            resizeHandler = checkAndApplySticky;
            window.addEventListener('resize', resizeHandler);
        }
    } catch (e) {
        console.error('Sticky sidebar error:', e);
    }
});