/**
 * @demo
 *
 */
const config = {
    options: {
        // animatable: false
    },
    title: 'Line Series 01',
    series: {
        type: 'line',
        layout: 'fill',
        children: [{
            data: [1,2,3,4,5,6,7]
        }, {
            data: [2,5,3,2,6,1,3]
        }, {
            data: [1,6,2,6,3,3,9]
        }]
    }
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
    createCheckBox(
        container,
        'Marker',
        function (e) {
            config.series.marker = _getChecked(e);
            chart.load(config, animate);
        },
        true
    );
    createCheckBox(
        container,
        'Point Label',
        function (e) {
            config.series.pointLabel = _getChecked(e);
            chart.load(config, animate);
        },
        true
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
