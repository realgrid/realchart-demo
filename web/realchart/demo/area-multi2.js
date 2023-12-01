/**
 * @demo
 *
 */
const config = {
	type: 'area',
	options: {
		// palette: 'gray'
	},
	title: '연령별 심혈관 건강 지표 비교',
	xAxis: {
		title: '연령대',
		baseValue: null,
	},
	yAxis: {
		title: '측정치 값',
	},
	series: [
		{
        lineType: 'spline',
		name: '여자',
		data: heart3_data.slice(0,600).filter(d => d.sex===0),
		xField: 'age',
		yField: 'thalachh',
		},
		{
            lineType: 'spline',
			name: '남자',
			data: heart3_data.slice(0,600).filter(d => d.sex===1),
			xField: 'age',
			yField: 'thalachh'
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
