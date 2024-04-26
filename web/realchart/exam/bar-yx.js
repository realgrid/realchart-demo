const config = {
    // 차트 제목 설정.
    title: 'Bar Chart',
    yAxis: {
        // 카테고리 타입 작성.
        type: 'category'
    },
    xAxis: {
        type: 'linear'
    },
    series: {
        // bar 타입으로 작성.
        type: 'bar',
        data: [
            [50, '경기'],
            [25, '강원'],
            [33, '대전']
        ]
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
