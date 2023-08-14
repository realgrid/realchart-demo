const config = {
    type: 'boxplot',
    options: {
    },
    title: "Multiple BoxPlot",
    xAxis: {
        categories: ['쓰리엠', '아디다스', '디즈니', 'Amazon', '이마트'],
    },
    yAxis: {
    },
    series: [{
        pointLabel: true,
        data: [
            [60, 101, 748, 895, 965],
            [533, 753, 939, 980, 1080],
            [514, 662, 817, 870, 918],
            [624, 802, 816, 871, 950],
            [634, 736, 804, 882, 910]
        ]
    }, {
        color: 'green',
        pointLabel: true,
        data: [
            [60, 651, 748, 895, 965],
            [633, 753, 939, 980, 1080],
            [554, 662, 817, 870, 918],
            [724, 802, 816, 871, 950],
            [700, 736, 804, 882, 910]
        ]
    }]
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
        chart.update(config);
    }, false);
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
