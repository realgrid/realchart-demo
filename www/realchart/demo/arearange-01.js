const config = {
    title: "AreaRange Series 01",
    xAxis: {
        type: 'time',
        title: 'Time'
    },
    yAxis: {
        title: 'Temparature'
    },
    series: {
        type: 'arearange',
        data: range_data
    }
}

export function init() {
    // console.log(RealTouch.getVersion());
    // RealTouch.setLogging(true);
    // RealTouch.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
