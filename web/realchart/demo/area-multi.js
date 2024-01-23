/**
 * @demo
 *
 * Multiple area series.
 */
const config = {
    type: 'area',
    options: {},
    title: 'Multiple',
    xAxis: {
        categories: [
            '34',
            '35',
            '37',
            '39',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59',
            '60',
            '61',
            '62',
            '63',
            '64',
            '65',
            '66',
            '67',
            '68',
            '69',
            '71',
            '74',
            '76',
        ],
        title: {
            text: 'Ages',
        },
    },
    yAxis: {
        title: 'Vertical 수직축 Axis',
    },
    series: [
        {
            lineType: 'spline',
            children: [
                {
                    visible: false,
                    name: '여자',
                    data: [
                        118, 138, 120, 232, 473, 222, 254, 226, 380, 385, 130,
                        264, 350, 520, 136, 396, 645, 575, 474, 518, 806, 174,
                        522, 275, 982, 657, 450, 605, 474, 373, 120, 140, 382,
                        120, 140,
                    ],
                },
                {
                    name: '남자',
                    data: [
                        130, 118, 368, 130, 396, 258, 402, 717, 794, 757, 1102,
                        599, 511, 598, 740, 368, 563, 974, 1563, 665, 1421, 562,
                        1007, 1795, 1625, 1915, 927, 830, 498, 545, 938, 503,
                        552, 777, 442,
                    ],
                },
            ],
        },
    ],
};

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
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createCheckBox(
        container,
        'Point Marker',
        function (e) {
            config.series[0].children.forEach(
                (s) => (s.marker = _getChecked(e))
            );
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis.reversed = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Y Reversed',
        function (e) {
            config.yAxis.reversed = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Legend.visible',
        function (e) {
            config.legend = _getChecked(e);
            chart.load(config);
        },
        true
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
