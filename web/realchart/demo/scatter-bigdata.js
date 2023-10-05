/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
        animatable: false
    },
	title: 'Scatter Series',
	xAxis: {
        minPadding: 0,
        maxPadding: 0,
		strictMax: 10000
    },
    yAxis: {
        minValue: 0,
        strictMax: 10000
    },
	series: [
		{
			data: scatter_data,
			xField: 'x',
			yField: 'y',
			// pointLabel: true
			radius: 2
		},
		{
			data: scatter_data2,
			xField: 'x',
			yField: 'y',
			radius: 2
		},
	],
};

let chart;

function setActions(container) {
	createCheckBox(
		container,
		'Debug',
		function (e) {
			RealChart.setDebugging(_getChecked(e));
			chart.refresh();
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
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
