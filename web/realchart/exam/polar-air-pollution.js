/**
 * @demo
 * 
 */

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
        text: 'Air Pollution (Ozone)',
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
            // textCallback: ({ count, index, value }) => {
            //     return (value > -90 && value < 90) ? value.toString() : '';
            // },
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
        style: {
            strokeDasharray: '4',
        }
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
            xField: "Wind Direction",
            yField: "Wind Speed",
            zProp: "Ozone",
            style: {
                stroke: 'none',
                // mixBlendMode: 'screen', // not working here...
            },
            pointStyleCallback: (p) => {
                const z = p.zValue;
                let fill = '';
                if (z < 10) {
                    fill = 'yellow'
                } else if (z < 30) {
                    fill = 'orange'
                } else if (z < 50) {
                    fill = 'red'
                } else {
                    fill = 'darkred'
                }
                return { fill, mixBlendMode: 'screen' };
            }
            // zProp: '',
            // style: {
            //     stroke: 'none',
            //     fill: '#bbb',
            // }
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
    ],
    legend: true
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
