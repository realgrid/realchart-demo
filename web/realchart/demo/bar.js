/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: '세종특별자치시 1인당 지방세 부담액',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '년도',
		categories: ['2017', '2018', '2019', '2020', '2021', '2022',],
		grid: true,
		
		label: {
			// startStep: 0,
			step: 1,
		},
	},
	yAxis: {
		title: '인구수',
		// reversed: true,
		// baseValue: -1,
        // strictMin: 11,
        // strictMax: 161
	},
	series: [{
		name: '주민1인당 부담금액',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		data: [237466, 213497, 195827, 223488, 235850, 224338]
	}, {
		name: '인구수',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		data: [28010, 31412, 34057, 35583, 37189, 38359]
	}],
};

let animate = false;
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
