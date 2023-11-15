/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	options: {
		// animatable: false,
        theme: 'dark'
	},
	title: {
        text: 'GLOBAL SURFACE AIR TEMPERATURE · 1-23 JULY',
        align: 'left',
        style: {
            fill: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
        }
    },
    subtitle: {
        text: 'Average for first 23 days of July from 1940 to 2023 · Data: ERAS · Credit: C3S/ECMWF',
        align: 'left',
        style: {
            marginBottom: '20px',
            fontSize: '14px',
            fill: '#aaa'
        }
    },
	xAxis: {
        type: 'linear',
        stepInterval: 10,
		title: '서울시',
		grid: {
            visible: true,
            style: {
                stroke: '#777'
            }
        },
		label: {
			// step: 10,
		},
	},
	yAxis: {
		title: {
            text: 'Temperature anomaly (℃)',
            style: {
                fill: '#aaa'
            }
        },
        grid: {
            style: {
                stroke: '#777'
            }
        }
	},
	series: {
		name: '대기질',
        baseValue: NaN,
        xStart: 1940,
		data: [
            15.78, 15.68, 15.5, 15.48, 15.64, 15.6, 15.61, 15.7, 15.64, 15.69,
            15.48, 15.46, 15.41, 15.64, 15.635, 15.5, 15.47, 15.44, 15.68, 15.75, 15.78, 15.77
        ],
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
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
