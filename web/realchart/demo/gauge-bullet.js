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
    title: "Bullet Guage",
    gauge: {
        type: 'bullet',
        name: 'bullet1',
        width: '50%',
        height: 80,
        label: {
            text: "RealChart Bullet<br>ver 1.0"
            // position: 'bottom',
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
    // createButton(container, 'Run', function(e) {
    //     config.gauge.active = true;
    //     chart.load(config);
    // });
    // createButton(container, 'Stop', function(e) {
    //     config.gauge.active = false;
    //     chart.load(config);
    // });
    createListBox(container, "label.position", ['left', 'right', 'top', 'bottom'], function (e) {
        config.gauge.label.position = _getValue(e);
        chart.load(config);
    }, 'left');
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
