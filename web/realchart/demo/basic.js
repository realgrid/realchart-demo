const config = {
    title: "Hello Real-Chart",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        data: [7, 11, 9, 15]
    }
}

export function init() {
    // console.log(RealTouch.getVersion());
    // RealTouch.setLogging(true);
    // RealTouch.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.chart = RealChart.loadChart(config);
}
