const config = {
    title: "Ohlc 01",
    xAxis: {
        type: 'category',
    },
    yAxis: {
        yBase: null
    },
    series: {
        type: 'ohlc',
        pointLabel: true,
        data: [
            [301, 348, 395, 465],
            [353, 439, 480, 580],
            [262, 370, 317, 418],
            [302, 326, 371, 450],
            [336, 382, 364, 420],
            [341, 356, 381, 430],
        ],
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
