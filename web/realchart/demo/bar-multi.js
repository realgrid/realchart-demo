/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: '관세청 마스크 수출통계 (2021-2023)',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '년도',
		categories: ['2021년', '2022년', '2023년'],
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
		name: '보건용 마스크',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		data: [84861, 111149, 12534]
	}, {
		name: '비말차단용 마스크',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		data: [13626, 9400, 2233]
	}, {
		name: '기타 안면마스크',
		// baseValue: null,
		pointLabel: true,
		// pointWidth: '100%',
		// colorByPoint: true,
		data: [73639, 33923, 12487]
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
