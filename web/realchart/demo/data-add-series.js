/**
 * @demo
 *
 */
const config = {
    type: 'line',
    options: {},
    title: 'Add/Remove Series',
    legend: true,
    body: {
        style: {
            stroke: 'none',
        },
    },
    xAxis: {
        label: {
            style: {},
        },
        grid: {
            visible: true,
            lastVisible: true,
        },
        tick: true,
        title: {
            text: '수정구',
        },
        // grid: true,
        crosshair: true,
    },
    yAxis: {
        title: {
            text: '전체 인구수',
        },
        unit: '(명)',
        label: {
            lastText: '${label}<br>${axis.unit}',
            lastStyle: { fontWeight: 'bold' },
        },
    },
    series: {
        name: 'ser1',
        pointLabel: true,
        data: [
            ['신흥1동', 3904],
            ['신흥2동', 19796],
            ['신흥3동', 10995],
            ['태평1동', 14625],
            ['태평2동', 14627],
            ['태평3동', 12649],
            ['태평4동', 12279],
        ],
        pointStyleCallback: (args) => {
            if (args.yValue > 30000) {
                return { fill: 'blue', stroke: 'blue' };
            } else if (args.yValue < 5000) {
                return { fill: 'red', stroke: 'red' };
            }
        },
    },
};

let animate;
let chart;
let timer;
let dong = 1;

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
    createButton(container, 'Add Series', function (e) {
        chart.addSeries({
            pointLabel: true,
            data: [
                ['신흥1동', 5904],
                ['신흥2동', 12796],
                ['신흥3동', 9995],
                ['태평1동', 11625],
                ['태평2동', 9627],
                ['태평3동', 11649],
                ['태평4동', 10279],
                ['태평5동', 13279],
            ],
        })
    });
    createButton(container, 'Remove Series', function (e) {
        chart.removeSeries(chart.series);
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
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
