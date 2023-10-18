/**
 * @demo
 * 
 */
const config = {
    templates: {
        gauge: {
            width: '33%',
            height: '33%',
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
            style: {
                stroke: 'lightblue',
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
    title: "Multiple Gauges 2",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        left: 0,
        top: 0,
        radius: '35%',
        scale: {
            visible: true,
            line: {
                style: {
                    stroke: '#0000ff50',
                    strokeWidth: '2px',
                    strokeDasharray: '3'
                }
            }
        },
        label: {
            text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge2',
        left: '33.5%',
        top: 0,
        valueRadius: '104%',    
        valueRim: {
            thickness: '200%',
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge3',
        left: '67%',
        top: 0,
        value: Math.random() * 100,
        label: {
            text: '<t style="font-size:20px;font-weight:normal">Gauge Test</t><br><t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
        }
    }, {
        template: "gauge",
        name: 'gauge4',
        left: 0,
        top: '33.5%',
        value: Math.random() * 100,
        label: {
            text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t>',
        }
    }, {
        template: "gauge",
        name: 'gauge5',
        left: '33.5%',
        top: '33.5%',
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge6',
        left: '67%',
        top: '33.5%',
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
        }
    }, {
        template: "gauge",
        name: 'gauge7',
        left: 0,
        top: '67%',
        centerY: '60%',
        startAngle: -120,
        sweepAngle: 240,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge8',
        left: '33.5%',
        top: '67%',
        radius: '45%',
        centerY: '65%',
        startAngle: -90,
        sweepAngle: 180,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge9',
        left: '67%',
        top: '67%',
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
        }
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
