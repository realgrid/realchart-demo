/**
 * @demo
 * 
 */
const config = {
    title: "Pareto Null Point",
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
        padding: 0,
        position: 'opposite',
        tick: {
        },
        label: {
            suffix: '%'
        }
    }],
    series: [{
        name: 'main',
        pointLabel: true,
        data: [755, 172, 131, null, 86, 72, 51, 36, 10],
    }, {
        name: 'pareto',
        type: 'pareto',
        pointLabel: true,
        source: 'main',
        curved: false,
        yAxis: 1
    }]
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
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

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
