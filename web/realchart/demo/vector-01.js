const config = {
    title: "Vector Series 01",
    xAxis: {
        title: 'X Axis',
        max: 100
    },
    yAxis: {
        title: 'Y Axis',
        max: 100
    },
    series: {
        type: 'vector',
        // arrowHead: 'open',
        data: [
            [20, 20, 111, 45],
            [30, 20, 111, 0],
        ],
        style: {
            stroke: 'red'
        }
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
