/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
		// palette: 'gray'
	},
    title: 'Axis Base Line',
	subtitle: '성별에 따른 나이와 최대 심박수의 관계',
	xAxis: {
		title: '나이',
		baseValue: null,
	},
	yAxis: {
		title: '최대 심박수 (thalachh)',
	},
	series: [
		{
			name: '남자',
			data: heart_data.slice(0,600).filter(d => d.sex===1),
			xField: 'age',
			yField: v => v.thalachh - 120,
            // pointLabel: true
		},{
			name: '여자',
			data: heart_data.slice(0,600).filter(d => d.sex===0),
			xField: 'age',
			yField: v => v.thalachh - 150
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
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
