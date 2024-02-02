/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: "연도별 서울시 평균 대기질 지수",
    xAxis: {
        title: '서울시',
        categories: ['`14', '`15', '`16', '`17', '`18', '`19'],
        grid: {
            visible: true,
        },
    },
    yAxis: {
        title: '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>',
    },
    series: {
        type: 'lollipop',
        pointLabel: {
            visible: true,
            style: {
                fill: 'black'
            },
        },
        data: [155, 138, 122, 133, 114, 113],
    }
}

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
