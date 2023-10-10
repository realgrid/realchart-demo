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
    title: "Linear Guages Vertical",
    gauge: [{
        type: 'linear',
        name: 'linear1',
        width: 65,
        height: '70%',
        top: 100,
        left: 50,
        vertical: true,
        maxValue: 100,
        value: 81,
        scale: {
            line: true,
        },
        ranges: [{
            toValue: 50,
            color: '#777'
        }, {
            toValue: 70,
            color: '#aaa'
        }],
        label: {
            text: "RealChart<br>Linear<br>ver 1.0"
        }
    }, {
        type: 'linear',
        name: 'linear2',
        width: 200,
        height: '70%',
        top: 100,
        left: 200,
        vertical: true,
        maxValue: 100,
        value: 81,
        scale: {
            line: true,
        },
        ranges: [{
            toValue: 50,
            color: '#777'
        }, {
            toValue: 70,
            color: '#aaa'
        }],
        label: {
            position: 'left',
            text: "RealChart Linear<br> ver 1.0"
        }
    }]
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
    // createButton(container, 'Run', function(e) {
    //     config.gauge.active = true;
    //     chart.load(config);
    // });
    // createButton(container, 'Stop', function(e) {
    //     config.gauge.active = false;
    //     chart.load(config);
    // });
    createListBox(container, "label.position", ['', 'left', 'right', 'top', 'bottom'], function (e) {
        config.gauge[0].label.position = _getValue(e);
        chart.load(config);
    }, '');
    createListBox(container, "label.gap", ['0', '5', '10', '3%', '5%', '7%'], function (e) {
        config.gauge[0].label.gap = _getValue(e);
        chart.load(config);
    }, '5%');
    createCheckBox(container, 'scale.opposite', function (e) {
        config.gauge[0].scale.opposite = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "label2.position", ['left', 'right', 'top', 'bottom'], function (e) {
        config.gauge[1].label.position = _getValue(e);
        chart.load(config);
    }, 'left');
    createCheckBox(container, 'scale2.opposite', function (e) {
        config.gauge[1].scale.opposite = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
