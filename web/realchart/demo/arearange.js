/**
 * @demo
 *
 * AreaRange 시리즈 기본 예제.
 */
const config = {
    title: '2023년 11월 서울 최고,최저 기온',
    subtitle: {
        align: 'left',
        text: '출처: 웨더아이',
        style: {
            fill: '#AAA'
        }
    },
    options: {
        // animatable: false=
    },
    xAxis: {
        type: 'time',
        title: 'Time',
        grid: true
    },
    yAxis: {
        title: 'Temparature',
        tick: true
    },
    series: [
        {
            type: 'area',
            name: '11월 최고,최저 기온',
            belowStyle: {
                stroke: 'red',
                fill: 'red'
            },
            tooltipText: '${xValue}<br>최저온도 ${y}, 최고온도 ${low}',
            data: [
                [17.2],
                [18.7],
                [17.7],
                [14.1],
                [15.1],
                [6.6],
                [3.6],
                [1.8],
                [5.9],
                [0.5],
                [-1.9],
                [-2],
                [-2.2],
                [-0.8],
                [2],
                [5.7],
                [-1.9],
                [-3.8],
                [-0.3],
                [1.8],
                [1.4],
                [2.9],
                [1.9],
                [-4.4],
                [-5.9],
                [-0.1],
                [4.4],
                [-3],
                [-5.6],
                [-7.8]
            ],
            xStart: '2023-11-01',
            xStep: '1d',
            marker: {
                // hintDistance: 0
            },
            style: {
                fill: '#66d0ff',
                stroke: 'none'
            }
        }
    ],
    tooltip: {
        followPointer: true
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
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createCheckBox(
        container,
        'Curved',
        function (e) {
            config.series.curved = _getChecked(e);
            chart.load(config);
        },
        false
    );
    createCheckBox(
        container,
        'Point Marker',
        function (e) {
            config.series[0].marker.visible = _getChecked(e);
            chart.load(config);
        },
        true
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
