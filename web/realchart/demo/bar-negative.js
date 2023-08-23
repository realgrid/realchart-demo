const config = {
    title: "Bar Negative",
    options: {},
    xAxis: {
    },
    yAxis: {
    },
    series: {
        // baseValue: null,
        pointLabel: {
            visible: true,
            // position: 'foot',
            effect: 'outline'
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', -9], 
            ['지리산', 14.3], 
            ['유튜브', -5], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ]
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createListBox(container, "PointLabel Position", ['auto', 'inside', 'outside', 'head', 'foot'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.update(config, animate);
    }, 'auto');
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
