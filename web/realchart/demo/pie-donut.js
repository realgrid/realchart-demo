/**
 * @demo
 * 
 */
const config = {
    options: {
        // animatable: false
    },
    title: {
        text: '2017년 3/4분기',
        gap: 10,
        backgroundStyle: {
            fill: 'black',
            padding: '2px 5px',
            rx: '3px'
        },
        style: {
            fill: '#fff',
            fontSize: '16px',
        }
    },
    subtitle: {
        text: '모바일 트래픽 분석',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    series: [{
        type: 'pie',
        radius: '40%',
        innerRadius: '50%',
        innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
        legendByPoint: true,
        pointLabel: {
            text: '${x}<br>${y}%',
            visible: true,
            numberFormat: '#.00',
            style: {
                fill: '#fff',
                stroke: '#d3d3d3',
                strokeWidth: '0.2px',
                fontSize: '14px'
            }
        },
        data: [ 
            { x: 'Android', y: 53.51, sliced: true }, 
            { x: 'iOS', y: 29.14 }, 
            { x: 'Windows', y: 10.72}, 
            { x: '기타', y: 6.63}, 
        ],
        onPointClick: (arg) => {
            config.series[0].data.forEach(value => {
                value.sliced = value.x === arg.x ? true : false;
            });
            chart.load(config, false);
        }
    }]
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
    createListBox(container, "options.palette", ['default', 'warm', 'cool', 'forest', 'gray'], function (e) {
        config.options.palette = _getValue(e);
        chart.load(config, animate);
    }, 'default');
    createCheckBox(container, 'Legend', function (e) {
        config.legend.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Legend.location", ['bottom', 'top', 'right', 'left'], function (e) {
        config.legend.location = _getValue(e);
        chart.load(config, animate);
    }, 'bottom');
    line(container);
    createListBox(container, "series.startAngle", [0, 90, 180, 270], function (e) {
        config.series.startAngle = _getValue(e);
        chart.load(config, animate);
    }, 0);
    createListBox(container, "series.totalAngle", [360, 270, 225, 180], function (e) {
        config.series.totalAngle = _getValue(e);
        chart.load(config, animate);
    }, 360);
    createCheckBox(container, 'series.clockwise', function (e) {
        config.series.clockwise = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "series.radius", ['30%', '35%', '40%', '45%'], function (e) {
        config.series.radius = _getValue(e);
        chart.load(config, animate);
    }, '40%');
    createListBox(container, "series.innerRadius", ['70%', '60%', '50%', '40%', '30%'], function (e) {
        config.series.innerRadius = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerX", ['30%', '40%', '50%', '60%'], function (e) {
        config.series.centerX = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    createListBox(container, "series.centerY", ['45%', '50%', '55%'], function (e) {
        config.series.centerY = _getValue(e);
        chart.load(config, animate);
    }, '50%');
    line(container);
    createListBox(container, "series.pointLabel.position", ['auto', 'outside'], function (e) {
        config.series.pointLabel.position = _getValue(e);
        chart.load(config, animate);
    }, 'auto');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
