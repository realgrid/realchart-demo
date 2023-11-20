/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	type: 'bar',
	title: {text : '월별 매출 현황 분석',
	style: {
		fontWeight: 'bold'
	}
	},
	subtitle: {
		visible: true,
		text: "1월부터 12월까지의 매출 변화 추적"
	},
	colorByPoint: true,
	options: {
		// animatable: false
	},
	legend:{
		visible: true,
		location: "bottom"
	},
	xAxis: {
        grid: {
            visible: true,
            endVisible: true,
        },
		crosshair: true,
		tick: true,
		title: '월 (1월 - 12월)',
		categories: ['Jan', 'Fed', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ang', 'Sep', 'Oct', 'Nov', 'Dec'],
		label: {
			startStep: 0,
			step: 2,
		},
        line: true,
        scrollBar: {
            visible: true
        }
	},
	yAxis: [{
		
		crosshair: true,
		grid: true,
		line: true,
		tick: true,
		title: '월별 매출액 (단위: 백만 원)',
		// reversed: true,
		// baseValue: -1
		break : {
			from : 90,
			to: 100
		},
		guide: [
			{ type: 'line', 
			value: -72, 
			label: {align: 'right', text: '안정성 임계선', style: {fill: 'red', stroke: 'red'} },
			style: {
				stroke: 'red'
			},
			},
			{
			  type: 'range',
			  start: 110,
			  end: 120,
			  label: { text: '업계 평균 매출 범위', align: 'left', style: { fill: 'black' } }
			}
		  ],
		
	}],
	body: {
        zoomType: 'x',
        style: {
            // stroke: 'none'
        },
    },
	series: [{
		colorByPoint: true,
		pointLabel: true,
		pointWidth: 30,
		yAxis: 0,
		data: [
			[-130], // 1월은 -2°C
			[-100], // 2월은 -1°C
			[-50], // 3월은 1°C
			[60], // 4월은 5°C
			[70], // 5월은 10°C
			[115], // 6월은 14°C
			[90], // 7월은 16°C
			[100], // 8월은 15°C
			[120], // 9월은 10°C
			[130], 
			[140], 
		 	[160], 
		],
	},
	
	],
	ChartTextEffect: {
		autoContrast: true,
	},
	seriesNavigator: {
        visible: true
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
            chart.inverted = _getChecked(e);
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
