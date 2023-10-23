/**
 * @demo
 * 
 */
export const config = {
    templates: {
        gauge: {
            innerRadius: '93%',
            valueRim: {
                ranges: [{
                    endValue: 25,
                    color: 'green'
                }, {
                    endValue: 50,
                    color: '#0000cc'
                }, {
                    endValue: 75,
                    color: '#ffaa00'
                }, {
                    color: 'red'
                }],
            },
            label: {
                text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
                style: {
                    fontWeight: 'bold'
                }
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
    title: "Hand Gauges",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        width: '33%',
        height: '50%',
        left: 0,
        top: 0,
        hand: true,
        pin: true,
        label: {
            text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
            offsetY: 30,
            style: {
                fontWeight: 'bold',
                fontSize: '30px'
            }
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge2',
        width: '33%',
        height: '50%',
        left: '33%',
        top: 0,
        valueRadius: '100%',    
        valueRim: {
            thickness: '200%',
        },
        hand: {
            visible: true,
            length: '80%',
            style: {
                fill: 'blue'
            }
        },
        pin: {
            visible: true,
            style: {
                stroke: 'blue'
            }
        },
        label: false,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge3',
        width: '33%',
        height: '50%',
        left: '66%',
        top: 0,
        startAngle: 240,
        sweepAngle: 245,
        hand: true,
        pin: true,
        label: {
            text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
            offsetY: 40,
            style: {
                fontWeight: 'bold',
                fontSize: '30px'
            }
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge4',
        width: '33%',
        height: '50%',
        left: 0,
        top: '50%',
        innerRadius: '80%',
        rim: {
        },
        band: {
            visible: true,
            position: 'inside',
            thickness: '100%',
            ranges: [{
                toValue: 20,
                color: '#a40'
            }, {
                toValue: 40,
                color: '#cc0'
            }, {
                toValue: 60,
                color: '#080'
            }, {
                toValue: 80,
                color: '#500'
            }, {
                color: '#300'
            }]
        },
        valueRim: false,
        hand: {
            visible: true,
            offset: '15%',
            length: '95%'
        },
        pin: true,
        label: false,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge5',
        width: '33%',
        height: '50%',
        left: '33%',
        top: '50%',
        hand: {
            visible: true,
            offset: '-15%',
            length: '80%',
            style: {
                fill: 'green'
            }
        },
        pin: {
            visible: true,
            style: {
                stroke: '#080',
                fill: '#0f0'
            }
        },
        label: false,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge6',
        width: '33%',
        height: '50%',
        left: '66%',
        top: '50%',
        clockwise: false,
        hand: true,
        pin: true,
        label: false,
        value: Math.random() * 100,
    }]
}

let animate;
let chart;
let timer;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
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
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
