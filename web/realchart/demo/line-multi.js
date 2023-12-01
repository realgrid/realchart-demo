/**
 * @demo
 *
 */
const config = {
    options: {},
    title: "보건용 마스크의 월별 수출입 현황",
    xAxis: {
        title: '월',
    },
    yAxis: {
        title: '수출량'
    },
    series: [{
        name: '2021년',
        type: 'line',
        // lineType: 'spline',
        marker: true,
		data : mask_data.filter(d => d.연도 === 2021),
		xField: '월',
		yField: '보건용 마스크 (6307904020) 수출'
    },{
        name: '2022년',
        type: 'line',
        // lineType: 'spline',
        marker: true,
		data : mask_data.filter(d => d.연도 === 2022),
		xField: '월',
		yField: '보건용 마스크 (6307904020) 수출'
    },{
        name: '2023년',
        type: 'line',
        // lineType: 'spline',
        marker: true,
		data : mask_data.filter(d => d.연도 === 2023),
		xField: '월',
		yField: '보건용 마스크 (6307904020) 수출'
    },]
}
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
