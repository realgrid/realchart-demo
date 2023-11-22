/**
 * @demo
 * 
 */
const config = {
    templates: {
        gauge: {
            label: {
                numberFormat: '#00.#',
            }
        }
    },
    options: {
        animatable: false,
        theme: 'dark',
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Circle Gauge Group",
    gauge: [{
        children: [{
            name: 'gauge1',
            template: 'gauge',
            value: Math.random() * 100,
            valueRim: {
                style: {
                    fill: '#00aaff'
                }
            },
            label: {
                style: {
                    fill: '#00aaff'
                },
                text: "<t style='fill:gray'>게이지 101 -</t> ${value}"
            }
        }, {
            name: 'gauge2',
            template: 'gauge',
            value: Math.random() * 100,
            valueRim: {
                style: {
                    fill: '#ffaa00'
                }
            },
            label: {
                style: {
                    fill: '#ffaa00'
                },
                text: "<t style='fill:gray'>게이지 202 -</t> ${value}"
            }
        }, {
            name: 'gauge3',
            template: 'gauge',
            value: Math.random() * 100,
            valueRim: {
                style: {
                    fill: '#88cc00'
                }
            },
            label: {
                style: {
                    fill: '#88cc00'
                },
                text: "<t style='fill:gray'>게이지 303 -</t> ${value}"
            }
        }, {
            name: 'gauge4',
            template: 'gauge',
            value: Math.random() * 100,
            valueRim: {
                style: {
                    fill: '#aa0000'
                }
            },
            label: {
                style: {
                    fill: '#aa0000'
                },
                text: "<t style='fill:gray'>게이지 404 -</t> ${value}"
            }
        }],
        innerRadius: '30%',
        sweepAngle: 270,
        valueRim: {
            ranges: [{
                toValue: 25,
                color: 'green'
            }, {
                toValue: 50,
                color: '#0000cc'
            }, {
                toValue: 75,
                color: '#ffaa00'
            }, {
                color: 'red'
            }]
        },
        panelStyle: {
            stroke: 'lightblue',
            borderRadius: '10px'
        }
    }]
}

let animate;
let chart;
let timer;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'label.animatable', function (e) {
        config.gauge.label.animatable = _getChecked(e);
        chart.load(config);
    }, true);
    createButton(container, 'Run', function(e) {
        clearInterval(timer);
        timer = setInterval(() => {
            for (let i = 1; i <= 4; i++) {
                chart.getGauge('gauge' + i).updateValue(Math.random() * 100);
            }
        }, 2000);
    });
    createButton(container, 'Stop', function(e) {
        clearInterval(timer);
    });
    createListBox(container, "options.theme", ['', 'dark'], function (e) {
        config.options.theme = _getValue(e);
        chart.load(config, animate);
    }, 'dark');
    createButton(container, 'PNG', function (e) {
		chart.exportImage();
	});
	createButton(container, 'JPG', function (e) {
		chart.exportImage({type: 'jpg'});
	});
	createButton(container, 'JPEG', function (e) {
		chart.exportImage({type: 'jpeg'});
	});
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
