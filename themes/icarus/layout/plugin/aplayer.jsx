const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class APlayer extends Component {
    render() {
        const { cssUrl, jsUrl, musicPath, head } = this.props;

        if (head) {
            return <link rel="stylesheet" href={cssUrl} />;
        }

        const scriptContent = `
            (function() {
                function initAPlayer() {
                    if (typeof APlayer === 'undefined') return;
                    // 如果已经存在APlayer实例，不要重新创建
                    if (document.getElementById('aplayer') && window.aplayerInstance) {
                        return;
                    }
                    // 如果存在旧容器但无实例，先清理
                    var oldContainer = document.getElementById('aplayer');
                    if (oldContainer) {
                        oldContainer.remove();
                    }
                    var container = document.createElement('div');
                    container.id = 'aplayer';
                    container.className = 'aplayer';
                    container.style.cssText = 'position:fixed;left:0;bottom:0;z-index:99999;width:400px;';
                    document.body.appendChild(container);
                    window.aplayerInstance = new APlayer({
                        container: container,
                        fixed: true,
                        mini: true,
                        autoplay: false,
                        theme: '#46718b',
                        loop: 'all',
                        order: 'list',
                        preload: 'auto',
                        volume: 0.5,
                        mutex: true,
                        listFolded: true,
                        audio: [
                            {
                                name: '\\u611b',
                                artist: 'seto',
                                url: '${musicPath}%E6%84%9B-seto.mp3',
                                cover: '${musicPath}%E6%84%9B-seto.jpg'
                            },
                            {
                                name: "Kingdom Hearts \\u2022 Xion\\'s Theme",
                                artist: 'Yoko Shimomura',
                                url: '${musicPath}Kingdom%20Hearts%20%E2%80%A2%20Xion\\'s%20Theme.mp3',
                                cover: '${musicPath}Kingdom%20Hearts%20%E2%80%A2%20Xion\\'s%20Theme.jpg'
                            }
                        ]
                    });
                }
                // 初始加载
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initAPlayer);
                } else {
                    initAPlayer();
                }
                // PJAX兼容：PJAX完成后检查是否需要初始化
                document.addEventListener('pjax:complete', function() {
                    setTimeout(initAPlayer, 100);
                });
            })();
        `;

        return <Fragment>
            <script src={jsUrl}></script>
            <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
        </Fragment>;
    }
}

APlayer.Cacheable = cacheComponent(APlayer, 'plugin.aplayer', props => {
    const { helper, head } = props;
    return {
        cssUrl: helper.cdn('aplayer', '1.10.1', 'dist/APlayer.min.css'),
        jsUrl: helper.cdn('aplayer', '1.10.1', 'dist/APlayer.min.js'),
        musicPath: '/blog_music/',
        head
    };
});

module.exports = APlayer;
