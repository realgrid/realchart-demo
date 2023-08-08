const config = {
    title: "Line Series - Spline",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'line',
        lineType: 'spline',
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['태풍', 9], 
            ['def', 7.5], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['백두산', 11],
            ['낙동강', 12.5]
        ]
    }
}

function setActions(container) {
    createButton(container, 'Test', function(e) {
        alert('hello');
    })
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);

    setActions('actions')
}
