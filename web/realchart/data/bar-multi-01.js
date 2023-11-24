/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: {
		text: "서울시 행사 만족도"
	},
	options: {
	},
	xAxis: {
		categories: ['장기적 개최 희망','긍적인식 도움', '소모임 참여의향', '지속적 만남의향','행사 진행자', '행사프로그램 및 운영'],
		title: {

		},
		grid: true,
		
		label: {
			step: 1,
		},
	},
	yAxis: {
		label: {
            suffix: '%',
            style: {
            }
        },
		title:{

		},
	},
	inverted: true,
	series: [
		{
			layout: "fill",
			children: [
				{
					name: '전혀 아니다',
					pointLabel: {
						visible: false,
						position: 'inside',
						effect: 'outline',
					},
					data: ["1%", "1%", "1", 1, 1, 1]},
					{
						name: '아니다',
						pointLabel: {
							visible: false,
							position: 'inside',
							effect: 'outline',
						},
						data: ["3%", "2.5%", "4%", "2%", "3%", "6%"]},
					{
						name: '보통이다',
						pointLabel: {
							visible: true,
							position: 'inside',
							effect: 'outline',
						},
						color: '#D3D3D3',
						data: ["6%", "8%", "9%", "5%", "9%", "15%"]},
					{
						name: '그렇다',
						pointLabel: {
							visible: true,
							position: 'inside',
							effect: 'outline',
						},
						color: '#FF6F7D',
						data: ["32%", "35%", "38%", "38%", "32%", "33%"]},{
							name: '매우 그렇다',
							pointLabel: {
								visible: true,
								position: 'inside',
								effect: 'outline',
							},
							color: '#D94A5A',
							data: ["60%", "53%", "52%", "56%", "58%", "47%"]},
			]
		}
	],
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
