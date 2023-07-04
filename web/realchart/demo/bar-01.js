const config = {
    title: "Bar Series 01",
    xAxis: {
    },
    yAxis: {
    },
    series: {
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
    // console.log(RealTouch.getVersion());
    // RealTouch.setLogging(true);
    // RealTouch.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
