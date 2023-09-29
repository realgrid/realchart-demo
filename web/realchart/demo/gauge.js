/**
 * @demo
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
    title: "Circle Guage",
    gauge: {
        name: 'gauge1',
        value: Math.random() * 100,
        ranges: [{
            endValue: 30,
            color: 'green'
        }, {
            endValue: 70,
            color: 'yellow'
        }, {
            color: 'red'
        }],
        label: {
            // suffix: '%',
            numberFormat: '#0.0',
            text: '<t style="fill:blue">${value}</t><t style="font-size:24px;">%</t><br><t style="margin-top:20px;font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontFamily: 'Arial',
                fontWeight: 'bold'
            },
        }
    }
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
            chart.updateGauge('gauge1', Math.random() * 100);
        }, 2000);
    });
    createButton(container, 'Stop', function(e) {
        clearInterval(timer);
    });
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
