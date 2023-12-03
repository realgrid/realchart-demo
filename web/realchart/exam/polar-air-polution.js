/**
 * @demo
 * 
 */

const data = [
    [162.0,  6.0, 220.61],
    [158.0,  7.0, 184.78],
    [166.0,  5.0, 144.61],
    [154.0,  8.0, 125.71],
    [166.0,  5.0, 105.50],
    [153.0,  9.0,  79.47],
    [154.0,  8.0,  63.10],
    [177.0,  4.0,  59.64],
    [154.0,  8.0,  54.96],
    [151.0,  7.0,  34.98],
]

const config = {
    polar: true,
    templates: {
        series: {
            noClip: true,
            pointLabel: false,
            tooltip: {
                text: '${x}°: ${y}m/s',
            }
        }
    },
    options: {
        style: {
            paddingLeft: '100px'
        }
    },
    title: {
        text: 'Air Polution',
        align: 'left',
        style: {
            fontWeight: 700,
        }
    },
    subtitle: {
        text: '',
        align: 'left',
        style: {
            textAlign: 'left'
        }
    },
    legend: false,
    xAxis: {
        type: 'linear',
        // startAngle: -90,
        minValue: 0,
        maxValue: 359.9,
        label: {
            visible: true,
            suffix: '°',
            style: {
                fill: '#999'
            },
            textCallback: ({ count, index, value }) => {
                return (value > -90 && value < 90) ? value.toString() : '';
            },
        },
        tick: {
            stepInterval: 90,
        },
        grid: {
            // visible: false,
        }
    },
    yAxis: {
        label: {
            visible: true,
            style: {
                fill: '#999'
            }
        },
        title: false,
        grid: {
            visible: true,
            // startVisible: false,
        },
        // strictMax: 25,
        tick: { 
            visible: !true,
            stepInterval: 5 
        },
    },
    body: {
        totalAngle: 360,
        annotations: [
            
        ]
    },
    series: [
        {
            template: 'series',
            type: 'bubble',
            data,
            // zProp: '',
            style: {
                stroke: 'none',
                fill: '#bbb',
            }
        },
        // {
        //     template: 'series',
        //     type: 'scatter',
        //     data: hitsData,
        //     style: {
        //         stroke: 'none',
        //         fill: 'var(--color-3)',
        //     }
        // },
    ]
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
    createListBox(container, "X.startAngle", ['0', '90', '180', '270'], function (e) {
        config.xAxis.startAngle = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "X.totalAngle", ['360', '270', '180'], function (e) {
        config.xAxis.totalAngle = _getValue(e);
        chart.load(config);
    }, '360');
    createListBox(container, "X.startOffset", ['0', '0.5'], function (e) {
        config.xAxis.startOffset = _getValue(e);
        chart.load(config);
    }, '0');
	createCheckBox(
		container,
		'body.circular',
		function (e) {
            config.body.circular = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
    createCheckBox(
		container,
		'polar',
		function (e) {
            config.polar = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
