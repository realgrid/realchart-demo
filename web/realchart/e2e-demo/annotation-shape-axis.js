/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: {
        text: "Shape Annotations with Axis",
        style: {
            fontSize: '40px'
        }
    },
    xAxis: {
        type: 'time',
        tick: {
            stepInterval: '2m'
        },
        label: {
            rotation: -90,
            timeFormat: 'yyyy년 MM월',
            style: {
                fontFamily: 'Arial',
                fontSize: '20px'
            }
        }
    },
    yAxis: {
        minValue: 0,
        tick: {
            stepInterval: 20,
        }
    },
    series: {
        name: 'main',
        type: 'line',
        lineType: 'spline',
        marker: false,
        xStart: '2020-01',
        xStep: '2m',
        marker: {
            visible: true
        },
        data: [
            101, 103, 105, 109, 113, 115, 120, 125, 131, 136, 139, 143, 141, 140, 139, 138, 130, 125, 120, 119, 119, 120, 122, 123    
        ],
        style: {
            strokeWidth: '5px'
        }
    },
    body: {
        annotations: [{
            shape: 'rectangle',
            x1: new Date(2020, 0),
            y1: 160,
            width: 200,
            height: 200,
            style: {
                fill: '#0000ff30'
            }
        }, {
            shape: 'rectangle',
            x1: new Date(2021, 0),
            x2: new Date(2021, 5),
            y1: 0,
            y2: 160,
            style: {
                fill: '#00880030',
                stroke: 'green'
            }
        }]
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
