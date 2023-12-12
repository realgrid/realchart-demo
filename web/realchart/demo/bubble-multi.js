const config = {
    type: 'bubble',
    options: {
        // animatable: false
    },
    title: "기업의 매출, 이익, 시장 점유율",
    xAxis: {
        title: '매출액 (백만 달러)'
    },
    yAxis: {
        title: '순이익 (백만 달러)'
    },
    series: [
        {
            name: '기업 A',
            pointLabel: {
                visible: true,
                suffix: 'm'
            },
            data: [
                [500, 80, 63],
                [600, 90, 70],
                [400, 65, 40],
                [550, 85, 55],
                [450, 75, 60],
                [700, 95, 75],
                [300, 60, 35],
                [650, 78, 68],
                [480, 66, 50],
                [520, 70, 65]
            ]
        },
        {
            name: '기업 B',
            color: '#ff5c35',
            pointLabel: {
                visible: true,
                suffix: 'm'
            },
            data: [
                [450, 75, 50],
                [550, 95, 80],
                [350, 60, 30],
                [600, 100, 85],
                [400, 66, 45],
                [480, 80, 55],
                [530, 85, 65],
                [410, 70, 48],
                [570, 90, 72],
                [490, 77, 60]
            ]
        }
    ]
};


let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
