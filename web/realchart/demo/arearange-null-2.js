/**
 * @demo
 * 
 * y값이 null인 포인터를 건너 뛰고 표시한다.
 */
const config = {
    title: "AreaRange Null Point 2",
    options: {
        animatable: false
    },
    xAxis: {
        type: 'category',
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: 'Temparature'
    },
    series: [{
        type: 'arearange',
        name: 'Area range series',
        data: [
            [20, 50],
            [60, 90],
            [90, 120],
            [110, 140],
            null,
            [160, 190],
            [120, 150],
            [130, 160],
            [200, 230],
            [180, 210],
            [80, 110],
            [40, 70]
        ],
        marker: false
    }, {
        type: 'line',
        color: 'blue',
        data: [29.9, 71.5, 106.4, 129.2, null, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4],
        name: 'Line series'
    }]
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
    createCheckBox(container, 'Curved', function (e) {
        config.series.curved = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Point Marker', function (e) {
        config.series.marker.visible = _getChecked(e);
        chart.load(config);
    }, true);
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
