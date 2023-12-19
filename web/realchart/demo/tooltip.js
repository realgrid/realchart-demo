/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	options: {
		// animatable: false,
        theme: 'dark',
        style: {
            paddingBottom: '60px'
        }
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
    tooltip: {
        numberFormat: '###'
    },
	xAxis: {
        type: 'linear',
        padding: 0.02,
		grid: {
            visible: true,
            style: {
                stroke: '#333'
            }
        },
	},
	yAxis: {
		title: {
            text: 'Temperature anomaly (℃)',
            style: {
                fill: '#aaa'
            }
        },
        tick: {
            stepInterval: 0.2,
        },
        grid: {
            style: {
                stroke: '#333'
            }
        }
	},
	series: {
		name: 'Air Quality',
        baseValue: NaN,
        xStart: 1940,
        tooltipText: '<b style="font-size: 18px">${series}</b><br>Year, ${x}<br>Temperature anomaly, ${yValue}℃',
		data: [
            15.78, 15.68, 15.5, 15.48, 15.64, 15.6, 15.61, 15.7, 15.64, 15.69,
            15.48, 15.46, 15.41, 15.64, 15.635, 15.5, 15.47, 15.44, 15.68, 15.75, 15.78, 15.77,
            15.48, 15.46, 15.41, 15.64, 15.65, 15.5, 15.47, 15.44, 15.68, 15.77, 15.78, 15.77,
            15.48, 15.46, 15.45, 15.64, 15.61, 15.55, 15.47, 15.51, 15.68, 15.78, 15.70, 15.81,
            15.78, 15.75, 15.80, 15.81, 15.82, 15.89, 15.91, 15.93, 15.94, 15.95, 
            16.2, 16.0, 16.1, 16.0, 15.98, 16.1, 16.2, 16.0, 16.1, 16.2,
            16.21, 16.19, 16.25, 16.29, 16.3, 16.36, 16.38, 16.58, 16.39, 16.43, 16.62, 16.39,
            16.43, 16.62, 16.58, 16.58, 16.58, 16.86,
        ],
        pointLabel: {
            numberFormat: '###',
            visibleCallback: args => args.yValue === args.yMax,
            text: '${xValue}',
            style: {
                fill: '#f00'
            }
        },
        viewRangeValue: 'y',
        viewRanges_2: [{
            toValue: 15.5,
            color: '#08529d'
        }, {
            toValue: 15.6,
            color: '#4392ca'
        }, {
            toValue: 15.7,
            color: '#69aed4'
        }, {
            toValue: 15.8,
            color: '#9fcadf'
        }, {
            toValue: 15.9,
            color: '#ffe0d1'
        }, {
            toValue: 16.0,
            color: '#fdb89e'
        }, {
            toValue: 16.1,
            color: '#fa9275'
        }, {
            toValue: 16.2,
            color: '#fa684b'
        }, {
            toValue: 16.3,
            color: '#f23a29'
        }, {
            toValue: 16.4,
            color: '#ef392f'
        }, {
            toValue: 16.5,
            color: '#ce161e'
        }, {
            color: '#a40f15'
        }],
        viewRanges: {
            fromValue: 15.4,
            colors: ['#08529d', '#4392ca', '#69aed4', '#9fcadf', '#ffe0d1', '#fdb89e', '#fa9275', '#fa684b', '#f23a29', '#ef392f', '#ce161e', '#a40f15']
        }
	},
    annotations: [{
        imageUrl: '../assets/images/climate.png',
        scope: 'container',
        width: 100,
        align: 'right',
        offsetX: 30
    }, {
        imageUrl: '../assets/images/twitter.png',
        scope: 'container',
        width: 43,
        align: 'center',
        verticalAlign: 'bottom'
    }, {
        imageUrl: '../assets/images/insta.png',
        scope: 'container',
        width: 43,
        align: 'center',
        verticalAlign: 'bottom',
        offsetX: 60
    }, {
        imageUrl: '../assets/images/rss.png',
        scope: 'container',
        width: 43,
        align: 'center',
        verticalAlign: 'bottom',
        offsetX: -40
    }]
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
    line(container);
    createCheckBox(
		container,
		'tooltip.visible',
		function (e) {
			config.tooltip.visible = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
    createCheckBox(
		container,
		'tooltip.followPointer',
		function (e) {
			config.tooltip.followPointer = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
    createListBox(
        container,
        'tooltip.hideDelay',
        ['300', '700', '2000'],
        function (e) {
            config.tooltip.hideDelay = _getValue(e);
            chart.load(config);
        },
    '700');
    createListBox(
        container,
        'tooltip.minWidth',
        ['100', '200', '300'],
        function (e) {
            config.tooltip.minWidth = _getValue(e);
            chart.load(config);
        },
    '100');
    createListBox(
        container,
        'tooltip.minHeight',
        ['40', '100', '200'],
        function (e) {
            config.tooltip.minHeight = _getValue(e);
            chart.load(config);
        },
    '40');
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
