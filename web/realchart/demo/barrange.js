const config = {
    title: "Bar Range Series",
    xAxis: {
        grid: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
    },
    series: {
        type: 'barrange',
        pointLabel: {
            visible: true,
            // format: '${x}'
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            [-13.9, 5.2],
            [-16.7, 10.6],
            [-4.7, 11.6],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [5.9, 29.4],
            [6.5, 29.1],
            [4.7, 25.4],
            [4.3, 21.6],
            [-3.5, 15.1],
            [-9.8, 12.5],
            [-11.5, 8.4]
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
