const config = {
    title: "Log Axis 02",
    xAxis: {
        type: 'log',
        tick: {
            stepSize: 1
        }
    },
    yAxis: {
        type: 'log'
    },
    series: {
        type: 'line',
        xStart: 1,
        data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
