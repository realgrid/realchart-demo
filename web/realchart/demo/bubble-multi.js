/**
 * @demo
 * 
 */
const config = {
    type: 'bubble',
    options: {
        // animatable: false
    },
    title: "Bubble Series",
    xAxis: {
        title: 'xAxis'
    },
    yAxis: {
        title: 'yAxis'
    },
    series: [{
        pointLabel: {
            visible: true,
            suffix: 'm'
        },
        data: [
            [9, 81, 63],
            [98, 5, 89],
            [51, 50, 73],
            [41, 22, 14],
            [58, 24, 20],
            [78, 37, 34],
            [55, 56, 53],
            [18, 45, 70],
            [42, 44, 28],
            [3, 52, 59],
            [31, 18, 97],
            [79, 91, 63],
            [93, 23, 23],
            [44, 83, 22]
        ]
    },
    {
        color: '#ff5c35',
        pointLabel: {
            visible: true,
            suffix: 'm'
        },
        data: [
            [4, 30, 50],
            [66, 24, 63],
            [18, 18, 18],
            [24, 83, 36],
            [27, 60, 51],
            [50, 37, 61],
            [80, 80, 80],
            [41, 65, 41],
            [95, 60, 28],
            [11, 14, 22],
            [36, 28, 95],
            [79, 63, 56],
            [2, 91, 87],
            [62, 79, 77]
        ]
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
    createCheckBox(container, 'ColorByPoint', function (e) {
        config.series.colorByPoint = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Outlined Label', function (e) {
        config.series.pointLabel.effect = _getChecked(e) ? 'outline' : 'none';
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
