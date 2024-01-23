const data = [
    { name: '주식회사 천보', y: 840 },
    { name: '씨피켐주식회사', y: 22 },
    { name: '외부고객사', y: 17 },
    { name: '에이치디씨(주)', y: 13 },
    { name: '영광정공(주)', y: 6 },
];

const config = {
    title: '외부 고객사 매출비중',
    series: [
        {
            type: 'pie',
            data,
            legendByPoint: true,
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline',
                textCallback: (args) => {
                    console.log(args);
                    const total = data.reduce(
                        (acc, curr) => acc + (curr.y || 0),
                        0
                    );
                    const percentage = (args.yValue / total) * 100;
                    return percentage.toFixed(1) + '%';
                },
            },
            tooltipText: '${x} <br> 매출비중: ${y} / ${}',
            tooltipCallback: (args) => {
                const total = data.reduce(
                    (acc, curr) => acc + (curr.y || 0),
                    0
                );
                return `${args.x} <br> 매출비중: ${(
                    (args.yValue / total) *
                    100
                ).toFixed(1)}%`;
            },
        },
    ],
    legend: {
        visible: true,
        location: 'right',
    },
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
    createListBox(
        container,
        'Line Type',
        ['default', 'spline', 'step'],
        function (e) {
            config.series.lineType = _getValue(e);
            chart.load(config, animate);
        },
        'default'
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
