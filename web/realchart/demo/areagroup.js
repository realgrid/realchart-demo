const config = {
    type: "area",
    options: {},
    title: "Area Group",
    xAxis: {
        title: "일일 Daily fat",
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: {
        series: [{
            name: 'Installation & Developers',
            marker: {},
            data: [43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610]
        }, {
            name: 'Manufacturing',
            marker: {},
            data: [24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050]
        }, {
            name: 'Sales & Distribution',
            marker: {},
            data: [11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663]
        }, {
            name: 'Operations & Maintenance',
            marker: {},
            data: [null, null, null, null, null, null, null,
                null, 11164, 11218, 10077]
        }, {
            name: 'Other',
            marker: {},
            data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073]
        }],
    }
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
    createListBox(container, "layout", ['default', 'stack', 'fill', 'overlap'], function (e) {
        config.series.layout = _getValue(e);
        chart.update(config);
    }, 'default');
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.series.forEach(s => s.lineType = _getValue(e));
        chart.update(config);
    }, 'default');
    createCheckBox(container, 'Point Marker', function (e) {
        config.series.series.forEach(s => s.marker.visible = _getChecked(e));
        chart.update(config);
    }, true);
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
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

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
