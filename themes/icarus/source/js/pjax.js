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
        
        // 重新初始化代码框复制按钮
        if (window.IcarusThemeSettings && window.IcarusThemeSettings.article && window.IcarusThemeSettings.article.highlight) {
            const config = window.IcarusThemeSettings.article.highlight;
            if (config.clipboard && typeof window.ClipboardJS !== 'undefined') {
                document.querySelectorAll('figure.highlight .copy').forEach(function(btn) {
                    btn.remove();
                });
                document.querySelectorAll('figure.highlight').forEach(function(block) {
                    const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                    const button = document.createElement('a');
                    button.href = 'javascript:;';
                    button.className = 'copy';
                    button.title = 'Copy';
                    button.setAttribute('data-clipboard-target', '#' + id + ' .code');
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                    block.setAttribute('id', id);
                    const levelRight = block.querySelector('figcaption .level-right');
                    if (levelRight) {
                        levelRight.appendChild(button);
                    }
                });
                new window.ClipboardJS('.highlight .copy').on('success', function(e) {
                    const button = e.trigger;
                    const icon = button.querySelector('i');
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    button.classList.add('copied');
                    e.clearSelection();
                    setTimeout(function() {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                        button.classList.remove('copied');
                    }, 2000);
                }).on('error', function(e) {
                    const button = e.trigger;
                    button.classList.add('error');
                    setTimeout(function() {
                        button.classList.remove('error');
                    }, 2000);
                });
            }
        }
        
        // 重新初始化图片画廊
        if (typeof window.lightGallery === 'function') {
            // 清理旧的 lightGallery 实例和 gallery-item 链接
            document.querySelectorAll('.article').forEach(function(el) {
                if (el.lgData) {
                    el.lgData.destroy();
                }
            });
            document.querySelectorAll('.article .gallery-item').forEach(function(link) {
                const img = link.querySelector('img');
                if (img) {
                    link.parentNode.insertBefore(img, link);
                }
                link.remove();
            });
            document.querySelectorAll('.article .caption').forEach(function(caption) {
                caption.remove();
            });
            document.querySelectorAll('.article img:not(".not-gallery-item")').forEach(function(img) {
                if (!img.closest('a')) {
                    const link = document.createElement('a');
                    link.className = 'gallery-item';
                    link.href = img.getAttribute('src');
                    img.parentNode.insertBefore(link, img);
                    link.appendChild(img);
                    if (img.alt) {
                        const caption = document.createElement('p');
                        caption.className = 'has-text-centered is-size-6 caption';
                        caption.textContent = img.alt;
                        link.parentNode.insertBefore(caption, link.nextSibling);
                    }
                }
            });
            document.querySelectorAll('.article').forEach(function(el) {
                var plugins = [];
                if (typeof window.lgZoom !== 'undefined') plugins.push(window.lgZoom);
                if (typeof window.lgThumbnail !== 'undefined') plugins.push(window.lgThumbnail);
                window.lightGallery(el, {
                    selector: '.gallery-item',
                    plugins: plugins,
                    zoom: true,
                    actualSize: true,
                    thumbnail: true,
                    toggleThumb: true
                });
            });
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
