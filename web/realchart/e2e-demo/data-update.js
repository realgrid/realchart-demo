/**
 * @demo
 *
 */
const config = {
    // type: 'spline',
    options: {},
    title: 'Update Data',
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
    createButton(container, 'Inc Point', function (e) {
        const v = chart.series.getValueAt(0);
        chart.series.updatePoint(0, v + 5000);
    });
    createButton(container, 'Dec Point', function (e) {
        const v = chart.series.getValueAt(0);
        chart.series.updatePoint(0, v - 5000);
    });
    createButton(container, 'Update Point2', function (e) {
        const v = chart.series.getValueAt('신흥3동');
        chart.series.updatePoint('신흥3동', v + 3000);
    });
    createButton(container, 'Random', function (e) {
        const i = Math.floor(Math.random() * chart.series.pointCount);
        const v = chart.series.getValueAt(i);
        chart.series.updatePoint(i, v + Math.floor(Math.random() * 10000));
    });
    createButton(container, 'Run', function (e) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        timer = setInterval(() => {
            const i = Math.floor(Math.random() * chart.series.pointCount);
            const v = chart.series.getValueAt(i) + Math.floor(Math.random() * 10000) - 5000;
            chart.series.updatePoint(i, Math.max(0, v));
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
