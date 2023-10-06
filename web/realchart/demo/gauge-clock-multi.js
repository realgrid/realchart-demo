/**
 * @demo
 * 
 */
const config = {
    gaugeType: 'clock',
    templates: {
        gauge: {
            label: {
                style: {
                    fontSize: '12px'
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
    title: "Multiple Clocks",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        width: '33%',
        height: '50%',
        left: 0,
        top: 0,
    }, {
        template: "gauge",
        name: 'gauge2',
        width: '33%',
        height: '50%',
        left: '33%',
        top: 0,
    }, {
        template: "gauge",
        name: 'gauge3',
        width: '33%',
        height: '50%',
        left: '66%',
        top: 0,
        tick: {
            length: 5
        },
        minorTick: false
    }, {
        template: "gauge",
        name: 'gauge4',
        width: '33%',
        height: '50%',
        left: 0,
        top: '50%',
    }, {
        template: "gauge",
        name: 'gauge5',
        width: '33%',
        height: '50%',
        left: '33%',
        top: '50%',
        minorTick: false,
        hourHand: {
            thickness: 5,
        },
        minuteHand: {
            thickness: 3,
        },
        secondHand: {
            style: {
                fill: '#333'            
            }
        }
    }, {
        template: "gauge",
        name: 'gauge6',
        width: '33%',
        height: '50%',
        left: '66%',
        top: '50%',
        rim: {
            thickness: 5,
            style: {
                stroke: 'none',
                fill: '#333'
            }
        },
        hourHand: {
            thickness: 5,
        },
        minuteHand: {
            thickness: 3,
        },
        secondHand: false,
        tickLabel: {
            step: 3
        },
        label: {
            position: 'bottom'
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
