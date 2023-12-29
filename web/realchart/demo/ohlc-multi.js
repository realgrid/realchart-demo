/**
 * @demo
 * 
 */
const config = {
    type: 'ohlc',
    options: {},
    title: "Multiple Ohlc",
    xAxis: {
        type: 'category',
    },
    yAxis: {
        yBase: null
    },
    series: [{
        pointLabel: true,
        tooltipText: 'open: ${open}<br>High: ${high}<br>Low: ${low}<br>Close: ${close}',
        // declineStyle: {
        //     stroke: 'red'
        // },
        data: [
            {low: 301, open: 348, close: 395, high: 465, color: 'green'},
            [353, 439, 480, 580],
            [262, 370, 317, 418],
            [302, 326, 371, 450],
            [336, 382, 364, 420],
            [341, 356, 381, 430],
        ],
    }, {
        pointLabel: true,
        tooltipText: 'open: ${open}<br>High: ${high}<br>Low: ${low}<br>Close: ${close}',
        data: [
            {low: 301, open: 348, close: 395, high: 465, color: 'green'},
            [353, 439, 480, 580],
            [262, 370, 317, 418],
            [302, 326, 371, 450],
            [336, 382, 364, 420],
            [341, 356, 381, 430],
        ],
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
