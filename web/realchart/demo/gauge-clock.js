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
        // time: "2000-01-01T11:11:11",
        type: 'clock',
        name: 'clock1',
        secondHand: {},
        tickLabel: {
            // step: 2
        },
        label: {
            // position: 'bottom',
        }
    }
}

let chart;
let timer;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createButton(container, 'Run', function(e) {
        chart.gauge.active = true;
    });
    createButton(container, 'Stop', function(e) {
        chart.gauge.active = false;
    });
    createCheckBox(container, 'secondHand.animatable', function (e) {
        config.gauge.secondHand.animatable = _getChecked(e);
        chart.load(config);
    }, false);
    createListBox(container, "tickLabel.step", ['1', '2', '3'], function (e) {
        config.gauge.tickLabel.step = _getValue(e);
        chart.load(config);
    }, 1);
    createListBox(container, "label.position", ['top', 'bottom'], function (e) {
        config.gauge.label.position = _getValue(e);
        chart.load(config);
    }, 0);
    createButton(container, 'PNG', function (e) {
		chart.exportImage();
	});
	createButton(container, 'JPG', function (e) {
		chart.exportImage({type: 'jpg'});
	});
	createButton(container, 'JPEG', function (e) {
		chart.exportImage({type: 'jpeg'});
	});
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
