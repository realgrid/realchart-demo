/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Line Series 01",
    xAxis: {
        type: 'category',
        crosshair: true
    },
    yAxis: {
        // strictMax: 15
    },
    series: {
        type: 'line',
        marker: {
            visible: true,
        },
        pointLabel: true,
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
    createCheckBox(container, 'Marker', function (e) {
        config.series.marker = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Point Label', function (e) {
        config.series.pointLabel = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Hover Style', function (e) {
        config.series.hoverStyle = _getChecked(e) ? {
            fill: 'white', 
            strokeWidth: '3px',
            filter: 'drop-shadow(2px 2px 2px #555)'
        } : '';
        chart.load(config, animate);
    }, false);
    createListBox(container, "Hover Scale", ['', 2, 2.5], function (e) {
        config.series.marker.hoverScale = _getValue(e);
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
