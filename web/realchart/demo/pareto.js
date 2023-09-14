/**
 * @demo
 * 
 */
const config = {
    title: "Pareto Series",
    options: {
        // animatable: false
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
        data: [755, 222, 151, 86, 72, 51, 36, 10],
    }, {
        name: 'pareto',
        type: 'pareto',
        pointLabel: true,
        curved: true,
        source: 'main',
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
    createCheckBox(container, 'Curved', function (e) {
        config.series[1].curved = _getChecked(e);
        chart.update(config);
    }, false);
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
