const config = {
    title: "Time Axis 02",
    options: {
        animatable: false
    },
    xAxis: {
        type: 'time',
        title: false,
        // minPadding: 0
    },
    yAxis: {
        title: 'Exchange Rate',
        min: 0.6,
        // reversed: true,
        // utc: true
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
    // RealChart.setDebugging(true);

    RealChart.createChart(document, 'realchart', config);
}
