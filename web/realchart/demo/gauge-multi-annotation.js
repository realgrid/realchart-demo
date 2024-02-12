/**
 * @demo
 * 
 */
const config = {
    templates: {
        gauge: {
            width: '27%',
            height: '40%',
            innerRadius: '93%',
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
            label: {
                text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
                style: {
                    fontWeight: 'bold'
                }
            },
            backgroundStyle: {
                stroke: 'lightblue',
                strokeWidth: '2px',
                borderRadius: '10px'
            }
        }
    },
    options: {
        // animatable: false,
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Multiple Gauges with Annotations",
    gauges: [{
        template: "gauge",
        name: 'gauge1',
        left: 0,
        top: 20,
        value: Math.random() * 100,
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        },
    }, {
        template: "gauge",
        name: 'gauge2',
        left: '33%',
        top: 20,
        valueRim: {
            thickness: '200%',
        },
        value: Math.random() * 100,
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        },
    }, {
        template: "gauge",
        name: 'gauge3',
        left: '66%',
        top: 20,
        value: Math.random() * 100,
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        },
    }, {
        template: "gauge",
        name: 'gauge4',
        left: 0,
        top: '50%',
        value: Math.random() * 100,
        innerRadius: '85%',
        valueRim: {
            stroked: true,
            style: {
                strokeLinecap: 'round'
            }
        },
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        }
    }, {
        template: "gauge",
        name: 'gauge5',
        left: '33%',
        top: '50%',
        value: Math.random() * 100,
        innerRadius: '75%',
        valueRim: {
            stroked: true,
            style: {
                strokeDasharray: '3'
            }
        },
        label: {
            style: {
                fontSize: '30px'
            }
        },
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        }
    }, {
        template: "gauge",
        name: 'gauge6',
        left: '66%',
        top: '50%',
        value: Math.random() * 100,
        innerStyle: {
            fill: '#003300',
            stroke: 'white',
            strokeWidth: '5px'
        },
        label: {
            text: '<t style="fill:yellow">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold',
                fill: 'white'
            }
        },
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        }
    }],
    body: {
        annotations: [{
            front: true,
            anchor: 'gauge1',
            text: '회계솔류션',
            width: '20%',
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                fill: 'white',
                textAlign: 'center',
            },
            backgroundStyle: {
                fill: '#008',
                stroke: 'black',
                padding: '2px 4px'
            }
        }]
    }
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
            for (let i = 1; i <= 6; i++) {
                chart.getGauge('gauge' + i).setValue(Math.random() * 100);
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
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
