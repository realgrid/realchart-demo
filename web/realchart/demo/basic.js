const config = {
    title: "Basic Real-Chart",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        pointLabel: {
            visible: true,
            // format: '${x}'
            format: '<b style="fill:red">${x}</b>'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
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
