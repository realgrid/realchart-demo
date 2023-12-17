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
        type: 'line',
        trendline: {
            visible: true,
            type: 'linear',
            // type: 'logarithmic',
            // type: 'exponential',
            // type: 'power',
            // type: 'movingAverage',
            movingAverage: {
                interval: 4,
            }
        },
        data: [5, 7, 11, 9, 3, 6, 9, 15, 4, 6, 8, 10, 15, 17, 11, 19, 18]
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
