const config = {
    title: "Scatter Series 01",
    xAxis: {
        title: 'Height'
    },
    yAxis: {
        title: 'Weight'
    },
    series: {
        type: 'scatter',
        data: olympic_data.slice(0, 200),
        xField: 'height',
        yField: 'weight'
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
