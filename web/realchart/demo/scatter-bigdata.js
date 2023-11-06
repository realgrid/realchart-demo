/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
        animatable: false
    },
	title: 'Scatter - 6,000 Points',
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
			radius: 3
		},
		{
			data: scatter_data2,
			xField: 'x',
			yField: 'y',
			radius: 2,
            shape: 'diamond',
            color: '#c80'
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
    createListBox(container, "series[0].shape", ['circle', 'diamond', 'sqaure', 'triangle', 'itriangle', 'star'], function (e) {
        config.series[0].shape = _getValue(e);
        chart.load(config);
    }, 'circle');
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
