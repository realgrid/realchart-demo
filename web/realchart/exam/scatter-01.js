const config = {
    type: 'scatter',
    title: "Scatter Series 01",
    xAxis: {
        title: 'Height',
        baseValue: null,
    },
    yAxis: {
        title: 'Weight'
    },
    series: [{
        data: olympic_data.slice(0, 200).filter(v => v.height > 1),
        xProp: 'height',
        yProp: 'weight',
        // pointLabel: true
    }, {
        data: olympic_data.slice(1000, 1200).filter(v => v.height > 1),
        xProp: 'height',
        yProp: 'weight'
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
