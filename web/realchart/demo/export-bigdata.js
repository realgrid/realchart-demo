/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false
    },
    body: {
        zoomType: 'x',
    },
    export: {
        visible: true
    },
    title: "Line Big Data",
    xAxis: {
        tick: {
            stepInterval: 300,
        },
        minPadding: 0,
        maxPadding: 0,
        scrollBar: {
            visible: true
        }
    },
    yAxis: {
        minValue: 0,
        strictMax: 100
    },
    series: {
        type: 'line',
        marker: false,
        data: line_data
    },
    seriesNavigator: {
        visible: true
    },
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
	createCheckBox(container, 'Inverted', function (e) {
            chart.inverted = _getChecked(e);
		}, false);
	createCheckBox(container, 'X Reversed', function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'Y Reversed', function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createCheckBox(container, 'export.visible', function (e) {
			config.export.visible = _getChecked(e);
			chart.load(config, animate);
		}, true);
	createCheckBox(container, 'export.hideNavigator', function (e) {
			config.export.hideNavigator = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'export.hideScrollbar', function (e) {
			config.export.hideScrollbar = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'export.hideZoomButton', function (e) {
			config.export.hideZoomButton = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createListBox(container, "export.width", ['425', '850', '1275'], function (e) {
        config.export.width = Number(_getValue(e));
        chart.load(config);
    }, '850');
	createListBox(container, "export.scale", ['0.5', '1', '1.5'], function (e) {
        config.export.scale = Number(_getValue(e));
        chart.load(config);
    }, '1');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
