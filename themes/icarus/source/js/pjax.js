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
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
        var commentContainer = document.querySelector('.comment-container');
        if (!commentContainer) return;
        
        var commentType = commentContainer.getAttribute('data-comment-type');
        var commentConfig = commentContainer.getAttribute('data-comment-config');
        
        if (commentType === 'utterances' && commentConfig) {
            // 清除旧的评论
            commentContainer.innerHTML = '';
            
            try {
                var config = JSON.parse(commentConfig);
                var script = document.createElement('script');
                script.src = 'https://utteranc.es/client.js';
                script.setAttribute('repo', config.repo);
                script.setAttribute('issue-term', config['issue-term']);
                script.setAttribute('theme', config.theme);
                script.setAttribute('crossorigin', 'anonymous');
                script.async = true;
                if (config.label) {
                    script.setAttribute('label', config.label);
                }
                commentContainer.appendChild(script);
            } catch (e) {
                console.warn('Failed to load utterances:', e);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
