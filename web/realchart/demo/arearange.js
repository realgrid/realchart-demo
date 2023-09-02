const config = {
    title: "AreaRange Series",
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
            ['home', 7, 12], 
            ['sky', 11, 17], 
            ['def', 9, 13], 
            ['지리산', 15.3, 21], 
            ['zzz', 13, 19],
            ['낙동강', 12.5, 17]
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
