const config = {
    title: "Time Axis 02",
    xAxis: {
        type: 'time',
        title: false
    },
    yAxis: {
        title: 'Exchange Rate',
        minValue: 0.6
    },
    series: {
        type: 'area',
        marker: false,
        data: usdeur_data
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
