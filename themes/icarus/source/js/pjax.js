(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;
    let pjaxClipboard = null;

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
        console.log('[PJAX] Page loaded, reinitializing components...');

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }

        // 重新初始化头像卡片 3D 效果
        if (window.AvatarCard) {
            window.AvatarCard.destroy();
            window.AvatarCard.init();
        }

        // 重新初始化代码框复制按钮（增强版）
        initCodeBlockCopyButton();

        // 重新初始化图片画廊
        initLightGallery();

        // 重新加载评论系统
        reloadComments();

        // 重新初始化黑暗模式切换功能
        reinitNightMode();
    });

    /**
     * 初始化代码块复制按钮
     * 支持 PJAX 页面切换后的重新初始化
     */
    function initCodeBlockCopyButton() {
        // 延迟执行，确保 DOM 完全渲染
        setTimeout(function() {
            try {
                const config = window.IcarusThemeSettings?.article?.highlight;

                if (!config || !config.clipboard) {
                    console.log('[PJAX] Clipboard not configured or disabled');
                    return;
                }

                if (typeof ClipboardJS === 'undefined' && typeof window.ClipboardJS === 'undefined') {
                    console.warn('[PJAX] ClipboardJS library not loaded');
                    return;
                }

                const ClipboardLib = window.ClipboardJS || ClipboardJS;
                const codeBlocks = document.querySelectorAll('figure.highlight');

                if (codeBlocks.length === 0) {
                    console.log('[PJAX] No code blocks found');
                    return;
                }

                console.log(`[PJAX] Found ${codeBlocks.length} code blocks, initializing copy buttons...`);

                // 添加 hljs CSS 类名，确保语法高亮样式生效
                codeBlocks.forEach(function(block) {
                    block.classList.add('hljs');
                    block.querySelectorAll('.code .line span').forEach(function(span) {
                        var classes = span.className.split(/\s+/);
                        for (var i = 0; i < classes.length; i++) {
                            if (classes[i]) {
                                span.classList.add('hljs-' + classes[i]);
                                span.classList.remove(classes[i]);
                            }
                        }
                    });
                });

                // 移除旧的复制按钮
                codeBlocks.forEach(block => {
                    block.querySelectorAll('.copy').forEach(btn => btn.remove());
                });

                // 为每个代码块添加新的复制按钮
                codeBlocks.forEach((block, index) => {
                    const id = 'code-pjax-' + Date.now() + '-' + index + '-' + (Math.random() * 1000 | 0);
                    block.setAttribute('id', id);

                    // 确保 figcaption 存在并具有正确的 Bulma 布局
                    let figcaption = block.querySelector('figcaption');
                    if (!figcaption) {
                        figcaption = document.createElement('figcaption');
                        figcaption.className = 'level is-mobile';
                        figcaption.innerHTML = '<div class="level-left"></div><div class="level-right"></div>';
                        block.prepend(figcaption);
                    } else {
                        figcaption.classList.add('level', 'is-mobile');
                        if (!figcaption.querySelector('.level-left')) {
                            var levelLeft = document.createElement('div');
                            levelLeft.className = 'level-left';
                            var existingSpan = figcaption.querySelector('span');
                            if (existingSpan) levelLeft.appendChild(existingSpan);
                            figcaption.insertBefore(levelLeft, figcaption.firstChild);
                        }
                        if (!figcaption.querySelector('.level-right')) {
                            var levelRight = document.createElement('div');
                            levelRight.className = 'level-right';
                            var existingLink = figcaption.querySelector('a');
                            if (existingLink) levelRight.appendChild(existingLink);
                            figcaption.appendChild(levelRight);
                        }
                    }

                    let levelRight = figcaption.querySelector('.level-right');
                    if (!levelRight) {
                        levelRight = document.createElement('div');
                        levelRight.className = 'level-right';
                        figcaption.appendChild(levelRight);
                    }

                    // 创建复制按钮
                    const button = document.createElement('a');
                    button.href = 'javascript:;';
                    button.className = 'copy';
                    button.title = 'Copy';
                    button.setAttribute('data-clipboard-target', '#' + id + ' .code');
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                    levelRight.appendChild(button);
                });

                // 初始化 ClipboardJS 实例（先销毁旧实例防止泄漏）
                if (pjaxClipboard) {
                    pjaxClipboard.destroy();
                }
                pjaxClipboard = new ClipboardLib('.highlight .copy')
                    .on('success', function(e) {
                        console.log('[PJAX] Copy success!');
                        const button = e.trigger;
                        const icon = button.querySelector('i');

                        icon.classList.remove('fa-copy');
                        icon.classList.add('fa-check');
                        button.classList.add('copied');

                        e.clearSelection();

                        setTimeout(() => {
                            icon.classList.remove('fa-check');
                            icon.classList.add('fa-copy');
                            button.classList.remove('copied');
                        }, 2000);
                    })
                    .on('error', function(e) {
                        console.error('[PJAX] Copy error:', e);
                        const button = e.trigger;
                        button.classList.add('error');

                        setTimeout(() => {
                            button.classList.remove('error');
                        }, 2000);
                    });

                console.log('[PJAX] Code block copy buttons initialized successfully! ✓');

            } catch (error) {
                console.error('[PJAX] Failed to initialize code block copy:', error);
            }
        }, 100); // 延迟 100ms 确保 DOM 渲染完成
    }

    /**
     * 初始化图片画廊
     */
    function initLightGallery() {
        if (typeof window.lightGallery !== 'function') {
            console.log('[PJAX] lightGallery not available');
            return;
        }

        try {
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

            document.querySelectorAll('.article img:not(.not-gallery-item)').forEach(function(img) {
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

            // 重新初始化 lightGallery
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

            console.log('[PJAX] LightGallery reinitialized ✓');
        } catch (error) {
            console.error('[PJAX] Failed to reinitialize LightGallery:', error);
        }
    }

    /**
     * 重新加载评论系统
     */
    function reloadComments() {
        var commentContainer = document.querySelector('.comment-container');

        if (!commentContainer) return;

        var commentType = commentContainer.getAttribute('data-comment-type');
        var commentConfig = commentContainer.getAttribute('data-comment-config');

        if (commentType === 'utterances' && commentConfig) {
            try {
                var config = JSON.parse(commentConfig);
                // 清除旧的评论
                commentContainer.innerHTML = '';
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
                console.log('[PJAX] Comments reloaded ✓');
            } catch (e) {
                console.warn('[PJAX] Failed to load utterances:', e);
            }
        }
    }

    /**
     * 重新初始化黑暗模式切换功能
     * 解决 PJAX 页面切换后点击事件丢失的问题
     */
    function reinitNightMode() {
        try {
            // 延迟执行，确保 DOM 完全渲染
            setTimeout(function() {
                var nightNav = document.getElementById('night-nav');

                if (!nightNav) {
                    console.log('[PJAX] Night mode button not found');
                    return;
                }

                console.log('[PJAX] Reinitializing night mode toggle...');

                // 移除旧的事件监听器（通过克隆节点）
                var newNightNav = nightNav.cloneNode(true);
                nightNav.parentNode.replaceChild(newNightNav, nightNav);

                // 重新绑定点击事件
                newNightNav.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (typeof window.toggleNightMode === 'function') {
                        window.toggleNightMode();
                    }
                };

                // 确保当前模式状态正确应用
                var currentMode = localStorage.getItem('night') || 'false';
                if (currentMode === 'true') {
                    document.body.classList.add('night');
                    document.body.classList.remove('light');
                    document.documentElement.classList.add('night-mode');

                    var icon = document.getElementById('night-icon');
                    if (icon) {
                        icon.className = 'fas fa-lightbulb';
                    }
                } else {
                    document.body.classList.remove('night');
                    document.body.classList.add('light');
                    document.documentElement.classList.remove('night-mode');

                    var icon = document.getElementById('night-icon');
                    if (icon) {
                        icon.className = 'fas fa-moon';
                    }
                }

                console.log('[PJAX] Night mode reinitialized successfully! ✓');
            }, 50); // 较短延迟，因为导航栏通常先于内容加载
        } catch (error) {
            console.error('[PJAX] Failed to reinitialize night mode:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
