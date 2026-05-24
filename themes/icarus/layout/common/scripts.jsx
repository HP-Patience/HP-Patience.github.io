const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');
const Plugins = require('./plugins');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn } = helper;
        const { article } = config;
        const language = toMomentLocale(page.lang || page.language || config.language || 'en');

        let fold = 'unfolded';
        let clipboard = true;
        if (article && article.highlight) {
            if (typeof article.highlight.clipboard !== 'undefined') {
                clipboard = !!article.highlight.clipboard;
            }
            if (typeof article.highlight.fold === 'string') {
                fold = article.highlight.fold;
            }
        }

        const embeddedConfig = `var IcarusThemeSettings = {
            article: {
                highlight: {
                    clipboard: ${clipboard},
                    fold: '${fold}'
                }
            }
        };`;

        return <Fragment>
            <script src={cdn('jquery', '3.3.1', 'dist/jquery.min.js')}></script>
            <script src={cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')}></script>
            {clipboard && <script src={cdn('clipboard', '2.0.4', 'dist/clipboard.min.js')} defer></script>}
            <script src={cdn('lightgallery', '2.7.2', 'lightgallery.min.js')}></script>
            <script src={cdn('lightgallery', '2.7.2', 'plugins/zoom/lg-zoom.min.js')}></script>
            <script src={cdn('lightgallery', '2.7.2', 'plugins/thumbnail/lg-thumbnail.min.js')}></script>
            <script dangerouslySetInnerHTML={{ __html: `moment.locale("${language}");` }}></script>
            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            <script src={url_for('/js/column.js')}></script>
            <script src={url_for('/js/imaegoo/night.js')}></script>
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script src={url_for('/js/main.js')} defer></script>
            <script src={url_for('/js/avatar-card.js')} defer></script>
            <script src={url_for('/js/heatmap.js')} defer></script>
            <script src={url_for('/js/sticky-sidebar.js')} defer></script>
            <script dangerouslySetInnerHTML={{ 
                __html: `
                    (function() {
                        function showPage() {
                            document.documentElement.classList.add('fouc-fix');
                        }
                        if (document.readyState === 'complete' || document.readyState === 'interactive') showPage();
                        else document.addEventListener('DOMContentLoaded', showPage);
                    })();
                ` 
            }}></script>
        </Fragment>;
    }
};
