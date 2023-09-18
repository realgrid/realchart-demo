const config = {
    title: "Time Axis 01",
    xAxis: {
        type: 'time',
        title: 'Time'
    },
    yAxis: {
        title: 'Temparature'
    },
    series: {
        type: 'area',
        marker: false,
        data: range_data
    }
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    // RealChart.setDebugging(true);

    RealChart.createChart(document, 'realchart', config);
}
