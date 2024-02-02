/**
 * @demo
 *
 */

const config = {
    options: {
        // animatable: false
    },
    title: '11월 평균 온도',
    xAxis: {
        type: 'category',
        crosshair: true
    },
    series: {
        type: 'line',
        marker: {
            visible: true
        },
        pointLabel: true,
        data: [
            { x: '1일', y: '18.9도' },
            { x: '2일', y: '22.29도' },
            { x: '3일', y: '20.04도' },
            { x: '4일', y: '17.5도' },
            { x: '5일', y: '17.75도' },
            { x: '6일', y: '12.95도' },
            { x: '7일', y: '6.75도' },
            { x: '8일', y: '8.95도' },
            { x: '9일', y: '12.15도' },
            { x: '10일', y: '4.8도' },
            { x: '11일', y: '2.4도' },
            { x: '12일', y: '1.85도' },
            { x: '13일', y: '2.25도' },
            { x: '14일', y: '5도' },
            { x: '15일', y: '7.25도' },
            { x: '16일', y: '6.55도' },
            { x: '17일', y: '2도' },
            { x: '18일', y: '0.95도' },
            { x: '19일', y: '6.55도' },
            { x: '20일', y: '7.3도' },
            { x: '21일', y: '8.1도' },
            { x: '22일', y: '9도' },
            { x: '23일', y: '8.25도' },
            { x: '24일', y: '-1.1도' },
            { x: '25일', y: '-0.95도' },
            { x: '26일', y: '3.55도' },
            { x: '27일', y: '6.85도' },
            { x: '28일', y: '0.5도' },
            { x: '29일', y: '-1.6도' },
            { x: '30일', y: '-3.2도' }
        ]
    },
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
    createCheckBox(
        container,
        'Hover Style',
        function (e) {
            config.series.hoverStyle = _getChecked(e)
                ? {
                      fill: 'white',
                      strokeWidth: '3px',
                      filter: 'drop-shadow(2px 2px 2px #555)'
                  }
                : '';
            chart.load(config, animate);
        },
        false
    );
    createListBox(
        container,
        'Hover Scale',
        ['', 2, 2.5],
        function (e) {
            config.series.marker.hoverScale = _getValue(e);
            chart.load(config, animate);
        },
        ''
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);


    const a = [
        { x: '1일', y: '18.9도' },
        { x: '2일', y: '22.29도' },
        { x: '3일', y: '20.04도' },
        { x: '4일', y: '17.5도' },
        { x: '5일', y: '17.75도' },
        { x: '6일', y: '12.95도' },
        { x: '7일', y: '6.75도' },
        { x: '8일', y: '8.95도' },
        { x: '9일', y: '12.15도' },
        { x: '10일', y: '4.8도' },
        { x: '11일', y: '2.4도' },
        { x: '12일', y: '1.85도' },
        { x: '13일', y: '2.25도' },
        { x: '14일', y: '5도' },
        { x: '15일', y: '7.25도' },
        { x: '16일', y: '6.55도' },
        { x: '17일', y: '2도' },
        { x: '18일', y: '0.95도' },
        { x: '19일', y: '6.55도' },
        { x: '20일', y: '7.3도' },
        { x: '21일', y: '8.1도' },
        { x: '22일', y: '9도' },
        { x: '23일', y: '8.25도' },
        { x: '24일', y: '-1.1도' },
        { x: '25일', y: '-0.95도' },
        { x: '26일', y: '3.55도' },
        { x: '27일', y: '6.85도' },
        { x: '28일', y: '0.5도' },
        { x: '29일', y: '-1.6도' },
        { x: '30일', y: '-3.2도' }
    ].map((e,i)=>{
        return {
            x: e.x,
            y:(Math.random() * (15 - (-3)) - 3).toFixed(1)
        }
    })

    console.log(JSON.stringify(a))
    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
