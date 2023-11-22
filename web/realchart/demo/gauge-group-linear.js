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
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Linear Gauge Group",
    gauge: [{
        type: 'lineargroup',
        width: '80%',
        height: 250,
        maxValue: 100,
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
        scale: {
        },
        band: {
            gap: 3,
            ranges: [{
                toValue: 30,
                color: '#ff0',
            }, {
                toValue: 60,
                color: '#fa0'
            }, {
                color: '#f40'
            }],
            // tickLabel: true
        },
        label: {
            text: 'Linear Gauges'
        },
        paneStyle: {
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
        config.gauge[0].label.animatable = _getChecked(e);
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
    }, 'default');
    createCheckBox(container, 'scale', function (e) {
        config.gauge[0].scale.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "scale.position", ['default', 'opposite'], function (e) {
        config.gauge[0].scale.position = _getValue(e);
        chart.load(config);
    }, 'default');
    createCheckBox(container, 'band', function (e) {
        config.gauge[0].band.visible = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "band.position", ['default', 'opposite'], function (e) {
        config.gauge[0].band.position = _getValue(e);
        chart.load(config);
    }, 'default');
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
