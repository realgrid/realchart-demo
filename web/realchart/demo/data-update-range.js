/**
 * @demo
 *
 */
const config = {
    title: 'Update Range Data',
    options: {
        // animatable: false,
    },
    xAxis: {
        grid: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
    },
    series: {
        type: 'barrange',
        pointLabel: {
            visible: true,
            // format: '${x}'
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            [-13.9, 5.2],
            [-16.7, 10.6],
            [-4.7, 11.6],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [5.9, 29.4],
            [6.5, 29.1],
            [4.7, 25.4],
            [4.3, 21.6],
            [-3.5, 15.1],
            [-9.8, 12.5],
            [-11.5, 8.4]
        ]
    }
};

let animate;
let chart;
let timer;

function setActions(container) {
    createCheckBox(
        container,
        'Debug',
        function (e) {
            RealChart.setDebugging(_getChecked(e));
            chart.render();
        },
        false
    );
    createButton(container, 'Update Point', function (e) {
        const low = chart.series.getValueAt(0, 'low');
        const high = chart.series.getValueAt(0, 'high');

        chart.series.updatePoint(0, {
            low: low + Math.random() * 10 - 5,
            high: high + Math.random() * 3
        });
    });
    createButton(container, 'Update Point2', function (e) {
        const low = chart.series.getValueAt('신흥3동', 'low');
        const high = chart.series.getValueAt('신흥3동', 'high');

        chart.series.updatePoint('신흥3동', {
            low: low + Math.random() * 10 - 5,
            high: high + Math.random() * 3
        });
    });
    createButton(container, 'Random', function (e) {
        const i = Math.floor(Math.random() * chart.series.pointCount);
        const v = chart.series.getValueAt(i);
        chart.series.updatePoint(i, v + Math.floor(Math.random() * 10));
    });
    createButton(container, 'Run', function (e) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        timer = setInterval(() => {
            const i = Math.floor(Math.random() * chart.series.pointCount);

            const low = chart.series.getValueAt(i, 'low');
            const high = chart.series.getValueAt(i, 'high');
    
            chart.series.updatePoint(i, {
                low: low + Math.random() * 10 - 5,
                high: high + Math.random() * 3
            });
        }, 200);
    });
    createButton(container, 'Stop', function (e) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    });
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'Y Reversed',
        function (e) {
            config.yAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'X Opposite',
        function (e) {
            config.xAxis.position = _getChecked(e) ? 'opposite' : '';
            chart.load(config, animate);
        },
        false
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    // RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
