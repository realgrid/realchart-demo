/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    title: 'Boundary',
    xAxis: {
        categories: [1, 2, 3, 4]
    },
    yAxis: {
        type: 'category',
        categories: [1, 2, 3, 4],
    },
    series: {
        name: 'column1',
        data: [1, 2, 3, 4]
    }
};

let animate = false;
let chart;

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
    createCheckBox(
        container,
        'Always Animate',
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config, animate);
        },
        true
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis[0].reversed = _getChecked(e);
            config.xAxis[1].reversed = _getChecked(e);
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
