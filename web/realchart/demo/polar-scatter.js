/**
 * @demo
 *
 */
const config = {
    polar: true,
	type: 'scatter',
	options: {
		// palette: 'gray'
	},
	title: 'Polar Scatter',
	xAxis: {
		title: 'Height',
		baseValue: null,
	},
	yAxis: {
        line: {
            visible: true,
            style: {
                stroke: 'blue'
            }
        },
		title: 'Weight',
	},
	series: [
		{
			data: olympic_data.slice(0, 200).filter((v) => v.height > 1),
			xField: 'height',
			yField: 'weight',
			// pointLabel: true
		},
		{
			data: olympic_data.slice(1000, 1200).filter((v) => v.height > 1),
			xField: 'height',
			yField: 'weight',
            shape: 'diamond',
            color: '#cc4400ee'
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
	
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
