/**
 * @demo
 *
 */
const config = {
    templates: {
        shape: {
            width: 100,
            height: 100,
            style: {
                fill: 'none',
                stroke: 'red',
                strokeWidth: '5px'
            }
        }
    },
    options: {},
    title: {
        text: 'Annotation Shapes',
        style: {
            fontSize: '30px'
        }
    },
    xAxis: false,
    yAxis: false,
    annotations: [
        {
            template: 'shape',
            type: 'shape'
        },
        {
            template: 'shape',
            type: 'shape',
            style: {
                stroke: 'var(--color-1)'
            },
            offsetY: 100
        },
        {
            template: 'shape',
            type: 'shape',
            //   shape: 'circle',
            align: 'center',
            verticalAlign: 'middle'
        },
        {
            template: 'shape',
            type: 'shape',
            //   shape: 'star',
            align: 'right',
            verticalAlign: 'middle',
            // offsetX: 100,
            style: {
                // fill: 'var(--color-2)',
                stroke: 'var(--color-1)'
            }
        },
        {
            template: 'shape',
            type: 'shape',
            shape: 'diamond',
            align: 'right',
            verticalAlign: 'bottom'
        }
    ]
};

let animate = false;
let chart;

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
    createCheckBox(
        container,
        'Always Animate',
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createListBox(
        container,
        'Line Type',
        ['default', 'spline', 'step'],
        function (e) {
            config.series.lineType = _getValue(e);
            chart.load(config, animate);
        },
        'default'
    );
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'Y Reversed',
        function (e) {
            config.yAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
