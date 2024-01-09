/**
 * @demo
 *
 */
const config = {
    title: 'Linear Gauge',
    options: {},
    gauge: [
        {
            type: 'linear',
            name: 'gauge',
            vertical: true,
            width: 80,
            label: {
                numberFormat: '#.#',
                style: {
                    fill: 'var(--color-1)',
                },
            },
            scale: {
                visible: true,
                stepInterval: 20,
            },
            value: Math.random() * 100,
            valueBar: {
                style: {
                    fill: 'var(--color-1)',
                },
            },
            style: {
                fill: 'var(--color-2)',
            },
            band: {
                visible: true,
                gap: 3,
                ranges: [{
                    toValue: 30,
                    color: '#ff0',
                }, {
                    toValue: 60,
                    color: '#fa0'
                }, {
                    color: '#f40'
                }]
            },
        },
    ],
};

let animate;
let chart;
let timer;

function setActions(container) {
    createCheckBox(
        container,
        'Debug',
        function (e) {
            RealChart.setDebugging(_getChecked(e));
            chart.render();
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createCheckBox(
        container,
        'label.animatable',
        function (e) {
            config.gauge[0].label.animatable = _getChecked(e);
            chart.load(config);
        },
        true
    );
    createButton(container, 'Run', function (e) {
        clearInterval(timer);
        timer = setInterval(() => {
            chart.getGauge('gauge').setValue(Math.random() * 100);
        }, 2000);
    });
    createButton(container, 'Stop', function (e) {
        clearInterval(timer);
    });
    createListBox(
        container,
        'options.theme',
        ['', 'dark'],
        function (e) {
            config.options.theme = _getValue(e);
            chart.load(config, animate);
        },
        'default'
    );
    createCheckBox(
        container,
        'scale',
        function (e) {
            config.gauge[0].scale.visible = _getChecked(e);
            chart.load(config);
        },
        true
    );
    createListBox(
        container,
        'scale.position',
        ['default', 'opposite'],
        function (e) {
            config.gauge[0].scale.position = _getValue(e);
            chart.load(config);
        },
        'default'
    );
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
