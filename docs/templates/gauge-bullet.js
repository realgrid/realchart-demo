/**
 * @demo
 */
export const config = {
    options: {
        // animatable: false,
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Bullet Guage",
    gauge: [{
        type: 'bullet',
        name: 'bullet1',
        width: '55%',
        height: 65,
        left: 10,
        maxValue: 100,
        value: 81,
        targetValue: 90,
        scale: {
            line: true
        },
        ranges: [{
            toValue: 50,
            color: '#777'
        }, {
            toValue: 70,
            color: '#aaa'
        }],
        label: {
            text: "RealChart Bullet<br>ver 1.0"
            // position: 'bottom',
        }
    }, {
        type: 'bullet',
        name: 'bullet2',
        width: 80,
        height: '70%',
        left: 600,
        top: 50,
        vertical: true,
        maxValue: 100,
        value: 81,
        targetValue: 90,
        scale: {
            line: true
        },
        ranges: [{
            toValue: 50,
            color: '#777'
        }, {
            toValue: 70,
            color: '#aaa'
        }],
        label: {
            text: "RealChart<br>Bullet<br>ver 1.0"
            // position: 'bottom',
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
    createCheckBox(container, 'reversed', function (e) {
        config.gauge[0].reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "label.position", ['', 'left', 'right', 'top', 'bottom'], function (e) {
        config.gauge[0].label.position = _getValue(e);
        chart.load(config);
    }, '');
    createCheckBox(container, 'scale', function (e) {
        config.gauge[0].scale.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createCheckBox(container, 'scale.line', function (e) {
        config.gauge[0].scale.line = _getChecked(e);
        chart.load(config);
    }, true);
    createCheckBox(container, 'scale.tick', function (e) {
        config.gauge[0].scale.tick = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "scale.gap", ['0', '4', '8', '12'], function (e) {
        config.gauge[0].scale.gap = _getValue(e);
        chart.load(config);
    }, '8');
    createCheckBox(container, 'scale.opposite', function (e) {
        config.gauge[0].scale.opposite = _getChecked(e);
        chart.load(config);
    }, false);
    line(container);
    createCheckBox(container, 'reversed2', function (e) {
        config.gauge[1].reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "label2.position", ['', 'left', 'right', 'top', 'bottom'], function (e) {
        config.gauge[1].label.position = _getValue(e);
        chart.load(config);
    }, '');
    createCheckBox(container, 'scale2', function (e) {
        config.gauge[1].scale.visible = _getChecked(e);
        chart.load(config);
    }, true);
    createCheckBox(container, 'scale2.line', function (e) {
        config.gauge[1].scale.line = _getChecked(e);
        chart.load(config);
    }, true);
    createCheckBox(container, 'scale2.tick', function (e) {
        config.gauge[1].scale.tick = _getChecked(e);
        chart.load(config);
    }, true);
    createListBox(container, "scale2.gap", ['0', '4', '8', '12'], function (e) {
        config.gauge[1].scale.gap = _getValue(e);
        chart.load(config);
    }, '8');
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
