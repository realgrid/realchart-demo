/**
 * @demo
 * 
 */
const config = {
    vars: {
        gauge: {
            innerRadius: '93%',
            valueRanges: [{
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
        var: "gauge",
        name: 'gauge1',
        width: '33%',
        height: '50%',
        left: 0,
        top: 0,
        value: Math.random() * 100,
    }, {
        var: "gauge",
        name: 'gauge2',
        width: '33%',
        height: '50%',
        left: '33%',
        top: 0,
        valueRadius: '104%',    
        valueThickness: '200%',
        value: Math.random() * 100,
    }, {
        var: "gauge",
        name: 'gauge3',
        width: '33%',
        height: '50%',
        left: '66%',
        top: 0,
        value: Math.random() * 100,
    }, {
        var: "gauge",
        name: 'gauge4',
        width: '33%',
        height: '50%',
        left: 0,
        top: '50%',
        value: Math.random() * 100,
    }, {
        var: "gauge",
        name: 'gauge5',
        width: '33%',
        height: '50%',
        left: '33%',
        top: '50%',
        value: Math.random() * 100,
    }, {
        var: "gauge",
        name: 'gauge6',
        width: '33%',
        height: '50%',
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
