const config = {
    options: {
        polar: true
    },
    title: "Polar Chart",
    xAxis: {
    },
    yAxis: {
        guide: [{
            type: 'line',
            value: 5.5,
            style: {
                stroke: 'red'
            }
        }]
    },
    series: [{
        type: 'bar',
        pointLabel: true,
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }, {
        type: 'area',
        pointLabel: true,
        data: [
            ['home', 13], 
            ['sky', 9], 
            ['def', 11], 
            ['지리산', 12.3], 
            ['zzz', 11],
            ['낙동강', 15.5]
        ]
    }]
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

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
