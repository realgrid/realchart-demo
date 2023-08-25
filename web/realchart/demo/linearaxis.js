const config = {
    options: {
        animatable: false
    },
    title: "Linear Axis",
    xAxis: {
        tick: {
            mark: {},
            label: {}
        }
    },
    yAxis: {
        tick: {
            mark: {},
            label: {}
        }
    },
    series: {
        type: 'bubble',
        colorByPoint: true,
        pointLabel: {
            visible: true,
            effect: 'outline'
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
        chart.refresh();
    }, true);
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
    createListBox(container, "X Min Padding", ['0.05', '0', '0.2'], function (e) {
        config.xAxis.minPadding = _getValue(e);
        chart.update(config);
    }, '0.05');
    createCheckBox(container, 'UseSymbols', function (e) {
        config.yAxis.tick.label.useSymbols = _getChecked(e);
        chart.update(config);
    }, true);
}

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
