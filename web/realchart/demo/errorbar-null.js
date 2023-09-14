/**
 * @demo
 * 
 */
const config = {
    title: "Error Bar - Null",
    options: {
    },
    xAxis: {
        title: 'X Axis',
        categories: ['쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트'],
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: [{
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline',
        },
        data: [11, 22, 15, 9, 13, 27]
    }, {
        type: 'errorbar',
        pointLabel: true,
        data: [[10, 12], [20, 23], [null, 1], [8, 11], [12, 14], [25, 26]],
        color: '#333',
    }]
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
