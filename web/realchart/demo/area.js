const config = {
    title: "Area Series",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'area',
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 15.3], 
            ['zzz', 13],
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
