/**
 * @demo
 *
 */
const config = {
    title: {
        text: '2023년 종량제 판매 실적',
        gap: 10,
        backgroundStyle: {
            fill: 'black',
            padding: '2px 5px',
            rx: '3px'
        },
        style: {
            fill: '#fff',
            fontSize: '16px'
        }
    },
    subtitle: {
        text: '주문 방법별 건수',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    tooltip: {
        text: '${x}: ${ratio}%'
    },
    series: [
        {
            type: 'pie',
            radius: '40%',
            legendByPoint: true,
            pointLabel: {
                text: '${x}<br>${ratio}%<br>(${y;0;#,#})',
                visible: true,
                numberFormat: '#.00',
                style: {
                    fill: '#fff',
                    stroke: '#d3d3d3',
                    strokeWidth: '0.2px',
                    fontSize: '14px'
                }
            },
            data: [
                { x: '인터넷', y: 9829, ratio: (9829 / (9829 + 3504)) * 100 },
                { x: '전화/방문', y: 3504, ratio: (3504 / (9829 + 3504)) * 100 }
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
        'options.palette',
        ['default', 'warm', 'cool', 'forest', 'gray'],
        function (e) {
            config.options.palette = _getValue(e);
            chart.load(config, animate);
        },
        'default'
    );
    createCheckBox(
        container,
        'Legend',
        function (e) {
            config.legend.visible = _getChecked(e);
            chart.load(config, animate);
        },
        true
    );
    createListBox(
        container,
        'Legend.location',
        ['bottom', 'top', 'right', 'left'],
        function (e) {
            config.legend.location = _getValue(e);
            chart.load(config, animate);
        },
        'bottom'
    );
    line(container);
    createListBox(
        container,
        'series.startAngle',
        [0, 90, 180, 270],
        function (e) {
            config.series.startAngle = _getValue(e);
            chart.load(config, animate);
        },
        0
    );
    createListBox(
        container,
        'series.totalAngle',
        [360, 270, 225, 180],
        function (e) {
            config.series.totalAngle = _getValue(e);
            chart.load(config, animate);
        },
        360
    );
    createCheckBox(
        container,
        'series.clockwise',
        function (e) {
            config.series.clockwise = _getChecked(e);
            chart.load(config, animate);
        },
        true
    );
    createListBox(
        container,
        'series.radius',
        ['30%', '35%', '40%', '45%'],
        function (e) {
            config.series.radius = _getValue(e);
            chart.load(config, animate);
        },
        '40%'
    );
    createListBox(
        container,
        'series.centerX',
        ['30%', '40%', '50%', '60%'],
        function (e) {
            config.series.centerX = _getValue(e);
            chart.load(config, animate);
        },
        '50%'
    );
    createListBox(
        container,
        'series.centerY',
        ['45%', '50%', '55%'],
        function (e) {
            config.series.centerY = _getValue(e);
            chart.load(config, animate);
        },
        '50%'
    );
    line(container);
    createListBox(
        container,
        'series.pointLabel.position',
        ['auto', 'outside'],
        function (e) {
            config.series.pointLabel.position = _getValue(e);
            chart.load(config, animate);
        },
        'auto'
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
