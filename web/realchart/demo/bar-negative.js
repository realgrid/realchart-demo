/**
 * @demo
 *
 */
const config = {
	title: '2022년도 서울시 월별 온도 변화',
	options: {},
	xAxis: {},
	yAxis: {
		title: '온도 차이 (°C)',
	},
	series: {
		// baseValue: null,
		pointLabel: {
			visible: true,
			// position: 'foot',
			effect: 'outline',
		},
        belowStyle: {
            fill: '#c00',
            stroke: '#c00'
        },
		data: [
			['1월', -7], // 1월은 -2°C
			['2월', -5], // 2월은 -1°C
			['3월', 1], // 3월은 1°C
			['4월', 5], // 4월은 5°C
			['5월', 10], // 5월은 10°C
			['6월', 14], // 6월은 14°C
			['7월', 16], // 7월은 16°C
			['8월', 15], // 8월은 15°C
			['9월', 10], // 9월은 10°C
			['10월', 7], // 10월은 7°C
			['11월', 3], // 11월은 3°C
			['12월', -3], // 12월은 -1°C
		],
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
	createListBox(
		container,
		'PointLabel Position',
		['auto', 'inside', 'outside', 'head', 'foot'],
		function (e) {
			config.series.pointLabel.position = _getValue(e);
			chart.load(config, animate);
		},
		'auto'
	);
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
