/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Line Series",
    xAxis: {
        padding: 0,
        // strictMin: 11.123,
        // strictMax: 12.2,
        tick: {
            // stepInterval: 1.2
            stepCount: 5
        }
    },
    yAxis: {
    },
    series: {
        type: 'line',
        marker: true,
        pointLabel: {
            visible: true,
        },
        data: [7, 11, 8, 9, 11, 15.3, 13, 12.5, 9.5, 8.8, 7.7],
        xStart: 11.123,
        xStep: 0.1
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createListBox(container, "pointLabel.position", ['', 'head', 'foot', 'inside'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "pointLabel.offset", ['', '0', '10', '-10'], function (e) {
        config.series.pointLabel.offset = +_getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "pointLabel.align", ['left', 'center', 'right'], function (e) {
        config.series.pointLabel.align = _getValue(e);
        chart.load(config, animate);
    }, 'center');
    createListBox(container, "pointLabel.alignOffset", ['', '0', '10', '-10'], function (e) {
        config.series.pointLabel.alignOffset = _getValue(e);
        chart.load(config, animate);
    }, '');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
