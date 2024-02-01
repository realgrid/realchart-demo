/**
 * @demo
 *
 * Area group의 음수 영역을 구분해서 표시한다.
 */
const config = {
    type: 'area',
    title: 'Area Group - Negative',
    options: {
        // inverted: true,
    },
    xAxis: {
        title: '일일 Daily fat',
        categories: Array.from({ length: 30 }, (_, i) => i + 1 + '일')
    },
    yAxis: {
        title: 'Vertical 수직축 Axis'
    },
    series: [
        {
            children: [
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
                    marker: {
                        // hintDistance: 0
                    },
                    style: {
                        fill: '#66d0ff',
                        stroke: 'none'
                    }
                },
                {
                    type: 'area',
                    name: '12월 최고,최저 기온',
                    belowStyle: {
                        stroke: 'purple',
                        fill: 'purple'
                    },
                    tooltipText: '${xValue}<br>최저온도 ${y}, 최고온도 ${low}',
                    data: [
                        [18.9],
                        [22.9],
                        [20.4],
                        [17.5],
                        [17.7],
                        [12.9],
                        [6.7],
                        [8.9],
                        [12.1],
                        [3.8],
                        [2.4],
                        [1.8],
                        [2.25],
                        [5],
                        [7],
                        [6.5],
                        [2],
                        [0.3],
                        [6],
                        [-1.8],
                        [1.4],
                        [-2.9],
                        [-1.9],
                        [-4.4],
                        [2.9],
                        [4.1],
                        [1.4],
                        [2],
                        [5.6],
                        [7.8]
                    ],
                    marker: {
                        // hintDistance: 0
                    },
                    style: {
                        fill: '#66d0ff',
                        stroke: 'none'
                    }
                }
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
        alert('hello2');
    });
    createListBox(
        container,
        'layout',
        ['default', 'stack', 'fill', 'overlap'],
        function (e) {
            config.series[0].layout = _getValue(e);
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
