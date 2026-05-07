(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    '[data-pjax]',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    '#back-to-top'
                ],
                cacheBust: false
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    // Listen for completion of Pjax
    document.addEventListener('pjax:complete', function() {
        // 重新初始化评论系统
        var commentContainer = document.querySelector('.comment-container');
        if (commentContainer && typeof window.utterancesLoad === 'function') {
            window.utterancesLoad();
        }
    });

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
