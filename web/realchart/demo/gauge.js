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
        // clockwise: false,
        // startAngle: -90,
        // totalAngle: 300,
        // valueRadius: '110%',
        // valueThickness: '100%',
        valueRanges: [{
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
            text: '<t style="fill:blue">${value}</t><t style="font-size:24px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontFamily: 'Arial',
                fontWeight: 'bold',
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
    createListBox(container, "startAngle", [0, 90, 180, 225, 270], function (e) {
        config.gauge.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 0);
    createListBox(container, "totalAngle", [360, 270, 225, 180], function (e) {
        config.gauge.totalAngle = _getValue(e);
        chart.load(config, animate);
    }, 360);
    createCheckBox(container, 'clockwise', function (e) {
        config.gauge.clockwise = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "innerRadius", ['', '70%', '80%', '85%', '90%', '95%'], function (e) {
        config.gauge.innerRadius = _getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "valueRadius", ['', '80%', '90%', '100%', '110%', '120%'], function (e) {
        config.gauge.valueRadius = _getValue(e);
        chart.load(config, animate);
    }, '');
    createListBox(container, "valueThickness", ['', '50%', '100%', '150%', '200%'], function (e) {
        config.gauge.valueThickness = _getValue(e);
        chart.load(config, animate);
    }, '');
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
