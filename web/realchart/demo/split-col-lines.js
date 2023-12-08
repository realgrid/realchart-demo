/**
 * @demo
 * 
 */
const config = {
    type: 'line',
    options: {},
    title: "Column Split Lines",
    split: {
        visible: true,
        cols: 3
    },
    xAxis: [{
        categories: [
            'home', 'sky', '태풍', 'def', '지리산', 'zzz', 'ttt', 'taaatt', '백두산', '낙동강'
        ]
    }, {
        col: 1,
        categories: [
            'home', 'sky', '태풍', 'def', '지리산', 'zzz', 'ttt', 'taaatt', '백두산', '낙동강'
        ]
    }, {
        col: 2,
        categories: [
            'home', 'sky', '태풍', 'def', '지리산', 'zzz', 'ttt', 'taaatt', '백두산', '낙동강'
        ]
    }],
    yAxis: {
    },
    series: [{
        lineType: 'spline',
        pointLabel: true,
        data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5]
    }, {
        xAxis: 1,
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        xAxis: 2,
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }]
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
