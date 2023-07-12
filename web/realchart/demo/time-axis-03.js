const config = {
    title: "Time Axis 03",
    xAxis: {
        type: 'time',
        title: false
    },
    yAxis: {
        title: 'Hestavollane'
    },
    series: {
        type: 'line',
        marker: false,
        xStart: "2023-07-12",
        xStep: 1000 * 60 * 60,
        data: [4.5, 5.1, 4.4, 3.7, 4.2, 3.7, 4.3, 4, 5, 4.9,
            4.8, 4.6, 3.9, 3.8, 2.7, 3.1, 2.6, 3.3, 3.8,
            4.1, 1, 1.9, 3.2, 3.8, 4.2]
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
