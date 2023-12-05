/**
 * @demo
 * 
 * Area 시리즈의 음수 영역을 구분해서 표시한다.
 */
const config = {
    options: {},
    title: "Area - Negative",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'area',
        style: {
            strokeWidth: '3px'
        },
        belowStyle: {
            stroke: 'red',
            fill: 'red'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['정우성', -7], 
            ['def', 9], 
            ['곽재식', -3], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
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
    createCheckBox(container, 'Curved', function (e) {
        config.series.lineType = _getChecked(e) ? 'spline' : '';
        chart.load(config);
    }, false);
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
