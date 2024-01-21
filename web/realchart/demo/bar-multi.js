/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	title: '울산광역시 농산물 수출 현황 (2014-2021)',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '년도',
		categories: [ '2017년', '2018년', '2019년', '2020년', '2021년'],
		grid: true,
		
		label: {
			// startStep: 0,
			step: 1,
		},
	},
	yAxis: {
		title: '수출량(단위 만)',
		// reversed: true,
		// baseValue: -1,
        // strictMin: 11,
        // strictMax: 161
	},
	series: [
			{
                // clusterable: false,
				pointWidth: 2,
				pointLabel: {
					visible: true,
					position: 'inside',
					effect: 'outline',
				},
				name: '배',
				// baseValue: null,
				// pointWidth: '100%',
				// colorByPoint: true,
				data: [ 485, 550, 554,233,181]
			}, {
				pointWidth: 2,
				pointLabel: {
					visible: true,
					position: 'inside',
					effect: 'outline',
				},
				name: '배즙',
				// baseValue: null,
				// pointWidth: '100%',
				// colorByPoint: true,
				data: [ 230, 250, 250,330,260]
			},{
				pointWidth: 2,
				pointLabel: {
					visible: true,
					position: 'inside',
					effect: 'outline',
				},
				name: '단감',
				// baseValue: null,
				// pointWidth: '100%',
				// colorByPoint: true,
				data: [ 60, 100, 70,67,28]
			}
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
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
