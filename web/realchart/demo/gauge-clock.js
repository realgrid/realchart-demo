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
    title: "Clock Guage",
    gauge: {
        type: 'clock',
        name: 'clock1',
        label: {
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
    createListBox(container, "sweepAngle", [360, 270, 225, 180], function (e) {
        config.gauge.sweepAngle = _getValue(e);
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
    createListBox(container, "valueRim.thickness", ['', '50%', '100%', '150%', '200%'], function (e) {
        config.gauge.valueRim.thickness = _getValue(e);
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
