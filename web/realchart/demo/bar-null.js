/**
 * @demo
 *
 */
const config = {
	title: '월별 제품 판매량',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '2023년 월별',
		categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
		grid: true,
	},
	yAxis: {
		title: '판매 수량 (단위: 천 개)',
		// reversed: true,
		// baseValue: -1
	},
	series: {
		name: '제품 A',
		// baseValue: -1,
		pointLabel: true,
		// pointWidth: '100%',
		data: [110, 220, null, 0, 150, 90, 130, 270],
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
	
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
