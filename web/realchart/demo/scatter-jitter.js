/**
 * @demo
 *
 */
const config = {
	type: 'scatter',
	options: {
        animatable: false
    },
	title: 'Scatter - Jittering',
	xAxis: {
    },
    yAxis: {
    },
	series: [
		{
			name: '나이',
			data: heart2_data.filter(d => d.features === 0),
			xField: 'features',
			yField: 'value'
		},{
			name: '안정시 혈압 (mmHg 단위)',
			data: heart2_data.filter(d => d.features === 1),
			xField: 'features',
			yField: 'value'
		},{
			name: '콜레스테롤 수치 (mg/dl 단위)',
			data: heart2_data.filter(d => d.features === 2),
			xField: 'features',
			yField: 'value'
		},{
			name: '최대 심박수',
			data: heart2_data.filter(d => d.features === 3),
			xField: 'features',
			yField: 'value'
		},{
			name: 'ST 우울증',
			data: heart2_data.filter(d => d.features === 4),
			xField: 'features',
			yField: 'value'
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
    createListBox(container, "jitterX", ['0', '0.1', '0.15', '0.2', '0.3', '0.4', '0.5'], function (e) {
        config.series.forEach(ser => ser.jitterX = +_getValue(e));
        chart.load(config);
    }, '0');
    createListBox(container, "jitterY", ['0', '0.1', '0.15', '0.2', '0.3', '0.4', '0.5'], function (e) {
        config.series.forEach(ser => ser.jitterY = +_getValue(e));
        chart.load(config);
    }, '0');
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
