const config = {
    options: {
        // animatable: false
    },
    title: {
        text: '사망자수 역대최대 기록',
        align: 'left',
        gap: 100,
    },
    legend: false,
    split: {
        visible: true,
        cols: 2,
        panes: [{
            body: {
                annotations: {
                    text: '사망자 수 추이',
                    offsetY: -100,
                    align: 'left',
                    style: {
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }
                }
            }
        },
        {
            col: 1,
            body: {
                annotations: [{
                    text: '주요 사망원인',
                    align: 'left',
                    style: {
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }
                },{
                    text: '2020년 기준',
                    align: 'right',
                    style: {
                        fontSize: '18px',
                    }
                }]
            }
        }]
    },
    xAxis: [{
        line: {
            style: {
                stroke: '#333'
            }
        }
    },{
        col: 1,
    }],
    yAxis: [{
        grid: true,
    }, {
        col: 1,
        grid: false,
        label: {
            style:  { fill: 'red' }
        }
    }],
    series: [{
        type: 'line',
        pointLabel: {
            visible: true,
            numberFormat: 'a##0.0'
        },
        data: [25.4, 25.7, 26.8, 26.5, 26.8, 27.6, 28.1, 28.6, 29.9, 29.5, 30.5]
    }, {
        color: '#ffaa00',
        yAxis: 1,
        xAxis: 1,
        pointLabel: {
            visible: true,
            numberFormat: '##0.0'
        },
        data: [
            {x: '암', y: 160.1},
            {x: '심장 질환', y: 63.0},
            {x: '폐렴', y: 43.3},
            {x: '뇌혈관 질환', y: 42.6},
            {x: '자살', y: 25.7},
            {x: '당뇨병', y: 16.5},
            {x: '알츠하이머병', y: 14.7},
            {x: '간 질환', y: 13.6},
            {x: '고혈압성 질환', y: 11.9},
            {x: '패혈증', y: 11.9}
        ]
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed 2', function (e) {
        config.xAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed 2', function (e) {
        config.yAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
