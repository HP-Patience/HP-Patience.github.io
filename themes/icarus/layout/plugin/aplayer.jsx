const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class APlayer extends Component {
    render() {
        const { cssUrl, jsUrl, musicPath, head } = this.props;

        if (head) {
            return <link rel="stylesheet" href={cssUrl} />;
        }

        const scriptContent = `
            document.addEventListener('DOMContentLoaded', function() {
                var checkAPlayer = setInterval(function() {
                    if (typeof APlayer === 'undefined') return;
                    clearInterval(checkAPlayer);
                    var container = document.createElement('div');
                    container.id = 'aplayer';
                    container.className = 'aplayer';
                    container.style.cssText = 'position:fixed;left:0;bottom:0;z-index:99999;width:400px;';
                    document.body.appendChild(container);
                    new APlayer({
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
                                name: 'Collapsing World',
                                artist: 'Lightscape',
                                url: '${musicPath}Collapsing%20World.mp3',
                                cover: '${musicPath}Collapsing%20World.jpg'
                            },
                            {
                                name: 'Daylight',
                                artist: 'Seredris',
                                url: '${musicPath}Daylight.mp3',
                                cover: '${musicPath}Daylight.jpg'
                            },
                            {
                                name: "Kingdom Hearts \\u2022 Xion\\'s Theme",
                                artist: 'Jenny',
                                url: '${musicPath}Kingdom%20Hearts%20%E2%80%A2%20Xion\\'s%20Theme.mp3',
                                cover: '${musicPath}Kingdom%20Hearts%20%E2%80%A2%20Xion\\'s%20Theme.jpg'
                            },
                            {
                                name: 'Komorebi',
                                artist: '恰见明月栖山',
                                url: '${musicPath}Komorebi.mp3',
                                cover: '${musicPath}Komorebi.jpg'
                            },
                            {
                                name: '\\u611b',
                                artist: 'seto',
                                url: '${musicPath}%E6%84%9B-seto.mp3',
                                cover: '${musicPath}%E6%84%9B-seto.jpg'
                            }
                        ]
                    });
                }, 100);
            });
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
