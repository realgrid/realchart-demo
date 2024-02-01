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
        type: 'spline',
        marker: {
            visible: true
        },
        pointLabel: true,
        belowStyle: {
            stroke: 'red',
            fill: 'red'
        },
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
    }
};
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Curved', function (e) {
        config.series.lineType = _getChecked(e) ? 'spline' : '';
        chart.load(config);
    }, false);
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
