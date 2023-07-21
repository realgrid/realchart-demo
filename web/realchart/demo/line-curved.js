const config = {
    title: "Line Series - Curved",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'line',
        curved: true,
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
