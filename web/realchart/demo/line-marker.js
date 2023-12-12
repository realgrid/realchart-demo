/**
 * @demo
 * 
 * line 시리즈의 데이터 포인트 마커를 다양한 모양으로 표시할 수 있다.
 */
const config = {
    type: "line",
    options: {},
    title: "Line Marker",
    xAxis: {
        title: "일일 Daily fat",
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: [{
        name: 'Installation & Developers',
        marker: {},
        data: [60934, 61656, 75165, 81827, 112143, 142383,
            171533, 165174, 155157, 161454, 154610]
    }, {
        name: 'Manufacturing',
        marker: {
            radius: 7,
        },
        data: [44916, 47941, 39742, 39851, 42490, 40282,
            48121, 46885, 43726, 44243, 41050]
    }, {
        name: 'Sales & Distribution',
        marker: {},
        data: [11744, 30000, 16005, 19771, 20185, 24377,
            32147, 30912, 29243, 29213, 25663]
    }, {
        name: 'Operations & Maintenance',
        marker: {},
        data: [null, null, null, null, null, null, null,
            null, 9164, 9218, 10077]
    }, {
        name: 'Other',
        marker: {},
        data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
            17300, 15053, 14906, 13073]
    }],
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
    createListBox(container, "Manufacturing.marker.shape", ['', 'circle', 'diamond', 'square', 'triangle', 'itriangle', 'star'], function (e) {
        config.series[1].marker.shape = _getValue(e);
        chart.load(config);
    }, '');
    createListBox(container, "Manufacturing.marker.radius", ['3', '4', '5', '6', '7', '8', '9'], function (e) {
        config.series[1].marker.radius = _getValue(e);
        chart.load(config);
    }, '7');
    createListBox(container, "all.marker.stroke", ['', 'red', 'blue', 'white'], function (e) {
        config.series.forEach(ser => {
            ser.marker.style = { stroke: _getValue(e) };
        })
        chart.load(config);
    }, '');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
