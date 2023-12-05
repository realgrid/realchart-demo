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
	title: 'Olympic player\'s physique',
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
			name: 'Asia',
			data: data.filter(r => r.continent == 'Asia').slice(0, 200).filter((v) => v.height > 1),
			xField: 'height',
			yField: 'weight',
			// pointLabel: true
		},
		{
			name: 'Europe',
			data: data.filter(r => r.continent == 'Europe').slice(1000, 1200).filter((v) => v.height > 1),
			xField: 'height',
			yField: 'weight',
			shape: 'diamond',
			color: 'var(--color-3)'
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
