const config = {
    title: "Trendline 01",
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

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
