/**
 * @demo
 * 
 */
const config = {
    templates: {
        gauge: {
            width: '33%',
            height: '50%',
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
    title: "Multiple Gauges",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        left: 0,
        top: 0,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge2',
        left: '33%',
        top: 0,
        valueRadius: '104%',    
        valueRim: {
            thickness: '200%',
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge3',
        left: '66%',
        top: 0,
        value: Math.random() * 100,
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
                chart.updateGauge('gauge' + i, Math.random() * 100);
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
