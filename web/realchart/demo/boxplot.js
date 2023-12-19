/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: "BoxPlot",
    xAxis: {
        categories: ['쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트'],
    },
    yAxis: {
    },
    series: {
        type: 'boxplot',
        pointLabel: true,
        tooltipText: 'min: ${min}<br>low: ${low}<br>mid: ${mid}<br>high: ${high}<br>y: ${y}',
        data: [
            [560, 651, 748, 895, 965],
            [533, 753, 939, 980, 1080],
            [514, 662, 817, 870, 918],
            [624, 802, 816, 871, 950],
            [634, 736, 804, 882, 910]
        ]
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
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
