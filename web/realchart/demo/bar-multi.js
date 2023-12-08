/**
 * @demo
 *
 */
const config = {
	title: '한국가스공사 월간 시도별 도시가스 판매현황',
	options: {},
	xAxis: {
		title: '시도별',
		categories: ['강원', '서울', '경기', '인천', '부산', '경북'],
		grid: true,
	},
	yAxis: {
		title: 'Vertical 수직축 Axis',
	},
	series: [
		{
			name: '2019년도',
			pointLabel: true,
			data: [413340, 4295799, 4582903, 1504513, 1428640, 1495929],
		},
		{
			name: '2020년도',
			pointWidth: 2,
			pointLabel: true,
			data: [416570, 4180225, 5236434, 1393145, 1408886, 1479257],
		},
		{
			name: '2021년도',
			pointLabel: true,
			data: [459931, 4201860, 5498483, 1472529, 1316482, 1421999],
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
