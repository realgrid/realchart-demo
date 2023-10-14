/**
 * @demo
 * 
 */
const config = {
    templates: {
    },
    options: {
        animatable: false,
        credits: {
            // visible: false,
            // verticalAlign: 'top'
            // align: 'center'
        }
    },
    title: "Circle Gauge Group",
    gauge: [{
        children: [{
            value: Math.random() * 100,
        }, {
            valueRadius: '104%',    
            valueRim: {
                thickness: '200%',
            },
            value: Math.random() * 100,
        }, {
            left: 0,
            top: '50%',
            value: Math.random() * 100,
        }, {
            left: '50%',
            top: '50%',
            value: Math.random() * 100,
        }],
        valueRim: {
            ranges: [{
                toValue: 25,
                color: 'green'
            }, {
                toValue: 50,
                color: '#0000cc'
            }, {
                toValue: 75,
                color: '#ffaa00'
            }, {
                color: 'red'
            }]
        },
        style: {
            stroke: 'lightblue',
            borderRadius: '10px'
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
