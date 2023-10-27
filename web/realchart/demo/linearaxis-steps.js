/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false
    },
    title: "Linear Axis - Steps",
    xAxis: {
        title: 'X Axis',
        tick: {
        },
        label: {}
    },
    yAxis: {
        title: 'Y Axis',
        tick: {
        },
        label: {}
    },
    series: {
        type: 'bubble',
        colorByPoint: true,
        pointLabel: {
            visible: true,
            effect: 'outline',
            suffix: '%',
            style: { fill: '#008' }
        },
        pointColors: ['#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666'],
        data: [
            [9, 2381, 63],
            [98, 7395, 89],
            [51, 5550, 73],
            [41, 9922, 14],
            [58, 5824, 20],
            [78, 2737, 34],
            [55, 15556, 53],
            [18, 9845, 70],
            [42, 7744, 28],
            [3, 5652, 59],
            [31, 5318, 97],
            [79, 11391, 63],
            [93, 12323, 23],
            [44, 13383, 22]
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X.reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y.reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "Y.stepCount", ['', '3', '4', '5', '6', '7'], function (e) {
        config.yAxis.tick.stepCount = _getValue(e);
        chart.load(config);
    }, '');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
