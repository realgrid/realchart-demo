const config = {
    title: "Column Negative",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        pointLabel: {
            visible: true,
            position: 'head'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', -9], 
            ['지리산', 14.3], 
            ['유튜브', -5], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
