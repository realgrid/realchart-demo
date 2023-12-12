/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Line Series - Point Labels",
    xAxis: {
        type: 'category',
    },
    yAxis: {
        // strictMax: 15
    },
    series: {
        type: 'line',
        marker: true,
        pointLabel: {
            visible: true,
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['카눈', 8], 
            ['def', 9], 
            ['머핀', 11], 
            ['지리산', 15.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
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
