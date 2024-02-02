/**
 * @demo
 * 
 */
const config = {
    type: 'line',
    options: {
        // animatable: false
    },
    title: "Grid Split Lines",
    split: {
        visible: true,
        cols: 3,
        rows: 3
    },
    xAxis: [{
        categories:['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시',' 안산시']
    }, {
        col: 1,
       type: 'linear'
    }, {
        col: 2,
        categories:['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시',' 안산시']
    }],
    yAxis: [{
    }, {
        row: 1,
        col: 2,
        position: 'opposite'
    }, {
        row: 2
    }],
    series: [{
        lineType: 'spline',
        pointLabel: true,
        // visibleInLegend: false,
        data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5]
    }, {
        xAxis: 1,
        type: 'bar',
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 5.5]
    }, {
        xAxis: 2,
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        lineType: 'spline',
        yAxis: 1,
        pointLabel: true,
        data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5]
    }, {
        xAxis: 1,
        yAxis: 1,
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        xAxis: 2,
        yAxis: 1,
        type: 'area',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        lineType: 'spline',
        yAxis: 2,
        pointLabel: true,
        data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5]
    }, {
        xAxis: 1,
        yAxis: 2,
        lineType: 'spline',
        // pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        xAxis: 2,
        yAxis: 2,
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
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
