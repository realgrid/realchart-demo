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
            type: 'movingAverage',
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
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
