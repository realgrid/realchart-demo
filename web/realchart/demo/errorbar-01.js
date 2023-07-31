const config = {
    title: "Error Bar 01",
    xAxis: {
        title: 'X Axis',
        categories: ['쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트'],
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: [{
        type: 'bar',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        type: 'errorbar',
        data: [[10, 12], [20, 23], [14, 16], [8, 11], [12, 14], [25, 26]],
        styles: {
            stroke: '#333'
        },
    }]
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
