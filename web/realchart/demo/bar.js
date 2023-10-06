/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: '2022년도 도시의 평균 대기질 지수',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '도시',
		categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
		grid: true,
		label:{
			step: 3
		}
	},
	yAxis: {
		title: '대기질 지수(Air Quality Index, AQI)',
		// reversed: true,
		// baseValue: -1
	},
	series: {
		name: '대기질',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		// color: 'green',
		data: [155, 138, 122, 130, 119, 115, 128],
	},
	ChartTextEffect: {
		autoContrast: false,
	},
};

let animate = false;
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
	createCheckBox(
		container,
		'Always Animate',
		function (e) {
			animate = _getChecked(e);
		},
		false
	);
	createButton(container, 'Test', function (e) {
		alert('hello');
	});
	createCheckBox(
		container,
		'ColorByPoint',
		function (e) {
			config.series.colorByPoint = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'Inverted',
		function (e) {
			config.inverted = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'X Reversed',
		function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'Y Reversed',
		function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
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
