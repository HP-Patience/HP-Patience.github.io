(function () {
    var MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'];

    var DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

    function dateKey(d) {
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    function activityLevel(count) {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count === 3) return 3;
        return 4;
    }

    function formatDate(d) {
        return d.getFullYear() + '年' +
            (d.getMonth() + 1) + '月' +
            d.getDate() + '日 周' + DAY_NAMES[d.getDay()];
    }

    function calcMaxCols(rootWidth) {
        // day labels ~18px + nav buttons ~22px, each column = 13px (10px cell + 3px gap)
        return Math.floor((rootWidth - 40) / 13);
    }

    // State: current page offset (number of days shifted back from today)
    var currentOffset = 0;

    function render(root, dailyCount, offset) {
        root.innerHTML = '';

        var today = new Date();
        today.setHours(23, 59, 59, 999);

        var maxCols = calcMaxCols(root.clientWidth || 220);
        if (maxCols < 4) maxCols = 4;
        if (maxCols > 53) maxCols = 53;

        var totalCells = maxCols * 7;
        var totalCols = maxCols;

        // offset = 0: gridEnd = today, showing most recent weeks
        // offset = N: gridEnd = today - N, showing older weeks
        var gridEnd = new Date(today);
        gridEnd.setDate(gridEnd.getDate() - offset);

        var gridStart = new Date(gridEnd);
        gridStart.setDate(gridStart.getDate() - totalCells + 1);
        gridStart.setHours(0, 0, 0, 0);

        // All 365 days from build data, to find min date
        var allDates = Object.keys(dailyCount).sort();
        var oldestDate = allDates.length > 0 ? allDates[0] : null;
        var maxOffset = 0;
        if (oldestDate) {
            var oldest = new Date(oldestDate + 'T00:00:00');
            var earliestEnd = new Date(oldest);
            earliestEnd.setDate(earliestEnd.getDate() + totalCells - 1);
            var latestStart = new Date(today);
            latestStart.setDate(latestStart.getDate() - totalCells + 1);
            maxOffset = Math.max(0, Math.round((latestStart - oldest) / (1000 * 60 * 60 * 24)));
        }

        // Build cells
        var cells = [];
        var d = new Date(gridStart);
        for (var i = 0; i < totalCells; i++) {
            var key = dateKey(d);
            cells.push({
                date: new Date(d),
                key: key,
                count: dailyCount[key] || 0,
                col: Math.floor(i / 7),
                row: i % 7
            });
            d.setDate(d.getDate() + 1);
        }

        // Month labels
        var monthLabels = [];
        for (var col = 0; col < totalCols; col++) {
            var cell = cells[col * 7];
            if (!cell) continue;
            var m = cell.date.getMonth();
            var prevCell = col > 0 ? cells[(col - 1) * 7] : null;
            if (!prevCell || prevCell.date.getMonth() !== m) {
                monthLabels.push({ col: col, label: MONTH_NAMES[m] });
            }
        }

        // Container
        var container = document.createElement('div');
        container.className = 'heatmap-container';

        // Day labels
        var startDow = gridStart.getDay();
        var dayLabels = document.createElement('div');
        dayLabels.className = 'heatmap-day-labels';
        [1, 3, 5].forEach(function (row) {
            var span = document.createElement('span');
            span.className = 'heatmap-day-label';
            span.textContent = DAY_NAMES[(startDow + row) % 7];
            span.style.gridRowStart = row + 1;
            dayLabels.appendChild(span);
        });

        // Main area
        var mainArea = document.createElement('div');
        mainArea.className = 'heatmap-main';

        // Month labels row
        var labelsRow = document.createElement('div');
        labelsRow.className = 'heatmap-month-labels';
        labelsRow.style.setProperty('--heatmap-cols', totalCols);

        monthLabels.forEach(function (ml) {
            var span = document.createElement('span');
            span.className = 'heatmap-month-label';
            span.textContent = ml.label;
            span.style.gridColumnStart = ml.col + 1;
            labelsRow.appendChild(span);
        });

        // Grid
        var grid = document.createElement('div');
        grid.className = 'heatmap-grid';
        grid.style.setProperty('--heatmap-cols', totalCols);

        cells.forEach(function (cell) {
            var el = document.createElement('div');
            el.className = 'heatmap-cell heatmap-level-' + activityLevel(cell.count);
            el.setAttribute('data-date', formatDate(cell.date));
            el.setAttribute('data-count', cell.count);
            el.setAttribute('data-key', cell.key);
            el.style.gridColumnStart = cell.col + 1;
            el.style.gridRowStart = cell.row + 1;
            grid.appendChild(el);
        });

        // Tooltip
        var tooltip = document.createElement('div');
        tooltip.className = 'heatmap-tooltip';
        tooltip.style.display = 'none';

        grid.addEventListener('mouseover', function (e) {
            var cell = e.target.closest('.heatmap-cell');
            if (!cell || !cell.getAttribute('data-date')) return;
            var rect = cell.getBoundingClientRect();
            tooltip.textContent = cell.getAttribute('data-date') + ' ' +
                cell.getAttribute('data-count') + ' 篇';
            tooltip.style.display = 'block';
            // 先显示才能测量 tooltip 高度
            var th = tooltip.offsetHeight;
            var left = rect.left + rect.width / 2;
            var top = rect.top - 6;
            // 钳制到视口内
            if (top - th < 0) top = rect.bottom + 6;
            if (left < 8) left = 8;
            if (left > window.innerWidth - 8) left = window.innerWidth - 8;
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });

        grid.addEventListener('mouseleave', function () {
            tooltip.style.display = 'none';
        });

        grid.addEventListener('click', function (e) {
            var cell = e.target.closest('.heatmap-cell');
            if (!cell) return;
            var key = cell.getAttribute('data-key');
            if (!key) return;
            var parts = key.split('-');
            window.location.href = '/archives/' + parts[0] + '/' + parts[1] + '/';
        });

        // Navigation buttons
        var nav = document.createElement('div');
        nav.className = 'heatmap-nav';

        var btnUp = document.createElement('button');
        btnUp.className = 'heatmap-nav-btn';
        btnUp.textContent = '▲';
        btnUp.title = '更早';

        var btnDown = document.createElement('button');
        btnDown.className = 'heatmap-nav-btn';
        btnDown.textContent = '▼';
        btnDown.title = '更新';

        function updateButtons() {
            if (offset <= 0) {
                btnDown.classList.add('heatmap-nav-btn--disabled');
            } else {
                btnDown.classList.remove('heatmap-nav-btn--disabled');
            }
            if (offset >= maxOffset) {
                btnUp.classList.add('heatmap-nav-btn--disabled');
            } else {
                btnUp.classList.remove('heatmap-nav-btn--disabled');
            }
        }

        updateButtons();

        btnUp.addEventListener('click', function () {
            if (offset >= maxOffset) return;
            currentOffset = offset + 7;
            if (currentOffset > maxOffset) currentOffset = maxOffset;
            render(root, dailyCount, currentOffset);
        });

        btnDown.addEventListener('click', function () {
            if (offset <= 0) return;
            currentOffset = offset - 7;
            if (currentOffset < 0) currentOffset = 0;
            render(root, dailyCount, currentOffset);
        });

        nav.appendChild(btnUp);
        nav.appendChild(btnDown);

        mainArea.appendChild(labelsRow);
        mainArea.appendChild(grid);
        container.appendChild(dayLabels);
        container.appendChild(mainArea);
        container.appendChild(nav);
        container.appendChild(tooltip);

        root.appendChild(container);
    }

    function init() {
        var root = document.getElementById('heatmap-root');
        var dataScript = document.getElementById('heatmap-data');

        if (!root || !dataScript) return;

        var dailyCount;
        try {
            dailyCount = JSON.parse(dataScript.textContent);
        } catch (e) {
            return;
        }

        currentOffset = 0;
        render(root, dailyCount, currentOffset);
    }

    function destroy() {
        var root = document.getElementById('heatmap-root');
        if (root) {
            root.innerHTML = '';
        }
        currentOffset = 0;
    }

    window.BlogHeatmap = { init: init, destroy: destroy };

    document.addEventListener('DOMContentLoaded', function () {
        init();
    });
})();
