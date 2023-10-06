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
        secondHand: {},
        label: {
            // position: 'bottom',
            style: {
                fontFamily: 'Arial',
                fontWeight: 'bold',
            },
        }
    }
}

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
    createButton(container, 'Run', function(e) {
        config.gauge.active = true;
        chart.load(config);
    });
    createButton(container, 'Stop', function(e) {
        config.gauge.active = false;
        chart.load(config);
    });
    createCheckBox(container, 'secondHand.animatable', function (e) {
        config.gauge.secondHand.animatable = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "label.position", ['top', 'bottom'], function (e) {
        config.gauge.label.position = _getValue(e);
        chart.load(config);
    }, 0);
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
