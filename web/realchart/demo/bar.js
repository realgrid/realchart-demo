const config = {
    title: "Bar Series 01",
    options: {
    },
    xAxis: {
        title: 'X Axis',
        // grid: true,
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: {
        type: 'bar',
        pointLabel: {
            visible: true,
            position: 'head',
            // text: '<b style="fill:red">${x}</b>'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
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
