/**
 * @demo
 *
 */
const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
];

const config = {
    type: 'area',
    title: '연도별 수학검정시험 응시 현황',
    options: {
        animatable: false
    },
    templates: {
        series: {
            marker: {
                visible: false
            },
            lineType: 'spline'
        }
    },
    assets: [
        {
            type: 'linearGradient',
            id: 'gradient-1',
            color: 'red'
        }
    ],
    xAxis: {
        categories: [
            '2023-01-01',
            '2023-01-02',
            '2023-01-03',
            '2023-01-04',
            '2023-01-05',
            '2023-01-06',
            '2023-01-07',
            '2023-01-08',
            '2023-01-09',
            '2023-01-10',
            '2023-01-11',
            '2023-01-12',
            '2023-01-13',
            '2023-01-14',
            '2023-01-15',
            '2023-01-16',
            '2023-01-17',
            '2023-01-18',
            '2023-01-19',
            '2023-01-20',
            '2023-01-21',
            '2023-01-22',
            '2023-01-23',
            '2023-01-24',
            '2023-01-25',
            '2023-01-26',
            '2023-01-01',
            '2023-01-02',
            '2023-01-03',
            '2023-01-04',
            '2023-01-05',
            '2023-01-06',
            '2023-01-07',
            '2023-01-08',
            '2023-01-09',
            '2023-01-10',
            '2023-01-11',
            '2023-01-12',
            '2023-01-13',
            '2023-01-14',
            '2023-01-15',
            '2023-01-16',
            '2023-01-17',
            '2023-01-18',
            '2023-01-19',
            '2023-01-20',
            '2023-01-21',
            '2023-01-22',
            '2023-01-23',
            '2023-01-24',
            '2023-01-25',
            '2023-01-26'
        ],
        label: {
            //   step: 1,
            autoArrange: 'step'
        }
    },
    yAxis: {},
    series: [
        {
            template: 'series',
            name: '응시 인원',
            data: data
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
