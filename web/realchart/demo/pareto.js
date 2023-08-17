const config = {
    title: "Pareto Series",
    options: {
    },
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
        pointLabel: true,
        data: [755, 222, 151, 86, 72, 51, 36, 10],
    }, {
        name: 'pareto',
        type: 'pareto',
        pointLabel: true,
        source: 'main',
        curved: true,
        yAxis: 1
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
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        config.yAxis[1].reversed = _getChecked(e);
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
