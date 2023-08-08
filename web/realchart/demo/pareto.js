const config = {
    title: "Pareto Series",
    xAxis: {
        title: 'X Axis',
    },
    yAxis: [{
        title: 'Y Axis',
    }, {
        min: 0,
        max: 100,
        position: 'opposite',
        tick: {
            suffix: '%'
        }
    }],
    series: [{
        name: 'main',
        data: [755, 222, 151, 86, 72, 51, 36, 10],
    }, {
        name: 'pareto',
        type: 'pareto',
        source: 'main',
        curved: true,
        yAxis: 1
    }]
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
