/**
 * @demo
 * 
 */
const config = {
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
        name: 'gauge1',
        centerX: '25%',
        centerY: '25%',
        size: '45%',
        value: 50,
        label: {
            // suffix: '%',
            text: '<t style="fill:blue">${value}</t><t style="font-size:20px;">%</t><br><t style="margin-top:20px;font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold'
            }
        }
    }, {
        name: 'gauge2',
        centerX: '75%',
        centerY: '25%',
        size: '45%',
        value: 50,
        label: {
            // suffix: '%',
            text: '<t style="fill:blue">${value}</t><t style="font-size:20px;">%</t><br><t style="margin-top:20px;font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold'
            }
        }
    }, {
        name: 'gauge3',
        centerX: '25%',
        centerY: '75%',
        size: '45%',
        value: 50,
        label: {
            // suffix: '%',
            text: '<t style="fill:blue">${value}</t><t style="font-size:20px;">%</t><br><t style="margin-top:20px;font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold'
            }
        }
    }, {
        name: 'gauge4',
        centerX: '75%',
        centerY: '75%',
        size: '45%',
        value: 50,
        label: {
            // suffix: '%',
            text: '<t style="fill:blue">${value}</t><t style="font-size:20px;">%</t><br><t style="margin-top:20px;font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold'
            }
        }
    }]
}

let animate;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setInterval(() => {
        chart.updateGauge('gauge1', Math.random() * 100);
        chart.updateGauge('gauge2', Math.random() * 100);
        chart.updateGauge('gauge3', Math.random() * 100);
        chart.updateGauge('gauge4', Math.random() * 100);
    }, 2000);
    setActions('actions')
}
