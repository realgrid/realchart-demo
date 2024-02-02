/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: {
        text: "Shape Annotations",
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
            type: 'shape',
            shape: 'rectangle',
            front: true,
            series: 'main',
            x1: new Date(2022, 8), 
            x2: new Date(2023, 4),
            y1: 65, 
            y2: 145,
            style: {
                fill: 'none',
                stroke: 'var(--color-1)',
                strokeWidth: '5px',
                strokeDasharray: '5'
            }
        }, {
            type: 'shape',
            shape: 'rectangle',
            front: true,
            series: 'main',
            x1: new Date(2021, 9), 
            x2: new Date(2021, 11),
            y1: 0, 
            y2: 200,
            style: {
                fill: 'white',
                stroke: 'var(--color-1)',
                strokeWidth: '1px',
            }
        }, {
            type: 'shape',
            shape: 'star',
            width: 200,
            height: 200,
            offsetY: -70,
            noClip: true,
            style: {
                fill: '#00884440'
            }
        }, {
            type: 'shape',
            shape: 'star',
            offsetX: 130,
            offsetY: 50,
            width: 100,
            height: 100,
            rotation: -21,
            front: true,
            style: {
                fill: '#00884490',
                stroke: 'blue'
            }
        }, {
            type: 'shape',
            shape: 'star',
            verticalAlign: 'bottom',
            offsetX: -50,
            offsetY: -50,
            width: 200,
            height: 200,
            style: {
                fill: '#ff000030'
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
