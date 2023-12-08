/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
        animatable: false
    },
	title: 'Scatter - Jittering',
	xAxis: {
    },
    yAxis: {
    },
	series: [{
        data: getJitterData(0, 200),
        radius: 2
    },
    {
        data: getJitterData(1, 200),
        radius: 2
    },
    {
        data: getJitterData(2, 200),
        radius: 2
    },
    {
        data: getJitterData(3, 200),
        radius: 2
    },
    {
        data: getJitterData(4, 200),
        radius: 2
    },
    {
        data: getJitterData(5, 200),
        radius: 2
    }],
};

let chart;

function setActions(container) {
	createCheckBox(
		container,
		'Debug',
		function (e) {
			RealChart.setDebugging(_getChecked(e));
			chart.render();
		},
		false
	);
	createButton(container, 'Test', function (e) {
		alert('hello');
	});
	createCheckBox(
		container,
		'Inverted',
		function (e) {
			config.inverted = _getChecked(e);
			chart.load(config);
		},
		false
	);
	createCheckBox(
		container,
		'X Reversed',
		function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config);
		},
		false
	);
	createCheckBox(
		container,
		'Y Reversed',
		function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config);
		},
		false
	);
    createListBox(container, "jitterX", ['0', '0.1', '0.15', '0.2', '0.3', '0.4', '0.5'], function (e) {
        config.series.forEach(ser => ser.jitterX = +_getValue(e));
        chart.load(config);
    }, '0');
    createListBox(container, "jitterY", ['0', '0.1', '0.15', '0.2', '0.3', '0.4', '0.5'], function (e) {
        config.series.forEach(ser => ser.jitterY = +_getValue(e));
        chart.load(config);
    }, '0');
	
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
