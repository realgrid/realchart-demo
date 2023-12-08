const x_ranges = [{
    toValue: 3,
    color: 'blue'
}, {
    toValue: 6,
    color: '#dddd00'
}, {
    color: 'red'
}];
const y_ranges = [{
    toValue: 120,
    color: 'blue',
    style: {
        strokeWidth: '4px'
    }
}, {
    toValue: 140,
    color: '#dddd00'
}, {
    color: 'red'
}];

/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    vars: {
    },
	title: 'View Ranges - Line',
	options: {
		// animatable: false
	},
	xAxis: {
		title: '서울시',
		categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
		grid: true
	},
	yAxis: {
		title: '대기질 지수(Air Quality Index, AQI)',
        // minValue: 0,
	},
	series: {
        type: 'line',
		pointLabel: true,
        baseValue: 0,
		data: [155, 138, 122, 133, 114, 113, 123, 117, 125, 131],
        viewRangeValue: 'x',
        viewRanges: x_ranges,//y_ranges,
        style: {
            strokeWidth: '2px'
        }
	},
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
	createListBox(
		container,
		'Color Ranges',
		['x', 'y'],
		function (e) {
            const axis = _getValue(e);
			config.series.viewRangeValue = axis;
            config.series.viewRanges = axis === 'x' ? x_ranges : y_ranges;
			chart.load(config, animate);
		},
		'x'
	);
	
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
