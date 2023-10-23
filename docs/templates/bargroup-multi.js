/**
 * @demo
 *
 */
export const config = {
	options: {
		// animatable: false
	},
	title: '기업별 전자제품 판매 현황',
	xAxis: {
		title: '기업',
		categories: ['A기업', 'B기업', 'C기업', 'D기업', 'E기업'],
		grid: true,
	},
	yAxis: {
		title: '판매수 (단위 만)',
	},
	series: [
		{
			groupPadding: 0.1,
			children: [
				{
					name: '태블릿',
					data: [40, 30, 55, 27, 15],
				},
				{
					name: '스마트폰',
					data: [110, 75, 130, 80, 45],
				},
				{
					name: '노트북',
					data: [70, 60, 100, 50, 30],
				},
			],
		},
		{
			groupPadding: 0.1,
			layout: 'stack',
			children: [
				{
					name: '온라인 매장',
					data: [90, 75, 100, 65, 40],
				},
				{
					name: '오프라인 매장',
					data: [20, 25, 35, 40, 25],
				},
			],
		},
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
	createListBox(
		container,
		'layout1',
		['default', 'stack', 'fill', 'overlap'],
		function (e) {
			config.series[0].layout = _getValue(e);
			chart.load(config, animate);
		},
		'default'
	);
	createListBox(
		container,
		'layout2',
		['default', 'stack', 'fill', 'overlap'],
		function (e) {
			config.series[1].layout = _getValue(e);
			chart.load(config, animate);
		},
		'stack'
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
