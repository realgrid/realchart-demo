/**
 * @demo
 * 
 */
const config = {
    type: "line",
    options: {},
    title: "부서별 월간 성과 비교",
    xAxis: {
		label: {
			step: 1
		},
		categories:["1월", "2월","3월","4월","5월","6월","7월","8월"],
        title: "월별 성과 측정",
    },
	legend: {
		position: 'left'
	},
    yAxis: {
        title: "성과 지표 (단위: 점수)",
    },
    series: [{
		children:[
			{
				lineType: 'spline',
				name: '기술 및 개발 부문',
				data: [200, 455, 385, 340, 260, 200,
					300, 375]
			}, {
				lineType: 'spline',
				name: '제조 부문',
				data: [90, 205, 245, 160, 220, 210,
					155,145]
			}, {
				lineType: 'spline',
				name: '영업 및 유통 부문',
				data: [150, 215, 170, 260, 190, 280,
					290, 270]
			}, {
				lineType: 'spline',
				name: '운영 및 유지보수 부문',
				data: [40, 65, 85, 55, 220, 35, 49,
					55]
			}, {
				lineType: 'spline',
				name: '기타 부문',
				data: [105, 102, 190, 255, 180, 240, 220,
					210]
			}
		]
	}
		
	],
}

let animate;
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
	createCheckBox(
		container,
		'X Opposite',
		function (e) {
			config.xAxis.position = _getChecked(e) ? 'opposite' : '';
			chart.load(config, animate);
		},
		false
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
