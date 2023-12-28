/**
 * @demo
 * 
 */
const config = {
    title: "Trendline",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        // type: 'line',
        trendline: {
            visible: true,
            type: 'linear',
            // type: 'logarithmic',
            // type: 'exponential',
            // type: 'power',
            // type: 'polynomial',
            // type: 'movingAverage',
            movingAverage: {
                interval: 2,
            }
        },
        data: [1.4, 2, 7.4, 10.8, 11.4, 10.4, 22.8, 16.6, 15, 12, 9.5, 4.2]
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
    createListBox(container, "trendline.type", ['linear', 'logarithmic', 'exponential', 'power', 'polynomial', 'movingAverage'], function (e) {
        config.series.trendline.type = _getValue(e);
        chart.load(config);
    }, 'linear');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
