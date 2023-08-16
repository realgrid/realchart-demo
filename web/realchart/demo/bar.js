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

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
        chart.update(config);
    }, false);
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
