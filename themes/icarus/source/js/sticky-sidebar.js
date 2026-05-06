document.addEventListener('DOMContentLoaded', function() {
    try {
        const columnLeft = document.querySelector('.column-left');
        const columnMain = document.querySelector('.column-main');
        
        if (!columnLeft || !columnMain) return;

        let scrollHandler = null;
        let resizeHandler = null;

        function updateSidebarPosition() {
            const sidebarHeight = columnLeft.offsetHeight;
            const mainHeight = columnMain.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const maxScroll = mainHeight - windowHeight + sidebarHeight;

            if (sidebarHeight <= windowHeight) {
                if (scrollTop <= maxScroll) {
                    columnLeft.style.position = 'fixed';
                    columnLeft.style.top = '1.5rem';
                    columnLeft.style.bottom = 'auto';
                } else {
                    const bottomOffset = maxScroll - scrollTop + sidebarHeight;
                    columnLeft.style.position = 'absolute';
                    columnLeft.style.bottom = Math.max(1.5 * 16, bottomOffset) + 'px';
                    columnLeft.style.top = 'auto';
                }
            } else {
                columnLeft.style.position = '';
                columnLeft.style.top = '';
                columnLeft.style.bottom = '';
            }
        }

        function checkAndApplySticky() {
            if (window.innerWidth >= 769) {
                columnLeft.style.position = 'fixed';
                columnLeft.style.top = '1.5rem';
                columnLeft.style.bottom = 'auto';
                columnLeft.style.width = columnLeft.offsetWidth + 'px';
                columnLeft.style.zIndex = '100';
                
                if (!scrollHandler) {
                    scrollHandler = updateSidebarPosition;
                    window.addEventListener('scroll', scrollHandler);
                }
                updateSidebarPosition();
            } else {
                columnLeft.style.position = '';
                columnLeft.style.top = '';
                columnLeft.style.bottom = '';
                columnLeft.style.width = '';
                columnLeft.style.zIndex = '';
                
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