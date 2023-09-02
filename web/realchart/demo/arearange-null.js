const config = {
    title: "AreaRange Null Point",
    options: {},
    xAxis: {
        type: 'time',
        title: 'Time'
    },
    yAxis: {
        title: 'Temparature'
    },
    series: {
        type: 'arearange',
        // data: range_data,
        data: [
            [13.7, 25.6],
            [13.3, 21.8],
            [11.2, null],
            [7.9, 17.3],
            [4.9, 20.6],
            [5.1, 16.8],
            [9.3, 21.1],
            [11.1, 20.5],
            [8.9, 18.4],
            [4.6, 23.2],
            [7.5, 25.7],
            [5.5, 24.3],
            [10.4, 21.2]
        ],
        pointLabel: {},
        marker: {}
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Curved', function (e) {
        config.series.curved = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Point Marker', function (e) {
        config.series.marker.visible = _getChecked(e);
        chart.update(config);
    }, true);
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
