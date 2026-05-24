const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Heatmap extends Component {
    render() {
        const { title, data } = this.props;
        return <div class="card widget" data-type="heatmap">
            <div class="card-content">
                <h3 class="menu-label">{title}</h3>
                <div id="heatmap-root" class="heatmap-root"></div>
                <script type="application/json" id="heatmap-data"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}></script>
                <div class="heatmap-legend">
                    <span class="heatmap-legend-label">Less</span>
                    <div class="heatmap-legend-cell heatmap-level-0"></div>
                    <div class="heatmap-legend-cell heatmap-level-1"></div>
                    <div class="heatmap-legend-cell heatmap-level-2"></div>
                    <div class="heatmap-legend-cell heatmap-level-3"></div>
                    <div class="heatmap-legend-cell heatmap-level-4"></div>
                    <span class="heatmap-legend-label">More</span>
                </div>
            </div>
        </div>;
    }
}

Heatmap.Cacheable = cacheComponent(Heatmap, 'widget.heatmap', props => {
    const { site, widget } = props;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setHours(0, 0, 0, 0);

    const dailyCount = {};
    const d = new Date(start);
    while (d <= today) {
        const key = d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
        dailyCount[key] = 0;
        d.setDate(d.getDate() + 1);
    }

    site.posts.forEach(post => {
        [post.date, post.updated].forEach(dateVal => {
            if (!dateVal) return;
            const val = dateVal instanceof Date ? dateVal : new Date(dateVal);
            if (isNaN(val.getTime())) return;
            if (val >= start && val <= today) {
                const key = val.getFullYear() + '-' +
                    String(val.getMonth() + 1).padStart(2, '0') + '-' +
                    String(val.getDate()).padStart(2, '0');
                if (key in dailyCount) dailyCount[key]++;
            }
        });
    });

    return {
        title: widget.title || 'Activity',
        data: dailyCount
    };
});

module.exports = Heatmap;
