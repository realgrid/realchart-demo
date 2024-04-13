/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    title: 'Bar & Pie Series',
    options: {
        // animatable: false
    },
    xAxis: {
        title: '일일 Daily fat',
        categories: ['성남시', '용인시', '수원시', '일산시', '화성시', '평택시'],
        grid: true
    },
    yAxis: {
        title: 'Vertical 수직축 Axis'
        // reversed: true,
        // baseValue: -1
    },
    series: [
        {
            name: 'bar1',
            pointLabel: true,
            visibleInLegend: false,
            data: [11, 13, 10, 15, 19, 22]
        },
        {
            type: 'pie',
            centerX: '15%',
            centerY: '25%',
            radius: '20%',
            pointLabel: true,
            legendByPoint: true,
            data: [
                ['성남시', 111],
                ['용인시', 113],
                ['수원시', 110],
                ['일산시', 115],
                ['화성시', 119],
                ['평택시', 122],
            ]
        }
    ]
};

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(
        container,
        'Debug',
        function (e) {
            console.log(chart.model);
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
        'ColorByPoint',
        function (e) {
            config.series[0].colorByPoint = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
