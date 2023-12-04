/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: '년도별 서울시 평균 대기질 지수',
	options: {
		// animatable: false
	},
	xAxis: {
		categories: [{
			name: 'a',
			label: '개똥이를<br>지지할 것이다.',
			weight: 33.5
		}, {
			name: 'b',
			label: '개똥이를<br>지지하지 않을 것이다.',
			weight: 59.5
		 }, {
			name: 'c',
			label: '잘모름',
			weight: 7
		 }],
		categoryPadding: 0,
		label: {
			// text: "${label}xxx${label}"
		},
	},
	yAxis: false,
	series: [{
		name: '대기질',
		// baseValue: null,
		pointLabel: true,
		pointPadding: 0,
		colors: ['red', 'green', 'blue'],
		colorByPoint: true,
		// colorByPoint: true,
		data: [122, 122, 122]},
	],
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
